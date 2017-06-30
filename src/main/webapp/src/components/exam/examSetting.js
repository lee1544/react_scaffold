import styles from '../../../styles/components/exam/exam.css'
import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import { decamelizeKeys } from 'humps'
import { Input, Button, message, DatePicker, Form, Select, TimePicker } from 'antd'
const Option = Select.Option
const FormItem = Form.Item

export default class examSetting extends Component {
    static displayName = 'examSetting'
    static propTypes = {
        addExam: PropTypes.func,
        updExam: PropTypes.func,
        resetSubmitFlag: PropTypes.func,
        getHistoryExamCode: PropTypes.func,
        updExamSampleUrl: PropTypes.func,
        exam: PropTypes.object,
        error: PropTypes.object,
        isSubmit: PropTypes.bool,
        historyExamCodes: PropTypes.array
    }

    constructor(props) {
        super(props)
        this.state = {
            editType: '',
            codeStatus: '',
            codeMsg: '',
            titleStatus: '',
            titleMsg: '',
            examTimeStatus: '',
            examTimeMsg: '',
            selfTimeStatus: '',
            selfTimeMsg: '',
            sampleUrlStatus: '',
            sampleUrlMsg: '',
            examStartHour: '',
            examStartMinutes: '',
            examEndHour: '',
            examEndMinutes: '',
            selfEvalStartHour: '',
            selfEvalStartMinutes: '',
            selfEvalEndHour: '',
            selfEvalEndMinutes: '',
            formObjet: {
                code: '',
                title: '',
                begin_at: null,
                end_at: null,
                self_eval_begin_at: null,
                self_eval_end_at: null,
                sample_url: ''
            }
        }
    }

    componentDidMount() {
        //给出历史编号供参考，最多给出历史3条编号
        this.props.getHistoryExamCode(0, 3)
        //编辑时,设置state
        if(this.props.exam != null && JSON.stringify(this.props.exam) != '{}') {
            let examEdit = decamelizeKeys(this.props.exam)
            this.setState({
                editType: examEdit.type,
                examStartHour: moment(this.strToInt(examEdit.begin_at)).hour()+'',
                examStartMinutes: moment(this.strToInt(examEdit.begin_at)).minute()+'',
                examEndHour: moment(this.strToInt(examEdit.end_at)).hour()+'',
                examEndMinutes: moment(this.strToInt(examEdit.end_at)).minute()+'',
                selfEvalStartHour:  moment(this.strToInt(examEdit.self_eval_begin_at)).hour()+'',
                selfEvalStartMinutes: moment(this.strToInt(examEdit.self_eval_begin_at)).minute()+'',
                selfEvalEndHour: moment(this.strToInt(examEdit.self_eval_end_at)).hour()+'',
                selfEvalEndMinutes: moment(this.strToInt(examEdit.self_eval_end_at)).minute()+'',
                formObjet: Object.assign({}, this.state.formObjet, examEdit)
            })
        }
    }

