/**
 * Created by xlm on 2016/8/2.
 */

/**
 * 判断浏览器是否小等于ie9
 * @returns {boolean}
 */
export function browserLessIE9() {
    let info = getBrowserInfo()
    if(info.browser != 'msie') {
        return false
    }else {
        if(info.ver == '8.0' || info.ver == '9.0' || info.ver == '7.0' || info.ver == '6.0') {
            return true
        }else {
            return false
        }
    }
}

/**
 * 判断浏览器是否小等于ie8
 * @returns {boolean}
 */
export function browserLessIE8() {
    let info = getBrowserInfo()
    if(info.browser != 'msie') {
        return false
    }else {
        if(info.ver == '8.0' || info.ver == '7.0' || info.ver == '6.0') {
            return true
        }else {
            return false
        }
    }
}

/**
 * 判断是否是ie浏览器 包括ie11
 * @returns {boolean}
 */
export function isIE() {
    if(!!window.ActiveXObject || 'ActiveXObject' in window) {
        return true
    }else {
        return false
    }
}

function getBrowserInfo() {
    let Sys = {}
    let ua = navigator.userAgent.toLowerCase()
    let re =/(trident|msie|firefox|chrome|opera|version).*?([\d.]+)/
    let m = ua.match(re)
    Sys.browser = m[1].replace(/version/, 'safari')
    Sys.ver = m[2]
    return Sys
}

/**
 * 获取浏览器可见窗口宽高-兼容ie
 * @returns {{width: number, height: number}}
 */
export function findDimensions() {
    let winWidth = 0
    let winHeight = 0
    if (window.innerWidth) {
        winWidth = window.innerWidth
    }else if ((document.body) && (document.body.clientWidth)) {
        winWidth = document.body.clientWidth
    }
    if (window.innerHeight) {
        winHeight = window.innerHeight
    }else if ((document.body) && (document.body.clientHeight)) {
        winHeight = document.body.clientHeight
    }
    //通过深入Document内部对body进行检测，获取窗口大小
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
        winHeight = document.documentElement.clientHeight
        winWidth = document.documentElement.clientWidth
    }
    return {
        width: winWidth,
        height: winHeight
    }
}

/**
 * 兼容主流浏览器和IE的事件监听
 * @param target
 * @param eventType
 * @param handler
 */

export function addHandler(target, eventType, handler) {
    let addHandler
    if(target.addEventListener) {
        addHandler = (target, eventType, handler) => {
            target.addEventListener(eventType, handler, false)
        }
    }else {
        addHandler = (target, eventType, handler) => {
            target.attachEvent('on'+eventType, handler)
        }
    }
    addHandler(target, eventType, handler)
}

/**
 *
 * @param target
 * @param eventType
 * @param handler
 */

export function removeHandler(target, eventType, handler) {
    let removeHandler
    if(target.addEventListener) {
        removeHandler = (target, eventType, handler) => {
            target.removeEventListener(eventType, handler, false)
        }
    }else {
        removeHandler = (target, eventType, handler) => {
            target.detachEvent('on'+eventType, handler)
        }
    }
    removeHandler(target, eventType, handler)
}

/**
 * ie8 trim()
 * @param str
 * @returns {string|void|XML|*}
 */

export function toTrim(str) {
    str = str.replace(/^(\s|\u00A0)+/, '')
    for(let i = str.length - 1; i >= 0; i--) {
        if(/\S/.test(str.charAt(i))) {
            str = str.substring(0, i+1)
            break
        }
    }
    return str
}

