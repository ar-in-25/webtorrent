let url = 'http://localhost:3000'
export function getFiles() {
    return fetch(url+'/files')  // Replace with the API or URL you're requesting from      
}

export function sendFiles(files) {
    return fetch(url+'/files', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  // Specify the content type as JSON
        },
        body: JSON.stringify(files)  // Convert your JavaScript object into a JSON string
    })
}