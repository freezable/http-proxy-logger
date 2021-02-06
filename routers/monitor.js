const router = require('express').Router()

module.exports = class MonitorRouter {

    constructor(token, htmlFilePath) {
        this.token = token;
        this.htmlFilePath = htmlFilePath;
    }

    get() {
        // Authorization
        router.use('/', (req, res, next) => {
            if (req.query.let_me_in === this.token) {
                next()
            } else {
                res.sendStatus(401)
            }
        })

        router.get('/', (req, res, next) => {
            res.sendFile(this.htmlFilePath);
        })

        return router;
    }
}
