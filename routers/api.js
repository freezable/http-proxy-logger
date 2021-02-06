const router = require('express').Router()
const {createProxyMiddleware} = require('http-proxy-middleware')

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
                pathRewrite: {
                    [`^` + fullEndpointName]: '',
                },
                onProxyReq: (proxyReq, req, res) => {
                    let dump = {
                        timestamp: new Date().toLocaleString(),
                        method: req.method,
                        url: req.originalUrl.replace(fullEndpointName, server.target),
                        headers: req.headers,
                        params: req.params,
                        body: req.body
                    }
                    io.emit(new URL(server.target).hostname, dump)
                    io.emit('request', dump)
                },
            }))
        }

        return router;
    }
}
