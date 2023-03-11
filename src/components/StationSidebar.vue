<template>
<div id="sidebarDiv">
    <div id="sidebarHeader">
        <img id="headerImage" src="../assets/station.png" alt="Station Icon">
        <div v-on:click="store.setDisplaySelectedStation(false)" id="xButton">X</div>
    </div>

    <div id="sidebarDiv">
        <h2>Station Code: {{ store.selectedStation["StationCode"][0] }}</h2>
        <p id="typeP">Type: {{ store.selectedStation["StationType"][0] }}</p>
        <p id="dateP">Station Position - Long: {{ store.selectedStation["StationLongitude"][0] }} Lat: {{ store.selectedStation["StationLatitude"][0] }}</p>
        <p id="directionP">Description: {{ store.selectedStation["StationDesc"][0] }}</p>
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