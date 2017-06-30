/**
 * Created by Li Jian on 2016/11/15
 */
import { Provider, connect } from 'react-redux'
import { pushState } from 'redux-router'
import dateUtils from '../utils/dateUtils.js'
import { login } from '../actions/simpleAction.js'
import LoginDumb from '../components/login/login.js'

function mapStateToProps(state) {
    return {
        isLoggedIn: dateUtils.returnDifferenceState(state.auth.expiresAt),
        userId: state.auth.userInfo && state.auth.userInfo.id ? state.auth.userInfo.id + '' : '',
        location: state.router.location,
        loginErr: state.auth.error && state.auth.error.message ? state.auth.error.message : ''
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onLogin: (user) => dispatch(login(user)),
        redirect: (link) => dispatch(pushState(null, link))
    }
}


let LoginSmart = connect(
    mapStateToProps, mapDispatchToProps
)(LoginDumb)

export default LoginSmart
