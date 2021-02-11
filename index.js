const bodyParser = require('body-parser')
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
require('dotenv').config()
const port = process.env.PORT || 3000
const handlebars = require('express-handlebars')

const healthStatusRouter = require('./routers/health-status')
const monitorRouter = require('./routers/monitor')
const apiRouter = require('./routers/api')

const servers = [
    {
        routerEndpoint: "/oms",
        target: process.env.OMS_TARGET_URL
    },
    {
        routerEndpoint: "/warehouse",
        target: process.env.WAREHOUSE_TARGET_URL
    },
]

app.set('view engine', 'hbs')
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs'
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/health-status', new healthStatusRouter().get())
app.use('/monitor', new monitorRouter(process.env.MONITOR_AUTH_KEY, servers).get())
app.use('/api', new apiRouter(servers, 'api', io).get())

http.listen(port, () => {
    console.log(`Monitoring server running at http://localhost:${port}/`)
})
