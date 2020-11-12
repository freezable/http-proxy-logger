class Dumper {

    _isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    _prepareEmptyBody(body){
        return body === '' ? undefined : body
    }

    _prepareRequestBody(req){
        let body = req.body
        if (req.is('application/x-www-form-urlencoded')) {
            body = '{"' + body
                    .split('=')
                    .join('":"')
                    .split('&')
                    .join('","')
                + '"}'
        }
        if (this._isJson(body)) {
            body = JSON.parse(body)
        }

        return this._prepareEmptyBody(body)
    }

    dumpRequest(req, fullEndpointName, serverTarget) {
        return {
            method: req.method,
            timestamp: new Date().toLocaleString(),
            url: req.originalUrl.replace(fullEndpointName, serverTarget),
            headers: req.headers,
            query: Object.entries(req.query).length === 0 ? undefined : req.query,
            body: this._prepareRequestBody(req)
        }
    }

    dumpResponse(res) {
        return {
            timestamp: new Date().toLocaleString(),
            headers: res.headers,
            body: this._prepareEmptyBody(res.body),
            statusCode: res.statusCode
        }
    }

    dumpProxyResponse(proxyRes, body) {
        return {
            statusCode: proxyRes.statusCode,
            timestamp: new Date().toLocaleString(),
            headers: proxyRes.headers,
            body: this._prepareEmptyBody(body)
        }
    }
}

module.exports = new Dumper()
