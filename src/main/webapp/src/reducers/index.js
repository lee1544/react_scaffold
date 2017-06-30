/**
 * Created by Administrator on 2015/12/7.
 */

import { routerStateReducer } from 'redux-router'
import { combineReducers } from 'redux'
import auth from './auth'
import role from './role'
import exam from './exam'

export default combineReducers({
    auth,
    role,
    exam,
    router: routerStateReducer
})

