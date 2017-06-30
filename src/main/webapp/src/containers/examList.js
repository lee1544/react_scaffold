/**
 * 考试列表Smart
 * Created by Li Jian on 2017/05/25
 */
import { Provider, connect } from 'react-redux'
import { pushState } from 'redux-router'
import ExamListDumb from '../components/exam/examList.js'
import { getExams, delExam, resetSubmitFlag, changePageSize, examEdit } from '../actions/simpleAction.js'

function mapStateToProps(state) {
    return {
        exams: state.exam.exams,
        isDel: state.exam.isDel,
        error: state.exam.error,
        page: state.exam.page,
        size: state.exam.size,
        total: state.exam.total,
        loading: state.exam.loading
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getExams: (page, size) => dispatch(getExams({ page, size })),
        delExam: (examId) => dispatch(delExam(examId)),
        resetSubmitFlag: () => dispatch(resetSubmitFlag()),
        changePageSize: (page, size) => dispatch(changePageSize(page, size)),
        examEdit: (examInfo) => dispatch(examEdit(examInfo))
    }
}

let ExamListSmart = connect(
    mapStateToProps, mapDispatchToProps
)(ExamListDumb)

export default ExamListSmart
