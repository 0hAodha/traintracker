import { createApp } from 'vue'
import App from './App.vue'

import OpenLayersMap from 'vue3-openlayers'
import 'vue3-openlayers/dist/vue3-openlayers.css'

import { LoadingPlugin } from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

const app = createApp(App);
app.use(OpenLayersMap)
app.use(LoadingPlugin)
app.mount('#app')