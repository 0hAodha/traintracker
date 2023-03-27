// Firebase imports
const functions = require("firebase-functions");
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
admin.initializeApp();

// external imports
const axios = require('axios');
const parseString = require('xml2js').parseString;

/* --------------------- station functions --------------------- */

// function to fetch station data from the Firestore database
exports.getStationData = functions.https.onRequest((request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Credentials', 'true');
  let jsonData = [];

  cors(request, response, () => {
    // fetch the "stations" collection
    admin.firestore().collection('stations').get().then((snapshot) => {
      if (snapshot.empty) {
        functions.logger.log("Error fetching station data from Firestore")
        response.status(404).send({data: "Error fetching station data from Firestore"})
        return;
      }
      // iterate through each of the collection's documents
      snapshot.forEach(doc => {
        jsonData.push(doc.data());
      });
      functions.logger.log("Successfully fetched station data from Firestore")
      response.json({data: jsonData});
    })
  });
})

// function to populate the Firestore database with station data from Irish Rail
exports.postStationData = functions.https.onRequest((request, response) => {
  // helper functon to parse station JSON objects
  function parseJSON(result) {
    let jsonStr = JSON.stringify(result);
    let jsonObj = JSON.parse(jsonStr);
    let jsonData = jsonObj.ArrayOfObjStation.objStation;
    return jsonData;
  }

  // helper function to write to the database
  function batchWriteDB(request, response, db, jsonData, dartCodes, stationTypeCode) {
    if (!jsonData) return
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Credentials', 'true');

    cors(request, response, () => {
      var batchWrite = db.batch();
      jsonData.forEach((doc) => {
        // append if the dartCodes hashset is empty or the current station is not present, and ignoring positions of zero
        if ((dartCodes.size == 0 || !dartCodes.has(doc["StationCode"][0])) && !(doc["StationLongitude"] == 0 || doc["StationLatitude"] == 0)) {
          doc["StationType"] = [stationTypeCode]
          var docID = db.collection('stations').doc(doc["StationCode"][0])
          batchWrite.set(docID, doc);
        }
      })
      batchWrite.commit()
    })
  }

  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Credentials', 'true');
  cors(request, response, () => {
    // fetch dart stations
    axios.get('http://api.irishrail.ie/realtime/realtime.asmx/getAllStationsXML_WithStationType?StationType=D').then(res => {
      // XML to JSON
      parseString(res.data, function(err, result) {
        let jsonData = parseJSON(result)

        // batch delete all of the station collection's documents
        var db = admin.firestore()
        admin.firestore().collection('stations').get().then((snapshot) => {
          var batchDelete = db.batch()
          snapshot.forEach(doc => {
              batchDelete.delete(doc.ref)
          })

          batchDelete.commit().then(function() {
            // store all dart codes into a hashset
            // compare these with the station call with code "all" to avoid duplicates
            let dartCodes = new Set()
            batchWriteDB(request, response, db, jsonData, dartCodes, "DART")

            // populate the dartCodes hashset
            jsonData.forEach((doc) => {
                dartCodes.add(doc["StationCode"][0])
            })

            // fetch all stations
            axios.get('http://api.irishrail.ie/realtime/realtime.asmx/getAllStationsXML_WithStationType?StationType=A').then(res => {
              parseString(res.data, function(err, result) {
                let jsonData = parseJSON(result)
                batchWriteDB(request, response, db, jsonData, dartCodes, "Train")
                functions.logger.log("Successfully fetched and upload station data from Irish Rail")
                response.send({data: "Successfully fetched and upload station data from Irish Rail"})
              })
            })
          })
        })
      })
    })
  })
})

