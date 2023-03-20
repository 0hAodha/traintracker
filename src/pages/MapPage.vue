<template>
<Navbar />

<div id="preferenceDropdown" class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
    Map Filters
  </button>
  <div style="padding-bottom: 7px;" id="dropMenu" class="dropdown-menu" aria-labelledby="dropdownMenuButton1" v-on:click.stop="handleClick">
    <div id="prefHeader">STATIONS</div>
      <div class="container-fluid" @change="decideShowStations();">
        <div class="form-check form-switch">
          <input @change="selectAllStations();" class="form-check-input" type="checkbox" role="switch" id="showAllStations" v-model="showAllStations"/>
          <label class="form-check-label" for="showAllStations">All Stations</label>
        </div>
        <hr/>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" role="switch" id="showMainlandStations" v-model="showMainlandStations"/>
          <label class="form-check-label" for="showMainlandStations">Mainline</label>
        </div>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" role="switch" id="showDARTStations" v-model="showDARTStations"/>
          <label class="form-check-label" for="showDARTStations">DART</label>
        </div>
      </div>
      <hr/>
      <div id="prefHeader">TRAINS</div>
      <div class="container-fluid" @change="decideShowTrains();">
        <div class="form-check form-switch">
          <input @change="selectAllTrains();" class="form-check-input" type="checkbox" role="switch" id="showAllTrains" v-model="showAllTrains"/>
          <label class="form-check-label" for="showAllTrains">All Trains</label>
        </div>
        <hr/>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" role="switch" id="showMainland" v-model="showMainland"/>
          <label class="form-check-label" for="showMainland">Mainline</label>
        </div>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" role="switch" id="showDART" v-model="showDART"/>
          <label class="form-check-label" for="showDART">DARTs</label>
        </div>
        <hr/>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" role="switch" id="showOnTime" v-model="showOnTime"/>
          <label class="form-check-label" for="showOnTime">On-Time</label>
        </div>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" role="switch" id="showLate" v-model="showLate"/>
          <label class="form-check-label" for="showLate">Late</label>
        </div>
        <hr/>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" role="switch" id="showNotYetRunning" v-model="showNotYetRunning"/>
          <label class="form-check-label" for="showNotYetRunning">Not-Yet Running</label>
        </div>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" role="switch" id="showRunning" v-model="showRunning"/>
          <label class="form-check-label" for="showRunning">Running</label>
        </div>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" role="switch" id="showTerminated" v-model="showTerminated"/>
          <label class="form-check-label" for="showTerminated">Terminated</label>
        </div>
      </div>
      <button id="savePref" class="btn btn-outline-info" v-if="store.loggedIn" @click="postPreferences()">Save Preferences</button>
    </div>
</div>

<transition id="sidebar" name="slideLeft">
  <div v-if="store.displaySelectedTrain && store.selectedTrain">
    <TrainSidebar />
  </div>
  <div v-else-if="store.displaySelectedStation && store.selectedStation">
    <StationSidebar />
  </div>
</transition>

<ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="position:absolute; height:90.6vh; width:100%;">
    <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection" />
    <ol-tile-layer>
    <ol-source-osm />
    </ol-tile-layer>

    <div v-if="(!store.isWaitingForLoginStatus && !store.loggedIn) || (store.loggedIn && readyToDisplayMap)">
      <!-- train overlay -->
      <template v-for="coordinate, i in trainCoordinates" :position="inline-block">
        <ol-overlay v-if="showTrains[i]" :position="coordinate" :offset="[-14,-16]">
            <div class="overlay-content" @click="getSelectedTrain(i)">
                <div v-if="getTrainType(i) === 'DART'">
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
        <ol-overlay v-if="showStations[i]" :position="coordinate" :offset="[-14,-16]">
          <div class="overlay-content" @click="getSelectedStation(i)">
            <img src="../assets/station.png" class="stationMapIcon" alt="Station Icon">
          </div>
        </ol-overlay>
      </template>
    </div>
</ol-map>

<div>
  <MarqueeText v-if="publicMessages.length>0" id="publicMessageTicker" :paused="isPaused" :duration="800" :repeat="1"
    @mouseenter="isPaused = !isPaused" @mouseleave="isPaused = false">
    <span v-for="message in publicMessages"> {{ message + " • " }} </span> 
  </MarqueeText>
</div>
</template>

<script>
import { store } from '../store/store';
import { fromLonLat } from 'ol/proj.js';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css'
import app from '../api/firebase';
import Navbar from '../components/Navbar.vue';
import MarqueeText from 'vue-marquee-text-component';
import TrainSidebar from '../components/TrainSidebar.vue';
import StationSidebar from '../components/StationSidebar.vue';

