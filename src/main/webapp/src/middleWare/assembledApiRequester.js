/**
 * Created by hjx on 8/30/2016.
 */
export const ASSEMBLED_REQUESTS                = Symbol('assembled request')
export const FILTER                            = Symbol('filter')
export const LINK_REQUESTS_MODE                = Symbol('link requests')
export const ZIP_REQUESTS_MODE                 = Symbol('zip requests')
export const SINGLE_REQUEST_MODE               = Symbol('single request')
export const LINK_INDETERMINATE_REQUESTS_MODE  = Symbol('link indeterminate requests')
export const ZIP_INDETERMINATE_REQUESTS_MODE   = Symbol('zip indeterminate requests')
export const TRANSFORMER_MODE                  = Symbol('dynamically change flow')

const UNDEFINED = 'undefined'
const FUNCTION  = 'function'
const STRING    = 'string'
const BOOLEAN   = 'boolean'
const NUMBER    = 'number'
const OBJECT    = 'object'

const FILTER_MAP = {}
let SYNFLAG = false

export function assemble(request, sync) {
    let req = request
    if (sync) {
        req = Object.assign({}, request, { synchronized: true })
    }
    return {
        [ASSEMBLED_REQUESTS]: req
    }
}

export function pass() {
    return link([])
}

export function single(options) {
    let action = {
        assembleMode: SINGLE_REQUEST_MODE
    }

    return Object.assign({}, action, options)
}

export function link(...requests) {
    if (requests.length == 1 && typeof requests[0] === 'function') {
        return {
            assembleMode: LINK_INDETERMINATE_REQUESTS_MODE,
            getRequests: requests[0]
        }
    }
    return {
        assembleMode: LINK_REQUESTS_MODE,
        requests: requests
    }
}

export function zip(...requests) {
    if (typeof requests[0] === FUNCTION) {
        if (requests.length > 1 && typeof requests[requests.length - 1] === FUNCTION) {
            return {
                assembleMode: ZIP_INDETERMINATE_REQUESTS_MODE,
                getRequests: requests[0],
                zip: requests[requests.length - 1]
            }
        } else {
            return {
                assembleMode: ZIP_INDETERMINATE_REQUESTS_MODE,
                getRequests: requests[0]
            }
        }
    }

    if (requests.length > 1 && typeof requests[requests.length - 1] === FUNCTION) {
        return {
            assembleMode: ZIP_REQUESTS_MODE,
            requests: requests.slice(0, requests.length - 1),
            zip: requests[requests.length - 1]
        }
    }

    return {
        assembleMode: ZIP_REQUESTS_MODE,
        requests: requests
    }
}

export function transform(transformFunc) {
    return {
        assembleMode: TRANSFORMER_MODE,
        transform: transformFunc
    }
}

function promiseJust(x) {
    return new Promise((resolve, reject) => { resolve(x) })
}

function singleRequest(request, next, lastResponse = null, lastError = null) {
    const {
        assembleMode, actionTypes, inMap, service, outMap, modifyActionResponse,
        modifyActionError, modifyActionPayload, onSuccess, onFailure, throwException
    } = request
    if (assembleMode !== SINGLE_REQUEST_MODE) {
        throw new Error('Expect a single request.')
    }
    if (typeof service !== FUNCTION) {
        throw new Error('Expect a function as service.')
    }
    if (!Array.isArray(actionTypes) || actionTypes.length !== 3) {
        throw new Error('Expect an array of three action types.')
    }
    const [ requestType, successType, failureType ] = actionTypes

    let promise = promiseJust({ lastResponse, lastError }).then((x) => {
        if (requestType != null) {
            if (modifyActionPayload) {
                next({ type: requestType, payload: modifyActionPayload() })
            } else {
                next({ type: requestType })
            }
        }
        return x
    }).then(({ lastResponse, lastError }) => {
        let r = inMap ? inMap(lastResponse) : lastResponse
        return { lastResponse: r, lastError }
    }).then(({ lastResponse, lastError }) => {
        return service(lastResponse, lastError)
    }).then((response) => {
        if (onSuccess) {
            onSuccess(response)
        }
        if (successType != null) {
            let payload = modifyActionResponse ? modifyActionResponse(response) : response
            next({ type: successType, response: payload })
        }
        let lastResponse = outMap ? outMap(response) : response
        return { lastResponse, lastError: null }
    }).catch((err) => {
        let unifiedFailureType = 'UNIFIED_EXCEPTION_HANDLING'
        next({ type: unifiedFailureType, err })
        if (onFailure) {
            onFailure(err)
        }
        if (failureType != null) {
            let error = modifyActionError ? modifyActionError(err) : err
            next({ type: failureType, error })
        }
        let e = err == null ? new Error('error: ' + failureType) : err
        return { lastResponse: null, lastError: e }
    })
    return promise
}

function linkRequest(requests, next, lastResponse = null, lastError = null) {
    if (!requests || requests.length == 0) {
        return promiseJust({ lastResponse, lastError })
    }

    return requests.reduce((pre, cur, index, array) => {
        return pre.then(({ lastResponse, lastError }) => {
            return doRequest(cur, next, lastResponse, lastError)
        })
    }, promiseJust({ lastResponse, lastError }))
}

