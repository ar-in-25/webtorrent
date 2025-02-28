import { seedTorrent } from "./torrent.js"


export function uploadFile(file){
    seedTorrent(file)
}