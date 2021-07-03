const router = require('express').Router()
const {createProxyMiddleware} = require('http-proxy-middleware')
const zlib = require('zlib');
const dumper = require('./helper/dumper')

module.exports = class ApiRouter {

    constructor(servers, routerName, io) {
        this.servers = servers
        this.routerName = routerName
        this.io = io
    }

    get() {
        let io = this.io;
        for (const server of this.servers) {
            let fullEndpointName = '/' + this.routerName + server.routerEndpoint
            router.use(server.routerEndpoint, createProxyMiddleware({
                    target: server.target,
                    changeOrigin: true,
                    preserveHeaderKeyCase: true,
                    pathRewrite: {[`^` + fullEndpointName]: ''},
                    onProxyReq(proxyReq, req, res) {
                        let body = [];
                        req.on('data', function (chunk) {
                            body.push(chunk);
                        }).on('end', function () {
                            if(body.length > 0){
                                req.body = Buffer.concat(body).toString()
                            }
                        })
                    },
                    onProxyRes(proxyRes, req, res) {
                        const dumpProxyResponse = new Promise((resolve, reject) => {
                            let originalBody = Buffer.from('');
                            proxyRes.on('data', function (data) {
                                originalBody = Buffer.concat([originalBody, data]);
                            });
                            proxyRes.on('end', function () {
                                let body = ''
                                try {
                                    originalBody = zlib.gunzipSync(originalBody)
                                } catch (error) {
                                }
                                originalBody = originalBody.toString('utf8')
                                try {
                                    body = JSON.parse(originalBody)
                                } catch (error) {
                                    body = originalBody
                                }
                                resolve(dumper.dumpProxyResponse(proxyRes, body))
                            })
                        })

                        dumpProxyResponse.then((proxyResponseDump) => {
                            let dump = {
                                request: dumper.dumpRequest(req, fullEndpointName, server.target),
                                response: proxyResponseDump,
                            }
                            io.emit(server.name, dump)
                        })
                    },
                    onError(err, req, res) {
                        res.writeHead(500, {
                            'Content-Type': 'application/json',
                        });
                        let message = JSON.stringify({message: err.message})
                        res.jsonBody = message
                        let dump = {
                            request: dumper.dumpRequest(req, fullEndpointName, server.target),
                            response: dumper.dumpResponse(res),
                        }
                        io.emit(server.name, dump)
                        res.end(message);
                    }
                }
            ))
        }

        return router;
    }
}
