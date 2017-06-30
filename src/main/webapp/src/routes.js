import React from 'react'
import { IndexRoute, IndexRedirect, Route, Router, Link, Redirect } from 'react-router'
import IndexSmart from './containers/index.js'
import LoginSmart from './containers/login.js'
import DashboardSmart from './containers/dashboard.js'
import authUtils from './utils/authUtils.js'
import dateUtils from './utils/dateUtils.js'
import NotFound from './components/common/notFound/error404.js'
import examSettingSmart from './containers/examSetting.js'
import examListSmart from './containers/examList.js'
import roleAdminSmart from './containers/roleAdmin.js'

export default function getRoutes({ getState, dispatch }) {
    const requireLogin = (nextState, replaceState) => {
        function checkAuth() {
            let authInfo = authUtils.getAuth()
            let isExpires = dateUtils.returnDifferenceState(authInfo.expiresAt)
            if (!isExpires) {
                replaceState(null, '/?err=tokenout')
            }
        }
        checkAuth()
    }
    return (
        <Route path='/' component={IndexSmart}>
            <IndexRoute component={LoginSmart}/>
            <Route path='login' component={LoginSmart}/>
            <Route onEnter={requireLogin}>
                <Route component={DashboardSmart}>
                    <Route path='exam_setting' component={examSettingSmart}/>
                    <Route path='exam_list' component={examListSmart}/>
                    <Route path='role_admin' component={roleAdminSmart}/>
                </Route>
            </Route>
            <Route path='*' component={NotFound} status={404}/>
        </Route>
    )
}
