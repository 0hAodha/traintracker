<template>
<div id="sidebarDiv">
    <div v-on:click="store.setDisplaySelectedStation(false)" id="xButton">X</div>
    <h2>Station Code: {{ store.selectedStation["StationCode"][0] }}</h2>
    <div id="sidebarHeader">
        <img id="headerImage" src="../assets/station.png" alt="Station Icon">
    </div>

    <div id="sidebarDiv">
        <div id="typeDiv">
          <div id="typeIcon">
            <img id="typeImage" src = "../assets/trainTypeIcon.png">
          </div>
            <p id="typeP"><span style="color:grey; font-size: 14px;">Station Type:</span><br>{{ store.selectedStation["StationType"][0] }}</p>
        </div>

        <div id="positionDiv">
          <div id="positionIcon">
            <img id="positionImage" src = "../assets/locationIcon.png">
          </div>
          <div id="positionParagraphDiv">
            <p id="longP"><span style="color:grey; font-size: 14px;">Longitude:</span><br>{{ store.selectedStation["StationLongitude"][0] }}</p>
            <p id="latP"><span style="color:grey; font-size: 14px;">Latitude:</span><br>{{ store.selectedStation["StationLatitude"][0] }}</p>
          </div>
        </div>
        
        <div id="descriptionDiv">
          <div id="descriptionIcon">
            <img id="descriptionImage" src="../assets/descriptionIcon.png">
          </div>
          <p id="descriptionP"><span style="color:grey; font-size: 14px;">Description:</span><br>{{ store.selectedStation["StationDesc"][0] }}</p>
        </div>
        
    </div>
</div>
</template>

<script>
import { store } from '../store/store'
export default {
    name: "StationSidebar",

    data() {
        return {
            store
        }
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

#typeDiv, #positionDiv, #descriptionDiv{
  background-color: rgb(230, 230, 230);
  height: 12%;
  position: absolute;
  right:0px;
  width:100%;
}

#typeIcon, #positionIcon, #descriptionIcon{
  background-color: rgb(214, 214, 214);
  width:20%;
  height: 100%;
  position: absolute;
  left:0px;
  display: flex;
  justify-content: center;
}

#positionImage, #descriptionImage{
  padding-top: 2px; 
  padding-bottom: 2px;
}

#typeP, #longP, #latP, #descriptionP{
  font-size: 16px;
  position: relative;
  bottom: 3px;
  width: 40%;
  left: 22%;
  text-align: left;
}

#positionParagraphDiv{display: flex;}

#latP{left: 3%;}

#typeImage{width: 70%;}

#positionDiv{top: 16%;}
#descriptionDiv{top: 29.5%;}

@media screen and (max-width: 850px) {
  .headerImage{
  height: 100%;
  width: 100%;
  padding: 10px;
  }

  #typeImage{
  width: 50%;
  }

}
</style>