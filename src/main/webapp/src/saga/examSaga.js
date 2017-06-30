import { put, call } from 'redux-saga/effects'
import { delay, takeEvery, eventChannel, channel, END } from 'redux-saga'
import { ADD_EXAM_SUCCESS, ADD_EXAM_FAILURE, UPD_EXAM_SUCCESS, UPD_EXAM_FAILURE, DEL_EXAM_SUCCESS, DEL_EXAM_FAILURE, GET_EXAMS_SUCCESS, GET_EXAMS_FAILURE,
    GET_HISTORY_EXAM_CODE_SUCCESS, GET_HISTORY_EXAM_CODE_FAILURE, GET_EXAM_TABS_SUCCESS, GET_EXAM_TABS_FAILURE, GET_EXAM_PAPERS_SUCCESS, GET_EXAM_PAPERS_FAILURE,
    UPD_EXAM_SAMPLE_SUCCESS, UPD_EXAM_SAMPLE_FAILURE } from '../actions/actionTyps.js'
import examService from '../services/examService.js'

export function* addExam(examInfo) {
    try {
        let result = yield call([ examService, examService.addExam ], examInfo)
        yield put({ type: ADD_EXAM_SUCCESS, response: result })
    } catch(error) {
        yield put({ type: ADD_EXAM_FAILURE, error })
    }
}

export function* updExam(examInfo) {
    try {
        let result = yield call([ examService, examService.updExam ], examInfo.id, examInfo)
        yield put({ type: UPD_EXAM_SUCCESS, response: result })
    } catch(error) {
        yield put({ type: UPD_EXAM_FAILURE, error })
    }
}

export function* updExamSampleUrl(examInfo) {
    try {
        let result = yield call([ examService, examService.updExamSampleUrl ], examInfo.id, examInfo)
        yield put({ type: UPD_EXAM_SAMPLE_SUCCESS, response: result })
    } catch(error) {
        yield put({ type: UPD_EXAM_SAMPLE_FAILURE, error })
    }
}

export function* delExam(examId) {
    try {
        let result = yield call([ examService, examService.delExam ], examId)
        yield put({ type: DEL_EXAM_SUCCESS, response: result })
    } catch(error) {
        yield put({ type: DEL_EXAM_FAILURE, error })
    }
}

export function* getExams({ page, size }) {
    try {
        let result = yield call([ examService, examService.getExams ], page, size)
        yield put({ type: GET_EXAMS_SUCCESS, response: result })
    } catch(error) {
        yield put({ type: GET_EXAMS_FAILURE, error })
    }
}

export function* getHistoryExamCode({ page, size }) {
    try {
        let result = yield call([ examService, examService.getHistoryExamCode ], page, size)
        yield put({ type: GET_HISTORY_EXAM_CODE_SUCCESS, response: result })
    } catch(error) {
        yield put({ type: GET_HISTORY_EXAM_CODE_FAILURE, error })
    }
}

export function* getExamTabs() {
    try {
        let result = yield call([ examService, examService.getExamCodes ])
        yield put({ type: GET_EXAM_TABS_SUCCESS, response: result })
        if(result && result.items && result.items.length > 0) {
            let first = result.items[0]
            const response = yield examService.getPapersByExamCode(first.code, 0, 10)
            if (response) {
                yield put({ type: GET_EXAM_PAPERS_SUCCESS, response: response })
            } else {
                throw 'resolve conflict failed'
            }
        }
    } catch(error) {
        yield put({ type: GET_EXAM_TABS_FAILURE, error })
    }
}

export function* getExamPaperByCode({ code, page, size }) {
    try {
        let result = yield call([ examService, examService.getPapersByExamCode ], code, page, size)
        yield put({ type: GET_EXAM_PAPERS_SUCCESS, response: result })
    } catch(error) {
        yield put({ type: GET_EXAM_PAPERS_FAILURE, error })
    }
}
