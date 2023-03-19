import { reactive } from 'vue'

export const store = reactive({
    // map and insights data
    insights: {},
    orderedTrains: [],
    selectedTrain: {},
    selectedStation: {},
    rawData: {},

    // side bar
    displaySelectedTrain: false,
    displayedSelectedStation: false,

    // login status
    loggedIn: false,
    isWaitingForLoginStatus: true,

    setInsights(insights) {
        this.insights = insights
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