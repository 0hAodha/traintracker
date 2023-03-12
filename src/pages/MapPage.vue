<template>
<Navbar />

<nav class="navbar navbar-light bg-light">
    <div class="container-fluid" @change="decideShowTrains();">
        <input type="checkbox" id="showLate" v-model="showLate"/>
        <label for="showLate">Show Late Trains</label>
        <input type="checkbox" id="showOnTime" v-model="showOnTime"/>
        <label for="showOnTime">Show On-Time Trains</label>
    </div>
</nav>

<transition id="sidebar" name="slideLeft">
  <div v-if="store.displaySelectedTrain && store.selectedTrain">
    <TrainSidebar />
  </div>
  <div v-else-if="store.displaySelectedStation && store.selectedStation">
    <StationSidebar />
  </div>
</transition>

<ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="position:absolute; height:90.7vh; width:100%;">
    <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection" />
    <ol-tile-layer>
    <ol-source-osm />
    </ol-tile-layer>

    <!-- train overlay -->
    <template v-for="coordinate, i in trainCoordinates" :position="inline-block">
      <ol-overlay v-if="showTrains[i]" :position="coordinate" :positioning="center-center" :offset="[-14,-16]">
          <div class="overlay-content" @click="getSelectedTrain(i)">
              <div v-if="getTrainType(i) === 'Dart'">
                  <img v-if="isTrainRunning(i) && isTrainLate(i)" src="../assets/red-train-tram-solid.png" class="trainMapIcon" alt="Late DART Icon">
                  <img v-else-if="isTrainRunning(i) && !isTrainLate(i)" src="../assets/green-train-tram-solid.png" class="trainMapIcon" alt="On-Time DART Icon">
                  <img v-else src="../assets/train-tram-solid.svg" class="trainMapIcon" alt="Not Running DART Icon">
              </div>
              <div v-else>
                  <img v-if="isTrainRunning(i) && isTrainLate(i)" src="../assets/red-train-solid.png" class="trainMapIcon" alt="Late Train Icon">
                  <img v-else-if="isTrainRunning(i) && !isTrainLate(i)" src="../assets/green-train-solid.png" class="trainMapIcon" alt="On-Time Train Icon">
                  <img v-else src="../assets/train-solid.svg" class="trainMapIcon" alt="Not Running Train Icon">
              </div>
          </div>
      </ol-overlay>
    </template>

    <!-- station overlay -->
    <template v-for="coordinate, i in stationCoordinates" :position="inline-block">
      <ol-overlay :position="coordinate" :positioning="center-center" :offset="[-14,-16]">
        <div class="overlay-content" @click="getSelectedStation(i)">
          <img src="../assets/station.png" class="stationMapIcon" alt="Station Icon">
        </div>
      </ol-overlay>
    </template>
</ol-map>

<div>
  <MarqueeText v-if="publicMessages.length > 0" id="publicMessageTicker" :paused="isPaused" :duration="800" :repeat="1"
    @mouseenter="isPaused = !isPaused" @mouseleave="isPaused = false">
    <span v-for="message in publicMessages"> {{ message + " • " }} </span> 
  </MarqueeText>
</div>
</template>

<script>
import { store } from '../store/store';
import { ref } from 'vue';
import { fromLonLat, toLonLat } from 'ol/proj.js';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import app from '../api/firebase';
import Navbar from '../components/Navbar.vue';
import MarqueeText from 'vue-marquee-text-component';
import TrainSidebar from '../components/TrainSidebar.vue';
import StationSidebar from '../components/StationSidebar.vue';

