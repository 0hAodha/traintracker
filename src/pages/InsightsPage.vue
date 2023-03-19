<template>
<Navbar />
<div v-if="this.insights" id="insightDiv">
    <h1 style="padding-left: 10px;">Train Insights</h1>
    <div id="trainTotal">
        <div id="trainTotalText">
            <p>Total number of trains: {{ this.insights["totalNumTrains"] }}</p>
            <ul>
                <li><p>Trains: {{ this.insights["numTrains"] }}</p></li>
                <li><p>Darts: {{ this.insights["numDarts"] }}</p></li>
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
    <div id="statsDiv">
        <BarChart id="lateGraph" /> 
    </div>

    <p v-if="this.latestTrain['TrainCode']">Latest train: {{ this.latestTrain["TrainCode"][0] }}, {{ this.insights["latestTime"] }} mins late</p>
    <p v-if="this.earliestTrain['TrainCode']">Earliest train: {{ this.earliestTrain["TrainCode"][0] }}, {{ this.insights["earliestTime"] * -1 }} mins early</p>

    <h1 style="padding-left: 10px;">Station Insights</h1>
    <div id="stationTotal">
        <div id="stationTotalText">
            <p>Total number of stations: {{ this.insights["totalNumStations"] }}</p>
            <ul>
                <li><p>Trains: {{ this.insights["numTrainStations"] }}</p></li>
                <li><p>Darts: {{ this.insights["numDartStations"] }}</p></li>
            </ul>
        </div>
        <div id="stationTotalChart">
            <pieChart id="stationPie" />
        </div>
    </div>
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
<div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" role="switch" v-model="showTopEarliestLatest"/>
    <label class="form-check-label" for="showTopEarliestLatest">Show top three earliest and latest</label>
</div>

<div v-if="!showTopEarliestLatest" v-for="train in orderedTrains">
    <h2>{{ this.rawData[train.jsonIndex]["TrainCode"][0] }}</h2>
    <p v-if="train.time > 0">{{ train.time }} mins late</p>
    <p v-else>{{ train.time * -1}} mins early</p>
</div>

<div v-else v-for="train in topEarliestLatest">
    <h2>{{ this.rawData[train.jsonIndex]["TrainCode"][0] }}</h2>
    <p v-if="train.time > 0">{{ train.time }} mins late</p>
    <p v-else>{{ train.time * -1}} mins early</p>
</div>
</template>
    
<script>
import {store} from '../store/store'
import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css'
import Navbar from '../components/Navbar.vue'
import BarChart from '../components/BarChart.vue'
import pieChart from '../components/pieChart.vue'
export default {
    name: "InsightsPage",

    data() {
        const toast = () => {
            createToast(this.toastMessage, {
                hideProgressBar: true,
                timeout: 4000,
                toastBackgroundColor: this.toastBackground
            })
        }

        return {
            insights: {},
            latestTrain: {},
            earliestTrain: {},
            rawData: {},
            orderedTrains: [],
            topEarliestLatest: [],
            showTopEarliestLatest: false,
            store,

            toastMessage: "",
            toastBackground: "",
            toast
        }
    },

    components: {
      Navbar,
      pieChart,
      BarChart
    },

    created() {
        if (!store.orderedTrains.length > 0) {
            this.showToast("Error fetching live data", "red")
        }
        else {
            this.insights = store.insights
            this.latestTrain = store.latestTrain
            this.earliestTrain = store.earliestTrain
            this.rawData = store.rawData
            this.orderedTrains = store.orderedTrains
            this.topEarliestLatest = this.orderedTrains.slice(0, 3).concat(this.orderedTrains.slice(-3))
        }
    },

    methods: {
        showToast(message, backgroundColour) {
          this.toastMessage = message
          this.toastBackground = backgroundColour
          this.toast()
        }
    }
}
</script>
    
<style scoped>
#insightDiv {
    color: black;
    padding-left: 10px;
    width:80%;
    background-color: rgb(250, 235, 215);
}

#trainTotal, #stationTotal {
    height: 280px;

}
#trainTotalText, #stationTotalText {
    position: relative;
    width: 30%;
    height: 100%;
    right:0px;
}

#trainTotalChart, #stationTotalChart {
    position: absolute;
    top:114px;
    width: 50%;
    height: 20%;
    left: 20%;
}

#lateGraph {
    position: absolute;
    height:50%;
    left:0px;
}

#statsDiv {
    height: 230px;
}

#ads {
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