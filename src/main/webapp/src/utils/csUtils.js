import { getCsHost } from '../utils/configUtils.js'
// 尽量使用 cdn
const HOST = getCsHost().url

export function getCsUrlByDentry(dentryId, session) {
  // console.log(dentryId, session);
    let endpoint = `download?dentryId=${dentryId}`
    if (session) {
        endpoint += `&session=${session}`
    }
    const url = `${HOST}/${endpoint}`
    return url
}

export function getCsThumbnailUrlByDentry(dentryId, session, size = 80, addition) {
    let endpoint = `download?dentryId=${dentryId}&size=${size}`
    if(addition && addition != '' && addition != '{}') {
        try {
            let additionObject = JSON.parse(addition)
            if(additionObject[dentryId] && additionObject[dentryId].toLocaleLowerCase() == 'gif') {
                endpoint += '&ext=jpg'
            }
        } catch(e) {
            // do nothing
        }
    }
    if (session) {
        endpoint += `&session=${session}`
    }
    const url = `${HOST}/${endpoint}`
    return url
}

export function getCsUrlByPath(path, session) {
    let endpoint = `static${path}`
    if (session) {
        endpoint = `${session}/` + endpoint
    }
    const url = `${HOST}/${endpoint}`
    return url
}

const IMG_OPTION = [
    { name: 'imgSrc', size: 0, gif: false },
    { name: 'imgSize80', size: 80, gif: true },
    { name: 'imgSize160', size: 160, gif: true },
    { name: 'imgSize240', size: 240, gif: true },
    { name: 'imgSize320', size: 320, gif: true },
    { name: 'imgSize480', size: 480, gif: true },
    { name: 'imgSize640', size: 640, gif: false },
    { name: 'imgSize960', size: 960, gif: false }
]

export function getImagesByDentryId(dentryId, addition) {
    const csUrl = `${HOST}`
    if(!dentryId || !csUrl) return null
    let images = []
    let dentryIds = dentryId.split(',')
    if(dentryIds && dentryIds.length > 0) {
        dentryIds.map(id => {
            let image = {}
            IMG_OPTION.map(option => {
                let endpoint = `/download?dentryId=${id}`
                if(option.size != 0) {
                    endpoint += `&size=${option.size}`
                }
                let additionObject = {}
                if(addition && addition != '' && addition != '{}') {
                    try {
                        if(typeof addition === 'string') {
                            additionObject = JSON.parse(addition)
                        } else if (typeof addition === 'object') {
                            additionObject = addition
                        }
                        if(additionObject[id] && additionObject[id].toLocaleLowerCase() == 'gif') {
                            if(option.gif) {
                                endpoint += '&ext=jpg'
                            }
                        }
                    } catch(e) {
                        // do nothing
                    }
                }
                image[option.name] = csUrl + endpoint
            })
            images.push(image)
        })
    }
    return images
}

export function  CheckImgExists(imgUrl) {
    let isExists = false
    let ImgObj = new Image()
    ImgObj.src = imgUrl
    if(ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
        isExists = true
    } else {
        isExists = false
    }
    return isExists
}


