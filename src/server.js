import http from 'http'
import url from 'url'
import qs from 'querystring'
import config from '../config'

const server = http.createServer((req, res) => {
    let headers = req.headers
    let method = req.method
    let insideUrl = req.url
    let body = []

    if(method=='POST') {
            req.on('error', (err) => {
                console.error(err);
            }).on('data', (data) => {
                body.push(data)
            }).on('end', () => {
                body = qs.parse(Buffer.concat(body).toString())
                let command = body['command']
                let gifText = body['text']
                let token = body['token']

                if (token != config['SLACK_TOKEN']){
                    res.statusCode = 403;
                    res.write(JSON.stringify({"Info": "The token for the slash command does not match."}))
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json')
                    let responseBody = {
                      headers: headers,
                      method: method,
                      url: url,
                      body: body
                    };
                    res.write(JSON.stringify(responseBody))
                }
                res.end()
            })
    }
    else if(method=='GET') {
        res.write(JSON.stringify({"Message": "Hi, this is a bot to generate ASCII GIFs for Slack."}))
        res.end()
    }
})

server.listen(1337, "localhost")