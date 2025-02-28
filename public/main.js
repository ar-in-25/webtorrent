import { renderUploadedList } from "./download.js"
import { getFiles, sendFiles } from "./service.js"
import { uploadFile } from "./download.js"

const downloadtabbutton = document.getElementById('downloadtabbutton')
const uploadtabbutton = document.getElementById('uploadtabbutton')
const uploadtab = document.getElementById('uploadtab')
const downloadtab = document.getElementById('downloadtab')

downloadtabbutton.addEventListener('click', () => {
    downloadtab.classList.remove('hidden')
    uploadtab.classList.add('hidden')
})
uploadtabbutton.addEventListener('click', () => {
    downloadtab.classList.add('hidden')
    uploadtab.classList.remove('hidden')
})

let downloadedTorrents = []

export async function getVideoDetails(){
    let downloadedTorrents = await ((await getFiles()).json())
    renderUploadedList(downloadedTorrents)
}

//upload functionality
// document.getElementById('uploadbutton').addEventListener('click', uploadFile)
document.getElementById('videofile').addEventListener('change',(element) => {uploadFile(element.target.files[0]); element.target.value = ''})
document.getElementById('refresh').addEventListener('click',getVideoDetails)

getVideoDetails()