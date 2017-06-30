/**
 * config工具,解析各个环境的配置文件.
 * Created by Li Jian on 2017/03/24.
 */
import CONFIG from '../constants/config.js'

const _parse = (configItem) => {
    let envList = Object.keys(configItem)
    for (let index = 0; index < envList.length; index++) {
        let key = envList[index]
        let env = configItem[key]
        if (window.location.href.match(env.rule)) {
            return env
        }
    }
}

/**
 * 获得当前框架服务端的HOST
 */
export function getExamHost() {
    return _parse(CONFIG.exam)
}

/**
 * 获得当前UC服务端的HOST
 */
export function getUcHost() {
    return _parse(CONFIG.uc)
}

/**
 * 获得当前CS服务端的HOST
 */
export function getCsHost() {
    return _parse(CONFIG.cs)
}
