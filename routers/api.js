const express = require('express')
const router = express.Router()
const {createProxyMiddleware} = require('http-proxy-middleware')
const routerName = 'api'
require('dotenv').config()

const servers = [
    {
        routerEndpoint: "/oms",
        target: process.env.OMS_TARGET_URL
    }
]

for (const server of servers) {
    router.use(server.routerEndpoint, createProxyMiddleware({
        target: server.target,
        changeOrigin: true,
        pathRewrite: {
            [`^/` + routerName + server.routerEndpoint]: '',
        }
    }))
}

module.exports = router
