import document from "document";
import { HeartRateSensor } from "heart-rate";
import * as fs from "fs";
import {outbox} from "file-transfer";
import { listDirSync } from "fs";

const hrmLabel = document.getElementById("hrm-label");
const hrmData = document.getElementById("hrm-data");
const sendToDB = document.getElementById("send-to-db");
const sensors = [];

const hrmJSON = [];

var dbOutput = false;
var newReading = false;

if (HeartRateSensor) {
  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
    
    if(dbOutput){
        hrmData.text = JSON.stringify({
            heartRate: hrm.heartRate ? hrm.heartRate : 0
          });
        newReading = true;
        var date= new Date().toString();

        hrmJSON.push( {
          date: date,
          heartRate: hrm.heartRate
        });
          
          
    }else{
        if(newReading){
            hrmData.text = "{ ... }";
            const jsonData = document.getElementById("json-data");
            
            fs.writeFileSync("heartrate.txt", hrmJSON, "json");
            console.log(hrmJSON);
            newReading = false;
            let dirIter = "";
            const listDir = listDirSync("/private/data");
            while((dirIter = listDir.next()) && !dirIter.done) {
              console.log(dirIter.value);
            }
        }
    }
  });
  sensors.push(hrm);
  hrm.start();
} else {
  hrmLabel.style.display = "none";
  hrmData.style.display = "none";
}

let Rect = document.getElementById("button-1");

Rect.addEventListener("click", (evt) => {
  dbOutput = !dbOutput;
  
  

  if(dbOutput){
      Rect.text="READING";
  }else{
      Rect.text="READ";
  }
});

let sendData = document.getElementById("button-2");
sendData.addEventListener("click", (evt) => {

  outbox
  .enqueueFile("/private/data/heartrate.txt")
  .then(ft => {
    console.log(`Transfer of ${ft.name} successfully queued.`);
  })
  .catch(err => {
    console.log(`Failed to schedule transfer: ${err}`);

  })

});


// display.addEventListener("change", () => {
//   // Automatically stop all sensors when the screen is off to conserve battery
//   display.on ? sensors.map(sensor => sensor.start()) : sensors.map(sensor => sensor.stop());
// });
