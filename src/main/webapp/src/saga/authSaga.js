import authUtils from '../utils/authUtils'
import { getUcName } from '../utils/ucUtils.js'
import { put, call } from 'redux-saga/effects'
import { delay, takeEvery, eventChannel, channel, END } from 'redux-saga'
import { LOGIN_SUCCESS, LOGIN_FAILURE, GET_USER_INFO_SUCCESS, GET_USER_INFO_FAILURE, GET_USER_INFO_REQUEST, GET_USER_LIST_BY_KEYWORD_SUCCESS, GET_USER_LIST_BY_KEYWORD_FAILURE } from '../actions/actionTyps.js'
import ucService from '../services/ucService.js'
import examService from '../services/examService.js'

function setTokenInfo(tokens) {
    authUtils.saveAuth(tokens['accessToken'], tokens['macKey'], tokens['refreshToken'], tokens['expiresAt'], { id: tokens['userId'] })
}

function setUserInfo(userInfo) {
    let name = getUcName(userInfo)
    let orgId = userInfo['orgExinfo']['orgId']
    let authInfo = authUtils.getAuth()
    authUtils.saveAuth(authInfo.accessToken, authInfo.macKey, authInfo.refreshToken, authInfo.expiresAt, { id: authInfo.userInfo.id, name, orgId })
}

function setLoginInfo(loginInfo) {
    let name = ''
    if(loginInfo['realName'] != '') {
        name = loginInfo['realName']
    } else if(loginInfo['nickName'] != '') {
        name = loginInfo['nickName']
    } else {
        name = loginInfo['userId']
    }
    authUtils.saveAuth(loginInfo['accessToken'], loginInfo['macKey'], loginInfo['refreshToken'], loginInfo['expiresAt'], { id: loginInfo['userId'], name: name, orgId: loginInfo['orgId'] })
}

export function* getUserInfo(userId) {
    try {
        let userInfo = yield call([ ucService, ucService.getUserInfo ], userId)
        yield call(setUserInfo, userInfo)
        yield put({ type: GET_USER_INFO_SUCCESS, response: userInfo })
    } catch(error) {
        yield put({ type: GET_USER_INFO_FAILURE, error })
    }
}

export function* login(user) {
    try {
        let tokens = yield call([ examService, examService.login ], user.username, user.password)
        yield call(setLoginInfo, tokens)
        // yield call(setTokenInfo, tokens)
        yield put({ type: LOGIN_SUCCESS, response: tokens })
        // yield put({ type: GET_USER_INFO_REQUEST, payload: tokens['userId'] })
    } catch(error) {
        yield put({ type: LOGIN_FAILURE, error })
    }
}

export function* getUserListByKeyWord(keyWord) {
    try {
        let users = yield call([ ucService, ucService.getUserListByKeyWord ], keyWord)
        yield put({ type: GET_USER_LIST_BY_KEYWORD_SUCCESS, response: users })
    } catch(error) {
        yield put({ type: GET_USER_LIST_BY_KEYWORD_FAILURE, error })
    }
}
