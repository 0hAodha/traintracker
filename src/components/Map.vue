<template>
  <h1>Test</h1>
  <button @click="getLiveTrainData">Show</button>
  <button @click="postLiveTrainData">Populate Database</button>

  <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height: 1000px">
    <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection" />

    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>

    <template v-for="coordinate in this.coordinates">
      <ol-vector-layer>
        <ol-source-vector>
          <ol-feature>
            <ol-geom-point :coordinates="coordinate"></ol-geom-point>
            <ol-style>
              <ol-style-circle :radius="radius">
                <ol-style-fill :color="fillColor"></ol-style-fill>
                <ol-style-stroke :color="strokeColor" :width="strokeWidth"></ol-style-stroke>
              </ol-style-circle>
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>
    </template>

  </ol-map>
</template>

<script>
import { ref } from 'vue';
import {fromLonLat, toLonLat} from 'ol/proj.js';
import axios from 'axios';

export default {
  name: "Map",
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
      allDataMap: {}
    }
  },

  methods: {
    // fetch live train data from the Firestore database
    getLiveTrainData() {
      axios.get('https://us-central1-concept-d5be1.cloudfunctions.net/getLiveTrainData')
      .then((response) => {
        this.dbLiveTrainData = response.data;

        // create a Hashmap with the key-values as {TrainCode: JSON}
        for(var i=0; i<this.dbLiveTrainData.data.length; i++) {
          this.allDataMap[this.dbLiveTrainData.data[i]["TrainCode"][0]] = this.dbLiveTrainData.data[i];
          this.coordinates[i] = ref(fromLonLat([this.dbLiveTrainData.data[i]["TrainLongitude"][0], this.dbLiveTrainData.data[i]["TrainLatitude"][0]]))
        }
      })
      .catch((error) => {
        console.log(error)
      })
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