<template>
<Navbar />

<!-- Table to be shown on screen widths > 1000px -->
<table id="statsTable" class="hideMobile">
    <tr>
        <th colspan = "2" style="border-right: 1px solid;">Train Insights</th>
        <th colspan = "2">Station Insights</th>
    </tr>
    <tr>
        <td><div v-if="readyToRender"><pieChart :id="stationPie" :trainChart="true"/></div></td>
        <td style="border-right: 1px solid;">
            <div v-if="readyToRender" id="statsDiv">
                <BarChart id="lateGraph" /> 
            </div>
        </td>
        
        <td><div style="position:relative; left:30px;" v-if="readyToRender"><pieChart :id="stationPie" :trainChart="false"/></div></td>
        
    </tr>
    <tr>
        <td>
            <p>Total number of trains: {{ this.insights["totalNumTrains"] }}</p>
            <ul>
                <li><p>Trains: {{ this.insights["numTrains"] }}</p></li>
                <li><p>Darts: {{ this.insights["numDarts"] }}</p></li>
            </ul>
        </td>
        <td style="border-right: 1px solid;">
            <p>Number of actively running trains: {{ this.insights["numRunningTrains"] }}</p>
            <p>Percentage late: {{ this.insights["percentageLate"] }}%</p>
            <p>Percentage early or ontime: {{ this.insights["percentageNotLate"] }}%</p>
        </td>
        <td>
            <p>Total number of stations: {{ this.insights["totalNumStations"] }}</p>
            <ul>
                <li><p>Trains: {{ this.insights["numTrainStations"] }}</p></li>
                <li><p>Darts: {{ this.insights["numDartStations"] }}</p></li>
            </ul>
        </td>
    </tr>
</table>

<table id="statsTable" class="showMobile">
    <tr>
        <th colspan = "2" style="border-right: 1px solid;">Train Insights</th>
        <th colspan = "2">Station Insights</th>
    </tr>
    <tr>
        <td>
            <p>Total number of trains: {{ this.insights["totalNumTrains"] }}</p>
            <ul>
                <li><p>Trains: {{ this.insights["numTrains"] }}</p></li>
                <li><p>Darts: {{ this.insights["numDarts"] }}</p></li>
            </ul>
        </td>
        <td style="border-right: 1px solid;">
            <p>Number of actively running trains: {{ this.insights["numRunningTrains"] }}</p>
            <ul>
                <li><p>Percentage late: {{ this.insights["percentageLate"] }}%</p></li>
                <li><p>Percentage early or ontime: {{ this.insights["percentageNotLate"] }}%</p></li>
            </ul>
            
        </td>
        <td>
            <p>Total number of stations: {{ this.insights["totalNumStations"] }}</p>
            <ul>
                <li><p>Trains: {{ this.insights["numTrainStations"] }}</p></li>
                <li><p>Darts: {{ this.insights["numDartStations"] }}</p></li>
            </ul>
        </td>
    </tr>
</table>

<div id="leaderboardTitleDiv">
    <p>Leaderboard</p>
    <div id = "leaderboardToggle" class="form-check form-switch">
        <input class="form-check-input" type="checkbox" role="switch" v-model="showTopEarliestLatest"/>
        <label v-if="showTopEarliestLatest" class="form-check-label" for="showTopEarliestLatest">Showing All Trains</label>
        <label v-else class="form-check-label" for="showTopEarliestLatest">Showing Top & Bottom 3</label>
    </div>
</div>


<div id="leaderboard">
    <div v-if="!showTopEarliestLatest" v-for="train in topEarliestLatest" id="filteredLeaderboard">
        <div v-if="train.time > 0" id="leaderLate">
            <h2>{{ this.rawData[train.jsonIndex]["TrainCode"][0] }} - <span style="font-size:28px">Type: {{ this.rawData[train.jsonIndex]["TrainType"][0] }} | Heading {{ this.rawData[train.jsonIndex]["Direction"][0] }} </span></h2>
            <p>{{ train.time }} mins late</p>
            
        </div>
        <div v-else id="leaderEarly">
            <h2>{{ this.rawData[train.jsonIndex]["TrainCode"][0] }} - <span style="font-size:28px">Type: {{ this.rawData[train.jsonIndex]["TrainType"][0] }} | Heading {{ this.rawData[train.jsonIndex]["Direction"][0] }} </span></h2>
            <p>{{ train.time * -1}} mins early</p>
        </div>
    </div>
    <div v-else v-for="train in orderedTrains" id="fullLeaderBoard">
        <div> 
            <h2>{{ this.rawData[train.jsonIndex]["TrainCode"][0] }} - <span style="font-size:28px">Type: {{ this.rawData[train.jsonIndex]["TrainType"][0] }} | Heading {{ this.rawData[train.jsonIndex]["Direction"][0] }} </span></h2>
            <p v-if="train.time > 0">{{ train.time }} mins late</p>
            <p v-else>{{ train.time * -1}} mins early</p>
            
        </div>
        
    </div>

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


.showMobile{/*Hides table for screens smaller than 1000px*/
    display: none;
}

#trainPie, #stationPie{
    width: 40%;
    position: absolute;
}


#lateGraph {
    position: relative;
    height: 20%;
    width: 20%;
    left: 10px;
}


th{
    padding: 15px;
    text-align: center;
    font-size: 22px;
}

#statsTable{
    border: 1px solid;
    width: 80%;
    left: 10%;
    position: relative;
}

#leaderboard{
    width: 100%;
    text-align: center;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size: small;
}

#leaderboardToggle{
    position: relative;
    top: -40px;
    left: 20px;
}


#leaderboardTitleDiv div{
    width: 10%;
    top: -10px;
    left:47%;
}

#leaderboardTitleDiv p{
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    text-align: center;
    font-size: 50px;
    padding-top:10px;
    text-shadow: 2px 2px rgb(155, 155, 155);
}
#leaderEarly{
    color: rgb(129, 213, 3);
    text-align: center;
    width:100%;
    z-index: 1;
}

#leaderLate{
    color: #fc1919;
    text-align: center;
    width: 100%;
    z-index:2;
    
}

#filteredLeaderboard h2{
    text-shadow: 2px 1px rgb(110, 110, 110);
}

#fullLeaderBoard{
    text-align: center;
}

@media screen and (max-width: 1000px) {
    .hideMobile{
        display:none;
    }
    .showMobile{
        display:block;
    }

    #statsTable p{
        font-size: 12px;
        padding: 2px;
        text-align: center;
    }

    tr{
        border: 1px solid;
    }
    #statsTable{
        padding: 2px;
        border: 0px;
    }
}
</style>