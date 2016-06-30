import http from 'http'
import url from 'url'
import qs from 'querystring'
import figlet from 'figlet'
import config from '../config'


const server = http.createServer((req, res) => {
    let requestUrl = req.url
    let method = req.method
    res.setHeader('Content-Type', 'application/json')

    function buildResponse(error, data){
        res.statusCode = 200
        let responseBody = {
            "response_type": "in_channel",
            "text": "\`\`\`" + data + "\`\`\`"
        }
        res.end(JSON.stringify(responseBody))
    }

    if (method=='POST' && requestUrl == '/getascii') {
            let reqBody = []
            req.on('error', (err) => {
                console.error(err);
            }).on('data', (data) => {
                reqBody.push(data)
            }).on('end', () => {
                reqBody = qs.parse(Buffer.concat(reqBody).toString())
                let textToConvert
                let font
                let bodyText = reqBody['text'].split(':')
                let token = reqBody['token']

                if (bodyText.indexOf(":")){
                    textToConvert = bodyText[0]
                    font = bodyText[1]
                }
                else{
                    textToConvert = bodyText
                }
                
                if (token != config['SLACK_TOKEN']){
                    res.statusCode = 403
                    res.end(JSON.stringify({"Info": "The token for the slash command does not match."}))
                }
                else if (!bodyText){
                    res.statusCode = 422
                    res.end(JSON.stringify({"Error": "Oops! You didn't enter any text..."}))
                }
                else {
                    figlet.text(textToConvert, {font: font} , buildResponse)
                }
            })
    }
    else if (method=='GET' && requestUrl == '/') {
        res.end(JSON.stringify({"Message": "Hi, this is a bot to generate ASCII text from text command for Slack."}))
    }
    else{
        res.statusCode = 404
        res.end(JSON.stringify({"Message": "Resource not found."}))
    }
})


server.listen(1337, "localhost")