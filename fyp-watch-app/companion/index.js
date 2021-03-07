import { inbox } from "file-transfer";

async function processAllFiles() {
  let file;
  while ((file = await inbox.pop())) {
    var payload = await file.text();
   
    console.log(`file contents: ${payload}`);
    
    
    
    const url = "https://fyp-sensors.web.app/data";
    var params = {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'no-cors', // no-cors, *cors, same-origin
        headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer',
        body: payload
        }

    const res = await fetch(url, params);
    console.log(res);

  }
}

inbox.addEventListener("newfile", processAllFiles);

processAllFiles()