function zipRequest(requests, zip, next, lastResponse = null, lastError = null) {
    if (!requests || requests.length == 0) {
        return promiseJust({ lastResponse, lastError })
    }
    let promises = requests.map((request) => {
        return doRequest(request, next, lastResponse, lastError)
    })
    return Promise.all(promises).then((results) => {
        let ret = results.reduce((pre, cur) => {
            return {
                lastResponse: pre.lastResponse.concat(cur.lastResponse),
                lastError: pre.lastError.concat(cur.lastError)
            }
        }, { lastResponse: [], lastError: [] })
        if (typeof zip === FUNCTION) {
            ret = { lastResponse: zip(ret.lastResponse, ret.lastError), lastError: null }
        }
        return ret
    })
}

function doRequest(request, next, lastResponse = null, lastError = null) {
    if (request == null) {
        return promiseJust({ lastResponse, lastError })
    }
    let assembleMode = request.assembleMode
    let requests
    let zip
    switch (assembleMode) {
        case TRANSFORMER_MODE:
            let newRequest = request.transform(lastResponse, lastError)
            return doRequest(newRequest, next, lastResponse, lastError)
        case LINK_REQUESTS_MODE:
            requests = request.requests
            if (typeof requests === FUNCTION) {
                requests = requests(lastResponse, lastError)
            }
            return linkRequest(requests, next, lastResponse, lastError)
        case LINK_INDETERMINATE_REQUESTS_MODE:
            requests = request.getRequests(lastResponse, lastError)
            return linkRequest(requests, next, lastResponse, lastError)
        case ZIP_REQUESTS_MODE:
            requests = request.requests
            if (typeof requests === FUNCTION) {
                requests = requests(lastResponse, lastError)
            }
            zip = request.zip
            return zipRequest(requests, zip, next, lastResponse, lastError)
        case ZIP_INDETERMINATE_REQUESTS_MODE:
            requests = request.getRequests(lastResponse, lastError)
            zip = request.zip
            return zipRequest(requests, zip, next, lastResponse, lastError)
        case SINGLE_REQUEST_MODE:
            return singleRequest(request, next, lastResponse, lastError)
        default :
            return promiseJust({ lastResponse, lastError })
    }
}

function stringifyParam(param) {
    return JSON.stringify(param ? param : {})
}

function clearRequestTime(action) {
    const filterConfig = action[FILTER]
    if (typeof filterConfig === UNDEFINED) {
        return
    }
    const { symbol, param } = filterConfig
    if (!symbol) {
        return
    }
    let paramstr = stringifyParam(param)
    if (typeof FILTER_MAP[symbol] != UNDEFINED &&
        typeof FILTER_MAP[symbol][paramstr] != UNDEFINED) {
        delete FILTER_MAP[symbol][paramstr]
    }
}

function filter(action) {
    const filterConfig = action[FILTER]
    if (typeof filterConfig === UNDEFINED) {
        return true
    }
    const { symbol, param, timeInterval } = filterConfig
    if (!symbol) {
        throw new Error('a symbol is required to filter requests')
    }
    let timeStamp = new Date().getTime()
    let paramstr = stringifyParam(param)
    let interval = (typeof timeInterval === NUMBER) ? timeInterval : 1000
    if (typeof FILTER_MAP[symbol] === UNDEFINED) {
        FILTER_MAP[symbol] = {}
    }
    if (typeof FILTER_MAP[symbol][paramstr] === UNDEFINED ||
        timeStamp - FILTER_MAP[symbol][paramstr] > interval) {
        FILTER_MAP[symbol][paramstr] = timeStamp
        return true
    }

    return false
}

// can't wait any longer
let noWait = next => action => {
    let synchronized = action[ASSEMBLED_REQUESTS]['synchronized'] === true
    if(synchronized) SYNFLAG = true

    if (!filter(action)) {
        if (typeof action[FILTER].onDiscard === FUNCTION) {
            action[FILTER].onDiscard()
        }
        return
    }

    return doRequest(action[ASSEMBLED_REQUESTS], next).then((x) => {
        // console.log('request result: ')
        // console.dir(x)
        if (synchronized) {
            SYNFLAG = false
        }
    }).catch((e) => {
        // console.log('request error: ')
        // console.dir(e)
        clearRequestTime(action)
        if (synchronized) {
            SYNFLAG = false
        }
    })
}

export function wait2(callback, interval = 20, max = 3000) {
    if (max < interval) max = interval
    let i = Math.floor(max / interval)

    function* generator(i) {
        for(; i > 0 ; i--) {
            let x = yield i
            if (x == 0) {
                return 'done'
            }
        }
        return 'timeout'
    }

    //http://stackoverflow.com/questions/951021/what-do-i-do-if-i-want-a-javascript-version-of-sleep
    function resume(i, generator) {
        setTimeout( () => {
            let result = generator.next(i)
            if(result.done) {
                callback()
              //console.log('goes on with service ... ')
            } else {
                if (SYNFLAG) {
                    resume(result.value, generator)
                } else {
                    resume(0, generator)
                }
            }
        }, interval)
    }

    let gen = generator(i)
    let result = gen.next()
    if(result.done) {
        callback()
    } else {
        resume(result.value, gen)
    }
}

let current = next => action => {
    if (typeof action[ASSEMBLED_REQUESTS] === UNDEFINED) {
        return next(action)
    } else if (SYNFLAG) {
        return wait2(() => current(next)(action))
    } else {
        return noWait(next)(action)
    }
}

export default  store => current
