const express = require('express')
const router = express.Router()
const content = require('fs').readFileSync( './public/index.html', 'utf8')
require('dotenv').config()

// Authorization
router.use('/', (req, res, next) => {
    if (req.query.let_me_in ===  process.env.MONITOR_AUTH_KEY) {
        next()
    } else {
        res.sendStatus(401)
    }
})

router.get('/', (req, res, next) => {
    res.send(content)
})

module.exports = router
