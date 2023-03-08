<template>
<div id= "sidebarDiv">
    <div id = "sidebarHeader">
        <img id = "headerImage" src="../assets/train-solid.svg" alt="Train Icon">
        <div v-on:click="store.setDisplay(false)" id="xButton">X</div>
    </div>

    <div id= "sidebarDiv">
        <h2>Train Code: {{ store.selectedDataMap["TrainCode"] }}</h2>
        <p id = "typeP">Type: {{ store.selectedDataMap["TrainType"] }}</p>
        <p id = "dateP">Date: {{ store.selectedDataMap["TrainDate"] }}</p>
        <p id = "dateP">Status: {{ store.selectedDataMap["TrainStatus"] }}</p>
        <p id = "dateP">Train Position - Long: {{ store.selectedDataMap["TrainLongitude"] }} Lat: {{ store.selectedDataMap["TrainLatitude"] }}</p>
        <p id = "directionP">Direction: {{ store.selectedDataMap["Direction"] }}</p>
        <p id = "messageP">Public Message: {{ store.selectedDataMap["PublicMessage"] }}</p>
    </div>
</div>
</template>

<script>
import {store} from '../store/store'
export default {
    name: "SidebarPanel",

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
}

#sidebarDiv{
  position: absolute;
  height: 80%;
  width: 100%;
  color: white;
}

#headerImage{
  height: 80%;
  width: auto;
  overflow: hidden;
  position: relative;
  top: 10px;
}

#xButton{
  font-size: 80%;
  font-family: Georgia;
  color: white;
  position: absolute;
  top:10px;
  right:10px;
}

#xButton:hover{
  color:red;
}

</style>
