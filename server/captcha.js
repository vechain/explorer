import Axios from 'axios'
import * as QS from 'querystring'
const getRawBody = require('raw-body')
const http = require('http')
const https = require('https')

export const token = process.env['CAPTCHA_SECRET']
export const apiURL = process.env['API_URL']

/**
 * 
 * @param {string} secret secret key of hcaptcha
 * @param {string} response h-captcha-response
 */
const verify = async (secret, response) => {
    const ret = await Axios.post('https://hcaptcha.com/siteverify', QS.stringify({ secret, response }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    
    console.log('verify response', ret)
    if (ret.data['success']) {
        return true
    } else {
        return false
    }
}

const captcha = (req, res, next) => {
    ; (async () => {
        if (/^\/transfers\/0x[0-9a-f]{40}$/i.test(req.url)&& req.method==='POST') {
            try {
                const raw = await getRawBody(req, 'utf8')
                const body = QS.parse(raw)
                
                const ret = await verify(body['h-captcha-response'], token)
                if (ret) {
                    const client = apiURL.startsWith('http://') ? http.request : https.request
                    const request = client(`${apiURL}/api/export${req.url}`, {
                        method: 'POST',
                        headers: {'Content-Type':'application/x-www-form-urlencoded'},
                    }, (response) => {
                        res.writeHead(response.statusCode, response.headers);
                        return response.pipe(res, {end: true});
                    })
                    request.end(raw)
                    return
                } else {
                    res.writeHead(403).end('Prove to me you are human!')
                    return
                }
            } catch (e) {
                console.log(e)
                res.writeHead(500).end('Server Error!')
            }
        } else {
            return next()
        }
    })()
}

export default captcha
