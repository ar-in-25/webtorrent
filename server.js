import express from "express"
import cors from 'cors'
import compression from "compression"
import path from 'path'
import {fileURLToPath} from 'url'
import fs from 'fs';
import https from 'https'

const app = express()
// sync()

app.use(compression())
app.use(cors())
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)) , "public")));
app.use(express.json())

let torrentlist = [
]

app.get('/files', (req, res, next) => {
    return res.status(200).json(torrentlist)
})
app.post('/files', (req, res, next) => {
    console.log(req.body)
    if(torrentlist.filter(x => x.name == req.body.name).length == 0){
        torrentlist.unshift(req.body)
    }
    return res.status(200).json(torrentlist)
})

// app.listen(3000, () => {})

// create prod server
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/bharattube.xyz/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/bharattube.xyz/fullchain.pem')
};
https.createServer(options, app).listen(443, () => {
    console.log('API server running on https://bharattube.xyz');
});
