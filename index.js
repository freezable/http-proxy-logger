const morganBody = require("morgan-body")
const bodyParser = require('body-parser')
const path = require('path')
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
require('dotenv').config()

const port = process.env.PORT || 3000
const healthStatusRouter = require('./routers/health-status')
const monitorRouter = require('./routers/monitor')
const apiRouter = require('./routers/api')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const loggerStream = {
    write: message => {
        io.emit('request', message)
    },
}

morganBody(app, {
    logAllReqHeader: true,
    logResponseBody: true,
    maxBodyLength: 10000000,
    noColors: true,
    stream: loggerStream,
    includeNewLine: true
})

const servers = [
    {
        routerEndpoint: "/oms",
        target: process.env.OMS_TARGET_URL
    }
]

app.use('/health-status', new healthStatusRouter().get())
app.use('/monitor', new monitorRouter(process.env.MONITOR_AUTH_KEY, path.join(__dirname + '/public/index.html')).get())
app.use('/api', new apiRouter(servers, 'api').get())


http.listen(port, () => {
    console.log(`Monitoring server running at http://localhost:${port}/`)
})
