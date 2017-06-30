/**
 * Created by zhoumao on 16-3-15.
 */

/**
 * canva FileAPI blob 等对象依赖于浏览器
 *
 */
import React from 'react'
import ReactDOM from 'react-dom'

// source https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
//if (!HTMLCanvasElement.prototype.toBlob) {
//    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
//        value: function (callback, type, quality) {
//
//            let binStr = atob( this.toDataURL(type, quality).split(',')[1] ),
//                len = binStr.length,
//                arr = new Uint8Array(len)
//
//            for (let i=0; i<len; i++ ) {
//                arr[i] = binStr.charCodeAt(i)
//            }
//
//            callback( new Blob( [ arr ], { type: type || 'image/png' } ) )
//        }
//    })
//}

/**
 * 图形高品质缩放
 * 宽或高为 0 时会尝试重设
 *
 * @param image
 * @param width
 * @param height
 * @returns {*}
 */
function resample(image, width, height) {
    let factor

    if (!width && !height) {
        width = image.width
        height = image.height
    }

    if (!width) {
        factor = height / image.height
        width = Math.round(image.width * factor)
    }

    if(!height) {
        factor = width / image.width
        height = Math.round(image.height * factor)
    }

    let canvas = image
    while(canvas.width > width && canvas.width * 0.5 > width) {
        canvas = scalingHelper(canvas, 0.5)
    }

    let finalCanvas = document.createElement('canvas')
    finalCanvas.width = width // 原始宽
    finalCanvas.height = height
    let ctx = finalCanvas.getContext('2d')
    ctx.drawImage(canvas, 0, 0, width, height)

    return finalCanvas
}

function scalingHelper(img, factor) {
    let canvas = document.createElement('canvas')
    canvas.width = Math.round(img.width * factor)
    canvas.height = Math.round(img.height * factor)
    let ctx = canvas.getContext('2d')
    //ctx.imageSmoothingEnabled = false
    //ctx.webkitImageSmoothingEnabled = false
    //ctx.mozImageSmoothingEnabled = false
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    return canvas
}

function canvas2DataUrl(canvas, options={}) {
    let defaultOptions = {
        quality: 0.75,
        type: 'image/jpeg'
    }
    let actualOptions = Object.assign({}, defaultOptions, options)

    let { type, quality } = actualOptions
    //console.info(`type: ${type}, q: ${quality}, w: ${canvas.width}`)
    let result =  canvas.toDataURL(type, quality)
    return result
}

function canvas2Blob(canvas, options={}) {
    return new Promise((resolve, reject) => {
        let defaultOptions = {
            quality: 0.75,
            type: 'image/jpeg'
        }
        let actualOptions = Object.assign({}, defaultOptions, options)

        let { type, quality } = actualOptions
        canvas.toBlob(blob => {
            resolve(blob)
        }, type, quality)
    })
}

/**
 * 将 blob 对象转为 file，以上传到服务器
 *
 * @param blob
 * @param filename
 * @param mimeType
 * @returns {*}
 */
function blob2File(blob, filename, mimeType) {
    return new File([ blob ], filename, { type: mimeType })
}

/**
 * 图像缩放为 blob
 * @param img
 * @param width
 * @param height
 * @returns {Promise}
 */
function resizePromise(img, width=0, height=0) {
    return new Promise((resolve, reject) => {
        let loaded = typeof img == 'string' // url
        let image
        if (loaded) {
            image = new Image
            image.onload = () => {
                if (image.width <= width || image.height <= height || (width == 0 && height == 0)) {
                    // nothing changes
                    resolve(scalingHelper(image, 1))
                }else {
                    resolve(resample(image, width, height))
                }
            }
            image.onerror = () => {
                console.error('image resize error here!!!')
                reject('resize error')
            }
            image.src = img
        } else {
            image = img
            if (image.width <= width || image.height <= height || (width == 0 && height == 0)) {
                // nothing changes
                resolve(scalingHelper(image, 1))
            }else {
                resolve(resample(image, width, height))
            }
        }
    })
}

/**
 * 缩放成图象
 *
 * @param img
 * @param width
 * @param height
 * @param type jpg/png
 * @param quality
 * @returns DataUrl
 */
function resize(img, width=0, height=0, type='png', quality=0.75) {
    let mime
    switch(type.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
    case 'image/jpeg':
        mime = 'image/jpeg'
        break
    case 'png':
    case 'image/png':
    default:
        mime = 'image/png'
    }
    return resizePromise(img, width, height).then(
        canvas => canvas2Blob(canvas, { type: mime, quality })
        //canvas => canvas2DataUrl(canvas, { type: mime, quality })
    )
}

/**
 * 读取file 并转成 blob 对象
 * @param file
 * @returns {Promise}
 */
function file2BlobPromise(file) {
    return new Promise((resolve, reject)=> {
        const reader = new FileReader()

        reader.onload = (e)=> {
            resolve(e.target.result)
        }

        reader.readAsDataURL(file)
    })
}

export { resize, file2BlobPromise, blob2File }