    componentWillUnmount() {
        //卸载组件时,清除exam对象,和所有提交标志.
        this.props.resetSubmitFlag()
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.error == null && nextProps.isSubmit) {
            this.props.resetSubmitFlag()
            message.success('考试配置成功', 3)
            window.location.href = '#/exam_list'
        }
        if(nextProps.error != null && nextProps.isSubmit) {
            message.error(nextProps.error.message, 3)
            this.props.resetSubmitFlag()
        }
    }

    handleChange(e) {
        if(e.currentTarget.value != '') {
            if(e.currentTarget.name == 'code') {
                let reg= /^\w+$/
                if (reg.test(e.currentTarget.value) && e.currentTarget.value.length <= 8) {
                    this.setState({ codeStatus: '', codeMsg: '' })
                } else if (!reg.test(e.currentTarget.value)) {
                    this.setState({ codeStatus: 'error', codeMsg: '考试编号只支持字母、数字、下划线' })
                } else if (e.currentTarget.value.length > 8) {
                    this.setState({ codeStatus: 'error', codeMsg: '考试编号不能超过8个字符' })
                }
            }
            if(e.currentTarget.name == 'title' && e.currentTarget.value.length <= 300) {
                this.setState({ titleStatus: '', titleMsg: '' })
            } else if (e.currentTarget.value.length > 300) {
                this.setState({ titleStatus: 'error', titleMsg: '超出长度限制（300个字符）' })
            }
        }
        this.setState({
            formObjet: Object.assign({}, this.state.formObjet, { [e.currentTarget.name]: e.currentTarget.value })
        })
    }

    getOptions(type) {
        let res = []
        let maxNum = type.indexOf('Hour') > 0 ? 24 : 60
        for(let i=0; i<maxNum; i++) {
            let opt = i
            if(i<10) {
                opt = `0${i}`
            }
            res.push(<Option key={`${type}${i}`} value={`${i}`}>{opt}</Option>)
        }
        return res
    }

    strToInt(str) {
        let num = 0
        try {
            if(str == '') return num
            num = parseInt(str)
        } catch(e) {
            return num
        }
        return num
    }

    submit() {
        //表单验证
        let reg= /^\w+$/
        let submitFlag = false
        let formData = Object.assign({}, this.state.formObjet)
        if (!reg.test(this.state.formObjet.code)) {
            submitFlag = true
            this.setState({ codeStatus: 'error', codeMsg: '考试编号只支持字母、数字、下划线' })
        }
        if(this.state.formObjet.code.length > 8) {
            submitFlag = true
            this.setState({ codeStatus: 'error', codeMsg: '超出长度限制（8个字符）' })
        }
        if(this.state.formObjet.code == '') {
            submitFlag = true
            this.setState({ codeStatus: 'error', codeMsg: '考试编号不能为空' })
        }
        if(this.state.formObjet.title == '') {
            submitFlag = true
            this.setState({ titleStatus: 'error', titleMsg: '考试标题不能为空' })
        } else if(this.state.formObjet.title.length > 300) {
            submitFlag = true
            this.setState({ titleStatus: 'error', titleMsg: '超出长度限制（300个字符）' })
        }
        //时间非空验证
        if(this.state.formObjet.begin_at == null || this.state.formObjet.end_at == null) {
            submitFlag = true
            this.setState({ examTimeStatus: 'error', examTimeMsg: '考试时间不能为空' })
        }
        if(this.state.formObjet.self_eval_begin_at == null || this.state.formObjet.self_eval_end_at == null) {
            submitFlag = true
            this.setState({ selfTimeStatus: 'error', selfTimeMsg: '自评时间不能为空' })
        }
        //考试时间,自评时间--小时,分钟选择后的处理.都要转换成timestamp.
        if(this.state.examStartHour != '') {
            let examStartHourTime = this.strToInt(this.state.examStartHour) * 60 * 60 * 1000
            let examStartMinutesTime = this.strToInt(this.state.examStartMinutes) * 60 * 1000
            let value = moment(this.strToInt(this.state.formObjet.begin_at))
            value.set('hour', 0)
            value.set('minute', 0)
            value.set('second', 0)
            value.set('millisecond', 0)
            let examStartTime = examStartHourTime*1 + examStartMinutesTime*1 + this.strToInt(value.format('x'))*1
            formData = Object.assign({}, formData, { begin_at: examStartTime*1 })
        } else {
            formData = Object.assign({}, formData, { begin_at: this.state.formObjet.begin_at*1 })
        }
        if(this.state.examEndHour != '') {
            let examEndHourTime = this.strToInt(this.state.examEndHour) * 60 * 60 * 1000
            let examEndMinutesTime = this.strToInt(this.state.examEndMinutes) * 60 * 1000
            let value = moment(this.strToInt(this.state.formObjet.end_at))
            value.set('hour', 0)
            value.set('minute', 0)
            value.set('second', 0)
            value.set('millisecond', 0)
            let examEndTime = examEndHourTime*1 + examEndMinutesTime*1 + this.strToInt(value.format('x'))*1
            formData = Object.assign({}, formData, { end_at: examEndTime*1 })
        } else {
            let examEndTime = 24 * 60 * 60 * 1000 + this.state.formObjet.end_at*1
            formData = Object.assign({}, formData, { end_at: examEndTime*1 })
        }
        if(this.state.selfEvalStartHour != '') {
            let selfStartHourTime = this.strToInt(this.state.selfEvalStartHour) * 60 * 60 * 1000
            let selfStartMinutesTime = this.strToInt(this.state.selfEvalStartMinutes) * 60 * 1000
            let value = moment(this.strToInt(this.state.formObjet.self_eval_begin_at))
            value.set('hour', 0)
            value.set('minute', 0)
            value.set('second', 0)
            value.set('millisecond', 0)
            let selfStartTime = selfStartHourTime*1 + selfStartMinutesTime*1 + this.strToInt(value.format('x'))*1
            formData = Object.assign({}, formData, { self_eval_begin_at: selfStartTime*1 })
        } else {
            formData = Object.assign({}, formData, { self_eval_begin_at: this.state.formObjet.self_eval_begin_at*1 })
        }
        if(this.state.selfEvalEndHour != '') {
            let selfEndHourTime = this.strToInt(this.state.selfEvalEndHour) * 60 * 60 * 1000
            let selfEndMinutesTime = this.strToInt(this.state.selfEvalEndMinutes) * 60 * 1000
            let value = moment(this.strToInt(this.state.formObjet.self_eval_end_at))
            value.set('hour', 0)
            value.set('minute', 0)
            value.set('second', 0)
            value.set('millisecond', 0)
            let selfEndTime = selfEndHourTime*1 + selfEndMinutesTime*1 + this.strToInt(value.format('x'))*1
            formData = Object.assign({}, formData, { self_eval_end_at: selfEndTime*1 })
        } else {
            let selfEndTime = 24 * 60 * 60 * 1000 + this.state.formObjet.self_eval_end_at*1
            formData = Object.assign({}, formData, { self_eval_end_at: selfEndTime*1 })
        }
        // //验证开始时间结束时间的大小.
        // if (formData.begin_at >= formData.end_at) {
        //     submitFlag = true
        //     this.setState({ examTimeStatus: 'error', examTimeMsg: '考试结束时间要大于开始时间!' })
        // }
        // //验证自评时间结束时间的大小.
        // if (formData.self_eval_begin_at >= formData.self_eval_end_at) {
        //     submitFlag = true
        //     this.setState({ selfTimeStatus: 'error', selfTimeMsg: '自评结束时间要大于开始时间!' })
        // }
        // //验证自评开始时间要大于考试开始时间
        // if (formData.self_eval_begin_at <= formData.begin_at) {
        //     submitFlag = true
        //     this.setState({ selfTimeStatus: 'error', selfTimeMsg: '自评开始时间要大于考试开始时间!' })
        // }
        // //验证自评结束时间要大于考试结束时间
        // if (formData.self_eval_end_at <= formData.end_at) {
        //     submitFlag = true
        //     this.setState({ selfTimeStatus: 'error', selfTimeMsg: '自评结束时间要大于考试结束时间!' })
        // }
        //url有效性验证
        // let urlReg= /^((https|http|ftp|rtsp|mms)?:\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/
        // if (this.state.formObjet.sample_url != '' && !urlReg.test(this.state.formObjet.sample_url)) {
        //     submitFlag = true
        //     this.setState({ sampleUrlStatus: 'error', sampleUrlMsg: '链接格式有误,请检查!' })
        // }
        //提交.新增|更新.
        if(!submitFlag) {
            if(this.state.formObjet.id && this.state.formObjet.id != '') {
                if(this.state.editType == 'editUrl') {
                    this.props.updExamSampleUrl(formData)
                } else {
                    this.props.updExam(formData)
                }
            } else {
                this.props.addExam(formData)
            }
        }
    }

    formReset() {
        this.setState({
            editType: '',
            codeStatus: '',
            codeMsg: '',
            titleStatus: '',
            titleMsg: '',
            examTimeStatus: '',
            examTimeMsg: '',
            selfTimeStatus: '',
            selfTimeMsg: '',
            sampleUrlStatus: '',
            sampleUrlMsg: '',
            examStartHour: '',
            examStartMinutes: '',
            examEndHour: '',
            examEndMinutes: '',
            selfEvalStartHour: '',
            selfEvalStartMinutes: '',
            selfEvalEndHour: '',
            selfEvalEndMinutes: '',
            formObjet: {
                type: 'edit',
                code: '',
                title: '',
                begin_at: null,
                end_at: null,
                self_eval_begin_at: null,
                self_eval_end_at: null,
                sample_url: ''
            }
        })
    }

    onChangeData(attr, value) {
        if(value != null) {
            value.set('hour', 0)
            value.set('minute', 0)
            value.set('second', 0)
            value.set('millisecond', 0)
            if(attr == 'begin_at' || attr == 'end_at') {
                this.setState({
                    examTimeStatus: '',
                    examTimeMsg: '',
                    formObjet: Object.assign({}, this.state.formObjet, { [attr]: value.format('x') })
                })
            }
            if(attr == 'self_eval_begin_at' || attr == 'self_eval_end_at') {
                this.setState({
                    selfTimeStatus: '',
                    selfTimeMsg: '',
                    formObjet: Object.assign({}, this.state.formObjet, { [attr]: value.format('x') })
                })
            }
        } else {
            this.setState({
                formObjet: Object.assign({}, this.state.formObjet, { [attr]: null })
            })
        }
    }

    onChangeTime(attr, value) {
        this.setState({
            [attr]: value
        })
    }

    disabledDate(attr, value) {
        let oneDay = 24 * 60 * 60 * 1000
        let gtCurrentDate = value && value.valueOf() < (Date.now() - oneDay)
        if(value) {
            value.set('hour', 0)
            value.set('minute', 0)
            value.set('second', 0)
            value.set('millisecond', 0)
        }
        if(attr == 'begin_at') {
            const end_at = this.state.formObjet.end_at
            if (!value || !end_at) {
                return gtCurrentDate
            }
            return (value.format('x') > end_at) || gtCurrentDate
        }
        if(attr == 'end_at') {
            const begin_at = this.state.formObjet.begin_at
            if (!value || !begin_at) {
                return gtCurrentDate
            }
            return (value.format('x') <= (begin_at*1 - oneDay)) || gtCurrentDate
        }
        if(attr == 'self_eval_begin_at') {
            const self_eval_end_at = this.state.formObjet.self_eval_end_at
            if (!value || !self_eval_end_at) {
                return gtCurrentDate
            }
            return (value.format('x') > self_eval_end_at) || gtCurrentDate
        }
        if(attr == 'self_eval_end_at') {
            const self_eval_begin_at = this.state.formObjet.self_eval_begin_at
            if (!value || !self_eval_begin_at) {
                return gtCurrentDate
            }
            return (value.format('x') <= (self_eval_begin_at*1 - oneDay)) || gtCurrentDate
        }
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 18 }
        }
        let historyExamCodes = ''
        if(this.props.historyExamCodes && this.props.historyExamCodes.length > 0) {
            let codes = this.props.historyExamCodes.map(exam => {
                return exam.code
            })
            historyExamCodes = <div>历史考试编号 : {codes.join('、')}</div>
        }
        return (
            <div className={styles.main}>
                <div className={styles.formContent}>
                    <Form>
                        <FormItem {...formItemLayout}
                                  label='考试编号'
                                  required={true}
                                  validateStatus={this.state.codeStatus}
                                  help={this.state.codeMsg}>
                            <Input type='text' placeholder='考试编号不超过8个字符' style={{ width: 250 }} value={this.state.formObjet.code} name='code' onChange={this.handleChange.bind(this)} disabled={this.state.editType != 'editUrl' ? false : true}/>
                            {historyExamCodes}
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label='考试标题'
                                  required={true}
                                  validateStatus={this.state.titleStatus}
                                  help={this.state.titleMsg}>
                            <Input type='text' placeholder='请输入考试标题' style={{ width: 250 }} value={this.state.formObjet.title} name='title' onChange={this.handleChange.bind(this)} disabled={this.state.editType != 'editUrl' ? false : true}/>
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label='考试时间'
                                  required={true}
                                  validateStatus={this.state.examTimeStatus}
                                  help={this.state.examTimeMsg}>
                            <DatePicker format='YYYY-MM-DD'
                                        style={{ width: 100 }}
                                        disabled={this.state.editType != 'editUrl' ? false : true}
                                        disabledDate={this.disabledDate.bind(this, 'begin_at')}
                                        value={this.state.formObjet.begin_at != null ? moment(parseInt(this.state.formObjet.begin_at)) : null}
                                        placeholder='开始时间'
                                        onChange={this.onChangeData.bind(this, 'begin_at')}/>
                            <Select size='large'
                                    disabled={this.state.editType != 'editUrl' ? false : true}
                                    value={this.state.examStartHour}
                                    style={{ width: 50, marginLeft: 10, marginRight: 5 }}
                                    onChange={this.onChangeTime.bind(this, 'examStartHour')}>
                                {this.getOptions('examStartHour')}
                            </Select>时
                            <Select size='large'
                                    disabled={this.state.editType != 'editUrl' ? false : true}
                                    value={this.state.examStartMinutes}
                                    style={{ width: 50, marginLeft: 10, marginRight: 5 }}
                                    onChange={this.onChangeTime.bind(this, 'examStartMinutes')}>
                                {this.getOptions('examStartMinutes')}
                            </Select>分
                            <span className={styles.decollator}>——</span>
                            <DatePicker format='YYYY-MM-DD'
                                        style={{ width: 100 }}
                                        disabled={this.state.editType != 'editUrl' ? false : true}
                                        disabledDate={this.disabledDate.bind(this, 'end_at')}
                                        value={this.state.formObjet.end_at != null ? moment(parseInt(this.state.formObjet.end_at)) : null}
                                        placeholder='结束时间'
                                        onChange={this.onChangeData.bind(this, 'end_at')}/>
                            <Select size='large'
                                    disabled={this.state.editType != 'editUrl' ? false : true}
                                    value={this.state.examEndHour}
                                    style={{ width: 50, marginLeft: 10, marginRight: 5 }}
                                    onChange={this.onChangeTime.bind(this, 'examEndHour')}>
                                {this.getOptions('examEndHour')}
                            </Select>时
                            <Select size='large'
                                    disabled={this.state.editType != 'editUrl' ? false : true}
                                    value={this.state.examEndMinutes}
                                    style={{ width: 50, marginLeft: 10, marginRight: 5 }}
                                    onChange={this.onChangeTime.bind(this, 'examEndMinutes')}>
                                {this.getOptions('examEndMinutes')}
                            </Select>分
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label='自评时间'
                                  required={true}
                                  validateStatus={this.state.selfTimeStatus}
                                  help={this.state.selfTimeMsg}>
                            <DatePicker format='YYYY-MM-DD'
                                        style={{ width: 100 }}
                                        disabled={this.state.editType != 'editUrl' ? false : true}
                                        disabledDate={this.disabledDate.bind(this, 'self_eval_begin_at')}
                                        value={this.state.formObjet.self_eval_begin_at != null ? moment(parseInt(this.state.formObjet.self_eval_begin_at)) : null}
                                        placeholder='开始时间'
                                        onChange={this.onChangeData.bind(this, 'self_eval_begin_at')}/>
                            <Select size='large'
                                    disabled={this.state.editType != 'editUrl' ? false : true}
                                    value={this.state.selfEvalStartHour}
                                    style={{ width: 50, marginLeft: 10, marginRight: 5 }}
                                    onChange={this.onChangeTime.bind(this, 'selfEvalStartHour')}>
                                {this.getOptions('selfStartHour')}
                            </Select>时
                            <Select size='large'
                                    disabled={this.state.editType != 'editUrl' ? false : true}
                                    value={this.state.selfEvalStartMinutes}
                                    style={{ width: 50, marginLeft: 10, marginRight: 5 }}
                                    onChange={this.onChangeTime.bind(this, 'selfEvalStartMinutes')}>
                                {this.getOptions('selfStartMinutes')}
                            </Select>分
                            <span className={styles.decollator}>——</span>
                            <DatePicker format='YYYY-MM-DD'
                                        style={{ width: 100 }}
                                        disabled={this.state.editType != 'editUrl' ? false : true}
                                        disabledDate={this.disabledDate.bind(this, 'self_eval_end_at')}
                                        value={this.state.formObjet.self_eval_end_at != null ? moment(parseInt(this.state.formObjet.self_eval_end_at)) : null}
                                        placeholder='结束时间'
                                        onChange={this.onChangeData.bind(this, 'self_eval_end_at')}/>
                            <Select size='large'
                                    disabled={this.state.editType != 'editUrl' ? false : true}
                                    value={this.state.selfEvalEndHour}
                                    style={{ width: 50, marginLeft: 10, marginRight: 5 }}
                                    onChange={this.onChangeTime.bind(this, 'selfEvalEndHour')}>
                                {this.getOptions('selfEndHour')}
                            </Select>时
                            <Select size='large'
                                    disabled={this.state.editType != 'editUrl' ? false : true}
                                    value={this.state.selfEvalEndMinutes}
                                    style={{ width: 50, marginLeft: 10, marginRight: 5 }}
                                    onChange={this.onChangeTime.bind(this, 'selfEvalEndMinutes')}>
                                {this.getOptions('selfEndMinutes')}
                            </Select>分
                            <div>自评后提交试卷，考生必须在自评时间内提交改卷</div>
                        </FormItem>
                        <FormItem {...formItemLayout} label='考试样卷' validateStatus={this.state.sampleUrlStatus} help={this.state.sampleUrlMsg}>
                            <Input type='text' placeholder='考试样卷' style={{ width: 450 }} value={this.state.formObjet.sample_url} name='sample_url' onChange={this.handleChange.bind(this)}/>
                            <div>考试结束后开放，请输入参考样卷链接。<span className='ant-rate-text' style={{ color: 'red' }}>请确认链接正常可打开！</span></div>
                        </FormItem>
                        <FormItem {...formItemLayout}>
                            <Button size='large' className={styles.button} onClick={this.formReset.bind(this)}>取消</Button>
                            <Button size='large' type='primary' onClick={this.submit.bind(this)}>确定</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}
