/**
 * Created by Li Jian on 2017/03/24.
 */
import { getCsHost } from '../utils/configUtils.js'
import BaseService from '../services/baseService'
import $ from 'jquery'

export default new class CsService extends BaseService {

    uploadImg(res, imgData) {
        const endpoint = `upload?session=${res.session}`
        const url = `${getCsHost().url}/${endpoint}`
        imgData.append('path', res.path)
        imgData.append('scope', 1)
        return new Promise((resolve) => {
            $.ajax({
                url: url,
                type: 'post',
                data: imgData,
                cache: false,
                contentType: false,
                processData: false,
                success: (res) => {
                    if (res) {
                        resolve(res)
                    }
                }
            })
        })
    }

    /**
     * 获取目录信息
     * @param dentryId
     * @param session
     * @returns {*}
     */
    getDentryInfo(dentryId, session) {
        let endpoint = `dentries/${dentryId}`
        if (session) {
            endpoint += `?session=${session}`
        }
        const apiUrl = `${getCsHost().url}/${endpoint}`
        return super.request({ apiUrl, method:'GET', withAuthToken:true })
    }

    /**
     * 获取内容服务上传授权session
     * @returns {*}
     */
    getSessionInfo() {
        let endpoint = 'images/sessions'
        const apiUrl = `${getCsHost().url}/${endpoint}`
        return super.request({ apiUrl, body: null, method:'GET', withAuthToken:true })
    }


}
