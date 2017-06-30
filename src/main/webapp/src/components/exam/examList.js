import styles from '../../../styles/components/exam/examList.css'
import React, { Component, PropTypes } from 'react'
import { Table, Pagination, Button, message, Popconfirm, Badge } from 'antd'
import dateUtils from '../../utils/dateUtils.js'

export default class examList extends Component {
    static displayName = 'examList'
    static propTypes = {
        getExams: PropTypes.func,
        delExam: PropTypes.func,
        resetSubmitFlag: PropTypes.func,
        changePageSize: PropTypes.func,
        examEdit: PropTypes.func,
        exams: PropTypes.array,
        isDel: PropTypes.bool,
        error: PropTypes.object,
        page: PropTypes.number,
        size: PropTypes.number,
        total: PropTypes.number,
        loading: PropTypes.bool
    }

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
        this.props.getExams(this.props.page-1, this.props.size)
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.error == null && nextProps.isDel) {
            message.success('操作成功', 3)
            this.props.resetSubmitFlag()
        }
        if(nextProps.error != null && nextProps.isDel) {
            message.error(nextProps.error.message, 3)
        }
    }

    removeExam(id) {
        this.props.delExam(id)
    }

    editExam(exam) {
        this.props.examEdit(exam)
        setTimeout(()=>{
            window.location.href = '#/exam_setting'
        }, 500)
    }

    editUrlExam(exam) {
        this.props.examEdit(Object.assign({}, exam, { type: 'editUrl' }))
        setTimeout(()=>{
            window.location.href = '#/exam_setting'
        }, 500)
    }

    addExam() {
        window.location.href = '#/exam_setting'
    }

    pageChanged(page) {
        this.props.changePageSize(page, this.props.size)
        this.props.getExams(page-1, this.props.size)
    }

    onShowSizeChange(page, size) {
        this.props.changePageSize(page, size)
        this.props.getExams(page-1, size)
    }

    fetchTableItems() {
        return this.props.exams.map((exam, index) => {
            return Object.assign({}, exam, { operation: '', key: exam.id })
        })
    }

    getColumns() {
        return [
            {
                title: '考试编号',
                dataIndex: 'code',
                key: 'code',
                width: 50
            },
            {
                title: '考试标题',
                dataIndex: 'title',
                key: 'title',
                width: 150
            },
            {
                title: '考试时间',
                dataIndex: 'beginAt',
                key: 'beginAt',
                width: 100,
                render: (text, record, index) => {
                    return dateUtils.getLocalTime(record.beginAt) + ' -- ' + dateUtils.getLocalTime(record.endAt)
                }
            },
            {
                title: '自评时间',
                dataIndex: 'selfEvalBeginAt',
                key: 'selfEvalBeginAt',
                width: 100,
                render: (text, record, index) => {
                    return dateUtils.getLocalTime(record.selfEvalBeginAt) + ' -- ' + dateUtils.getLocalTime(record.selfEvalEndAt)
                }
            },
            {
                title: '考试状态',
                dataIndex: 'state',
                key: 'state',
                width: 50,
                render: (text, record, index) => {
                    let state = ''
                    if(text == 'notstarted') {
                        state = <Badge status='warning' text='未开始'/>
                    }
                    if(text == 'started') {
                        state = <Badge status='processing' text='正在进行中'/>
                    }
                    if(text == 'finished') {
                        state = <Badge status='success' text='已结束'/>
                    }
                    return state
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: 50,
                render: (text, record, index) => {
                    let state = ''
                    if(record.state == 'notstarted') {
                        state = <span>
                                    <a onClick={this.editExam.bind(this, record)}>修改</a>
                                    <span className='ant-divider'/>
                                    <a href='#'>
                                        <Popconfirm placement='bottomLeft' title={`确定要删除该考试吗?`} onConfirm={this.removeExam.bind(this, record.id)} okText='确定' cancelText='取消'>
                                            删除
                                        </Popconfirm>
                                    </a>
                                </span>
                    }
                    if(record.state == 'started' || record.state == 'finished') {
                        state = <a onClick={this.editUrlExam.bind(this, record)}>修改</a>
                    }
                    return state
                }
            }
        ]
    }

    showTotal(total) {
        return `共 ${total} 条记录`
    }

    render() {
        return (
            <div className={styles.main}>
                <div className={styles.queryDiv}>
                    <Button type='primary' htmlType='submit' size='large' onClick={this.addExam.bind(this)}>新建考试</Button>
                </div>
                <div className={styles.tableDiv}>
                    <Table columns={this.getColumns()}
                           dataSource={this.fetchTableItems()}
                           bordered={true}
                           pagination={false}
                           loading={this.props.loading}/>
                </div>
                <div className={styles.pagination}>
                    <Pagination total={this.props.total}
                                current={this.props.page}
                                pageSize={this.props.size}
                                showSizeChanger showQuickJumper
                                showTotal={this.showTotal}
                                onChange={this.pageChanged.bind(this)}
                                onShowSizeChange={this.onShowSizeChange.bind(this)}/>
                </div>
            </div>
        )
    }
}
