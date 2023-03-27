<template>
  <div id="sidebarDiv">
    <div v-on:click="store.setDisplaySelectedTrain(false)" id="xButton">X</div>
    <h2 style="padding: 10px;">Train Code: {{ store.selectedTrain["TrainCode"][0] }}</h2>
      <div id="sidebarHeader">
        <p id="originDiv">Origin:<br> {{ getOrigin(store.selectedTrain["PublicMessage"][0]) }}</p>
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
          <p id="destinationDiv">Destination:<br> {{ getDestination(store.selectedTrain["PublicMessage"][0]) }}</p>
      </div>
  
      <div id="sidebarDiv">
        <div id="typeDiv">
          <div id="typeIcon">
            <img id="typeImage" src = "src\assets\trainTypeIcon.png">
          </div>
          <p id="typeP"><span style="color:grey; font-size: 14px;">Type:</span><br>{{ store.selectedTrain["TrainType"][0] }}</p>
        </div>

        <div id="dateDiv">
          <div id="dateIcon">
            <img id="dateImage" src = "src\assets\dateIcon.png">
          </div>
          <p id="dateP"><span style="color:grey; font-size: 14px;">Date:</span><br>{{ store.selectedTrain["TrainDate"][0] }}</p>
        </div>
        
        <div id="positionDiv">
          <div id="positionIcon">
            <img id="positionImage" src = "src\assets\locationIcon.png">
          </div>
          <div id="positionParagraphDiv">
            <p id="longP"><span style="color:grey; font-size: 14px;">Longitude:</span><br>{{ store.selectedTrain["TrainLongitude"][0] }}</p>
            <p id="latP"><span style="color:grey; font-size: 14px;">Latitude:</span><br>{{ store.selectedTrain["TrainLatitude"][0] }}</p>
          </div>
        </div>

        <div id="directionDiv">
          <div id="directionIcon">
            <img id="directionImage" src="src\assets\directionIcon.png">
          </div>
          <p id="directionP"><span style="color:grey; font-size: 14px;">Direction:</span><br>{{ store.selectedTrain["Direction"][0] }}</p>
        </div>

        <div id="publicMessageDiv">
          <div id="publicMessageIcon">
            <img id="publicMessageImage" src="src\assets\publicMessageIcon.png">
          </div>
          <p id="publicMessageP"><span style="color:grey; font-size: 14px;">Public Message:</span><br>Public Message: {{ store.selectedTrain["PublicMessage"][0] }}</p>
        </div>
        <!--<p id="messageP">Public Message: {{ store.selectedTrain["PublicMessage"][0] }}</p> -->
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

        getOrigin(publicMessage) {
            let startOrigin = publicMessage.indexOf("-") + 1
            let endOrigin = publicMessage.indexOf("to ") - 1;
            return publicMessage.substring(startOrigin, endOrigin);
        },

        getDestination(publicMessage) {
            let endOrigin = publicMessage.indexOf("to ");
            let startDestination = endOrigin + 3;
            let endDestination = publicMessage.indexOf("(") - 1;
            return publicMessage.substring(startDestination, endDestination);
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
  display: flex;
  justify-content: center; 
  background-color: rgb(214, 214, 214);
  box-shadow: 0 0 5px 2px rgb(190, 190, 190);
}
#sidebarDiv{
  position: absolute;
  height: 80%;
  width: 100%;
  color: rgb(0, 0, 0);
  padding-top: 10px;
}
.headerImage{
  height: 100%;
  width: 100%;
  padding: 10px;
}
#imageDiv{
  background-color: rgb(230, 230, 230);
  border-radius: 50%;
  order:1;
}

#xButton{
  font-size: 16px;
  font-family: Georgia;
  color: rgb(0, 0, 0);
  position: absolute;
  top:10px;
  right:10px;
  z-index: 5;
}
#xButton:hover{
  color:red;
}

#originDiv, #destinationDiv{
  position: relative;
  width: 40%;
  font-size: 18px;
  align-self: center;
  padding-top: 3%;
}
#originDiv{
  order:0;
}

#destinationDiv{
  order:2;
}


/* Sidebar Section Divs */

#typeDiv, #dateDiv, #positionDiv, #directionDiv, #publicMessageDiv{
  background-color: rgb(230, 230, 230);
  height: 12%;
  position: absolute;
  right:0px;
  width:100%;
}

#typeIcon, #dateIcon, #positionIcon, #directionIcon, #publicMessageIcon{
  background-color: rgb(214, 214, 214);
  width:20%;
  height: 100%;
  position: absolute;
  left:0px;
  display: flex;
  justify-content: center;
}

#publicMessageIcon{
  align-items: center;
}

#typeP, #dateP, #longP, #latP, #directionP, #publicMessageP{
  font-size: 16px;
  position: relative;
  bottom: 2px;
  width: 40%;
  left: 22%;
  text-align: left;
}

#positionParagraphDiv{
  display: flex;
}

#latP{
  left: 3%;
}

#publicMessageP{
  width: 78%;
}

/*Different Icons CSS*/
#typeImage{
  width: 70%;
}
#dateImage, #positionImage, #directionImage{
  padding-top: 2px; 
  padding-bottom: 2px;
}

#publicMessageImage{
  height: 40%;
  position: relative;
  top:-10px;
}

/*Positioning rows*/
#dateDiv{top: 60px;}
#positionDiv{top: 110px;}
#directionDiv{top: 160px;}
#publicMessageDiv{
  top:210px;
  height: 40%;
}



@media screen and (max-width: 850px) {
  .headerImage{
  height: 100%;
  width: 100%;
  padding: 10px;
  }

}
</style>
