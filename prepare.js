const { exec } = require('child_process')
require('dotenv').config()
const IS_MAIN = process.env['NETWORK'] === 'mainnet'
const cpCmd = `cp ./resource/${IS_MAIN ? 'main' : 'test'}/* ./static/`


const files = [
    './static/facicon.png',
    './static/icon.png',
    './static/opensearch.xml'
]

const rmCmd = 'rm -rf ' + files.join(' ')
exec(rmCmd, (err) => {
    if (err) {
        process.exit(-1)
    }
})

exec(cpCmd, (err, stdout, stderr) => {
    if (err) {
        process.exit(-1)
    }
})