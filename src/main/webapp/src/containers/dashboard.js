/**
 * Created by Li Jian on 2016/11/15
 */
import { Provider, connect } from 'react-redux'
import { pushState } from 'redux-router'
import DashboardDumb from '../components/dashboard/dashboard.js'
import { logout } from '../actions/simpleAction.js'
import authUtils from '../utils/authUtils'

function mapStateToProps(state) {
    return {
        userId: state.auth.userInfo && state.auth.userInfo.id ? state.auth.userInfo.id + '' : '',
        userName: state.auth.userInfo && state.auth.userInfo.name ? state.auth.userInfo.name : '',
        path: state.router.location.pathname
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onLogout: () => {
            authUtils.cleanAuth()
            dispatch(logout())
            return dispatch(pushState(null, '/login'))
        }
    }
}

let DashboardSmart = connect(
    mapStateToProps, mapDispatchToProps
)(DashboardDumb)

export default DashboardSmart
