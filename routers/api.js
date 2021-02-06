const express = require('express')
const router = express.Router()
const {createProxyMiddleware} = require('http-proxy-middleware')
const apiEndpointName = 'api'
const API_SERVICE_URL = "https://jsonplaceholder.typicode.com"

// Proxy endpoints
router.use('/json_placeholder', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        [`^/`+apiEndpointName+`/json_placeholder`]: '',
    },
}))


module.exports = router
