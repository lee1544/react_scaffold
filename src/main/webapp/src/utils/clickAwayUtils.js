/**
 * Created by Administrator on 2015/12/11.
 */
import ReactDOM from 'react-dom'

export function bindClickAway(el) {
    let fn = getClickAwayEvent(el)
    on(document, 'click', fn)
    on(document, 'touchstart', fn)
}

export function unbindClickAway(el) {
    let fn = getClickAwayEvent(el)
    off(document, 'click', fn)
    off(document, 'touchstart', fn)
}

function getClickAwayEvent(el) {
    let fn
    if (!fn) {
        const self = el
        fn = function (e) {
            let el = ReactDOM.findDOMNode(self)
            // Check if the target is inside the current component
            if (e.target !== el && !isDescendant(el, e.target)) {
                self.componentClickAway()
            }
        }
        self.setState({ checkClickAwayMethod: fn })
    }
    return fn
}

function isDescendant(parent, child) {
    let node = child.parentNode
    while (node !== null) {
        if (node === parent) {
            return true
        }
        node = node.parentNode
    }
    return false
}

function on(el, type, callback) {
    if (el.addEventListener) {
        el.addEventListener(type, callback)
    } else {
        el.attachEvent('on' + type, function () {
            callback.call(el)
        })
    }
}

function off(el, type, callback) {
    if (el.removeEventListener) {
        el.removeEventListener(type, callback)
    } else {
        el.detachEvent('on' + type, callback)
    }
}