export default {
    name: "MapPage",

    data() {
      const toast = () => {
        createToast(this.toastMessage, {
            hideProgressBar: true,
            timeout: 4000,
            toastBackgroundColor: this.toastBackground
        })
      }

      let loader = this.$loading.show({
            loader: 'dots',
            container: this.$refs.container,
            canCancel: false
      });

      return {
          center: fromLonLat([-7.5029786, 53.4494762]),
          projection: 'EPSG:3857',
          zoom: 7,
          rotation: 0,

          showTrains: [],
          showStations: [],
          trainCoordinates: [],
          stationCoordinates: [],
          allTrains: {},
          allStations: {},
          publicMessages: [],
          isPaused: false,
          readyToDisplayMap: false,
          store,

          toastMessage: "",
          toastBackground: "",
          toast,
          loader,

          showAllStations: true,
          showMainlandStations: true, 
          showDARTStations: true,
          showAllTrains: true,
          showLate: true,
          showOnTime: true,
          showMainland: true,
          showDART: true, 
          showRunning: true, 
          showTerminated: true, 
          showNotYetRunning: true,
      }
    },

    components: {
      Navbar,
      MarqueeText,
      TrainSidebar,
      StationSidebar
    },
    
    created() {
        this.readyToDisplayMap = false
        let host = window.location.hostname
        if (host === '127.0.0.1' || host === 'localhost') {
            this.postTrainAndStationData();
        }  
        else {
            this.getTrainAndStationData();
        }
        // request new data every 60 seconds
        // window.setInterval(this.getTrainAndStationData, 60000);
    },

    methods: {
        showToast(message, backgroundColour) {
          this.toastMessage = message
          this.toastBackground = backgroundColour
          this.toast()
        },

        handleClick(e){
          e.stopPropagation();
        },

        getPreferences() {
          if (!store.loggedIn) {
            this.loader.hide()
            return
          }

          const functions = getFunctions(app);
          let host = window.location.hostname
          if (host === '127.0.0.1' || host == 'localhost') {
            connectFunctionsEmulator(functions, host, 5001);
          }

          const getPreferencesData = httpsCallable(functions, 'getPreferences')
          getPreferencesData().then((response) => {
            if (response.data.data) {
              this.hasPreferences = true
              this.showMainlandStations = response.data.data["showMainlandStations"]
              this.showDARTStations = response.data.data["showDARTStations"]
              this.showLate = response.data.data["showLate"]
              this.showOnTime = response.data.data["showOnTime"]
              this.showMainland = response.data.data["showMainland"]
              this.showDART = response.data.data["showDART"]
              this.showRunning = response.data.data["showRunning"]
              this.showTerminated = response.data.data["showTerminated"]
              this.showNotYetRunning = response.data.data["showNotYetRunning"]

              // update the map with the user's preferences
              this.decideShowStations()
              this.decideShowTrains()
              this.readyToDisplayMap = true
              this.loader.hide()
            }
          })
          .catch((error) => {
            this.readyToDisplayMap = true
            this.loader.hide()
          })
        },

        postPreferences() {
          if (!store.loggedIn) return
          let preferences = {
            "showMainlandStations": this.showMainlandStations,
            "showDARTStations": this.showDARTStations,
            "showLate": this.showLate,
            "showOnTime": this.showOnTime,
            "showMainland": this.showMainland,
            "showDART": this.showDART,
            "showRunning": this.showRunning,
            "showTerminated": this.showTerminated,
            "showNotYetRunning": this.showNotYetRunning
          }

          const functions = getFunctions(app);
            let host = window.location.hostname
            if (host === '127.0.0.1' || host == 'localhost') {
              connectFunctionsEmulator(functions, host, 5001);
          }
          
          this.showToast("Saving preferences", "green")
          const postPreferencesData = httpsCallable(functions, 'postPreferences')
          postPreferencesData(preferences).then(() => {
            this.readyToDisplayMap = true
          })
          .catch((error) => {
            this.showToast(error.message, "red")
          })
        },

        // method to determine whether or not to show each train 
        decideShowTrains() {
          for (var i=0; i<this.showTrains.length; i++) {
              let isDART = this.getTrainType(i) == "DART"; 
              if ((this.showRunning && this.allTrains[i]["TrainStatus"][0] == "R") || (this.showTerminated && this.allTrains[i]["TrainStatus"][0] == "T") || this.showNotYetRunning && this.allTrains[i]["TrainStatus"][0] == "N") {
                  if ((this.showDART && isDART) || (this.showMainland && !isDART)) {
                      this.showTrains[i] = (this.showLate && this.isTrainLate(i)) || (this.showOnTime && !this.isTrainLate(i));
                  }
                  else {
                      this.showTrains[i] = false;
                  }
              }
              else {
                  this.showTrains[i] = false;
              }
          }
        },
        
        // method to determine whether or not to show each station
        decideShowStations() {
          for (var i=0; i<this.showStations.length; i++) {
            let isDARTStation = this.getStationType(i) == "DART"; 
            this.showStations[i] = (this.showDARTStations && isDARTStation) || (this.showMainlandStations && !isDARTStation); 
          }
        },

        // method to select all stations 
        selectAllStations() {
            this.showDARTStations = this.showAllStations; 
            this.showMainlandStations = this.showAllStations;
        },

        // method to select all trains 
        selectAllTrains() {
          this.showLate = this.showAllTrains; 
          this.showOnTime = this.showAllTrains;
          this.showMainland = this.showAllTrains;
          this.showDART = this.showAllTrains;
          this.showRunning = this.showAllTrains;
          this.showTerminated = this.showAllTrains;
          this.showNotYetRunning = this.showAllTrains;
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

        // method to determine whether or not a selected train is running
        isTrainRunning(i) {
            if (this.allTrains[i]["TrainStatus"][0] == "R") return true; 
            else return false;
        },

        // method that returns the type of train (either "Train" or "DART")
        getTrainType(i) {
            return this.allTrains[i]["TrainType"][0];
        },

        // method that returns the type of station (either "Train" or "DART")
        getStationType(i) {
          return this.allStations[i]["StationType"][0]
        },

        // method to fetch live train and station data from the database
        getTrainAndStationData() {
            const functions = getFunctions(app);
            let host = window.location.hostname
            if (host === '127.0.0.1' || host == 'localhost') {
                connectFunctionsEmulator(functions, host, 5001);
            }

            const getTrainData = httpsCallable(functions, 'getLiveTrainData');
            getTrainData().then((response) => {
                try {
                    if (!response.data) throw new Error("Error fetching live train data from the database")
                    var unorderedTrains = [];
                    var currentMessages = [];
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

                    // create an array of coordinates and hashmap with the key-values {index: JSON obj}
                    for (var i=0; i<response.data.length; i++) {
                        let train = response.data[i];
                        this.allTrains[i] = train;
                        this.trainCoordinates[i] = fromLonLat([train["TrainLongitude"][0], train["TrainLatitude"][0]])
                        insights["totalNumTrains"] += 1

                        // fill showTrains with the default value - true
                        this.showTrains[i] = true;
                        if (train["TrainType"][0] == "Train") insights["numTrains"] += 1;
                        else if (train["TrainType"][0] == "DART") insights["numDarts"] += 1;

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
                            }
                        }
                    }

                    insights["percentageLate"] = ((insights["numLateRunningTrains"] / insights["numRunningTrains"]) * 100).toFixed(2);
                    insights["percentageNotLate"] = (100 - insights["percentageLate"]).toFixed(2);
                    this.publicMessages = currentMessages;

                    // assign the results to the Vue Store
                    store.setRawData(response.data);
                    store.setOrderedTrains(unorderedTrains);

                    const getStationData = httpsCallable(functions, 'getStationData');
                    getStationData().then((response) => {
                      if (!response.data) throw new Error("Error fetching station from the database");

                      for (var i=0; i<response.data.length; i++) {
                        let station = response.data[i];
                        this.allStations[i] = station;
                        this.stationCoordinates[i] = fromLonLat([station["StationLongitude"][0], station["StationLatitude"][0]])
                        insights["totalNumStations"] += 1

                        // setting the station to show on the map by default - true
                        this.showStations[i] = true; 
                        if (station["StationType"][0] == "DART") insights["numDartStations"] += 1;
                        else if (station["StationType"][0] == "Train") insights["numTrainStations"] += 1;
                      }

                      store.setInsights(insights);
                      // this.loader.hide()
                      // request the user's preferences
                      this.getPreferences()
                    })
              }
              catch (error) {
                  this.loader.hide()
                  this.showToast(error.message, "red")
              }
            })
            .catch((error) => {
              this.loader.hide()
              this.showToast("Error fetching live data", "red")
            })
        },

        // method to populate the database for local testing
        postTrainAndStationData() {
            const functions = getFunctions(app);
            let host = window.location.hostname
            if (host === '127.0.0.1' || host === 'localhost') {
                connectFunctionsEmulator(functions, host, 5001);
            }

            const postTrainData = httpsCallable(functions, 'postLiveTrainData');
            postTrainData().then(() => {
              const postStationData = httpsCallable(functions, 'postStationData');
              postStationData().then(() => {
                this.getTrainAndStationData()
              })
            })
            .catch((error) => {
              this.showToast(error.message, "red")
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

.trainMapIcon:hover {
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

#dropdownMenuButton1 {
  box-shadow: 0 0 5px 2px #6e757dbe;
}

#dropMenu {
  /*In case we want to edit dropdown menu*/
  font-size: 14.6px;
}

#preferenceDropdown {
  position: absolute;
  z-index: 3;
  right: 1%;
  top: 11%;
}

#prefHeader {
  font-size: 18px;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  text-align: center;
  position: relative;
}

#sidebar {
  position: absolute;
  height: 80%;
  width: 20%;
  left: 2%;
  top: 14%;
  z-index: 2;
  text-align: center;
  animation: gradient 15s ease infinite;
  background: linear-gradient(45deg, #ffffff, #fef3f3, #ffffff, #f2f2f2);
  background-size: 100%, 100%;
  box-shadow: 0 0 4px 2px #cccccc;
  overflow: hidden;
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
}

#savePref {
  left:2%;
  top: 2px;
  width: 95%;
  position: relative;
}
.slideLeft-enter-active, .slideLeft-leave-active {
  transition: opacity .5s;
  transition: all 0.8s;

}
.slideLeft-enter-from, .slideLeft-leave-to {
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
