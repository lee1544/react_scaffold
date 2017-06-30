/**
 * Created by Li Jian on 2017/05/25.
 */

import { combineReducers } from 'redux'
import { createReducer, updateObject } from '../utils/actionUtils'
import { GET_USER_LIST_BY_KEYWORD_SUCCESS, SAVE_ADMIN_SUCCESS, SAVE_ADMIN_FAILURE, REMOVE_ADMIN_SUCCESS, REMOVE_ADMIN_FAILURE, GET_ADMINS_REQUEST,
    GET_ADMINS_SUCCESS, GET_ADMINS_FAILURE, RESET_SUBMIT_FLAG } from '../actions/actionTyps'
import { setLoadingFalse, setLoadingTrue } from './exam'

const initRoleState = {
    users: [],
    sysAdmins: [],
    isSubmit: false,
    error: null,
    loading: false
}

function setUsers(state, action) {
    return updateObject(state, { users: action.response.items })
}

function saveSysAdminSuccess(state, action) {
    return updateObject(state, { sysAdmins: state.sysAdmins.concat(action.response), isSubmit: true, error: null })
}

function saveSysAdminFailure(state, action) {
    return updateObject(state, { isSubmit: true, error: action.error })
}

function removeSysAdminSuccess(state, action) {
    return updateObject(state, { sysAdmins: state.sysAdmins.filter(admin=>admin.id != action.response.id), isSubmit: true, error: null })
}

function getSysAdmins(state, action) {
    return updateObject(state, { sysAdmins: action.response.items, loading: false })
}

function resetSubmitFlag(state, action) {
    return updateObject(state, { isSubmit: false, error: null })
}

const role = createReducer(initRoleState, {
    [GET_USER_LIST_BY_KEYWORD_SUCCESS]: setUsers,
    [SAVE_ADMIN_SUCCESS]: saveSysAdminSuccess,
    [SAVE_ADMIN_FAILURE]: saveSysAdminFailure,
    [REMOVE_ADMIN_SUCCESS]: removeSysAdminSuccess,
    [REMOVE_ADMIN_FAILURE]: saveSysAdminFailure,
    [GET_ADMINS_REQUEST]: setLoadingTrue,
    [GET_ADMINS_SUCCESS]: getSysAdmins,
    [GET_ADMINS_FAILURE]: setLoadingFalse,
    [RESET_SUBMIT_FLAG]: resetSubmitFlag
})

export default role
