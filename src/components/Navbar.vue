<template>
  <nav class="navbar navbar-expand-sm navbar-light bg-light">
  <div class="container-fluid">
    <router-link tag="a" style="text-decoration: none; color: black; font-weight: 100;" to="/" class="navbar-brand">
      <img src="https://cdn.discordapp.com/attachments/1017419092447207436/1063092138029625394/pixil-frame-0.png" alt="mascot" width="55" height="40" class="d-inline-block align-text-middle">
      <b>Irish Rail Tracker</b>
    </router-link>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link"><router-link to="/">Home</router-link></a>
        </li>
        <li class="nav-item">
          <a class="nav-link"><router-link to="/insights">Insights</router-link></a>
        </li>
        <li class="nav-item">
          <a v-if="!isLoggedIn" class="nav-link"><router-link to="/login">Login</router-link></a>
          <a v-if="isLoggedIn" class="nav-link"><router-link to="/account">Account Settings</router-link></a>
        </li>
        <li class="nav-item">
          <a v-if="isLoggedIn" id="logout" class="nav-link"><router-link style="text-decoration: none; color: black; font-weight: 100;" @click="logout" to="/" class="navlink">Logout</router-link></a>
          <a v-if="!isLoggedIn" class="nav-link"><router-link to="/signup">Sign Up</router-link></a>
        </li>
      </ul>
    </div>
  </div>
  </nav>
</template>

<script>
import app from "../api/firebase"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { store } from '../store/store'

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
        store.setLoginStatus(this.isLoggedIn)
        store.isWaitingForLoginStatus = false
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
.router-link-active{
  color: rgb(0, 0, 0);
  font-weight: 600;
  cursor: pointer;
}

a {
  text-decoration: none;
  color: black;
  font-weight: 100;
}
</style>