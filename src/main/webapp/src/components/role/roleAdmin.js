import styles from '../../../styles/components/exam/examList.css'
import React, { Component, PropTypes } from 'react'
import { Table, Button, message, Popconfirm, AutoComplete, Modal, Form } from 'antd'
const FormItem = Form.Item
import { getUserName, getUserId, getName } from '../../utils/ucUtils'

export default class roleAdmin extends Component {
    static displayName = 'roleAdmin'
    static propTypes = {
        getUserListByKeyWord: PropTypes.func,
        saveSysAdmin: PropTypes.func,
        removeSysAdmin: PropTypes.func,
        getSysAdmins: PropTypes.func,
        resetSubmitFlag: PropTypes.func,
        users: PropTypes.array,
        sysAdmins: PropTypes.array,
        isSubmit: PropTypes.bool,
        error: PropTypes.object,
        loading: PropTypes.bool
    }

    constructor(props) {
        super(props)
        this.selectVal = ''
        this.state = {
            visible: false,
            keyWord: '',
            userId: '',
            userName: ''
        }
    }

    componentDidMount() {
        this.props.getSysAdmins()
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.isSubmit && nextProps.error == null) {
            this.setState({ visible: false, userName: '', userId: '', keyWord: '' })
            this.selectVal = ''
            message.success('操作成功', 3)
            this.props.resetSubmitFlag()
        }
        if(nextProps.isSubmit && nextProps.error != null) {
            message.error(nextProps.error.message, 3)
            this.props.resetSubmitFlag()
        }
    }

    removeUser(id) {
        this.props.removeSysAdmin(id)
    }

    addUser() {
        this.setState({ visible: true, userName: '', userId: '', keyWord: '' })
    }

    handleCancel() {
        this.setState({ visible: false, userName: '', userId: '', keyWord: '' })
    }

    saveAdmin() {
        if(this.state.userId != '' && this.state.userName != '') {
            let sysAdminInfo = {
                user_id: this.state.userId,
                user_name: this.state.userName,
                system: false
            }
            this.props.saveSysAdmin(sysAdminInfo)
        } else {
            message.warning('请选择用户后再提交', 3)
        }
    }

    getDataSource() {
        return this.props.users.map(user => {
            return getUserName(user)
        })
    }

    inputChange(inputValue) {
        if(inputValue != this.selectVal) {
            this.setState({ keyWord: inputValue, userId: '', userName: '' })
        }
        if(inputValue != '' && inputValue.trim() != '' && inputValue.indexOf('(') < 0 && inputValue.indexOf(')') < 0) {
            this.props.getUserListByKeyWord(inputValue)
        }
    }

    onSelect(value) {
        let userId = getUserId(value)
        let userName = getName(value)
        this.selectVal = value
        this.setState({ keyWord: value, userId: userId, userName: userName })
    }

    fetchTableItems() {
        return this.props.sysAdmins.map((user, index) => {
            return Object.assign({}, user, { operation: '删除', key: user.id })
        })
    }

    getColumns() {
        return [
            {
                title: '管理员',
                dataIndex: 'userId',
                key: 'userId',
                width: 150,
                render: (text, record, index) => {
                    return `${record.userName}(${record.userId})`
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: 50,
                render: (text, record, index) =>{
                    if(record.system) {
                        return ''
                    }
                    return <a href='#'>
                        <Popconfirm placement='bottomLeft' title={`确定要删除该管理员吗?`} onConfirm={this.removeUser.bind(this, record.userId)} okText='确定' cancelText='取消'>
                            删除
                        </Popconfirm>
                    </a>
                }
            }
        ]
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 1 }
        }
        return (
            <div className={styles.main}>
                <div className={styles.addDiv}>
                    <Button type='primary' htmlType='submit' size='large' onClick={this.addUser.bind(this)}>新增</Button>
                </div>
                <div className={styles.roleTableDiv}>
                    <Table columns={this.getColumns()}
                           dataSource={this.fetchTableItems()}
                           bordered={true}
                           pagination={false}
                           loading={this.props.loading}
                           scroll={{ x: 200 }}/>
                </div>
                <Modal title='新增管理员'
                       visible={this.state.visible}
                       okText='提交'
                       onOk={this.saveAdmin.bind(this)}
                       onCancel={this.handleCancel.bind(this)}
                       width='400'>
                    <Form>
                        <FormItem label='后台管理员' {...formItemLayout}>
                            <AutoComplete
                                value={this.state.keyWord}
                                dataSource={this.getDataSource()}
                                style={{ width: 240 }}
                                allowClear={true}
                                onSelect={this.onSelect.bind(this)}
                                onChange={this.inputChange.bind(this)}
                                placeholder='输入查找关键字'/>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}
