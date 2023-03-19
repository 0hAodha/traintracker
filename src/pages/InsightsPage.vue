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
        <div v-if="readyToRender" id="trainTotalChart">
            <pieChart id="trainPie" />
        </div>
    </div>

    <hr>
    <p>Number of actively running trains: {{ this.insights["numRunningTrains"] }}</p>
    <p>Percentage late: {{ this.insights["percentageLate"] }}%</p>
    <p>Percentage early or ontime: {{ this.insights["percentageNotLate"] }}%</p>
    <div v-if="readyToRender" id="statsDiv">
        <BarChart id="lateGraph" /> 
    </div>

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
            <pieChart v-if="readyToRender" id="stationPie" />
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
import { store } from '../store/store'
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css'
import Navbar from '../components/Navbar.vue'
import BarChart from '../components/BarChart.vue'
import pieChart from '../components/pieChart.vue'
import app from '../api/firebase';

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

        let loader = this.$loading.show({
            loader: 'dots',
            container: this.$refs.container,
            canCancel: false
        });

        return {
            insights: {},
            rawData: {},
            orderedTrains: [],
            topEarliestLatest: [],
            showTopEarliestLatest: false,
            readyToRender: false,
            store,

            toastMessage: "",
            toastBackground: "",
            toast,
            loader
        }
    },

    components: {
      Navbar,
      pieChart,
      BarChart
    },

    created() {
        // check if no insight data exists
        if (!store.orderedTrains.length > 0) {
            let host = window.location.hostname
            if (host === '127.0.0.1' || host === 'localhost') {
                this.postTrainAndStationData();
            }  
            else {
                this.getTrainAndStationData();
            }
        }
        else {
            this.insights = store.insights
            this.rawData = store.rawData
            this.orderedTrains = store.orderedTrains
            this.topEarliestLatest = this.orderedTrains.slice(0, 3).concat(this.orderedTrains.slice(-3))
            this.loader.hide();
            this.readyToRender = true
        }
    },

    methods: {
        showToast(message, backgroundColour) {
          this.toastMessage = message
          this.toastBackground = backgroundColour
          this.toast()
        },

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
        },

        // condensed version
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

                    for (var i=0; i<response.data.length; i++) {
                        let train = response.data[i];
                        insights["totalNumTrains"] += 1
                        if (train["TrainType"][0] == "Train") insights["numTrains"] += 1;
                        else if (train["TrainType"][0] == "DART") insights["numDarts"] += 1;
                        
                        train["PublicMessage"][0] = train["PublicMessage"][0].replace(/\\n/g, ". ");
                        let publicMessage = train["PublicMessage"][0];

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
                    store.setRawData(response.data);
                    store.setOrderedTrains(unorderedTrains);
                    
                    const getStationData = httpsCallable(functions, 'getStationData');
                    getStationData().then((response) => {
                        if (!response.data) throw new Error("Error fetching station from the database");
                        for (var i=0; i<response.data.length; i++) {
                            let station = response.data[i];
                            insights["totalNumStations"] += 1
                            if (station["StationType"][0] == "DART") insights["numDartStations"] += 1;
                            else if (station["StationType"][0] == "Train") insights["numTrainStations"] += 1;
                        }

                        store.setInsights(insights);
                        this.insights = insights
                        this.rawData = store.rawData
                        this.orderedTrains = store.orderedTrains
                        this.topEarliestLatest = this.orderedTrains.slice(0, 3).concat(this.orderedTrains.slice(-3))
                        this.loader.hide();
                        this.readyToRender =  true
                    })
                }
                catch {
                    this.loader.hide()
                    this.showToast(error.message, "red")
                }
            })
            .catch((error) => {
              this.loader.hide()
              this.showToast("Error fetching live data", "red")
            })
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