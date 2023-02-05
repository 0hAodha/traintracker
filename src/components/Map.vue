<template>
  <div v-if="this.display">
    <h2>Train Code: {{ selectedDataMap["TrainCode"] }}</h2>
    <p>Date: {{ selectedDataMap["TrainDate"] }}</p>
    <p>Status: {{ selectedDataMap["TrainStatus"] }}</p>
    <p>Longitude: {{ selectedDataMap["TrainLongitude"] }}</p>
    <p>Longitude: {{ selectedDataMap["TrainLatitude"] }}</p>
    <p>Direction: {{ selectedDataMap["Direction"] }}</p>
    <p>Public Message: {{ selectedDataMap["PublicMessage"] }}</p>
  </div>

  <button @click="getLiveTrainData">Show</button>
  <button @click="postLiveTrainData">Populate Database</button>

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
</style>