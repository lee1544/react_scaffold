/**
 * Created by Li Jian on 2017/03/30.
 */

/**
 * 创建action减少模版代码.
 * @param type  actionType
 * @param argNames 所有附带数据的属性名称
 * @returns {{ type: *, ... }}
 */
export function createAction(type, ...argNames) {
    return (...args) => {
        let action = { type }
        argNames.forEach((arg, index) => {
            action[argNames[index]] = args[index]
        })
        return action
    }
}

/**
 * 创建reducer减少模版代码.
 * @param initialState 初始化state
 * @param handlers 处理函数
 * @returns newState
 */

export function createReducer(initialState, handlers) {
    return function reducer(state = initialState, action) {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action)
        } else {
            return state
        }
    }
}

/**
 * 更新对象方法,
 * @param oldObject 旧数据
 * @param newValues 需要合并进旧数据的新值
 * @returns newState
 */
export function updateObject(oldObject, newValues) {
    return Object.assign({}, oldObject, newValues)
}

/**
 * 更新数组方法,
 * @param array 需要更新的目标数组
 * @param compareField 用来定位数组中元素的属性
 * @param newValues 更新的对象
 * @returns newArray
 */
export function updateItemInArray(array, newValues, compareField) {
    const updatedItems = array.map(item => {
        if (item[compareField] !== newValues[compareField]) {
            return item
        }
        return updateObject(item, newValues)
    })
    return updatedItems
}

/**
 * 给数组添加一个对象
 * @param array 目标数组
 * @param item 需要增加的数据
 * @param flag 增加标志, true: 增加数据到数组头部, false: 增加数据到数组尾部
 * @returns {*|Array|Array.<T>|string|Observable|WordArray}
 */
export function addItemToArray(array, item, flag = true) {
    if(flag) {
        return [ item ].concat(array)
    }
    return array.concat(item)
}

/**
 * 删除数组某个元素
 * @param array 目标数组
 * @param index 索引
 * @returns {Array.<*>}
 */
export function removeItemFromArray(array, index) {
    let _array = Array.from(array)
    _array.splice(index, 1)
    return _array
}

/**
 * 过滤数组某个元素
 * @param array 目标数组
 * @param newValues 需要过滤掉的对象
 * @param compareField 用来做过滤的条件属性
 * @returns {Array.<*>}
 */
export function filterItemFromArray(array, newValues, compareField) {
    return array.filter(item => item[compareField] != newValues[compareField])
}
