<template>
<Navbar />
<!-- <button id="hoverButton" @click="postLiveTrainData">Populate Database</button> -->

<!--Sidebar, fades out on click of X button-->
<transition id="sidebar" name="slideLeft">
<div v-if="this.display" id= "sidebarDiv">
    <div id = "sidebarHeader">
        <img id = "headerImage" src="../assets/train-solid.svg" alt="Train Icon">
        <div v-on:click="this.display = false" id="xButton">X</div>
    </div>

    <div id= "sidebarDiv">
        <h2>Train Code: {{ selectedDataMap["TrainCode"] }}</h2>
        <p id = "dateP">Date: {{ selectedDataMap["TrainDate"] }}</p>
        <p id = "dateP">Status: {{ selectedDataMap["TrainStatus"] }}</p>
        <p id = "dateP">Train Position - Long: {{ selectedDataMap["TrainLongitude"] }} Lat: {{ selectedDataMap["TrainLatitude"] }}</p>
        <p id = "directionP">Direction: {{ selectedDataMap["Direction"] }}</p>
        <p id = "messageP">Public Message: {{ selectedDataMap["PublicMessage"] }}</p>
    </div>
</div>
</transition>

<ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="position:absolute; height:90.7vh; width:100%;">
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

<div>
  <MarqueeText v-if="publicMessages.length > 0" id="publicMessageTicker" :paused="isPaused" :duration="800" :repeat="1"
    @mouseenter="isPaused = !isPaused" @mouseleave="isPaused = false">
    <span v-for="message in publicMessages"> {{ "---" + message + "---" }} </span> 
  </MarqueeText>
</div>
</template>

<script>
import {store} from '../store/store'
import { ref } from 'vue';
import {fromLonLat, toLonLat} from 'ol/proj.js';
import app from '../api/firebase';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import Navbar from '../components/Navbar.vue'
import MarqueeText from 'vue-marquee-text-component'

export default {
    name: "MapPage",

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
            store,

            publicMessages: [],
            isPaused: false,
       }
    },

    components: {
      Navbar,
      MarqueeText
    },

    created() {
        let host = window.location.hostname
        if (host === '127.0.0.1' || host === 'localhost') {
            this.postLiveTrainData();
        }  
        else {
            this.getLiveTrainData();
        }
        // request new data every 60 seconds
        // window.setInterval(this.getLiveTrainData, 60000);
    },

    methods: {
        // method to assign a single train's data to the selected hashmap
        getSelectedTrain(i) {
            this.display = true;
            this.selectedDataMap = this.allDataMap[i];
        },

        // method to determine whether or not a selected train is late 
        isTrainLate(i) {
            // check if the train is running
            if (this.allDataMap[i]["TrainStatus"][0] == "R") {
                let publicMessage = this.allDataMap[i]["PublicMessage"][0];
                let startTimeStr = publicMessage.indexOf("(");

                // check if the train is late
                if (publicMessage[startTimeStr+1] != "-" && publicMessage[startTimeStr+1] != "0") {
                    return true;
                }
            }
            return false;
        },

        // method to fetch live train data from the database
        getLiveTrainData() {
            const functions = getFunctions(app);
            let host = window.location.hostname
            if (host === '127.0.0.1' || host == 'localhost') {
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
                    if (!this.dbLiveTrainData) throw new Error("Error fetching live train data from the database");

                    var insights = {"numRunningTrains": 0,
                                  "numLateRunningTrains": 0,
                                  "numMainland": 0,
                                  "numSuburban": 0,
                                  "numDart": 0}
                    var unorderedTrains = []
                    var latest = null
                    var earliest = null
                    var currLatestTime = null
                    var currEarliestTime = null

                    var currentMessages = []

                    // create an array of coordinates and hashmap with the key-values {index: JSON obj}
                    for (var i=0; i<this.dbLiveTrainData.length; i++) {
                        let train = this.dbLiveTrainData[i];
                        this.coordinates[i] = ref(fromLonLat([train["TrainLongitude"][0], train["TrainLatitude"][0]]))
                        this.allDataMap[i] = train;

                        if (train["TrainType"][0] == "M") insights["numMainland"] += 1;
                        else if (train["TrainType"][0] == "S") insights["numSuburban"] += 1;
                        else if (train["TrainType"][0] == "D") insights["numDart"] += 1;
                        
                        let publicMessage = train["PublicMessage"][0];
                        currentMessages.push(publicMessage)

                        // check if the train is running
                        if (this.dbLiveTrainData[i]["TrainStatus"][0] == "R") {
                            insights["numRunningTrains"] += 1;
                            let startTimeStr = publicMessage.indexOf("(");
                            let timeEnd = publicMessage.indexOf(" ", startTimeStr+1);
                            let num = parseInt(publicMessage.substring(startTimeStr+1, timeEnd))
                            unorderedTrains.push({"time": num, "jsonIndex": i})

                            // check if the train is late
                            if (publicMessage[startTimeStr+1] != "-" && publicMessage[startTimeStr+1] != "0") {
                                insights["numLateRunningTrains"] += 1;

                                if (!latest) latest = train;

                                // check for a new latest train
                                if (num > currLatestTime) {
                                    latest = train
                                    currLatestTime = num
                                }
                            }
                            // train is early or ontime
                            else {
                                if (!earliest) earliest = train;
                                
                                // check for a new earliest train (early trains are -x mins late)
                                if (num < currEarliestTime) {
                                    earliest = train
                                    currEarliestTime = num
                                }
                            }
                        }
                    }

                    insights["percentageLate"] = ((insights["numLateRunningTrains"] / insights["numRunningTrains"]) * 100).toFixed(2);
                    insights["percentageNotLate"] = (100 - insights["percentageLate"]).toFixed(2);
                    insights["totalNumTrains"] = Object.keys(this.allDataMap).length;
                    insights["latestTime"] = currLatestTime;
                    insights["earliestTime"] = currEarliestTime
                    this.publicMessages = currentMessages

                    // assign the results to the Vue Store
                    store.setInsights(insights);
                    store.setEarliestTrain(earliest);
                    store.setLatestTrain(latest);
                    store.setRawData(this.dbLiveTrainData);
                    store.setOrderedTrains(unorderedTrains);
                    loader.hide();
              }
              catch (error) {
                  console.log(error)
                  loader.hide();
              }
            })
        },

        // method to populate the database for local testing
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
  overflow: hidden;
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
}

#sidebarHeader{
  position: relative;
  top:0%;
  height: 15%;
  width: 100%;
  overflow: hidden;
}

#sidebarDiv{
  position: absolute;
  height: 80%;
  width: 100%;
  color: white;
}

#headerImage{
  height: 80%;
  width: auto;
  overflow: hidden;
  position: relative;
  top: 10px;
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

#publicMessageTicker {
  z-index: 3;
  position: absolute;
  bottom:0px;
  width:100%;
  background-color: rgb(255, 255, 125);
  color: black;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  text-align: bottom;
  font-size: 17px;
}
</style>
