<template>
  <button @click="getLiveTrainData">Fetch Data</button>
  <button @click="postLiveTrainData">Populate Database</button>

  <!--Sidebar, fades out on click of X button-->
    <transition id="sidebar" name="slideLeft">
      <div v-if="this.display" id= "sidebarDiv">

        <div id = "sidebarHeader">
          <div id="headerTop">
            <div style="font-size: 24px">Code: {{ selectedDataMap["TrainCode"] }}</div><div v-on:click="this.display = false" id="xButton">X</div>
          </div>
          <div id="departStation"><div class="stationCode">DP452</div><div class="stationName">Dublin Heuston</div></div><img id = "headerImage" src="https://cdn.discordapp.com/attachments/1017419092447207436/1063092138029625394/pixil-frame-0.png"><div id="destinationStation"><div class="stationCode">DS223</div><div class="stationName">Athenry</div></div>
          
        </div>

        <div id = "expectedArrive"><div class = "verticalCenter">Expected Arrival:</div></div>
        <div id = "actualArrive"><div class = "verticalCenter">Actual Arrival: </div></div>

        <div id= "sidebarContent">
          <p>Date: {{ selectedDataMap["TrainDate"] }}</p>
          <p>Status: {{ selectedDataMap["TrainStatus"] }}</p>
          <p>Longitude: {{ selectedDataMap["TrainLongitude"] }}</p>
          <p>Latitude: {{ selectedDataMap["TrainLatitude"] }}</p>
          <p>Direction: {{ selectedDataMap["Direction"] }}</p>
          <p>Public Message: {{ selectedDataMap["PublicMessage"] }}</p>
        </div>
      </div>
    </transition>

  <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height: 1000px">
    <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection" />
    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>

    <template v-for="coordinate, i in coordinates" :position="inline-block">
      <ol-overlay :position="coordinate">
        <div class="overlay-content" @click="getSelectedTrain(i)">
          <img src="https://cdn.discordapp.com/attachments/1017419092447207436/1063092138029625394/pixil-frame-0.png" class="trainMapIcon">
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
    }
  },

  created() {
    // initial request of data
    console.log("jere")
    this.getLiveTrainData()
    
    // request new data every 60 seconds
    // window.setInterval(this.getLiveTrainData, 60000);
  },

  methods: { 
    // fetch live train data from the Firestore database
    getLiveTrainData() {
      const functions = getFunctions(app);
      if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
        connectFunctionsEmulator(functions, "localhost", 5001);
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
          // create an array of coordinates and hashmap with the key-values {index: JSON obj}
          for(var i=0; i<this.dbLiveTrainData.length; i++) {
            this.coordinates[i] = ref(fromLonLat([this.dbLiveTrainData[i]["TrainLongitude"][0], this.dbLiveTrainData[i]["TrainLatitude"][0]]))
            this.allDataMap[i] = this.dbLiveTrainData[i];
          }
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

    // ---------------- TESTING ----------------
    postLiveTrainData() {
      const functions = getFunctions(app);
      if (window.location.hostname === '127.0.0.1'|| window.location.hostname === 'localhost') {
        connectFunctionsEmulator(functions, "localhost", 5001);
      }
      const postData = httpsCallable(functions, 'postLiveTrainData');

      postData().then((response) => {
        console.log("Test")
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
  height: 5.5vh;
  width: 3.5vw;
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
  font-family: Arial, Helvetica, sans-serif;
}

#sidebarDiv{
  position: relative;
  height: 95%;
  top:10px;
  width: 100%;
  color: white;
  background-color: aqua;
}

#sidebarHeader{
  position: relative;
  top:0%;
  height: 18%;
  width: 100%;
}

#headerTop{
  position: relative;
  width: 100%;
  height: 50%;
  text-align: left;
  color: yellow;
  font-weight: bold;
  background-color: #444444;
  box-sizing: border-box;
  padding: 10px;
  
}

#headerImage{
  height: 70%;
  width: auto;
  position: relative;
  background-color: black;
  border-radius: 50%;
  display: inline-block;
  top: 20px;
  z-index: 1;
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

#sidebarContent{
  color: white;
  top:50px;
  position: relative;
  font-weight: normal;
}

#sidebarFooter{
  position: relative;
  bottom:0%;
  height:10%;
  text-align: center;
  color: azure;
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


#departStation{
  background-color: rgb(206, 206, 206);
  width: 49.5%;
  height: 100%;
  z-index: -1;
  position: absolute;
  left:0px;
  
}

#expectedArrive{
  position: relative;
  top: 9.2%;
  background-color: #555555;
  text-align: left;
  height: 8%;
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
}

#actualArrive{
  position: relative;
  background-color: #555555;
  top: 9.3%;
  vertical-align: middle;
  text-align: left;
  height: 8%;
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
}

#destinationStation{
  background-color: rgb(206, 206, 206);
  width: 49.5%;
  height: 100%;
  z-index: -1;
  position: absolute;
  right:0px;
  top:54px;
  overflow: hidden;
}

.stationCode{
  color: #222222;
  text-align: center;
  font-size: 35px;
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  z-index: 10;
  position: relative;
  overflow: hidden;
  left: 0px;

}

.stationName{
  position: relative;
  width: 40%;
  left:32%;
}

.verticalCenter{
  top: 30%;
  position: absolute;
}
</style>