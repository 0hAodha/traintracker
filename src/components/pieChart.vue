<template>
<div id="statsDiv">
    <div id="trainPie">
        <Pie :data="trainData" :options="chartOptions" />
    </div>
    <div id="stationPie">
        <Pie :data="stationData" :options="chartOptions" />
    </div>
</div>
</template>
  
<script lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { store } from '../store/store.js'
ChartJS.register(ArcElement, Tooltip, Legend)

export default {
    name: 'pieChart',

    components: { 
        Pie 
    },

    data() {
        return{
            trainData: {
                labels: ['Trains', 'Darts'],
                datasets: [{
                    backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
                    data: [store.insights["numTrains"], store.insights["numDarts"]]
                }]
            },
            
            stationData: {
                labels: ['Train Stations', 'Dart Stations'],
                datasets: [{
                    backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
                    data: [store.insights["numTrainStations"], store.insights["numDartStations"]]
                }]
            },

            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                radius: 80,
                hoverOffset: 0
            }
        }
    }
}
</script>

<style scoped>
</style>