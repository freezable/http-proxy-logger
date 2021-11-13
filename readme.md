# HTTP PROXY REQUESTS DUMPER

[![Node.js CI](https://github.com/freezable/http-proxy-logger/actions/workflows/node.js.yml/badge.svg)](https://github.com/freezable/http-proxy-logger/actions/workflows/node.js.yml)
[![CodeQL](https://github.com/freezable/http-proxy-logger/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/freezable/http-proxy-logger/actions/workflows/codeql-analysis.yml)


this tool gives you possibility to see request and responses in real time between defined applications

## Before start
- copy `.env.dist` file into new `.env` file and fill in with values 
- copy `servers.json.dist` file into new `servers.json` file and fill in with values
- change sender in application, which will send request, 
  recipient endpoint url from original one to "http://MONOTOR_APP/api(routerEndpoint from servers.json)"

### Dev
```
npm install 
npm run dev
```

### prod 
```
npm install 
npm run start
```

## How to use 
- open `http://localhost:3000monitor?let_me_in=MONITOR_AUTH_KEY`
- select needed project from table and click on "View" button
- make request from sender application 
- check data in monitor app view 
- you also could copy info in one click 

## Features: 
- you could define status changes rate if needed. For example you want to simulate 429 response in 10% requests 