<template>
<div id="statsDiv">
    <div id="lateGraph">
        <Bar
        id="my-chart-id"
        :options="chartOptions"
        :data="chartData"
        />
    </div>
</div>
</template>
  
<script scoped>
import { Bar } from 'vue-chartjs'
import { store } from '../store/store'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  data() {
    return {
      chartData: {
        labels: ['Punctuality Percentage'],
        datasets: [{ 
          label: 'Late', 
          backgroundColor: '#FF0000', 
          data: [store.insights["percentageLate"]] 
        },
        {
          label: 'Early/ontime', 
          backgroundColor: '#4ADC57', 
          data: [store.insights["percentageNotLate"]] 
        }]
      },
      chartOptions: {
        responsive: true
      }
    }
  }
}
</script>

<style scoped>
#lateGraph{
    position: relative;
    height:48%;
    left:0px;
}
</style>