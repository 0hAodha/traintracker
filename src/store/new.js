import { reactive } from 'vue'
import { fromLonLat } from 'ol/proj.js';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import app from '../api/firebase';

export const store = reactive({
    // map and insights data
    insights: {},
    latestTrain: {},
    earliestTrain: {},
    orderedTrains: [],
    selectedTrain: {},
    selectedStation: {},
    allTrainsJSON: {},

    // side bar
    displaySelectedTrain: false,
    displayedSelectedStation: false,

    // login status
    loggedIn: false,
    isWaitingForLoginStatus: true,

    setOrderedTrains(unorderedTrains) {
        // sort in ascending order
        unorderedTrains.sort((a, b) => {
            return a.time - b.time
        })
        this.orderedTrains = unorderedTrains
    },

    // method to populate the database for local testing
    postTrainAndStationData(host) {
        const functions = getFunctions(app);
        if (host === '127.0.0.1' || host === 'localhost') {
            connectFunctionsEmulator(functions, host, 5001);
        }

        const postTrainData = httpsCallable(functions, 'postLiveTrainData');
        postTrainData().then(() => {
            const postStationData = httpsCallable(functions, 'postStationData');
            postStationData().then(() => {
            this.getTrainAndStationData(host)
            })
        })
        .catch((error) => {
            console.log(error.message)
            //this.showToast(error.message, "red")
        })
    },

    // method to fetch live train  and station data from Firestore
    getTrainAndStationData(host) {
        const functions = getFunctions(app);
        if (host === '127.0.0.1' || host == 'localhost') {
            connectFunctionsEmulator(functions, host, 5001);
        }
        const getTrainData = httpsCallable(functions, 'getLiveTrainData');
        getTrainData().then((response) => {
            try {
                if (!response.data) throw new Error("Error fetching live train data from the database")
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

                var unorderedTrains = [];
                var currentMessages = [];
                var latest = null;
                var earliest = null;
                var currLatestTime = null;
                var currEarliestTime = null;

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
                            if (!latest) latest = train;

                            // check for a new latest train
                            if (num > currLatestTime) {
                                latest = train;
                                currLatestTime = num;
                            }
                        }
                        // train is early or ontime
                        else {
                            if (!earliest) earliest = train;
                            // check for a new earliest train (early trains are -x mins late)
                            if (num < currEarliestTime) {
                                earliest = train;
                                currEarliestTime = num;
                            }
                        }
                    }
                }

                // assign results after looping through JSON
                insights["percentageLate"] = ((insights["numLateRunningTrains"] / insights["numRunningTrains"]) * 100).toFixed(2);
                insights["percentageNotLate"] = (100 - insights["percentageLate"]).toFixed(2);
                insights["latestTime"] = currLatestTime;
                insights["earliestTime"] = currEarliestTime;
                this.publicMessages = currentMessages;

                // assign the results to the Vue Store
                store.setEarliestTrain(earliest);
                store.setLatestTrain(latest);
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
                        store.setInsights(insights);
                        loader.hide();
                        // request the user's preferences
                        this.getPreferences()
                    }
                })

            }
            catch (error) {
                //loader.hide()
                //this.showToast(error.message, "red")
            }
        })
        .catch((error) => {
            //loader.hide()
            //this.showToast("Error fetching live data", "red")
          })
    }
})