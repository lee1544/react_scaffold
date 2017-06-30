/**
 * Created by Li Jian on 2016/06/08.
 */
import { getUcHost } from '../utils/configUtils.js'
import BaseService from '../services/baseService'
import { getMD5Value } from '../utils/md5Utils.js'
import authUtils from '../utils/authUtils.js'
import { UcService } from '../services/ucService'

/**
 * vorgService 增加从 Uc 取 vorg 的相关逻辑，在没有提供 vorgid 或者 authUtils 中取不到 vorg
 * 信息时回退到 ucService
 */

export default new class vorgService extends UcService {

    vorgRequest( paramObject ) {
        let baseUrl = `${getUcHost().vurl}`
        return super.request(paramObject, baseUrl)
    }

    login(loginName, passwords, vOrgId) {
        if (!vOrgId) return super.login(loginName, passwords)
        const endpoint = `virtual_organizations/${vOrgId}/tokens`
        const body = { login_name: loginName, password: getMD5Value(passwords) }
        return this.vorgRequest({ endpoint, body, method: 'post', withAuthToken: false }).then(response => {
            return this.getVorgInfo(vOrgId, response['accessToken'], response['macKey']).then( vOrgInfo => {
                response['vOrgInfo'] = vOrgInfo
                return response
            })
        })
    }

    getUserInfo(userId, vOrgId) {
        // 除 login 与 tokensCheck 以外其他服务均尝试从 localstorage 中取 vorg 信息
        vOrgId = vOrgId ? vOrgId : authUtils.getAuth().vOrgId
        if (!vOrgId) {
            return super.getUserInfo(userId)
        }
        const endpoint = `virtual_organizations/${vOrgId}/users/${userId}`
        let body = null
        return this.vorgRequest({ endpoint, body, method: 'get', withAuthToken: true })
    }

    getUsersInfo(ids = [], vOrgId) {
        if (!ids || ids.toString() == '' ) return Promise.resolve({})
        vOrgId = vOrgId ? vOrgId : authUtils.getAuth().vOrgId
        if (!vOrgId) return super.getUsersInfo(ids)
        const endpoint = `virtual_organizations/${vOrgId}/users/actions/query`

        let users = new Set(ids.map(item=>item['user_id']))
        const body = Array.from(users).filter(item=>item).sort().map(item=> {
            return { 'user_id': item }
        })
        return this.vorgRequest({ endpoint, body, method: 'post', withAuthToken: true })
    }

    searchUserInfo(query, size, vOrgId) {
        vOrgId = vOrgId ? vOrgId : authUtils.getAuth().vOrgId
        let userId = authUtils.getAuth().userInfo.id
        if (!vOrgId) return super.searchUserInfo(query, size)
        let orgId = authUtils.getAuth().userInfo.orgId
        const endpoint = `virtual_organizations/${vOrgId}/organizations/${orgId}/orgnodes/0/users/actions/search?user_id=${userId}&name=${query}&$offset=0&$limit=${size}`
        let body = null
        return this.vorgRequest({ endpoint, body, method: 'get', withAuthToken: true })
    }

    tokensCheck(Authorization, vOrgId) {
        if (!vOrgId) return super.tokensCheck(Authorization)
        const endpoint = `virtual_organizations/${vOrgId}/tokens/${Authorization.accessToken}/actions/valid`
        const body = {
            mac: Authorization.mac,
            nonce: Authorization.nonce,
            host: Authorization.host,
            request_uri: Authorization.request_uri,
            http_method: Authorization.http_method
        }
        return this.vorgRequest({ endpoint, body, method: 'post', withAuthToken: false }).then(response => {
            return this.getVorgInfo(vOrgId, response['accessToken'], response['macKey']).then( vOrgInfo => {
                response['vOrgInfo'] = vOrgInfo
                return response
            })
        })
    }

    tokensRefresh(refreshToken, vOrgId) {
        // 保持接口与 uc 一致
        return super.tokensRefresh(refreshToken)
    }

    getVorgInfo(vOrgId, accessToken, macKey) {
        const endpoint = `virtual_organizations/${vOrgId}`
        return this.vorgRequest({ endpoint, body: null, method: 'get', withAuthToken: true, accessToken, macKey })
    }
}
