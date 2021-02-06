const express = require('express')
const router = express.Router()
const content = require('fs').readFileSync( './public/index.html', 'utf8')
const LET_ME_IN_KEY = process.env.MONITOR_AUTH_KEY  || "qnDuEG6VBqFuqwJTWdPZhCAHUWDUm3L72wEKhgArfNWNMBGMLKyQV8xxqV5jbzX8"

// Authorization
router.use('/', (req, res, next) => {
    if (req.query.let_me_in === LET_ME_IN_KEY) {
        next()
    } else {
        res.sendStatus(401)
    }
})

router.get('/', (req, res, next) => {
    res.send(content)
})

module.exports = router
