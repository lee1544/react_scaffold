/**
 * Created by Li Jian on 2017-03-24.
 */
//方法论在线评测管理后台各个环境url
const dev_url = 'http://methodology-exam-server.dev.web.nd'
const debug_url = 'http://methodology-exam-server.debug.web.nd'
const beta_url = 'http://methodology-exam-server.beta.101.com|https://methodology-exam-server.beta.101.com'
const prod_url = 'http://methodology-exam-server.sdp.101.com|https://methodology-exam-server.sdp.101.com'
const localhost = 'localhost'
//方法论在线评测服务端各个环境url
const dev_exam = 'http://methodology-exam-server.dev.web.nd/v0.1'
const debug_exam = 'http://methodology-exam-server.debug.web.nd/v0.1'
const beta_exam = 'https://methodology-exam-server.beta.101.com/v0.1'
const prod_exam = 'https://methodology-exam-server.sdp.101.com/v0.1'
//vuc(虚拟组织UC)服务端各个环境url
const dev_vuc = 'https://virtual-organization.dev.web.nd/v0.1'
const debug_vuc = 'https://virtual-organization.debug.web.nd/v0.1'
const beta_vuc = 'https://ucvorg-beta.101.com/v0.1'
const prod_vuc = 'https://ucvorg.101.com/v0.1'
//uc服务端各个环境url
const non_prod_uc = 'https://ucbetapi.101.com/v0.93'
const prod_uc = 'https://aqapi.101.com/v0.93'
//cs服务端各个环境url
const non_prod_cs = 'http://betacs.101.com/v0.1'
const prod_cs = 'http://cs.101.com/v0.1'
//cs(头像服务)服务端各个环境url
const non_prod_avatar = 'http://betacs.101.com/v0.1/static/preproduction_content_cscommon/avatar'
const prod_avatar = 'http://cdncs.101.com/v0.1/static/cscommon/avatar'

const CONFIG = {
    exam: {
        local: {
            rule: localhost,
            url: dev_exam
        },
        dev: {
            rule: dev_url,
            url: dev_exam
        },
        debug: {
            rule: debug_url,
            url: debug_exam
        },
        beta: {
            rule: beta_url,
            url: beta_exam
        },
        prod: {
            rule: prod_url,
            url: prod_exam
        }
    },
    uc: {
        local: {
            rule: localhost,
            url: non_prod_uc,
            vurl: dev_vuc
        },
        dev: {
            rule: dev_url,
            url: non_prod_uc,
            vurl: dev_vuc
        },
        debug: {
            rule: debug_url,
            url: non_prod_uc,
            vurl: debug_vuc
        },
        beta: {
            rule: beta_url,
            url: non_prod_uc,
            vurl: beta_vuc
        },
        prod: {
            rule: prod_url,
            url: prod_uc,
            vurl: prod_vuc
        }
    },
    cs:{
        local: {
            rule: localhost,
            url: non_prod_cs,
            avatar : non_prod_avatar
        },
        dev: {
            rule: dev_url,
            url: non_prod_cs,
            avatar : non_prod_avatar
        },
        debug: {
            rule: debug_url,
            url: non_prod_cs,
            avatar : non_prod_avatar
        },
        beta: {
            rule: beta_url,
            url: non_prod_cs,
            avatar : non_prod_avatar
        },
        prod: {
            rule: prod_url,
            url: prod_cs,
            cdn : 'http://cdncs.101.com/v0.1', // CS Utils uses cdn
            avatar : prod_avatar // 生产环境使用 cdn
        }
    }
}

export default CONFIG
