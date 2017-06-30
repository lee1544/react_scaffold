/**
 * 权限配置Smart
 * Created by Li Jian on 2017/05/25
 */
import { Provider, connect } from 'react-redux'
import { pushState } from 'redux-router'
import RoleAdminDumb from '../components/role/roleAdmin.js'
import { getUserListByKeyWord, saveSysAdmin, removeSysAdmin, getSysAdmins, resetSubmitFlag } from '../actions/simpleAction.js'

function mapStateToProps(state) {
    return {
        users: state.role.users,
        sysAdmins: state.role.sysAdmins,
        isSubmit: state.role.isSubmit,
        error: state.role.error,
        loading: state.role.loading
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getUserListByKeyWord: (keyword) => dispatch(getUserListByKeyWord(keyword)),
        saveSysAdmin: (userInfo) => dispatch(saveSysAdmin(userInfo)),
        removeSysAdmin: (userId) => dispatch(removeSysAdmin(userId)),
        getSysAdmins: () => dispatch(getSysAdmins()),
        resetSubmitFlag: () => dispatch(resetSubmitFlag())
    }
}

let RoleAdminSmart = connect(
    mapStateToProps, mapDispatchToProps
)(RoleAdminDumb)

export default RoleAdminSmart
