<template>


  <button @click="getLiveTrainData">Show</button>
  <button @click="postLiveTrainData">Populate Database</button>
  <!--Sidebar, fades out on click of X button-->
    <transition id="sidebar" name="slideLeft">
      <div v-if="this.display" id= "sidebarDiv">
      <div id = "sidebarHeader"><img id = "headerImage" src="https://cdn.discordapp.com/attachments/1017419092447207436/1063092138029625394/pixil-frame-0.png"> <div v-on:click="this.display = false" id="xButton">X</div></div>
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
  <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height: 1000px">
    <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection" />

    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>

    <template v-for="coordinate, i in coordinates">
      <ol-overlay :position="coordinate">
        <template v-slot="slotProps">
            <div class="overlay-content" @click="getSelectedTrain(i)">{{ i }}</div>
        </template>
    </ol-overlay>
    </template>

  </ol-map>
</template>

<script>
import { ref } from 'vue';
import {fromLonLat, toLonLat} from 'ol/proj.js';
import axios from 'axios';

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

  methods: {
    // fetch live train data from the Firestore database
    getLiveTrainData() {
      axios.get('https://us-central1-concept-d5be1.cloudfunctions.net/getLiveTrainData')
      .then((response) => {
        this.dbLiveTrainData = response.data;

        // create an array of coordinates and hashmap with the key-values {index: JSON obj}
        for(var i=0; i<this.dbLiveTrainData.data.length; i++) {
          this.coordinates[i] = ref(fromLonLat([this.dbLiveTrainData.data[i]["TrainLongitude"][0], this.dbLiveTrainData.data[i]["TrainLatitude"][0]]))
          this.allDataMap[i] = this.dbLiveTrainData.data[i];
        }
      })
      .catch((error) => {
        console.log(error)
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
      axios.get('https://us-central1-concept-d5be1.cloudfunctions.net/postLiveTrainData')
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
    }
    // ---------------- TESTING ----------------
  }
}
</script>

<style scoped>
.overlay-content {
    background: #efefef;
    box-shadow: 0 5px 10px rgb(2 2 2 / 20%);
    padding: 10px 20px;
    font-size: 16px;
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

body{
background-color: #b7deff;
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
