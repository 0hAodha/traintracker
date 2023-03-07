<template>
<nav class="navbar navbar-light bg-light">
  <div class="container-fluid">
    <router-link to="/" class="navbar-brand">
      <img src="https://cdn.discordapp.com/attachments/1017419092447207436/1063092138029625394/pixil-frame-0.png" alt="mascot" width="55" height="40" class="d-inline-block align-text-middle">
      <b>Irish Rail Tracker</b>
    </router-link>
    
    <a class="navbarLink"><router-link to="/">Home</router-link></a>
    <a class="navbarLink"><router-link to="/insights">Insights</router-link></a>
    <a v-if="isLoggedIn" class="navbarLink"><router-link to="/secure">Secure</router-link></a>
    <a v-if="isLoggedIn" class="navbarLink"><router-link @click="logout" to="/">Logout</router-link></a>
    <a v-if="!isLoggedIn" class="navbarLink"><router-link to="/login">Login</router-link></a>
    <a v-if="!isLoggedIn" class="navbarLink"><router-link to="/signup">Sign Up</router-link></a>
  </div>
</nav>
</template>

<script>
import app from "../api/firebase"
import {getAuth, onAuthStateChanged, signOut} from "firebase/auth"

export default {
  name: "Navbar",

  data() {
    return {
      isLoggedIn: false
    }
  },

  created() {
    // check if user is logged in
    const auth = getAuth(app);
      onAuthStateChanged(auth, (user) => {
        user ? this.isLoggedIn = true : this.isLoggedIn = false
      })
  },

  methods: {
    logout() {
      signOut(getAuth(app)).then(() => {
          // send user back to home page
          this.$router.push("/")
      })
    }
  }
}
</script>

<style scoped>
.navbarLink{
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-size: 150%;
}
</style>