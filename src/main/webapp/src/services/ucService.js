/**
 * Created by Administrator on 2015/12/7.
 */
import { getUcHost } from '../utils/configUtils.js'
import BaseService from '../services/baseService'
import { getMD5Value } from '../utils/md5Utils.js'
import authUtils from '../utils/authUtils.js'

class UcService extends BaseService {

    // 增加额外的 apiUrl 参数让 vorgService 可以改写 apiUrl
    request(paramObject, baseUrl = null) {
        let { endpoint } = paramObject
        let apiUrl = baseUrl ? baseUrl + `/${endpoint}` : `${getUcHost().url}/${endpoint}`
        paramObject.apiUrl = apiUrl
        return super.request(paramObject)
    }

    login(loginName, passwords) {
        const endpoint = 'tokens'
        const body = { login_name: loginName, password: getMD5Value(passwords) }
        return this.request({ endpoint, body, method: 'post', withAuthToken: false })
    }

    getUserInfo(userId) {
        const endpoint = 'users/' + userId
        let body = null
        return this.request({ endpoint, body, method: 'get', withAuthToken: true })
    }

    getUsersInfo(ids = []) {
        const endpoint = 'users/actions/query'

        let users = new Set(ids.map(item=>item['user_id']))
        const body = Array.from(users).filter(item=>item).sort().map(item=> {
            return { 'user_id': item }
        })
        return this.request({ endpoint, body, method: 'post', withAuthToken: true })
    }

    searchUserInfo(orgId, nodeId, query, size) {
        //let orgId = authUtils.getAuth().userInfo.orgId
        const endpoint = `organizations/${orgId}/orgnodes/${nodeId}/users/actions/search?name=${query}&$offset=0&$limit=${size}`
        let body = null
        return this.request({ endpoint, body, method: 'get', withAuthToken: true })
    }

    getUserListByKeyWord(keyword) {
        let orgId = authUtils.getAuth().userInfo.orgId
        const endpoint = `organizations/${orgId}/orgnodes/0/users/actions/search?name=${keyword}&$offset=0&$limit=10`
        let body = null
        return this.request({ endpoint, body, method: 'get', withAuthToken: true })
    }

    searchOrgNodes(orgId, nodeId, query, size) {
        const endpoint = `organizations/${orgId}/orgnodes/${nodeId}/actions/search?name=${query}&$offset=0&$limit=${size}`
        let body = null
        return this.request({ endpoint, body, method: 'get', withAuthToken: true })
    }

    tokensCheck(Authorization) {
        const endpoint = `tokens/${Authorization.accessToken}/actions/valid`
        const body = {
            mac: Authorization.mac,
            nonce: Authorization.nonce,
            host: Authorization.host,
            request_uri: Authorization.request_uri,
            http_method: Authorization.http_method
        }
        return this.request({ endpoint, body, method: 'post', withAuthToken: false })
    }

    tokensRefresh(refreshToken) {
        const endpoint = `tokens/${refreshToken}/actions/refresh`
        let body = null
        return this.request({ endpoint, body, method: 'post', withAuthToken: false })
    }

    queryOrgInfo(orgName) {
        const endpoint = `organizations/actions/query`
        let body = {
            org_name: orgName
        }
        return this.request({ endpoint, body, method: 'post', withAuthToken: true })
    }

    getOrgUsersInfo(offset,limit) {
        let orgId = authUtils.getAuth().userInfo.orgId
        const endpoint = `organizations/${orgId}/users?$offset=${offset}&$limit=${limit}`
        return this.request({ endpoint, body:null, method: 'get', withAuthToken: true })
    }

    getOrgUsersCount() {
        let orgId = authUtils.getAuth().userInfo.orgId
        const endpoint = `organizations/${orgId}/users/actions/count`
        return this.request({ endpoint, body:null, method: 'get', withAuthToken: true })
    }

    getOrgNodes(orgId, offset, limit) {
        let endpoint = `organizations/${orgId}/orgnodes?`
        if (offset != null) {
            endpoint += `$offset=${offset}`
        }
        if (limit != null) {
            endpoint += `&$limit=${limit}`
        }
        return this.request({ endpoint, body: null, method: 'get', withAuthToken: true })
    }

    getChildNodesCount(orgId, nodeId) {
        let endpoint = `organizations/${orgId}/orgnodes/${nodeId}/current/nodes/action/amount`
        return this.request({ endpoint, body: null, method: 'get', withAuthToken: true })
    }

    getChildNodes(orgId, nodeId, offset, limit) {
        let endpoint = `organizations/${orgId}/orgnodes/${nodeId}/childnodes?`
        if (offset != null) {
            endpoint += `$offset=${offset}`
        }
        if (limit != null) {
            endpoint += `&$limit=${limit}`
        }
        return this.request({ endpoint, body: null, method: 'get', withAuthToken: true })
    }

    getChildNodesWithUserAmount(orgId, nodeId, offset, limit) {
        let endpoint = `organizations/${orgId}/orgnodes/${nodeId}/childnodeamounts?$offset=${offset}&$limit=${limit}`
        return this.request({ endpoint, body: null, method: 'get', withAuthToken: true })
    }

    // 获取节点下一级用户数
    getNodeUsersCount(orgId, nodeId) {
        let endpoint = `organizations/${orgId}/orgnodes/${nodeId}/current/users/action/amount`
        return this.request({ endpoint, body: null, method: 'get', withAuthToken: true })
    }

    //统计某个节点下的所有用户数
    getNodeTotalUsersCount(orgId, nodeId) {
        let endpoint = `organizations/${orgId}/orgnodes/${nodeId}/users/actions/count`
        return this.request({ endpoint, body: null, method: 'get', withAuthToken: true })
    }

    getNodeUsers(orgId, nodeId, offset, limit) {
        let endpoint = `organizations/${orgId}/orgnodes/${nodeId}/users?`
        if (offset != null) {
            endpoint += `$offset=${offset}`
        }
        if (limit != null) {
            endpoint += `&$limit=${limit}`
        }
        console.log('get node users offset: ' + offset)
        console.log('get node users: ' + endpoint)
        return this.request({ endpoint, body: null, method: 'get', withAuthToken: true })
    }

    getOrgUsers(orgId, offset, limit) {
        //const endpoint = `organizations/${orgId}/users?$offset=${offset}&$limit=${limit}`
        let endpoint = `organizations/${orgId}/users?`
        if (offset != null) {
            endpoint += `$offset=${offset}`
        }
        if (limit != null) {
            endpoint += `&$limit=${limit}`
        }
        return this.request({ endpoint, body: null, method: 'get', withAuthToken: true })
    }

    getAllAncestors(orgId, nodeId) {
        let endpoint = `organizations/${orgId}/orgnodes/${nodeId}/parentsinfo`
        return this.request({ endpoint, body: null, method: 'get', withAuthToken: true })
    }

    getNodeInfo(orgId, nodeId) {
        let endpoint = `organizations/${orgId}/orgnodes/${nodeId}`
        return this.request({ endpoint, body: null, method: 'get', withAuthToken: true })
    }

}

export {
    UcService // vorgService 继承
}

export default new UcService()
