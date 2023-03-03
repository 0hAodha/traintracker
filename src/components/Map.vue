<template>
  <h2>Insights:</h2>
  <p>Total number of trains: {{ this.numTrains }}</p>
  <p>Number of actively running trains: {{ this.numRunningTrains }}</p>
  <p>Percentage late: {{ this.percentageLate }}%</p>
  <p>Percentage early or ontime: {{ this.percentageEarly }}%</p>
  <p v-if="this.latestTrain['TrainCode']">Latest train: {{ this.latestTrain["TrainCode"][0] }}, {{ this.latestTrain["Direction"][0] }}, {{ this.latestTime }} mins late</p>
  <p v-if="this.earliestTrain['TrainCode']">Earliest train: {{ this.earliestTrain["TrainCode"][0] }}, {{ this.earliestTrain["Direction"][0] }}, {{ this.earliestTime * -1 }} mins early</p>

  <button @click="getLiveTrainData">Fetch Data</button>
  <button @click="postLiveTrainData">Populate Database</button>

  <!--Sidebar, fades out on click of X button-->
    <transition id="sidebar" name="slideLeft">
      <div v-if="this.display" id= "sidebarDiv">

        <div id = "sidebarHeader">
          <img id = "headerImage" src="../assets/train-solid.svg" alt="Train Icon">
          <div v-on:click="this.display = false" id="xButton">X</div>
        </div>

        <div id= "sidebarDiv">
          <h2>Train Code: {{ selectedDataMap["TrainCode"] }}</h2>
          <p>Date: {{ selectedDataMap["TrainDate"] }}</p>
          <p>Status: {{ selectedDataMap["TrainStatus"] }}</p>
          <p>Longitude: {{ selectedDataMap["TrainLongitude"] }}</p>
          <p>Latitude: {{ selectedDataMap["TrainLatitude"] }}</p>
          <p>Direction: {{ selectedDataMap["Direction"] }}</p>
          <p>Public Message: {{ selectedDataMap["PublicMessage"] }}</p>
        </div>
      </div>
    </transition>

  <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height: 100vh; width: 100vw">
    <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection" />
    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>

    <template v-for="coordinate, i in coordinates" :position="inline-block">
      <!-- overlay offset is the size of the image so that it is centered-->
      <ol-overlay :position="coordinate" :positioning="center-center" :offset="[-14,-16]">
        <div class="overlay-content" @click="getSelectedTrain(i)">
          <img v-if="isTrainLate(i)" src="../assets/red-train-solid.png" class="trainMapIcon" alt="Train Icon">
          <img v-else src="../assets/green-train-solid.png" class="trainMapIcon" alt="Train Icon">
        </div>

    </ol-overlay>
    </template>
  </ol-map>
</template>

<script>
import { ref } from 'vue';
import {fromLonLat, toLonLat} from 'ol/proj.js';
import app from '../api/firebase';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";

