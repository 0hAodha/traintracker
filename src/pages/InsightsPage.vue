<template>
<Navbar />

<!-- Table to be shown on screen widths > 1000px -->
<div class="card-group">
  <div class="card">
    <h4 style="text-align:center;">Train Insights</h4>
    <div v-if="readyToRender" class="piechart"><pieChart :id="stationPie" :trainChart="true"/></div>
    <div class="card-body">
      <h5 class="card-title">Train Data</h5>
      <p class="card-text">Total number of trains: {{ this.insights["totalNumTrains"] }}</p>
            <ul>
                <li><p class="card-stats">Trains: {{ this.insights["numTrains"] }}</p></li>
                <li><p class="card-stats">Darts: {{ this.insights["numDarts"] }}</p></li>
            </ul>
    </div>
  </div>
  <div class="card">
    <h4 style="text-align:center;">Station Insights</h4>
    <div v-if="readyToRender" class="piechart"><pieChart :id="stationPie" :trainChart="false"/></div>
    <div class="card-body">
      <h5 class="card-title">Station Data</h5>
      <p class="card-text">Total number of stations: {{ this.insights["totalNumStations"] }}</p>
            <ul>
                <li><p class="card-stats">Trains: {{ this.insights["numTrainStations"] }}</p></li>
                <li><p class="card-stats">Darts: {{ this.insights["numDartStations"] }}</p></li>
            </ul>     
    </div>
  </div>
  <div class="card">
    <h4 style="text-align:center;">Punctuality Insights</h4>
    <div v-if="readyToRender"><BarChart id="barChart"/></div>
    <div class="card-body">
      <h5 class="card-title">Punctuality Data</h5>
      <p class="card-text">Number of actively running trains: {{ this.insights["numRunningTrains"] }}</p>
            <ul>
                <li><p class="card-stats">Percentage late: {{ this.insights["percentageLate"] }}%</p></li>
                <li><p class="card-stats">Percentage early or ontime: {{ this.insights["percentageNotLate"] }}%</p></li>
            </ul>
    </div>
  </div>
</div>

<div id="leaderboardTitleDiv"><p>Leaderboard</p></div>
<table>
    <div style="left:3px; top:3px;" class="form-check form-switch">
        <input class="form-check-input" type="checkbox" role="switch" v-model="showTopEarliestLatest"/>
        <label class="form-check-label" for="showTopEarliestLatest">Show All Train Entries</label>
    </div>
      <thead>
        <tr>
          <th>Code</th>
          <th>Time</th>
          <th>Type</th>
          <th>Origin</th>
          <th>Destination</th>
        </tr>
    </thead>
      <tbody v-if="!showTopEarliestLatest" v-for="train in topEarliestLatest">
        <tr>
          <td>{{ this.rawData[train.jsonIndex]["TrainCode"][0] }}</td>
          <td v-if="train.time > 0"><span style="color: #fc1919;">{{ train.time }} mins late</span></td>
          <td v-else><span style="color: rgb(129, 213, 3);">{{ train.time * -1}} mins early</span></td>
          <td>{{ this.rawData[train.jsonIndex]["TrainType"][0] }}</td>
          <td>{{ getOrigin(this.rawData[train.jsonIndex]["PublicMessage"][0]) }}</td>
          <td>{{ getDestination(this.rawData[train.jsonIndex]["PublicMessage"][0]) }}</td>
        </tr>
      </tbody>

      <tbody v-else v-for="train in orderedTrains">
        <tr>
          <td>{{ this.rawData[train.jsonIndex]["TrainCode"][0] }}</td>
          <td v-if="train.time > 0"><span style="color: #fc1919;">{{ train.time }} mins late</span></td>
          <td v-else><span style="color: rgb(129, 213, 3);">{{ train.time * -1}} mins early</span></td>
          <td>{{ this.rawData[train.jsonIndex]["TrainType"][0] }}</td>
          <td>{{ getOrigin(this.rawData[train.jsonIndex]["PublicMessage"][0]) }}</td>
          <td>{{ getDestination(this.rawData[train.jsonIndex]["PublicMessage"][0]) }}</td>
        </tr>
      </tbody>
</table>
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

        getOrigin(publicMessage) {
            let startOrigin = publicMessage.indexOf("-") + 1
            let endOrigin = publicMessage.indexOf("to") - 1;
            return publicMessage.substring(startOrigin, endOrigin)
        },

        getDestination(publicMessage) {
            let endOrigin = publicMessage.indexOf("to") - 1;
            let startDestination = endOrigin + 4;
            let endDestination = publicMessage.indexOf("(") - 1;
            return publicMessage.substring(startDestination, endDestination);
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
.card-text, .card-stats {
    font-size: 17px;
}

.piechart {
    display: flex;
    justify-content: center;
    padding-bottom: 0;
    margin-bottom: 0;
    height: 53%
}

#barChart {
    position:relative;
    padding: 10px;
    width: 100%;
    top: 20px;
    height: 40%;
}

th {
    padding: 15px;
    text-align: center;
    font-size: 19px;
}


/* #leaderboardToggle{
    position: absolute;
    top: 70px;
    left: 35%;
} */

#leaderboardTitleDiv p {
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    text-align: center;
    font-size: 50px;
    padding-top:10px;
}


table {
  border-spacing: 1;
  border-collapse: collapse;
  background: white;
  border-radius: 6px;
  overflow: hidden;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  font-size: 19px;
}
*{
    position: relative;
}
td,th {
    padding-left: 8px;
}

thead tr {
    height: 60px;
    background: #ffed86;
    font-size: 16px;
}

tbody tr {
    height: 48px;
    border-bottom: 1px solid #e3f1d5;
    
    
}

tbody tr:last-child {
    border: 0;
    border-bottom: 2px solid #d5e0f1;
}

td, th{
    text-align: left;
}

td.l, th.l{
    text-align: right;
}

@media screen and (max-width: 820px){

    table{
        display:block;
    }

    table tr,td,th, *{
        display: block;
    }

    thead{
        display:none;
    }

    tbody tr {
        height: auto;
        padding: 8px 0;
    }

    tbody tr td{
        padding-left: 45%;
        margin-bottom: 12px;
    
    }

    tbody tr td:last-child{
        margin-bottom: 0;
        
    }

    tbody tr td:before{
        position: absolute;
        font-weight: 700;
        width: 40%;
        left: 10px;
        top: 0;
    }

    tbody tr td:nth-child(1):before {
          content: "Code";
    }
    tbody tr td:nth-child(2):before {
          content: "Time";
    }
    tbody tr td:nth-child(3):before {
          content: "Type";
    }
    tbody tr td:nth-child(4):before {
          content: "Origin";
    }
    tbody tr td:nth-child(5):before {
          content: "Destination";
    }
}
</style>