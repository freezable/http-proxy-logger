const router = require('express').Router()

module.exports = class ApiMock {

    constructor(hostname) {
        this.hostname = hostname;
    }

    get() {
        router.use('/', (req, res, next) => {
            if (req.hostname === this.hostname) {
                next()
            } else {
                res.sendStatus(401)
            }
        })

        for (let status = 100; status <= 599; status++ ){
            let path = '/' + status + '/:optional?*';
            router.all(path, (req, res, next) => {
                res.sendStatus(status)
            })
        }

        return router;
    }
}
