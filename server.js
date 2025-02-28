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
    // {
    //     magnetUri: 'magnet:?xt=urn:btih:1884020dafe24c523bd543e952394e1d74ff0bd7&dn=punnetlaugh.mp4&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com',
    //     name: 'puneet',
    //     size : 2000
    // },
    // {
    //     magnetUri: 'magnet:?xt=urn:btih:a5661e3e491f61626faf5366dccab85db1c65f13&dn=fun.+-+At+Least+I+m+Not+As+Sad+(As+I+Used+To+Be)+-+%5BAUDIO%5D.mp4&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337',
    //     name: 'have you ever',
    //     size : 3000
    // },
    // {
    //     magnetUri : 'magnet:?xt=urn:btih:8f98e749ae820e01733ee1f6df2aeef32eb8a182&dn=11GatsuNoAnkletKsrhyde.mp4&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337',
    //     name : '11 gatsu',
    //     size : 4000
    // }
]

app.get('/files', (req, res, next) => {
    return res.status(200).json(torrentlist)
})
app.post('/files', (req, res, next) => {
    console.log(req.body)
    torrentlist.unshift(req.body)
    return res.status(200).json("Success")
})

// app.listen(3000, () => {})

//create prod server
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/bharattube.xyz/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/bharattube.xyz/fullchain.pem')
};
https.createServer(options, app).listen(443, () => {
    console.log('API server running on https://bharattube.xyz');
});
