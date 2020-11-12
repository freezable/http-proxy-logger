const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
require('dotenv').config()
const port = process.env.PORT || 3000
const handlebars = require('express-handlebars')
const fs = require('fs');
const servers = JSON.parse(fs.readFileSync('servers.json'));

const healthStatusRouter = require('./routers/health-status')
const apiMockRouter = require('./routers/api-mock')
const monitorRouter = require('./routers/monitor')
const apiRouter = require('./routers/api')

app.set('view engine', 'hbs')
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs'
}))

app.use('/public', express.static('public'))

app.use('/health-status', new healthStatusRouter().get())
app.use('/monitor', new monitorRouter(process.env.MONITOR_AUTH_KEY, servers).get())
app.use('/api', new apiRouter(servers, 'api', io).get())
app.use('/api-mock', new apiMockRouter(process.env.HOST).get())

http.listen(port, () => {
    console.log(`Monitoring server running at http://localhost:${port}/`)
})
