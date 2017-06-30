/**
 * 考试配置Smart
 * Created by Li Jian on 2017/05/25
 */
import { Provider, connect } from 'react-redux'
import { pushState } from 'redux-router'
import ExamSettingDumb from '../components/exam/examSetting.js'
import { addExam, updExam, resetSubmitFlag, getHistoryExamCode, updExamSampleUrl } from '../actions/simpleAction.js'

function mapStateToProps(state) {
    return {
        exam: state.exam.exam,
        error: state.exam.error,
        isSubmit: state.exam.isSubmit,
        historyExamCodes: state.exam.historyExamCodes
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addExam: (examInfo) => dispatch(addExam(examInfo)),
        updExam: (examInfo) => dispatch(updExam(examInfo)),
        updExamSampleUrl: (examInfo) => dispatch(updExamSampleUrl(examInfo)),
        resetSubmitFlag: () => dispatch(resetSubmitFlag()),
        getHistoryExamCode: (page, size) => dispatch(getHistoryExamCode({ page, size }))
    }
}

let ExamSettingSmart = connect(
    mapStateToProps, mapDispatchToProps
)(ExamSettingDumb)

export default ExamSettingSmart
