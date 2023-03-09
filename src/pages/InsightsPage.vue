<template>
<Navbar />


<div v-if="this.insights" id="insightDiv">
    <h1 style="padding-left: 10px; ">Insights</h1>
    <div id="trainTotal">
        <div id = "trainTotalText">
            <p>Total number of trains: {{ this.insights["totalNumTrains"] }}</p>
            <ul>
                <li><p>Mainland: {{ this.insights["numMainland"] }}</p></li>
                <li><p>Suburban: {{ this.insights["numSuburban"] }}</p></li>
                <li><p>Darts: {{ this.insights["numDart"] }}</p></li>
            </ul>
        </div>
        <div id="trainTotalChart">
            <pieChart id="trainPie" />
        </div>

    </div>
    <hr>
    <p>Number of actively running trains: {{ this.insights["numRunningTrains"] }}</p>
    <p>Percentage late: {{ this.insights["percentageLate"] }}%</p>
    <p>Percentage early or ontime: {{ this.insights["percentageNotLate"] }}%</p>
    <div id ="statsDiv">
        <BarChart id ="lateGraph" /> 
    </div>
    <p v-if="this.latestTrain['TrainCode']">Latest train: {{ this.latestTrain["TrainCode"][0] }}, {{ this.insights["latestTime"] }} mins late</p>
    <p v-if="this.earliestTrain['TrainCode']">Earliest train: {{ this.earliestTrain["TrainCode"][0] }}, {{ this.insights["earliestTime"] * -1 }} mins early</p>
    
    
</div>
<div id="ads">
    <h2>AdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAds
        AdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAds
        AdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAds
        AdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAds
        AdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAds
        AdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAdsAds
    </h2>
</div>
<hr>


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
import BarChart from '../components/BarChart.vue'
import pieChart from '../components/pieChart.vue'
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
      Navbar,
      pieChart,
      BarChart
      
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
#insightDiv{
    color: black;
    padding-left: 10px;
    width:80%;
    background-color: antiquewhite;
}

#trainTotal{
    height: 280px;

}
#trainTotalText{
    position: relative;
    width: 30%;
    height: 100%;
    right:0px;
}
#trainTotalChart{
    position: absolute;
    top:114px;
    width: 50%;
    height: 20%;
    left: 20%;
}

#lateGraph{
    position: absolute;
    height:50%;

    left:0px;
}

#statsDiv{
    height: 230px;
}

#ads{
    position: absolute;
    background-color:rgb(78, 232, 109);
    right: 0px;
    width:20%;
    height: 110%;
    top:66px;
    word-wrap: break-word;
    overflow-y: hidden;
}
</style>