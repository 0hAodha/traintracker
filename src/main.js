import { createApp } from 'vue'
import App from './App.vue'

import OpenLayersMap from 'vue3-openlayers'
import 'vue3-openlayers/dist/vue3-openlayers.css'

import { LoadingPlugin } from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

import { createRouter, createWebHistory } from 'vue-router';
import routes from './router/routes';

let router = createRouter({
    history: createWebHistory(),
    routes: routes
})

const app = createApp(App);
app.use(router);
app.use(OpenLayersMap)
app.use(LoadingPlugin)
app.mount('#app')