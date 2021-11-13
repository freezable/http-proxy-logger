const router = require('express').Router()
const invander = require('./helper/invander')

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

        for (let status = 100; status <= 599; status++) {
            let path = '/' + status + '/:optional?*';
            router.all(path, (req, res, next) => {
                let responseStatus = status;
                let json = req.query.payload ? req.query.payload : null;
                if (invander.isProbable(req.query.probability)) {
                    responseStatus = req.query.alt_status ? req.query.alt_status : responseStatus;
                    if (req.query.alt_payload) {
                        json = req.query.alt_payload;
                    }
                }
                res.status(responseStatus);
                if (json) {
                    res.json(json);
                }
                res.send();
            })
        }

        return router;
    }
}