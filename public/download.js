import { downloadTorrentAndPlayVideo, getTorrent, downloadTorrentAndSeed } from "./torrent.js"

function getClone() {
    const originalContainer = document.getElementById('clone');
    const clonedContainer = originalContainer.cloneNode(true);
    clonedContainer.classList.remove('hidden')
    return clonedContainer
}

export function renderUploadedList(uploadedvideolist) {
    //reset container
    document.getElementById('downloadedvideocontainer').innerHTML = ''
    //iterate values and add node
    for (let video of uploadedvideolist) {
        const clonedContainer = getClone()
        clonedContainer.querySelector('#title').textContent = video.name
        clonedContainer.querySelector('#size').textContent = 'Size : '+ formatDataSize(video.size)
        clonedContainer.querySelector('#playVideo').addEventListener('click', () => {
            //set video property as playing and rest as false
            uploadedvideolist.forEach(x => x.playing = false)
            video.playing = true 
            downloadTorrentAndPlayVideo(video.magnetUri, clonedContainer)
            clonedContainer.querySelector('#details').classList.remove('hidden')
        })
        clonedContainer.querySelector('#seedVideo').addEventListener('click', () => { 
            downloadTorrentAndSeed(video.magnetUri, clonedContainer)
            clonedContainer.querySelector('#details').classList.remove('hidden')
        })
        clonedContainer.querySelector('#pauseVideo').addEventListener('click', () => { let t = getTorrent(video.magnetUri); if (t) t.pause() })
        clonedContainer.querySelector('#resumeVideo').addEventListener('click', () => { let t = getTorrent(video.magnetUri); if (t) t.resume() })
        clonedContainer.querySelector('#deleteVideo').addEventListener('click', () => deleteTorrent(video, clonedContainer))
        //add details if torrent already present in client
        if (getTorrent(video.magnetUri)) {
            updateTorrentDetails(getTorrent(video.magnetUri), clonedContainer)
        }
        document.getElementById('downloadedvideocontainer').appendChild(clonedContainer);
    }
}

export function updateTorrentDetails(torrent, clonedContainer) {
    if (torrent) {
        clonedContainer.querySelector('#progress').textContent = `Progress :  ${(torrent.downloaded / torrent.length * 100).toFixed(2)}%`
        clonedContainer.querySelector('#timeRemaining').textContent = `Time remaining : ${(torrent.timeRemaining / 1000).toFixed(0)} seconds`
        clonedContainer.querySelector('#torrentLength').textContent = `Torrent length: ${formatDataSize(torrent.length)}`;
        clonedContainer.querySelector('#downloaded').textContent = `Downloaded: ${formatDataSize(torrent.received)}`;
        clonedContainer.querySelector('#uploaded').textContent = `Uploaded: ${formatDataSize(torrent.uploaded)}`;
        clonedContainer.querySelector('#downloadSpeed').textContent = `Download speed: ${formatDataSize(torrent.downloadSpeed)}/s`;
        clonedContainer.querySelector('#uploadSpeed').textContent = `Upload speed: ${formatDataSize(torrent.uploadSpeed)}/s`;
        clonedContainer.querySelector('#ratio').textContent = `Ratio: ${torrent.ratio.toFixed(2)}`;
        clonedContainer.querySelector('#peers').textContent = `Peers: ${torrent.numPeers}`;
    }
}

function formatDataSize(size) {
    //size in byte
    let sizepostfix = ['KB', 'MB', 'GB', 'TB']
    let index = 0
    let currentsize = size / 1024
    while (currentsize > 1024) {
        currentsize /= 1024
        ++index
    }
    return `${currentsize.toFixed(2)} ${sizepostfix[index]}`
}

function resetTorrentDetails(clonedContainer){
    clonedContainer.querySelector('#progress').textContent = `Progress :  0%`
        clonedContainer.querySelector('#timeRemaining').textContent = `Time remaining : 0 seconds`
        clonedContainer.querySelector('#torrentLength').textContent = `Torrent length: 0`;
        clonedContainer.querySelector('#downloaded').textContent = `Downloaded: 0`;
        clonedContainer.querySelector('#uploaded').textContent = `Uploaded: 0`;
        clonedContainer.querySelector('#downloadSpeed').textContent = `Download speed: 0`;
        clonedContainer.querySelector('#uploadSpeed').textContent = `Upload speed: 0`;
        clonedContainer.querySelector('#ratio').textContent = `Ratio: 0`;
        clonedContainer.querySelector('#peers').textContent = `Peers: 0`;
}

function deleteTorrent(video, clonedContainer) {
    //destroy torrent instance
    let t = getTorrent(video.magnetUri)
    if (t) t.destroy()
    //remove video
    //TODO only remove current video
    if(video.playing){
    document.getElementById('videocontainer').innerHTML = ''
    video.playing = false
    }
    //reset details
    resetTorrentDetails(clonedContainer)
    //hide video details
    clonedContainer.querySelector('#details').classList.add('hidden')
}


