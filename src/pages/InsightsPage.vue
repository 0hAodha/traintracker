<template>
<router-link to="/">Home</router-link>
<router-link to="/insights">Insights</router-link>

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
</template>
    
<script>
import {store} from '../store/store'
export default {
    name: "InsightsPage",

    data() {
        return {
            insights: {},
            latestTrain: {},
            earliestTrain: {},
            store
        }
    },

    created() {
        this.insights = store.insights
        this.latestTrain = store.latestTrain
        this.earliestTrain = store.earliestTrain
    }
}
</script>
    
<style scoped>
</style>