<template>
<div id="sidebarDiv">
    <div id="sidebarHeader">

        <div id = "imageDiv" v-if="getTrainType() === 'DART'">
          <img v-if="isTrainRunning() && isTrainLate()" src="../assets/red-train-tram-solid.png" class="headerImage" alt="Late DART Icon">
          <img v-else-if="isTrainRunning() && !isTrainLate()" src="../assets/green-train-tram-solid.png" class="headerImage" alt="On-Time DART Icon">
          <img v-else src="../assets/train-tram-solid.svg" class="headerImage" alt="Not Running DART Icon">
        </div>
        <div id = "imageDiv" v-else>
          <img v-if="isTrainRunning() && isTrainLate()" src="../assets/red-train-solid.png" class="headerImage" alt="Late Train Icon">
          <img v-else-if="isTrainRunning() && !isTrainLate()" src="../assets/green-train-solid.png" class="headerImage" alt="On-Time Train Icon">
          <img v-else src="../assets/train-solid.svg" class="headerImage" alt="Not Running Train Icon">
        </div>
        <div v-on:click="store.setDisplaySelectedTrain(false)" id="xButton">X</div>
    </div>

    <div id="sidebarDiv">
        <h2>Train Code: {{ store.selectedTrain["TrainCode"][0] }}</h2>
        <p id="typeP">Type: {{ store.selectedTrain["TrainType"][0] }}</p>
        <p id="dateP">Date: {{ store.selectedTrain["TrainDate"][0] }}</p>
        <p id="dateP">Status: {{ store.selectedTrain["TrainStatus"][0] }}</p>
        <p id="dateP">Train Position - Long: {{ store.selectedTrain["TrainLongitude"][0] }} Lat: {{ store.selectedTrain["TrainLatitude"][0] }}</p>
        <p id="directionP">Direction: {{ store.selectedTrain["Direction"][0] }}</p>
        <p id="messageP">Public Message: {{ store.selectedTrain["PublicMessage"][0] }}</p>
    </div>
</div>
</template>

<script>
import { store } from '../store/store'
export default {
    name: "TrainSidebar",

    data() {
        return {
            store
        }
    }, 

    methods: {
        // method to determine whether or not a selected train is late 
        isTrainLate() {
            // check if the train is running
            if (store.selectedTrain["TrainStatus"][0] == "R") {
                let publicMessage = store.selectedTrain["PublicMessage"][0];
                let startTimeStr = publicMessage.indexOf("(");

                // check if the train is late
                if (publicMessage[startTimeStr+1] != "-" && publicMessage[startTimeStr+1] != "0") {
                    return true;
                }
            }
            return false;
        },

        // method to determine whether or not a selected train is running
        isTrainRunning() {
            if (store.selectedTrain["TrainStatus"][0] == "R") {
                return true; 
            } 
            else {
                return false;
            }
        },

        // method that returns the type of train (either "Train" or "DART")
        getTrainType() {
            return store.selectedTrain["TrainType"][0];
        },
    }
}
</script>

<style scoped>
#sidebarHeader{
  position: relative;
  top:0%;
  height: 15%;
  width: 100%;
  overflow: hidden;
}

#sidebarDiv{
  position: absolute;
  height: 80%;
  width: 100%;
  color: rgb(0, 0, 0);
}


.headerImage{
  height: 100%;
  width: 40px;
  padding-top: 10px;
  
}

.imageDiv{
  display: flex;
  justify-content: center;
}

#xButton{
  font-size: 80%;
  font-family: Georgia;
  color: rgb(0, 0, 0);
  position: absolute;
  top:10px;
  right:10px;
}

#xButton:hover{
  color:red;
}
</style>
