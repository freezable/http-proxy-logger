const router = require('express').Router()

module.exports = class HealthRouter {
    get(){
        return router.get('/', (req, res, next) => {
            res.sendStatus(200)
        })
    }
}
