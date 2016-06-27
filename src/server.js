import http from 'http'
import url from 'url'
import qs from 'querystring'
import figlet from 'figlet'
import config from '../config'


const server = http.createServer((req, res) => {
    let headers = req.headers
    let requestUrl = req.url
    let method = req.method

    function buildResponse(error, data){
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/text')
        let responseBody = {
            headers: headers,
            method: method,
            url: requestUrl,
            data: data
        }
        res.write("\`\`\`" + data + "\`\`\`")
        res.end()
    }

    if (method=='POST' && requestUrl == '/getascii') {
            let reqBody = []
            req.on('error', (err) => {
                console.error(err);
            }).on('data', (data) => {
                reqBody.push(data)
            }).on('end', () => {
                let textToConvert
                let font
                reqBody = qs.parse(Buffer.concat(reqBody).toString())
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
                    res.write(JSON.stringify({"Info": "The token for the slash command does not match."}))
                    res.end()
                }
                else if (!bodyText){
                    res.statusCode = 422
                    res.write(JSON.stringify({"Error": "Oops! You didn't enter any text..."}))
                    res.end()
                }
                else {
                    figlet.text(textToConvert, {font: font} , buildResponse)
                }
            })
    }
    else if (method=='GET') {
        res.write(JSON.stringify({"Message": "Hi, this is a bot to generate ASCII text from text command for Slack."}))
        res.end()
    }
})


server.listen(1337, "localhost")