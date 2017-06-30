//import Crypto from 'crypto-js';
import HmacSHA256 from 'crypto-js/hmac-sha256'
import Base64 from 'crypto-js/enc-base64'
//import {'hmac-sha256' as HmacSHA256, 'enc-base64' as Base64 } from 'crypto-js.hmac-sha256';

export default {
    getAuthHeader({ url, accessToken, macKey, host=null, method='get' }) {
        //URI转码
        url = encodeURI(url)
        /**
         * @return {Promise}
         */
        let _accessToken = accessToken || localStorage.getItem('access_token')
        let _macKey = macKey || localStorage.getItem('mac_key')

        if (!_accessToken || !_macKey) {
            return
        }

        if (!HmacSHA256) {
            console.error('please include crypto lib in the page.')
        }

        let strAuth = `MAC id="${_accessToken}",nonce="`
        let nonce = new Date().getTime() + ':' + this.randomCode()
        strAuth += nonce + '",mac="'

        let path
        let pos = url.indexOf('://')
        if (pos > 0) {// for cross domain requesting
            path = url.substring(pos + 3)
            pos = path.indexOf('/')
            host = path.substr(0, pos)
            path = path.substring(pos)
        } else {
            if(!host) {
                console.error('parameter "host" is missed.')
                return
            }
            path = url
        }
        let requestContent = nonce + '\n' + method.toUpperCase()  + '\n' + path + '\n' + host + '\n'
        let hash = HmacSHA256(requestContent, _macKey)
        let mac = hash.toString(Base64)
        strAuth += mac + '"'
        return strAuth
    },

    randomCode() {
        let code = ''
        let codeLength = 8//验证码的长度
        let chars = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ]
        //所有候选组成验证码的字符，当然也可以用中文的

        for (let i = 0; i < codeLength; i++) {
            let charIndex = Math.floor(Math.random() * 36)
            code += chars[charIndex]
        }
        return code
    },
    saveAuth(accessToken, macKey, refreshToken, expiresAt, userInfo={}) {
        localStorage.setItem('user_info', JSON.stringify(userInfo))
        localStorage.setItem('access_token', accessToken)
        localStorage.setItem('mac_key', macKey)
        localStorage.setItem('refresh_token', refreshToken)
        localStorage.setItem('expires_at', expiresAt)
    },
    getAuth() {
        return {
            userInfo : localStorage.getItem('user_info') ? JSON.parse(localStorage.getItem('user_info')) : null,
            accessToken : localStorage.getItem('access_token') || null,
            macKey : localStorage.getItem('mac_key') || null,
            refreshToken : localStorage.getItem('refresh_token') || null,
            expiresAt : localStorage.getItem('expires_at') || null
        }
    },
    cleanAuth() {
        localStorage.clear()
        //delete localStorage.user_info
        //delete localStorage.access_token
        //delete localStorage.mac_key
        //delete localStorage.refresh_token
        //delete localStorage.expires_at
        //delete localStorage.v_org_id
        //delete localStorage.v_org_info
    }
}
