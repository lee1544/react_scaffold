/**
 * Created by Li Jian on 2017/05/25.
 */

import { combineReducers } from 'redux'
import authUtils from '../utils/authUtils'
import { getUcName } from '../utils/ucUtils'
import { createReducer, updateObject } from '../utils/actionUtils'
import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, GET_USER_INFO_SUCCESS } from '../actions/actionTyps'
const initAuthState = authUtils.getAuth()

function setTokenInfo(state, action) {
    const response = action.response
    let name = ''
    if(response['realName'] != '') {
        name = response['realName']
    } else if(response['nickName'] != '') {
        name = response['nickName']
    } else {
        name = response['userId']
    }
    let userInfo = {
        id: response['userId'],
        name,
        orgId: response['orgId']
    }
    let accessToken = response['accessToken']
    let macKey = response['macKey']
    let refreshToken = response['refreshToken']
    let expiresAt = response['expiresAt']
    return updateObject(state, { userInfo, macKey, accessToken, refreshToken, expiresAt, error: '' })
}
function setUserInfo(state, action) {
    let name = getUcName(action.response)
    let authInfo = {
        id: state.userInfo.id,
        name: name,
        orgId: action.response['orgExinfo']['orgId']
    }
    return updateObject(state, { userInfo: authInfo })
}

const auth = createReducer(initAuthState, {
    [LOGIN_SUCCESS] : setTokenInfo,
    [GET_USER_INFO_SUCCESS] : setUserInfo,
    [LOGIN_FAILURE]: (state, action) => {
        return updateObject(state, { error: action.error })
    },
    [LOGOUT]: (state, action) => {
        return updateObject(state, { userInfo: null, macKey: null, accessToken: null, refreshToken: null, expiresAt: null, error: null })
    }
})
export default auth