// scheduled version
exports.scheduledPostStationData = functions.pubsub.schedule("every day 00:00").onRun(async (context) => {
  // helper functon to parse station JSON objects
  function parseJSON(result) {
    let jsonStr = JSON.stringify(result);
    let jsonObj = JSON.parse(jsonStr);
    let jsonData = jsonObj.ArrayOfObjStation.objStation;
    return jsonData;
  }

  // helper function to write to the database
  function batchWriteDB(db, jsonData, dartCodes, stationTypeCode) {
    if (!jsonData) return
    var batchWrite = db.batch();
    jsonData.forEach((doc) => {
      // append if the dartCodes hashset is empty or the current station is not present, and ignoring positions of zero
      if ((dartCodes.size == 0 || !dartCodes.has(doc["StationCode"][0])) && !(doc["StationLongitude"] == 0 || doc["StationLatitude"] == 0)) {
        doc["StationType"] = [stationTypeCode]
        var docID = db.collection('stations').doc(doc["StationCode"][0])
        batchWrite.set(docID, doc);
      }
    });
    batchWrite.commit()
  }

  // fetch dart stations
  return axios.get('http://api.irishrail.ie/realtime/realtime.asmx/getAllStationsXML_WithStationType?StationType=D').then(res => {
    // XML to JSON
    parseString(res.data, function(err, result) {
      let jsonData = parseJSON(result)

      // batch delete all of the station collection's documents
      var db = admin.firestore();
      admin.firestore().collection('stations').get().then((snapshot) => {
        var batchDelete = db.batch();
        snapshot.forEach(doc => {
          batchDelete.delete(doc.ref);
        });

        batchDelete.commit().then(function() {
          // store all dart codes into a hashset
          // compare these with the station call with code "all" to avoid duplicates
          let dartCodes = new Set()
          batchWriteDB(db, jsonData, dartCodes, "DART");

          // populate the dartCodes hashset
          jsonData.forEach((doc) => {
            dartCodes.add(doc["StationCode"][0])
          })

          // fetch all train stations
          axios.get('http://api.irishrail.ie/realtime/realtime.asmx/getAllStationsXML_WithStationType?StationType=A').then(res => {
            parseString(res.data, function(err, result) {
              let jsonData = parseJSON(result)
              batchWriteDB(db, jsonData, dartCodes, "Train")
              functions.logger.log("Successfully fetched and upload station data from Irish Rail on a schedule")
              return "Successfully fetched and upload station data from Irish Rail on a schedule"
            })
          })
        })
      })
    })
  })
})

/* --------------------- train functions --------------------- */

// function to fetch live train data from the Firestore database
exports.getLiveTrainData = functions.https.onRequest((request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Credentials', 'true');
  let jsonData = [];

  cors(request, response, () => {
    // fetch the "liveTrainData" collection
    admin.firestore().collection('liveTrainData').get().then((snapshot) => {
      if (snapshot.empty) {
        functions.logger.log("Error fetching live train data from Firestore")
        response.status(404).send({data: "Successfully fetched live train data from Firestore"});
        return;
      }
      // iterate through each of the collection's documents
      snapshot.forEach(doc => {
        jsonData.push(doc.data());
      });
      functions.logger.log("Successfully fetched live train data from Firestore")
      response.json({data: jsonData});
    })
  });
})

