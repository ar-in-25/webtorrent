import { downloadTorrentAndPlayVideo, getTorrent, downloadTorrentAndSeed, seedTorrent } from "./torrent.js"

function getClone() {
    // Create the container div
    const cloneDiv = document.createElement('div');
    cloneDiv.classList.add('clone');

    // Create the title (h2) element
    const titleH2 = document.createElement('h2');
    titleH2.classList.add('title');
    cloneDiv.appendChild(titleH2);

    // Create the size (h5) element
    const sizeH5 = document.createElement('h5');
    sizeH5.classList.add('size');
    cloneDiv.appendChild(sizeH5);

    // Create the details div
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('details', 'hidden');

    // Create the progress span
    const progressSpan = document.createElement('span');
    progressSpan.classList.add('progress');
    progressSpan.textContent = 'Progress: 0%';
    detailsDiv.appendChild(progressSpan);

    // Create the torrent length span
    const torrentLengthSpan = document.createElement('span');
    torrentLengthSpan.classList.add('torrentLength');
    torrentLengthSpan.textContent = 'Torrent length: 00:00';
    detailsDiv.appendChild(torrentLengthSpan);

    // Create the time remaining span
    const timeRemainingSpan = document.createElement('span');
    timeRemainingSpan.classList.add('timeRemaining');
    timeRemainingSpan.textContent = 'Time remaining: 00:00';
    detailsDiv.appendChild(timeRemainingSpan);

    // Create the downloaded span
    const downloadedSpan = document.createElement('span');
    downloadedSpan.classList.add('downloaded');
    downloadedSpan.textContent = 'Downloaded: 0 MB';
    detailsDiv.appendChild(downloadedSpan);

    // Create the uploaded span
    const uploadedSpan = document.createElement('span');
    uploadedSpan.classList.add('uploaded');
    uploadedSpan.textContent = 'Uploaded: 0 MB';
    detailsDiv.appendChild(uploadedSpan);

    // Create the download speed span
    const downloadSpeedSpan = document.createElement('span');
    downloadSpeedSpan.classList.add('downloadSpeed');
    downloadSpeedSpan.textContent = 'Download speed: 0 KB/s';
    detailsDiv.appendChild(downloadSpeedSpan);

    // Create the upload speed span
    const uploadSpeedSpan = document.createElement('span');
    uploadSpeedSpan.classList.add('uploadSpeed');
    uploadSpeedSpan.textContent = 'Upload speed: 0 KB/s';
    detailsDiv.appendChild(uploadSpeedSpan);

    // Create the peers span
    const peersSpan = document.createElement('span');
    peersSpan.classList.add('peers');
    peersSpan.textContent = 'Peers: 0';
    detailsDiv.appendChild(peersSpan);

    // Append the details div to the cloneDiv
    cloneDiv.appendChild(detailsDiv);

    // Create the play video button
    const playButton = document.createElement('button');
    playButton.classList.add('playVideo');
    playButton.textContent = 'Play';
    cloneDiv.appendChild(playButton);

    // Create the delete video button
    // const deleteButton = document.createElement('button');
    // deleteButton.classList.add('deleteVideo');
    // deleteButton.textContent = 'Delete';
    // cloneDiv.appendChild(deleteButton);

    // Create the seed video button
    const seedButton = document.createElement('button');
    seedButton.classList.add('seedVideo');
    seedButton.textContent = 'Seed';
    cloneDiv.appendChild(seedButton);

    // Create the pause video button
    const pauseButton = document.createElement('button');
    pauseButton.classList.add('pauseVideo', 'hidden');
    pauseButton.textContent = 'Pause Seeding';
    cloneDiv.appendChild(pauseButton);

    // Create the resume video button
    const resumeButton = document.createElement('button');
    resumeButton.classList.add('resumeVideo', 'hidden');
    resumeButton.textContent = 'Resume Seeding';
    cloneDiv.appendChild(resumeButton);

    return cloneDiv

}

