const router = require('express').Router()
const {createProxyMiddleware} = require('http-proxy-middleware')

module.exports = class ApiRouter {

    constructor(servers, routerName) {
        this.servers = servers
        this.routerName = routerName
    }

    get() {
        for (const server of this.servers) {
            router.use(server.routerEndpoint, createProxyMiddleware({
                target: server.target,
                changeOrigin: true,
                pathRewrite: {
                    [`^/` + this.routerName + server.routerEndpoint]: '',
                }
            }))
        }

        return router;
    }
}
