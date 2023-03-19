import { reactive } from 'vue'

export const store = reactive({
    insights: {},
    latestTrain: {},
    earliestTrain: {},
    orderedTrains: [],
    selectedTrain: {},
    selectedStation: {},
    rawData: {},
    displaySelectedTrain: false,
    displayedSelectedStation: false,
    loggedIn: false,
    isWaitingForLoginStatus: true,

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

    setSelectedTrain(selectedTrain) {
        this.selectedTrain = selectedTrain
    },

    setSelectedStation(selectedStation) {
        this.selectedStation = selectedStation
    },
    
    setDisplaySelectedTrain(bool) {
        this.displaySelectedTrain = bool
    },

    setDisplaySelectedStation(bool) {
        this.displaySelectedStation = bool
    },

    setLoginStatus(bool) {
        this.loggedIn = bool
    }
})