export default {
    name: "MapPage",

    data() {
        const center = ref(fromLonLat([-7.5029786, 53.4494762]));
        const projection = ref('EPSG:3857');
        const zoom = ref(7);
        const rotation = ref(0);
        const radius = ref(10);
        const strokeWidth = ref(1);
        const strokeColor = ref('black');
        const fillColor = ref('red');

        let showTrains = []; 

        let showLate = true; 
        let showOnTime = true; 
        let showEarly = true;

        return {
            center,
            projection,
            zoom,
            rotation,
            radius,
            strokeWidth,
            strokeColor,
            fillColor,

            showTrains: [],
            trainCoordinates: [],
            stationCoordinates: [],
            allTrains: {},
            allStations: {},
            publicMessages: [],
            isPaused: false,
            store,

            showLate,
            showOnTime,
            showEarly
       }
    },

    components: {
      Navbar,
      MarqueeText,
      TrainSidebar,
      StationSidebar
    },

    created() {
        let host = window.location.hostname
        if (host === '127.0.0.1' || host === 'localhost') {
            this.postTrainAndStationData();
        }  
        else {
            this.getTrainAndStationData();
        }

        // request new data every 60 seconds
        // window.setInterval(this.getLiveTrainData, 60000);
    },

    methods: {
        // method to determine whether or not to show each train 
        decideShowTrains() {
            for (let i = 0; i < this.showTrains.length; i++) {
                this.showTrains[i] = (this.showLate && this.isTrainLate(i)) || (this.showOnTime && !this.isTrainLate(i));
            }
        },

        // method to display a selected train
        getSelectedTrain(i) {
          store.setSelectedTrain(this.allTrains[i]);
          if (store.displaySelectedStation) store.setDisplaySelectedStation(false);
          store.setDisplaySelectedTrain(true);
        },

        // method to display a selected station
        getSelectedStation(i) {
          store.setSelectedStation(this.allStations[i]);
          if (store.displaySelectedTrain) store.setDisplaySelectedTrain(false);
          store.setDisplaySelectedStation(true);
        },

        // method to determine whether or not a selected train is late 
        isTrainLate(i) {
            // check if the train is running
            if (this.allTrains[i]["TrainStatus"][0] == "R") {
                let publicMessage = this.allTrains[i]["PublicMessage"][0];
                let startTimeStr = publicMessage.indexOf("(");

                // check if the train is late
                if (publicMessage[startTimeStr+1] != "-" && publicMessage[startTimeStr+1] != "0") {
                    return true;
                }
            }
            return false;
        },

        // // method to determine whether or not a selected train is early 
        // isTrainEarly(i) {
        //     // check if the train is running
        //     if (this.allTrains[i]["TrainStatus"][0] == "R") {
        //         let publicMessage = this.allTrains[i]["PublicMessage"][0];
        //         let startTimeStr = publicMessage.indexOf("(");
        //
        //         // check if the train is early
        //         if (publicMessage[startTimeStr+1] == "-" && publicMessage[startTimeStr+1] != "0") {
        //             return true;
        //         }
        //     }
        //     return false;
        // },
        //
        // // method to determine whether or not a selected train is on time 
        // isTrainOnTime(i) {
        //     // check if the train is running
        //     if (this.allTrains[i]["TrainStatus"][0] == "R") {
        //         let publicMessage = this.allTrains[i]["PublicMessage"][0];
        //         let startTimeStr = publicMessage.indexOf("(");
        //
        //         // check if the train is on time
        //         if (publicMessage[startTimeStr+1] != "-" && publicMessage[startTimeStr+1] == "0") {
        //             return true;
        //         }
        //     }
        //     return false;
        // },
        //
        // // method to determine whether or not a selected train is late 
        // isTrainLate(i) {
        //     // check if the train is running
        //     if (this.allTrains[i]["TrainStatus"][0] == "R") {
        //         let publicMessage = this.allTrains[i]["PublicMessage"][0];
        //         let startTimeStr = publicMessage.indexOf("(");
        //
        //         // check if the train is late
        //         if (publicMessage[startTimeStr+1] != "-" && publicMessage[startTimeStr+1] != "0") {
        //             return true;
        //         }
        //     }
        //     return false;
        // },
        //
        // // method to determine whether or not a selected train is late 
        // isTrainLate(i) {
        //     // check if the train is running
        //     if (this.allTrains[i]["TrainStatus"][0] == "R") {
        //         let publicMessage = this.allTrains[i]["PublicMessage"][0];
        //         let startTimeStr = publicMessage.indexOf("(");
        //
        //         // check if the train is late
        //         if (publicMessage[startTimeStr+1] != "-" && publicMessage[startTimeStr+1] != "0") {
        //             return true;
        //         }
        //     }
        //     return false;
        // },

        // method to determine whether or not a selected train is running
        isTrainRunning(i) {
            if (this.allTrains[i]["TrainStatus"][0] == "R") {
                return true; 
            } 
            else {
                return false;
            }
        },

        // method that returns the type of train (either "Train" or "Dart")
        getTrainType(i) {
            return this.allTrains[i]["TrainType"][0];
        },

        // method to fetch live train and station data from the database
        getTrainAndStationData() {
            const functions = getFunctions(app);
            let host = window.location.hostname
            if (host === '127.0.0.1' || host == 'localhost') {
                connectFunctionsEmulator(functions, host, 5001);
            }
            const getTrainData = httpsCallable(functions, 'getLiveTrainData');
            let loader = this.$loading.show({
                loader: 'dots',
                container: this.$refs.container,
                canCancel: false
            });
            
            getTrainData().then((response) => {
                try {
                    if (!response.data) throw new Error("Error fetching live train data from the database");
                    var insights =  {
                                      "totalNumTrains": 0,
                                      "numRunningTrains": 0,
                                      "numLateRunningTrains": 0,
                                      "numTrains": 0,
                                      "numDarts": 0,
                                      "totalNumStations": 0,
                                      "numTrainStations": 0,
                                      "numDartStations": 0
                                    };
                    var unorderedTrains = [];
                    var currentMessages = [];
                    var latest = null;
                    var earliest = null;
                    var currLatestTime = null;
                    var currEarliestTime = null;

                    // create an array of coordinates and hashmap with the key-values {index: JSON obj}
                    for (var i=0; i<response.data.length; i++) {
                        let train = response.data[i];
                        this.allTrains[i] = train;

                        // filling showTrains witht the default value true
                        this.showTrains[i] = true;

                        this.trainCoordinates[i] = ref(fromLonLat([train["TrainLongitude"][0], train["TrainLatitude"][0]]))
                        insights["totalNumTrains"] += 1

                        if (train["TrainType"][0] == "Train") insights["numTrains"] += 1;
                        else if (train["TrainType"][0] == "Dart") insights["numDarts"] += 1;

                        // filter out \n in public messages
                        train["PublicMessage"][0] = train["PublicMessage"][0].replace(/\\n/g, ". ");
                        let publicMessage = train["PublicMessage"][0];
                        currentMessages.push(publicMessage);

                        // check if the train is running
                        if (train["TrainStatus"][0] == "R") {
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
                                    latest = train;
                                    currLatestTime = num;
                                }
                            }
                            // train is early or ontime
                            else {
                                if (!earliest) earliest = train;
                                
                                // check for a new earliest train (early trains are -x mins late)
                                if (num < currEarliestTime) {
                                    earliest = train;
                                    currEarliestTime = num;
                                }
                            }
                        }
                    }

                    insights["percentageLate"] = ((insights["numLateRunningTrains"] / insights["numRunningTrains"]) * 100).toFixed(2);
                    insights["percentageNotLate"] = (100 - insights["percentageLate"]).toFixed(2);
                    insights["latestTime"] = currLatestTime;
                    insights["earliestTime"] = currEarliestTime;
                    this.publicMessages = currentMessages;

                    // assign the results to the Vue Store
                    store.setEarliestTrain(earliest);
                    store.setLatestTrain(latest);
                    store.setRawData(response.data);
                    store.setOrderedTrains(unorderedTrains);

                    const getStationData = httpsCallable(functions, 'getStationData');
                    getStationData().then((response) => {
                      if (!response.data) throw new Error("Error fetching station from the database");
                      for (var i=0; i<response.data.length; i++) {
                        let station = response.data[i];
                        this.allStations[i] = station;
                        this.stationCoordinates[i] = ref(fromLonLat([station["StationLongitude"][0], station["StationLatitude"][0]]))
                        insights["totalNumStations"] += 1
                        
                        if (station["StationType"][0] == "Dart") insights["numDartStations"] += 1;
                        else if (station["StationType"][0] == "Train") insights["numTrainStations"] += 1;
                      }

                      store.setInsights(insights);
                      loader.hide();
                    })
              }
              catch (error) {
                  console.log(error)
                  loader.hide();
              }
            })
        },

        // method to populate the database for local testing
        postTrainAndStationData() {
            const functions = getFunctions(app);
            let host = window.location.hostname
            if (host === '127.0.0.1' || host === 'localhost') {
                connectFunctionsEmulator(functions, host, 5001);
            }
            // post live train data
            const postTrainData = httpsCallable(functions, 'postLiveTrainData');
            postTrainData().then((response) => {
              // post station data
              const postStationData = httpsCallable(functions, 'postStationData');
              postStationData().then((reponse) => {
                this.getTrainAndStationData()
              })
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

.trainMapIcon:hover{
  width:30px;
  height:34px;
  cursor: pointer;
}

.stationMapIcon {
  width: 14px;
  height: 17px;
}

.stationMapIcon:hover {
  width: 16px;
  height: 19px;
  cursor: pointer;
}


#sidebar{
  position: absolute;
  height: 80%;
  width: 20%;
  left: 2%;
  top: 14%;
  z-index: 2;
  text-align: center;
  animation: gradient 15s ease infinite;
  background: linear-gradient(45deg, #000000, #111111, #222222, #333333, #444444, #555555);
  background-size: 400%, 400%;
  box-shadow: 0 0 4px 2px #333333;
  overflow: hidden;
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
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

#publicMessageTicker {
  z-index: 3;
  position: absolute;
  bottom:0px;
  width:100%;
  background-color: rgb(255, 255, 125);
  color: black;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  text-align: bottom;
  font-size: 16px;
}
</style>
