const router = require('express').Router()

module.exports = class MonitorRouter {

    constructor(token, servers) {
        this.token = token;
        this.servers = servers;
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

        const endpoints = [];

        for (const server of this.servers) {
            let event = new URL(server.target).hostname
            const params = new URLSearchParams({
                let_me_in: this.token,
                event: event,
                name: server.name
            });
            endpoints.push(
                {
                    name: server.name,
                    target: server.target,
                    endpoint: '/api' + server.routerEndpoint,
                    href: '?' + params.toString()
                }
            );
        }
        const homeLink = '?' + new URLSearchParams({let_me_in: this.token}).toString()

        router.get('/', (req, res, next) => {
            res.render('main', {layout: 'index', endpoints: endpoints, homeLink: homeLink});
        })

        return router;
    }
}
