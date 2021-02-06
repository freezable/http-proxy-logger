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

        let links = [
            {
                name: 'All',
                href: '?' + new URLSearchParams({let_me_in: this.token}).toString()
            }
        ];

        for (const server of this.servers) {
            let event = new URL(server.target).hostname
            const params = new URLSearchParams({
                let_me_in: this.token,
                event: event,
            });

            links.push( {
                name: event,
                href: '?' + params.toString()
            });
        }

        router.get('/', (req, res, next) => {
            res.render('main', {layout : 'index', links: links});
        })

        return router;
    }
}
