<template>

  <Bar :data="chartData" :id="barChart" :options="chartOptions" />

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
          backgroundColor: 'rgba(255, 0, 0, 0.3)',
          hoverBackgroundColor: 'rgba(255, 0, 0, 0.8)',
          borderColor: 'rgb(255, 0, 0)', 
          borderWidth: 1,
          data: [store.insights["percentageLate"]] 
        },
        {
          label: 'Early/ontime', 
          backgroundColor: 'rgba(74, 220, 87, 0.3)',
          hoverBackgroundColor: 'rgba(74, 220, 87), 0.8)',
          borderColor: 'rgb(74, 220, 87)', 
          borderWidth: 1, 
          data: [store.insights["percentageNotLate"]] 
        }]
      },

      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      }

    }
  }
}
</script>


<style scoped>

div{
  width: 70%;
}


</style>