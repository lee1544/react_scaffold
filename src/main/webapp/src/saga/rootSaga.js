import { delay, takeEvery, eventChannel, channel, END } from 'redux-saga'
import { login, getUserInfo, getUserListByKeyWord } from './authSaga.js'
import { saveAdmin, removeAdmin, getSysAdmins } from './roleSaga.js'
import { addExam, updExam, delExam, getExams, getHistoryExamCode, getExamTabs, getExamPaperByCode, updExamSampleUrl } from './examSaga.js'
import { LOGIN_REQUEST, GET_USER_INFO_REQUEST, GET_USER_LIST_BY_KEYWORD_REQUEST, SAVE_ADMIN_REQUEST, REMOVE_ADMIN_REQUEST, GET_ADMINS_REQUEST, ADD_EXAM_REQUEST,
            UPD_EXAM_REQUEST, DEL_EXAM_REQUEST, GET_EXAMS_REQUEST, GET_HISTORY_EXAM_CODE_REQUEST, GET_EXAM_TABS_REQUEST, GET_EXAM_PAPERS_REQUEST, UPD_EXAM_SAMPLE_REQUEST } from '../actions/actionTyps.js'

export default function* rootSaga() {
    yield [
        takeEvery(LOGIN_REQUEST, mapPayload(login)),
        takeEvery(GET_USER_INFO_REQUEST, mapPayload(getUserInfo)),
        takeEvery(GET_USER_LIST_BY_KEYWORD_REQUEST, mapPayload(getUserListByKeyWord)),
        takeEvery(SAVE_ADMIN_REQUEST, mapPayload(saveAdmin)),
        takeEvery(REMOVE_ADMIN_REQUEST, mapPayload(removeAdmin)),
        takeEvery(GET_ADMINS_REQUEST, mapPayload(getSysAdmins)),
        takeEvery(ADD_EXAM_REQUEST, mapPayload(addExam)),
        takeEvery(UPD_EXAM_REQUEST, mapPayload(updExam)),
        takeEvery(DEL_EXAM_REQUEST, mapPayload(delExam)),
        takeEvery(GET_EXAMS_REQUEST, mapPayload(getExams)),
        takeEvery(GET_HISTORY_EXAM_CODE_REQUEST, mapPayload(getHistoryExamCode)),
        takeEvery(GET_EXAM_TABS_REQUEST, mapPayload(getExamTabs)),
        takeEvery(GET_EXAM_PAPERS_REQUEST, mapPayload(getExamPaperByCode)),
        takeEvery(UPD_EXAM_SAMPLE_REQUEST, mapPayload(updExamSampleUrl))
    ]
}

/**
 * 提取action.payload
 * saga层直接接触参数,便于saga复用
 * @param func
 * @returns {mapFunc}
 */
function mapPayload(func) {
    return function* mapFunc(action) {
        return yield func.call(this, action.payload)
    }
}
