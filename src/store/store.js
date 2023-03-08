import { reactive } from 'vue'

export const store = reactive({
    insights: {},
    latestTrain: {},
    earliestTrain: {},
    orderedTrains: [],
    selectedDataMap: {},
    rawData: {},
    display: false,

    setInsights(insights) {
        this.insights = insights
    },

    setLatestTrain(latestTrain) {
        this.latestTrain = latestTrain
    },

    setEarliestTrain(earliestTrain) {
        this.earliestTrain = earliestTrain
    },

    setRawData(rawData) {
        this.rawData = rawData
    },

    setOrderedTrains(unorderedTrains) {
        // sort in ascending order
        unorderedTrains.sort((a, b) => {
            return a.time - b.time
        })
        this.orderedTrains = unorderedTrains
    },

    setSelectedDataMap(selectedDataMap) {
        this.selectedDataMap = selectedDataMap
    },
    
    setDisplay(bool) {
        this.display = bool
    }
})