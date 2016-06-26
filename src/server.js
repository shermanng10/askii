import http from 'http'
import url from 'url'
import qs from 'querystring'
import config from '../config'
import Giphy from './giphy'

const server = http.createServer((req, res) => {
    let headers = req.headers
    let requestUrl = req.url
    let method = req.method
    
    function buildGifResponse(error, gifUrl){
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        let responseBody = {
            headers: headers,
            method: method,
            url: requestUrl,
            data: gifUrl
        }
        res.write(JSON.stringify(responseBody))
        res.end()
    }

    if (method=='POST' && requestUrl == '/askgif') {
            let reqBody = []
            req.on('error', (err) => {
                console.error(err);
            }).on('data', (data) => {
                reqBody.push(data)
            }).on('end', () => {
                reqBody = qs.parse(Buffer.concat(reqBody).toString())
                let gifSearchTerm = reqBody['searchTerm']
                let token = reqBody['token']

                if (token != config['SLACK_TOKEN']){
                    res.statusCode = 403
                    res.write(JSON.stringify({"Info": "The token for the slash command does not match."}))
                    res.end()
                }
                else if (!gifSearchTerm){
                    res.statusCode = 422
                    res.write(JSON.stringify({"Error": "Oops! You didn't enter a search term."}))
                    res.end()
                }
                else {
                    let giphy = new Giphy()
                    giphy.getGif(gifSearchTerm, buildGifResponse)
                }
            })
    }
    else if (method=='GET') {
        res.write(JSON.stringify({"Message": "Hi, this is a bot to generate ASCII GIFs for Slack."}))
        res.end()
    }
})


server.listen(1337, "localhost")