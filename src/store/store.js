import { reactive } from 'vue'

export const store = reactive({
    insights: {},
    latestTrain: {},
    earliestTrain: {},

    setInsights(insights) {
        this.insights = insights
    },
    setLatestTrain(latestTrain) {
        this.latestTrain = latestTrain
    },
    setEarliestTrain(earliestTrain) {
        this.earliestTrain = earliestTrain
    }
})