/**
 * 方法论在线评测Service
 * Created by Li Jian on 2017/05/25.
 */
import { getExamHost } from '../utils/configUtils.js'
import { getMD5Value } from '../utils/md5Utils.js'
import BaseService from '../services/baseService'

export default new class examService extends BaseService {

    request({ endpoint, body=null, method='get', withAuthToken=true }) {
        let apiUrl = `${getExamHost().url}/${endpoint}`
        return super.request({ apiUrl, body, method, withAuthToken })
    }

    /**
     *  系统登录
     * */
    login(loginName, password) {
        const endpoint = 'login'
        const body = { user_name: loginName, password: getMD5Value(password) }
        return this.request({ endpoint, body, method: 'post', withAuthToken: false })
    }

    /**
     *  新增考试
     * */
    addExam(examInfo) {
        const endpoint = `m/methodology/exams`
        const body = examInfo
        return this.request({ endpoint, body, method: 'post', withAuthToken: true })
    }

    /**
     *  修改考试
     * */
    updExam(examId, examInfo) {
        const endpoint = `m/methodology/exams/${examId}`
        const body = examInfo
        return this.request({ endpoint, body, method: 'put', withAuthToken: true })
    }

    /**
     *  修改考试样卷Url
     * */
    updExamSampleUrl(examId, examInfo) {
        const endpoint = `m/methodology/exams/${examId}/sample_url`
        const body = examInfo
        return this.request({ endpoint, body, method: 'put', withAuthToken: true })
    }

    /**
     *  删除考试
     * */
    delExam(examId) {
        const endpoint = `m/methodology/exams/${examId}`
        const body = null
        return this.request({ endpoint, body, method: 'delete', withAuthToken: true })
    }

    /**
     *  获取考试列表
     * */
    getExams(page, size) {
        const endpoint = `m/methodology/exams?page=${page}&size=${size}`
        const body = null
        return this.request({ endpoint, body, method: 'get', withAuthToken: true })
    }

    /**
     *  根据考试编号查看对应的考试试卷
     * */
    getPapersByExamCode(examCode, page, size) {
        const endpoint = `m/methodology/exams/${examCode}/exam_papers?page=${page}&size=${size}`
        const body = null
        return this.request({ endpoint, body, method: 'get', withAuthToken: true })
    }

    /**
     *  新增系统管理员
     * */
    saveSysAdmin(userInfo) {
        const endpoint = `m/authority/administrators`
        const body = userInfo
        return this.request({ endpoint, body, method: 'post', withAuthToken: true })
    }

    /**
     *  删除系统管理员
     * */
    removeSysAdmin(userId) {
        const endpoint = `m/authority/administrators/${userId}`
        const body = null
        return this.request({ endpoint, body, method: 'delete', withAuthToken: true })
    }

    /**
     *  获取系统管理员列表
     * */
    getSysAdmin() {
        const endpoint = `m/authority/administrators`
        const body = null
        return this.request({ endpoint, body, method: 'get', withAuthToken: true })
    }

    /**
     *  获取考试历史编号
     * */
    getHistoryExamCode(page, size) {
        const endpoint = `methodology/exam_codes?page=${page}&size=${size}`
        const body = null
        return this.request({ endpoint, body, method: 'get', withAuthToken: true })
    }

    /**
     *  导出考卷数据到excel
     * */
    exportExamPaper(examCode) {
        const endpoint = `m/methodology/exams/${examCode}/exam_papers/export_excel`
        const body = null
        return this.request({ endpoint, body, method: 'get', withAuthToken: false })
    }

    /**
     *  获取所有考试编号
     * */
    getExamCodes() {
        const endpoint = `methodology/exam_codes?fetch_all=true`
        const body = null
        return this.request({ endpoint, body, method: 'get', withAuthToken: true })
    }
}