// function to populate the Firestore database with live train data from Irish Rail
exports.postLiveTrainData = functions.https.onRequest((request, response) => {
  // helper function to parse train JSON objects
  function parseJSON(result) {
    let jsonStr = JSON.stringify(result);
    let jsonObj = JSON.parse(jsonStr);
    let jsonData = jsonObj.ArrayOfObjTrainPositions.objTrainPositions;
    return jsonData;
  }
  
  // helper function to write to the database
  function batchWriteDB(request, response, db, jsonData, trainTypeCode) {
    if (!jsonData) return
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Credentials', 'true');

    cors(request, response, () => {
      var batchWrite = db.batch();
      jsonData.forEach((doc) => {
        // ignore trains with longitudes or latitudes equal zero
        if (!(doc["TrainLongitude"] == 0 || doc["TrainLatitude"] == 0)) {
          doc["TrainType"] = [trainTypeCode]
          var docID = db.collection('liveTrainData').doc(doc["TrainCode"][0]);
          batchWrite.set(docID, doc);
        }
      });
      batchWrite.commit()
    })
  }

  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Credentials', 'true');
  cors(request, response, () => {
    // fetch mainland trains
    axios.get('https://api.irishrail.ie/realtime/realtime.asmx/getCurrentTrainsXML_WithTrainType?TrainType=M').then(res => {
      // XML to JSON
      parseString(res.data, function(err, result) {
        let jsonData = parseJSON(result)

        // batch delete all of the liveTrainData collections's documents
        var db = admin.firestore();
        admin.firestore().collection('liveTrainData').get().then((snapshot) => {
          var batchDelete = db.batch();
          snapshot.forEach(doc => {
            batchDelete.delete(doc.ref);
          });

          batchDelete.commit().then(function() {
            // batch write all train JSON objects to the liveTrainData collection
            batchWriteDB(request, response, db, jsonData, "Train");
            
            // fetch suburban trains
            axios.get('https://api.irishrail.ie/realtime/realtime.asmx/getCurrentTrainsXML_WithTrainType?TrainType=S').then(res => {
              parseString(res.data, function(err, result) {
                let jsonData = parseJSON(result)
                batchWriteDB(request, response, db, jsonData, "Train");

                // fetch dart trains
                axios.get('https://api.irishrail.ie/realtime/realtime.asmx/getCurrentTrainsXML_WithTrainType?TrainType=D').then(res => {
                  parseString(res.data, function(err, result) {
                    let jsonData = parseJSON(result)
                    batchWriteDB(request, response, db, jsonData, "DART");
                    functions.logger.log("Successfully fetched and uploaded live train data from Irish Rail")
                    response.send({data: "Successfully fetched and uploaded live train data from Irish Rail"});
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})

// scheduled version
exports.scheduledPostLiveTrainData = functions.pubsub.schedule('every 10 minutes').onRun(async (context) => {
  // helper function to parse train JSON objects
  function parseJSON(result) {
    let jsonStr = JSON.stringify(result);
    let jsonObj = JSON.parse(jsonStr);
    let jsonData = jsonObj.ArrayOfObjTrainPositions.objTrainPositions;
    return jsonData;
  }

  // helper function to write to the database
  function batchWriteDB(db, jsonData, trainTypeCode) {
    if (!jsonData) return
    var batchWrite = db.batch();
    jsonData.forEach((doc) => {
      // ignore trains with longitudes or latitudes equal zero
      if (!(doc["TrainLongitude"] == 0 || doc["TrainLatitude"] == 0)) {
        doc["TrainType"] = [trainTypeCode]
        var docID = db.collection('liveTrainData').doc(doc["TrainCode"][0]);
        batchWrite.set(docID, doc);
      }
    });
    batchWrite.commit()
  }

  // fetch mainland stations
  return axios.get('https://api.irishrail.ie/realtime/realtime.asmx/getCurrentTrainsXML_WithTrainType?TrainType=M').then(res => {
    // XML to JSON
    parseString(res.data, function(err, result) {
      let jsonData = parseJSON(result)

      // batch delete all of the liveTrainData collections's documents
      var db = admin.firestore();
      admin.firestore().collection('liveTrainData').get().then((snapshot) => {
        var batchDelete = db.batch();
        snapshot.forEach(doc => {
          batchDelete.delete(doc.ref);
        });

        batchDelete.commit().then(function() {
          // batch write all train JSON objects to the liveTrainData collection
          batchWriteDB(db, jsonData, "Train");

          // fetch suburban trains
          axios.get('https://api.irishrail.ie/realtime/realtime.asmx/getCurrentTrainsXML_WithTrainType?TrainType=S').then(res => {
            parseString(res.data, function(err, result) {
              let jsonData = parseJSON(result)
              batchWriteDB(db, jsonData, "Train");

              // fetch DARTs
              axios.get('https://api.irishrail.ie/realtime/realtime.asmx/getCurrentTrainsXML_WithTrainType?TrainType=D').then(res => {
                parseString(res.data, function(err, result) {
                  let jsonData = parseJSON(result)
                  batchWriteDB(db, jsonData, "DART");
                  functions.logger.log("Successfully fetched and uploaded live train data from Irish Rail on a schedule")
                  return "Successfully fetched and uploaded live train data from Irish Rail on a schedule"
                })
              })
            })
          })
        })
      })
    })
  })
})

/* --------------------- preferences functions --------------------- */

// secure function to fetch a user's filter preferences from the database
exports.getPreferences = functions.https.onCall((data, context) => {
  if (!context.auth) return "Error request is not verified"
  return admin.firestore().collection('preferences').doc(context.auth.uid).get().then((preferences) => {
    functions.logger.log("Successfully fetched user preferences from Firestore")
    return preferences.data()
  })
}) 

// secure function to set a user's filter preferences in the database
exports.postPreferences = functions.https.onCall((data, context) => {
  if (!context.auth) return "Error request is not verified"
  return admin.firestore().collection('preferences').doc(context.auth.uid).set({data}).then(() => {
    functions.logger.log("Successfully saved user preferences into Firestore")
    return "Successfully saved user preferences into Firestore"
  })
})

// secure function to delete a user's filter preferences from the database
exports.deletePreferences = functions.https.onCall((data, context) => {
  if (!context.auth) return "Error request is not verified"
  return admin.firestore().collection('preferences').doc(context.auth.uid).delete().then(() => {
    functions.logger.log("Successfully deleted user preferences from Firestore")
    return "Successfully deleted user preferences from Firestore"
  })
})