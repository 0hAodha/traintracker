// Firebase imports
const functions = require("firebase-functions");
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
admin.initializeApp();

// external imports
const axios = require('axios');
const parseString = require('xml2js').parseString;

// function to fetch live train data from the Firestore database
exports.getLiveTrainData = functions.https.onRequest((request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Credentials', 'true');
  let jsonData = [];

  cors(request, response, () => {
    // fetch the "liveTrainData" collection
    admin.firestore().collection('liveTrainData').get().then((snapshot) => {
      if (snapshot.empty) {
        response.send({data: "Error fetching live train data from the database"});
        return;
      }
      // iterate through each of the collection's documents
      snapshot.forEach(doc => {
        jsonData.push(doc.data());
      });
      response.json({data: jsonData});
    })
  });
})

// function to fetch station data from the Firestore database
exports.getStationData = functions.https.onRequest((request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Credentials', 'true');
  let jsonData = [];

  cors(request, response, () => {
    // fetch the "stations" collection
    admin.firestore().collection('stations').get().then((snapshot) => {
      if (snapshot.empty) {
        response.send({data: "Error fetching station data from the database"})
        return;
      }
      // iterate through each of the collection's documents
      snapshot.forEach(doc => {
        jsonData.push(doc.data());
      });
      response.json({data: jsonData});
    })
  });
})

// function to populate the Firestore database with station data from Irish Rail
exports.postStationData = functions.https.onRequest((request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Credentials', 'true');

  cors(request, response, () => {
    axios.get('http://api.irishrail.ie/realtime/realtime.asmx/getAllStationsXML')
    .then((res) => {
      // XML to JSON
      parseString(res.data, function(err, result) {
        let jsonStr = JSON.stringify(result);
        let jsonObj = JSON.parse(jsonStr);
        let jsonData = jsonObj.ArrayOfObjStation.objStation;

        // batch delete all of the "stations" collection's documents
        var db = admin.firestore();
        admin.firestore().collection('stations').get().then((snapshot) => {
          var batchDelete = db.batch();
          snapshot.forEach(doc => {
            batchDelete.delete(doc.ref);
          });

          batchDelete.commit().then(function() {
            // batch write all station JSON objects to the "stations" collection
            var batchWrite = db.batch();

            jsonData.forEach((doc) => {
              // set the station's ID as the document ID
              var docID = db.collection('stations').doc(doc["StationCode"][0]);
              batchWrite.set(docID, doc);
            });

            batchWrite.commit().then(function () {
              response.send({data: "Successfully fetched and uploaded station data from Irish Rail"});
            });
          })
        })
      })
    })
  })
})

// function to populate the Firestore database with live train data from Irish Rail
exports.postLiveTrainData = functions.https.onRequest((request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Credentials', 'true');

  cors(request, response, () => {
    axios.get('http://api.irishrail.ie/realtime/realtime.asmx/getCurrentTrainsXML')
          .then((res) => {
            // XML to JSON
            parseString(res.data, function(err, result) {
              let jsonStr = JSON.stringify(result);
              let jsonObj = JSON.parse(jsonStr);
              let jsonData = jsonObj.ArrayOfObjTrainPositions.objTrainPositions;

              // batch delete all of the "liveTrainData" collections's documents
              var db = admin.firestore();
              admin.firestore().collection('liveTrainData').get().then((snapshot) => {
                  var batchDelete = db.batch();
                  snapshot.forEach(doc => {
                    batchDelete.delete(doc.ref);
                  });

                  batchDelete.commit().then(function() {
                    // batch write all train JSON objects to the "liveTrainData" collection
                    var batchWrite = db.batch();
                    
                    jsonData.forEach((doc) => {
                      // ignore trains with longitudes or latitudes equal zero
                      if (!(doc["TrainLongitude"] == 0 || doc["TrainLatitude"] == 0)) {
                        // set the train's code as the document ID
                        var docID = db.collection('liveTrainData').doc(doc["TrainCode"][0]);
                        batchWrite.set(docID, doc);
                      }
                    });

                    batchWrite.commit().then(function () {
                      response.send({data: "Successfully fetched and uploaded live train data from Irish Rail"});
                    });
                  })
              })
            })
          })
          .catch((error) => {;
            response.send({data: "Error fetching data from the IrishRail API"});
          })
  });
})