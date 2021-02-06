const morganBody = require("morgan-body")
const bodyParser = require('body-parser')
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
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

app.use('/health-status', healthStatusRouter)
app.use('/monitor', monitorRouter)
app.use('/api', apiRouter)


http.listen(port, () => {
    console.log(`Monitoring server running at http://localhost:${port}/`)
})
