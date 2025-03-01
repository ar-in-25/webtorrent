import { updateTorrentDetails } from "./download.js"
import { getVideoDetails } from "./main.js"
import { sendFiles } from "./service.js"

const client = new WebTorrent()

export function downloadTorrentAndPlayVideo(torrenthash, clonedContainer) {
    //clean the container
    document.querySelector('#videocontainer').innerHTML = ''
    //get hash / magnet uri of the video
    let hash = torrenthash ?? document.getElementById('torrenthash').value.trim()
    //check if torrent already exist in the client
    let torrent = client.get(hash)
    //if torrent doesnt exist fetch and seed it 
    if (!torrent) {
        client.add(hash, (torrent) => {
            //on download update the torrent details
            torrent.on('download', function (bytes) {
                if (clonedContainer) {
                    updateTorrentDetails(torrent, clonedContainer)
                }
            })
            //on upload update the torrent details
            torrent.on('upload', function (bytes) {
                if (clonedContainer) {
                    updateTorrentDetails(torrent, clonedContainer)
                }
            })
            //on done update the torrent details
            torrent.on('done', function (bytes) {
                if (clonedContainer) {
                    updateTorrentDetails(torrent, clonedContainer)
                }
            })

            //show the video while its still downloading
            torrent.files.forEach(function (file) {
                file.appendTo('#videocontainer', { autoplay: true, muted: true })
            });
        })
    } else {
        //if torrent exist in client , show the file to the user
        torrent.files[0]?.appendTo('#videocontainer', { autoplay: true, muted: true })
    }

}

//return the torrent object if already downloaded
export function getTorrent(magnetUri) {
    return client.get(magnetUri)
}

//download and seed torrent
export function downloadTorrentAndSeed(torrenthash, clonedContainer) {
    console.log('happening?')
    let hash = torrenthash
    //check if torrent already exist in the client
    let torrent = client.get(hash)
    //if torrent doesnt exist fetch and seed it 
    if (!torrent) {
        client.add(hash, (torrent) => {
            //on download update the torrent details
            torrent.on('download', function (bytes) {
                if (clonedContainer) {
                    updateTorrentDetails(torrent, clonedContainer)
                }
            })
            //on upload update the torrent details
            torrent.on('upload', function (bytes) {
                if (clonedContainer) {
                    updateTorrentDetails(torrent, clonedContainer)
                }
            })
            //on done update the torrent details
            torrent.on('done', function (bytes) {
                if (clonedContainer) {
                    updateTorrentDetails(torrent, clonedContainer)
                }
            })
        })
    }
}

export function seedTorrent(file, clonedContainer) {
    if (file) {
        client.seed(file, (torrent) => {
            let body = {
                name: file.name,
                size: file.size,
                magnetUri: torrent.magnetURI
            }
            sendFiles(body).then(() => { getVideoDetails()})

            // updateTorrentDetails(torrent, clonedContainer)

            // torrent.on('done', function () {
            //     updateTorrentDetails(torrent, clonedContainer)
            // })

            // torrent.on('download', function () {
            //     updateTorrentDetails(torrent, clonedContainer)
            // })

            // torrent.on('upload', () => {
            //     updateTorrentDetails(torrent, clonedContainer)
            // })

            // torrent.on('wire', () => {
            //     updateTorrentDetails(torrent, clonedContainer)
            // })
        })
    }

}