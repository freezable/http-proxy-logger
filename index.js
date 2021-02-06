const express = require('express');
const morgan = require("morgan");
const morganBody = require("morgan-body");
const bodyParser = require('body-parser');
const rfs = require('rotating-file-stream')
const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware');
const util = require('util');
const fs = require('fs');

// Create Express Server
const app = express();

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


// // create a write stream (in append mode)
// // create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
})


morganBody(app, {
    logAllReqHeader: true,
    logResponseBody: true,
    maxBodyLength: 10000000,
    noColors: true,
    stream: accessLogStream,
});


// Configuration
const PORT = 3000;
const HOST = "localhost";
const API_SERVICE_URL = "https://jsonplaceholder.typicode.com";



// Info GET endpoint
app.get('/info', (req, res, next) => {
    res.send('This is a proxy service which proxies to JSONPlaceholder API.');
});


app.all('/test', (req, res, next) => {

    res.send(Date.now().toString());

});


// Authorization
app.use('', (req, res, next) => {
    if (req.headers.authorization) {
        next();
    } else {
        res.sendStatus(403);
    }
});

// Proxy endpoints
app.use('/json_placeholder', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        [`^/json_placeholder`]: '',
    },
}));

// Start Proxy
app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
