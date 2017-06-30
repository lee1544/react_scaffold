/**
 * Created by Li Jian on 2017/05/25.
 */

import { combineReducers } from 'redux'
import { createReducer, updateObject } from '../utils/actionUtils'
import { ADD_EXAM_SUCCESS, ADD_EXAM_FAILURE, GET_EXAMS_REQUEST, GET_EXAMS_SUCCESS, GET_EXAMS_FAILURE, DEL_EXAM_SUCCESS, DEL_EXAM_FAILURE, RESET_SUBMIT_FLAG,
    CHANGE_PAGE_SIZE, GET_HISTORY_EXAM_CODE_SUCCESS, EXAM_EDIT, UPD_EXAM_SUCCESS, UPD_EXAM_FAILURE, GET_EXAM_TABS_SUCCESS, GET_EXAM_PAPERS_SUCCESS,
    GET_EXAM_PAPERS_REQUEST, GET_EXAM_PAPERS_FAILURE, UPD_EXAM_SAMPLE_SUCCESS, UPD_EXAM_SAMPLE_FAILURE } from '../actions/actionTyps'

const initExamState = {
    exams: [],
    examTabs: [],
    examPapers: [],
    page: 1,
    size: 10,
    total: 0,
    exam: {},
    historyExamCodes: [],
    isDel: false,
    isSubmit: false,
    loading: false,
    examTabsLoading: false,
    error: null,
    paperPage: 1,
    paperSize: 10,
    paperTotal: 0
}

function addExamSuccess(state, action) {
    return updateObject(state, { exam: null, error: null, isSubmit: true })
}

function addExamFailure(state, action) {
    return updateObject(state, { error: action.error, isSubmit: true })
}

function setExams(state, action) {
    return updateObject(state, { exams: action.response.items, total: action.response.total, loading: false })
}

function resetSubmitFlag(state, action) {
    return updateObject(state, { exam: null, isSubmit: false, error: null, isDel: false })
}

function delExam(state, action) {
    return updateObject(state, { exams: state.exams.filter(exam=>exam.id != action.response.id), isDel: true, error: null })
}

function delExamFailure(state, action) {
    return updateObject(state, { error: action.error, isDel: true })
}

export function setLoadingTrue(state, action) {
    return updateObject(state, { loading: true })
}

export function setLoadingFalse(state, action) {
    return updateObject(state, { loading: false })
}

function changePageSize(state, action) {
    return updateObject(state, { page: action.page, size: action.size, paperPage: action.page, paperSize: action.size })
}

function setHistoryExamCode(state, action) {
    return updateObject(state, { historyExamCodes: action.response.items })
}

function setEdit(state, action) {
    return updateObject(state, { exam: action.examInfo, loading: true })
}

function setExamTabs(state, action) {
    return updateObject(state, { examTabs: action.response.items, examTabsLoading: true })
}

function setExamPapers(state, action) {
    return updateObject(state, { examPapers: action.response.items, paperTotal: action.response.total, loading: false })
}

const exam = createReducer(initExamState, {
    [ADD_EXAM_SUCCESS]: addExamSuccess,
    [ADD_EXAM_FAILURE]: addExamFailure,
    [UPD_EXAM_SUCCESS]: addExamSuccess,
    [UPD_EXAM_FAILURE]: addExamFailure,
    [UPD_EXAM_SAMPLE_SUCCESS]: addExamSuccess,
    [UPD_EXAM_SAMPLE_FAILURE]: addExamFailure,
    [RESET_SUBMIT_FLAG]: resetSubmitFlag,
    [GET_EXAMS_REQUEST]: setLoadingTrue,
    [GET_EXAMS_SUCCESS]: setExams,
    [GET_EXAMS_FAILURE]: setLoadingFalse,
    [DEL_EXAM_SUCCESS]: delExam,
    [DEL_EXAM_FAILURE]: delExamFailure,
    [CHANGE_PAGE_SIZE]: changePageSize,
    [GET_HISTORY_EXAM_CODE_SUCCESS]: setHistoryExamCode,
    [EXAM_EDIT]: setEdit,
    [GET_EXAM_TABS_SUCCESS]: setExamTabs,
    [GET_EXAM_PAPERS_REQUEST]: setLoadingTrue,
    [GET_EXAM_PAPERS_FAILURE]: setLoadingFalse,
    [GET_EXAM_PAPERS_SUCCESS]: setExamPapers
})

export default exam
