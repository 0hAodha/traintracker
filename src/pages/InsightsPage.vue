<template>
<Navbar />

<h1>Insights</h1>
<div v-if="this.insights">
    <p>Total number of trains: {{ this.insights["totalNumTrains"] }}</p>
    <p>Number of actively running trains: {{ this.insights["numRunningTrains"] }}</p>
    <p>Percentage late: {{ this.insights["percentageLate"] }}%</p>
    <p>Percentage early or ontime: {{ this.insights["percentageNotLate"] }}%</p>

    <p v-if="this.latestTrain['TrainCode']">Latest train: {{ this.latestTrain["TrainCode"][0] }}, {{ this.insights["latestTime"] }} mins late</p>
    <p v-if="this.earliestTrain['TrainCode']">Earliest train: {{ this.earliestTrain["TrainCode"][0] }}, {{ this.insights["earliestTime"] * -1 }} mins early</p>
    
    <p>Mainland: {{ this.insights["numMainland"] }}</p>
    <p>Suburban: {{ this.insights["numSuburban"] }}</p>
    <p>Darts: {{ this.insights["numDart"] }}</p>
</div>

<h1>Leaderboard</h1>
<div v-for="item in orderedTrains">
    <h2>{{ this.rawData[item.jsonIndex]["TrainCode"][0] }}</h2>
    <p v-if="item.time > 0">{{ item.time }} mins late</p>
    <p v-else>{{ item.time * -1}} mins early</p>
</div>
</template>
    
<script>
import {store} from '../store/store'
import Navbar from '../components/Navbar.vue'
export default {
    name: "InsightsPage",

    data() {
        return {
            insights: {},
            latestTrain: {},
            earliestTrain: {},
            rawData: {},
            orderedTrains: [],
            store
        }
    },

    components: {
      Navbar
    },

    created() {
        this.insights = store.insights
        this.latestTrain = store.latestTrain
        this.earliestTrain = store.earliestTrain
        this.rawData = store.rawData
        this.orderedTrains = store.orderedTrains
    }
}
</script>
    
<style scoped>
body{
    background-color: rgb(44, 102, 102);
}
</style>