export default {
  name: "MapsOverlay",

  data() {
    const center = ref(fromLonLat([-7.5029786, 53.4494762]))
    const projection = ref('EPSG:3857')
    const zoom = ref(7)
    const rotation = ref(0)
    const radius = ref(10)
    const strokeWidth = ref(1)
    const strokeColor = ref('black')
    const fillColor = ref('red')

    return {
      center,
      projection,
      zoom,
      rotation,
      radius,
      strokeWidth,
      strokeColor,
      fillColor,

      coordinates: [],
      dbLiveTrainData: [],
      allDataMap: {},
      selectedDataMap: {},
      display: false,

      numTrains: 0,
      numRunningTrains: 0,
      numLateRunningTrains: 0,
      latestTrain: {},
      earliestTrain: {},
      percentageEarly: 0,
      percentageLate: 0,
      latestTime: 0,
      earliestTime: 0,
    }
  },

  created() {
    if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
      this.postLiveTrainData()
    }
    else {
      this.getLiveTrainData()
    }
    // request new data every 60 seconds
    // window.setInterval(this.getLiveTrainData, 60000);
  },

  methods: { 
    // fetch live train data from the Firestore database
    getLiveTrainData() {
      const functions = getFunctions(app);
      let host = window.location.hostname
      if (host === '127.0.0.1' || host === 'localhost') {
        connectFunctionsEmulator(functions, host, 5001);
      }
      const getData = httpsCallable(functions, 'getLiveTrainData');
      let loader = this.$loading.show({
        loader: 'dots',
        container: this.$refs.container,
        canCancel: false
      });

      getData().then((response) => {
        try {
          this.dbLiveTrainData = response.data;
          console.log(this.dbLiveTrainData)

          this.numRunningTrains = 0;
          this.numTrains = 0;
          this.numLateRunningTrains = 0;
          var latest = null
          var currLatestTime = 0
          var earliest = null
          var currEarliestTime = 0

          // create an array of coordinates and hashmap with the key-values {index: JSON obj}
          for(var i=0; i<this.dbLiveTrainData.length; i++) {
            this.coordinates[i] = ref(fromLonLat([this.dbLiveTrainData[i]["TrainLongitude"][0], this.dbLiveTrainData[i]["TrainLatitude"][0]]))
            this.allDataMap[i] = this.dbLiveTrainData[i];
            
            // check if the train is running
            if (this.dbLiveTrainData[i]["TrainStatus"][0] == "R") {
              this.numRunningTrains += 1;
              
              let publicMessage = this.dbLiveTrainData[i]["PublicMessage"][0];
              let startTimeStr = publicMessage.indexOf("(")

              // late
              if (publicMessage[startTimeStr+1] != "-" && publicMessage[startTimeStr+1] != "0") {
                this.numLateRunningTrains += 1;
                if (!latest) {
                  latest = this.dbLiveTrainData[i];
                }

                let timeEnd = publicMessage.indexOf(" ", startTimeStr+1);
                let num = parseInt(publicMessage.substring(startTimeStr+1, timeEnd))

                // new latest train
                if (num > currLatestTime) {
                  latest = this.dbLiveTrainData[i]
                  currLatestTime = num
                }
              }
              // early or ontime
              else {
                if (!earliest) {
                  earliest = this.dbLiveTrainData[i];
                }
                let timeEnd = publicMessage.indexOf(" ", startTimeStr+1);
                let num = parseInt(publicMessage.substring(startTimeStr+1, timeEnd))
                
                // new earliest train, negative as early trains defined as negative x mins late
                if (num < currEarliestTime) {
                  earliest = this.dbLiveTrainData[i]
                  currEarliestTime = num
                }
              }
            }
          }

          this.percentageLate = ((this.numLateRunningTrains / this.numRunningTrains) * 100).toFixed(2);
          this.percentageEarly = 100 - this.percentageLate;
          this.numTrains = Object.keys(this.allDataMap).length;
          this.latestTrain = latest;
          this.earliestTrain = earliest;
          this.latestTime = currLatestTime;
          this.earliestTime = currEarliestTime;
          loader.hide();
        }
        catch (error) {
          loader.hide();
        }
      })
    },

    // assign a single train's data to the selected hashmap
    getSelectedTrain(i) {
      this.display = true;
      this.selectedDataMap["TrainCode"] = this.allDataMap[i]["TrainCode"][0];
      this.selectedDataMap["TrainDate"] = this.allDataMap[i]["TrainDate"][0];
      this.selectedDataMap["TrainStatus"] = this.allDataMap[i]["TrainStatus"][0];
      this.selectedDataMap["TrainLongitude"] = this.allDataMap[i]["TrainLongitude"][0];
      this.selectedDataMap["TrainLatitude"] = this.allDataMap[i]["TrainLatitude"][0];
      this.selectedDataMap["Direction"] = this.allDataMap[i]["Direction"][0];
      this.selectedDataMap["PublicMessage"] = this.allDataMap[i]["PublicMessage"][0];
    },

    // method to determine whether or not a selected train is late 
    isTrainLate(i) {
        // check if the train is running
        if (this.allDataMap[i]["TrainStatus"][0] == "R") {
            let publicMessage = this.allDataMap[i]["PublicMessage"][0];
            let startTimeStr = publicMessage.indexOf("(");

            // checking if the train is late
            if (publicMessage[startTimeStr+1] != "-" && publicMessage[startTimeStr+1] != "0") {
            return true;
            }
        }

        return false;
    },

    // ---------------- TESTING ----------------
    postLiveTrainData() {
      const functions = getFunctions(app);
      let host = window.location.hostname
      if (host === '127.0.0.1' || host === 'localhost') {
        connectFunctionsEmulator(functions, host, 5001);
      }
      const postData = httpsCallable(functions, 'postLiveTrainData');

      postData().then((response) => {
        this.getLiveTrainData()
      })
    }
    // ---------------- TESTING ----------------
  }
}
</script>

<style scoped>
.overlay-content {
  width: 1%;
}

.trainMapIcon {
  width: 28px;
  height: 32px;
}

.slideLeft-enter-active, .slideLeft-leave-active {
  transition: opacity .5s;
  transition: all 0.8s;

}
.slideLeft-enter-from, .slideLeft-leave-to{
  opacity: 0;
  transform: translateX(-100px);
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
    100% {
  background-position: 0% 50%;
  }
}

#sidebar{
  position: absolute;
  height: 85%;
  width: 20%;
  left: 2%;
  top: 12%;
  z-index: 2;
  text-align: center;
  animation: gradient 15s ease infinite;
  background: linear-gradient(45deg, #000000, #111111, #222222, #333333, #444444, #555555);
  background-size: 400%, 400%;
  box-shadow: 0 0 4px 2px #333333;
}

#sidebarDiv{
  position: relative;
  height: 100%;
  width: 100%;
  color: white;
}

#sidebarHeader{
  position: relative;
  top:0%;
  height: 10%;
  width: 100%;
  overflow: hidden;
}

#headerImage{
  height: 100%;
  width: auto;
  overflow: hidden;
}

#xButton{
  font-size: 80%;
  font-family: Georgia;
  color: white;
  position: absolute;
  top:10px;
  right:10px;
}

#xButton:hover{
  color:red;
}

#sidebarFooter{
  position: relative;
  bottom:0%;
  height:10%;
  text-align: center;
  color: azure;
}

#sidebarMain{
  position: relative;
  height:80%;
  width:100%;
  overflow: hidden;
}

#sidebarContent{
  position: relative;
  size: 6px;
  color: white;
  overflow-wrap: break-word;
  font-family: Georgia, 'Times New Roman', Times, serif ;
}

#mapDiv{
  background-color: black;
  position: absolute;
  float: right;
  right: 0%;
  top: 0%;
  width:100%;
  overflow: hidden;
  height: 100%;
}

#mapIFrame{
  position: relative;
  height: 100%;
  width: 100%;
  top: 0%;
  z-index: 0;
}

#buttonDiv{
  position: absolute;
  float: right;
  right: 10%;
  top: 0%;
  width:10%;
  height:10px;
}

#buttonElement{
  position: relative;
  top: 50%;
  left: 50%;
  z-index: 0;
}
</style>
