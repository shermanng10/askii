import config from '../config'
import http from 'http'

export default class Giphy {
	getGif(search_term , callback){
		let search_url = `http://api.giphy.com/v1/gifs/search?q=${search_term}&api_key=${config.GIPHY_API_KEY}`
		http.get(search_url, (res) => {
			let body = ''

			res.on('data', function (chunk) {
			    body += chunk
			})

			res.on('end', function () {
				body = JSON.parse(body)
				let data = body["data"]
				let randomGifUrl = data[Math.floor(Math.random()*data.length)]["images"]["downsized_large"]["url"]
				callback(null, randomGifUrl)
			})
		})
	}
}
