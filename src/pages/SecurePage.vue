<template>
<Navbar />
<h1>Secure</h1>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import app from '../api/firebase'
import {getFunctions, httpsCallable, connectFunctionsEmulator} from "firebase/functions"
export default {
    name: "SecurePage",

    components: {
      Navbar,
    },

    created() {
        const functions = getFunctions(app)
        let host = window.location.hostname
        if (host === '127.0.0.1' || host === 'localhost') {
            connectFunctionsEmulator(functions, host, 5001);
        }
        const secureFunction = httpsCallable(functions, 'securefunction')
        secureFunction().then((response) => {
            console.log(response);
        })
    }
}
</script>

<style scoped>
</style>