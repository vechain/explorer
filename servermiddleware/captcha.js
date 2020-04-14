var getRawBody = require('raw-body')
import Axios from 'axios'
const qs = require('querystring')
const captcha = function (req, res, next) {
    getRawBody(req).then(r => {
        const paramsTemp = {}
        r.toString().split('&').map(item => {
            const temp = item.split('=')
            paramsTemp[temp[0]] = temp[1]
            return 0
        })

        const SECRET_KEY = process.env['SECRET_KEY']
        const token = paramsTemp['h-captcha-response']
        const url = process.env['CAPTCHA_VERIFY_SITE']
        console.log('===========', { secret: SECRET_KEY, response: token })
        Axios.post(url, qs.stringify({ secret: SECRET_KEY, response: token }), {
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        }).then(r => {
            if (r.data['success']) {
                next()
            } else {
                res.statusCode = 403
                res.end()
            }
        }).catch(e => {
            console.error('captcha error:', e)
            res.statusCode = 403
            res.end()
        })
    }).catch(e => {
        console.error('raw body error:', e)
        res.statusCode = 502
        res.end()
    })
}

export default captcha