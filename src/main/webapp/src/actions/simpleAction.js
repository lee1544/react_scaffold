/**
 * Created by Li Jian on 2017/05/25.
 */
import { createAction } from '../utils/actionUtils.js'
import { LOGOUT, LOGIN_REQUEST, GET_USER_LIST_BY_KEYWORD_REQUEST, SAVE_ADMIN_REQUEST, REMOVE_ADMIN_REQUEST, GET_ADMINS_REQUEST, ADD_EXAM_REQUEST,
    UPD_EXAM_REQUEST, DEL_EXAM_REQUEST, RESET_SUBMIT_FLAG, GET_EXAMS_REQUEST, CHANGE_PAGE_SIZE, GET_HISTORY_EXAM_CODE_REQUEST, EXAM_EDIT,
    GET_EXAM_TABS_REQUEST, GET_EXAM_PAPERS_REQUEST, UPD_EXAM_SAMPLE_REQUEST } from './actionTyps.js'

export const logout = createAction(LOGOUT)

export const login = createAction(LOGIN_REQUEST, 'payload')

export const resetSubmitFlag = createAction(RESET_SUBMIT_FLAG)

export const getUserListByKeyWord = createAction(GET_USER_LIST_BY_KEYWORD_REQUEST, 'payload')

export const saveSysAdmin = createAction(SAVE_ADMIN_REQUEST, 'payload')

export const removeSysAdmin = createAction(REMOVE_ADMIN_REQUEST, 'payload')

export const getSysAdmins = createAction(GET_ADMINS_REQUEST, 'payload')

export const addExam = createAction(ADD_EXAM_REQUEST, 'payload')

export const updExam = createAction(UPD_EXAM_REQUEST, 'payload')

export const updExamSampleUrl = createAction(UPD_EXAM_SAMPLE_REQUEST, 'payload')

export const delExam = createAction(DEL_EXAM_REQUEST, 'payload')

export const getExams = createAction(GET_EXAMS_REQUEST, 'payload')

export const changePageSize = createAction(CHANGE_PAGE_SIZE, 'page', 'size')

export const getHistoryExamCode = createAction(GET_HISTORY_EXAM_CODE_REQUEST, 'payload')

export const examEdit = createAction(EXAM_EDIT, 'examInfo')

export const getExamTabs = createAction(GET_EXAM_TABS_REQUEST)

export const getExamPapers = createAction(GET_EXAM_PAPERS_REQUEST, 'payload')
