'use strict'
require('babel-register')
let webpack = require('webpack')
let config = require('./webpack/dev.config')
//本地web启动端口
let port = 3030
let WebpackDevServer = require('webpack-dev-server')
let server = new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: {
        colors: true
    }
})

/**
 * 调试ie9/ie8兼容性,需要支持跨域请求时开启此段代码(用于本地调试,也可用来模拟服务端请求响应,返回对应json.)
 * 本地请求通过request转发到host地址.
 */
// let request = require('request')
// let bodyParser = require('body-parser')
// server.use(bodyParser.json())
// //转发服务器host
// let host = 'http://formtastic-service.dev.web.nd'
// server.use((req, res) => {
//     if(['.png', '.jpg','.css', '.jpeg', '.gif', '.json', '.js', '.swf'].some(
//             ext =>  req.url.toLowerCase().endsWith(ext))) {
//         res.sendFile(__dirname + req.url)
//     } else if(req.url.indexOf('v0.1/dispatcher') !== -1) {
//         let url = host + req.url
//         let headers = {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json; charset=UTF-8'
//         }
//         let options = {
//             url: url,
//             method: req.method,
//             headers: headers,
//             body: req.body,
//             json: true
//         }
//         request(options, (error, response, body) => {
//             // console.log(response.statusCode)
//             res.send(body)
//         })
//     }
// })
server.listen(port, '0.0.0.0', (err) => {
    if(err) {
        console.log(err)
    }
    console.info("==> Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
})
