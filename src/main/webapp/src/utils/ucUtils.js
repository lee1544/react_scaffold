/**
 * Created by xlm on 2016/9/7.
 */

/**
 * 获取用户名信息
 * @param userInfo
 * @return name (nickName | userName | userId)
 */
function getUcName(userInfo) {
    let name = ''
    if(userInfo['orgExinfo'] && userInfo['orgExinfo']['realName'] && userInfo['orgExinfo']['realName'] != '') {
        name = userInfo['orgExinfo']['realName']
    } else if(userInfo['userName'] && userInfo['userName'] != '') {
        name = userInfo['userName']
    } else {
        name = userInfo['userId']
    }
    return name
}

/**
 * 获取用户名信息
 * @param userInfo
 * @return name(userId)
 */
function getUserName(userInfo) {
    let userName = ''
    if(typeof userInfo != 'object') return userInfo
    if(!userInfo) return userName
    if(userInfo['org.realName'] && userInfo['org.realName'] != '') {
        userName = userInfo['org.realName']
    } else if(userInfo['nickName'] && userInfo['nickName'] != '') {
        userName = userInfo['nickName']
    } else {
        userName = userInfo['userId']
    }
    userName = userName + '(' + userInfo['org.orgUserCode'] + ')'
    return userName
}

/**
 * 获取应用角色信息,用于显示
 * @param role
 * @return roleName(roleId)
 */
function getRoleName(role) {
    let roleName = ''
    if(typeof role != 'object') return role
    roleName = role.roleName + ' (' + role.roleId + ')'
    return roleName
}

/**
 * 从name(userId)中获取userId
 * @param userInfo
 * @returns userId
 */
function getUserId(userName) {
    let userId = userName
    if(userName != '' && userName.indexOf('(') > 0 && userName.indexOf(')') > 0) {
        userId = userName.substring(userName.indexOf('(')+1, userName.indexOf(')'))
    }
    return userId
}

function getRoleId(roleName) {
    let roleId = roleName
    if(roleName != '' && roleName.indexOf('(') > 0 && roleName.indexOf(')') > 0) {
        roleId = roleName.substring(roleName.indexOf('(')+1, roleName.indexOf(')'))
    }
    return roleId
}

/**
 * 从name(userId)中获取name
 * @param userInfo
 * @returns name
 */
function getName(userName) {
    let name = ''
    if(userName != '' && userName.indexOf('(') > 0 && userName.indexOf(')') > 0) {
        name = userName.substring(0, userName.indexOf('('))
    }
    return name
}

module.exports = {
    getUserName,
    getUcName,
    getUserId,
    getName,
    getRoleName,
    getRoleId
}