export function renderUploadedList(uploadedvideolist) {
    //reset container
    document.getElementById('downloadedvideocontainer').innerHTML = ''
    //iterate values and add node
    for (let video of uploadedvideolist) {
        const clonedContainer = getClone()
        clonedContainer.querySelector('.title').textContent = video.name
        clonedContainer.querySelector('.size').textContent = 'Size : ' + formatDataSize(video.size)
        clonedContainer.querySelector('.playVideo').addEventListener('click', () => {
            //set video property as playing and rest as false
            uploadedvideolist.forEach(x => x.playing = false)
            video.playing = true
            downloadTorrentAndPlayVideo(video.magnetUri, clonedContainer)
            clonedContainer.querySelector('.details').classList.remove('hidden')
        })
        clonedContainer.querySelector('.seedVideo').addEventListener('click', () => {
            downloadTorrentAndSeed(video.magnetUri, clonedContainer)
            clonedContainer.querySelector('.details').classList.remove('hidden')
        })
        clonedContainer.querySelector('.pauseVideo').addEventListener('click', () => { let t = getTorrent(video.magnetUri); if (t) t.pause() })
        clonedContainer.querySelector('.resumeVideo').addEventListener('click', () => { let t = getTorrent(video.magnetUri); if (t) t.resume() })
        // clonedContainer.querySelector('.deleteVideo').addEventListener('click', () => deleteTorrent(video, clonedContainer))
        //add details if torrent already present in client
        if (getTorrent(video.magnetUri)) {
            updateTorrentDetails(getTorrent(video.magnetUri), clonedContainer)
        }
        document.getElementById('downloadedvideocontainer').appendChild(clonedContainer);
    }
}

export function updateTorrentDetails(torrent, clonedContainer) {
    if (torrent) {
        clonedContainer.querySelector('.progress').textContent = `Progress :  ${(torrent.downloaded / torrent.length * 100).toFixed(2)}%`
        clonedContainer.querySelector('.timeRemaining').textContent = `Time remaining : ${(torrent.timeRemaining / 1000).toFixed(0)} seconds`
        clonedContainer.querySelector('.torrentLength').textContent = `Torrent length: ${formatDataSize(torrent.length)}`;
        clonedContainer.querySelector('.downloaded').textContent = `Downloaded: ${formatDataSize(torrent.received)}`;
        clonedContainer.querySelector('.uploaded').textContent = `Uploaded: ${formatDataSize(torrent.uploaded)}`;
        clonedContainer.querySelector('.downloadSpeed').textContent = `Download speed: ${formatDataSize(torrent.downloadSpeed)}/s`;
        clonedContainer.querySelector('.uploadSpeed').textContent = `Upload speed: ${formatDataSize(torrent.uploadSpeed)}/s`;
        clonedContainer.querySelector('.peers').textContent = `Peers: ${torrent.numPeers}`;
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

function resetTorrentDetails(clonedContainer) {
    clonedContainer.querySelector('.progress').textContent = `Progress :  0%`
    clonedContainer.querySelector('.timeRemaining').textContent = `Time remaining : 0 seconds`
    clonedContainer.querySelector('.torrentLength').textContent = `Torrent length: 0`;
    clonedContainer.querySelector('.downloaded').textContent = `Downloaded: 0`;
    clonedContainer.querySelector('.uploaded').textContent = `Uploaded: 0`;
    clonedContainer.querySelector('.downloadSpeed').textContent = `Download speed: 0`;
    clonedContainer.querySelector('.uploadSpeed').textContent = `Upload speed: 0`;
    clonedContainer.querySelector('.peers').textContent = `Peers: 0`;
}

function deleteTorrent(video, clonedContainer) {
    //destroy torrent instance
    let t = getTorrent(video.magnetUri)
    if (t) t.destroy()
    //remove video
    //TODO only remove current video
    if (video.playing) {
        document.getElementById('videocontainer').innerHTML = ''
        video.playing = false
    }
    //reset details
    resetTorrentDetails(clonedContainer)
    //hide video details
    clonedContainer.querySelector('.details').classList.add('hidden')
}

export function uploadFile(file) {
    let clonedContainer = getClone()
    clonedContainer.querySelector('.title').textContent = file.name
    clonedContainer.querySelector('.size').textContent = 'Size : ' + formatDataSize(file.size)
    clonedContainer.querySelector('.details').classList.remove('hidden')
    clonedContainer.querySelector('.playVideo').classList.add('hidden')
    // clonedContainer.querySelector('.deleteVideo').classList.add('hidden')
    clonedContainer.querySelector('.seedVideo').classList.add('hidden')
    clonedContainer.querySelector('.resumeVideo').classList.add('hidden')
    clonedContainer.querySelector('.pauseVideo').classList.add('hidden')
    document.getElementById('uploadedvideocontainer').appendChild(clonedContainer)
    seedTorrent(file, clonedContainer)
}