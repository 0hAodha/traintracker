<template>
    <div id = "statsDiv">
    <div id = "trainPie">
        <Pie 
            :data="chartData" 
            :options="chartOptions" 
        />
    </div>
    </div>
</template>
  
<script lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import {store} from '../store/store.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
name: 'pieChart',
components: { Pie },
data() {
    return{
        chartData:{
            labels: ['Mainland', 'Suburban', 'Darts'],
            datasets: [{
                backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
                data: [store.insights["numMainland"], store.insights["numSuburban"], store.insights["numDart"]]
            }]
        },
        chartOptions:{
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