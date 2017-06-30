/**
 * Created by Li Jian on 2016/11/17.
 */
import authUtils from '../utils/authUtils'
import { Schema, arrayOf, normalize } from 'normalizr'
import { camelizeKeys } from 'humps'
import fetch from 'isomorphic-fetch'

export default class {

    // vorg 是否支持 vorg header , 如果支持 vorg header 会从 localstorage 找相应的 vorg 信息
    request({ apiUrl, body, method='get', withAuthToken=true,
        host=null, vorg = false, accessToken = null, macKey = null })
    {

        const _method = method.toLowerCase()

        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8'
        }

        if (withAuthToken) {
            let auth = headers['Authorization'] = authUtils.getAuthHeader({
                accessToken: accessToken,
                macKey: macKey,
                url:apiUrl,
                method:_method, host })
        }

        if (vorg)  {
            let vOrgInfo = authUtils.getAuth().vOrgInfo
            if(vOrgInfo && vOrgInfo.orgName) {
                headers['vorg'] = vOrgInfo.orgName
            }
        }

        let settings = {
            method: _method,
            headers: headers
        }

        if (![ 'get', 'head' ].includes(_method) && body) {
            settings['body'] = JSON.stringify(body)
        }

        return fetch(apiUrl, settings).then(response => {
            let json = response.json()
            return json.then(json => {
                return { json, response }
            }).then(({ json, response }) => {
                if (!response.ok) {
                    return Promise.reject(json)
                }
                return camelizeKeys(json)
            }).catch(e => {
                if (response.ok) {
                    return {}
                } else {
                    return Promise.reject(e)
                }
            })
        })
    }

    decamelizeRequest({ apiUrl, body, method='get', withAuthToken=true,
        host=null, vorg = false, accessToken = null, macKey = null })
    {

        const _method = method.toLowerCase()

        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8'
        }

        if (withAuthToken) {
            let auth = headers['Authorization'] = authUtils.getAuthHeader({
                accessToken: accessToken,
                macKey: macKey,
                url:apiUrl,
                method:_method, host })
        }

        if (vorg)  {
            let vOrgInfo = authUtils.getAuth().vOrgInfo
            if(vOrgInfo && vOrgInfo.orgName) {
                headers['vorg'] = vOrgInfo.orgName
            }
        }

        let settings = {
            method: _method,
            headers: headers
        }

        if (![ 'get', 'head' ].includes(_method) && body) {
            settings['body'] = JSON.stringify(body)
        }

        return fetch(apiUrl, settings).then(response => {
            let json = response.json()
            return json.then(json => {
                return { json, response }
            }).then(({ json, response }) => {
                if (!response.ok) {
                    return Promise.reject(json)
                }
                return json
            }).catch(e => {
                if (response.ok) {
                    return {}
                } else {
                    return Promise.reject(e)
                }
            })
        })
    }
}
