import { put, call } from 'redux-saga/effects'
import { delay, takeEvery, eventChannel, channel, END } from 'redux-saga'
import { SAVE_ADMIN_SUCCESS, SAVE_ADMIN_FAILURE, REMOVE_ADMIN_SUCCESS, REMOVE_ADMIN_FAILURE, GET_ADMINS_SUCCESS, GET_ADMINS_FAILURE } from '../actions/actionTyps.js'
import examService from '../services/examService.js'

export function* saveAdmin(sysAdminInfo) {
    try {
        let result = yield call([ examService, examService.saveSysAdmin ], sysAdminInfo)
        yield put({ type: SAVE_ADMIN_SUCCESS, response: result })
    } catch(error) {
        yield put({ type: SAVE_ADMIN_FAILURE, error })
    }
}

export function* removeAdmin(userId) {
    try {
        let userInfo = yield call([ examService, examService.removeSysAdmin ], userId)
        yield put({ type: REMOVE_ADMIN_SUCCESS, response: userInfo })
    } catch(error) {
        yield put({ type: REMOVE_ADMIN_FAILURE, error })
    }
}

export function* getSysAdmins() {
    try {
        let users = yield call([ examService, examService.getSysAdmin ])
        yield put({ type: GET_ADMINS_SUCCESS, response: users })
    } catch(error) {
        yield put({ type: GET_ADMINS_FAILURE, error })
    }
}
