<template>
<Navbar />
<div id="background">
  <div class="loginbox">
    <img src="https://cdn.discordapp.com/attachments/1017419092447207436/1063092138029625394/pixil-frame-0.png" class="avatar">
    <h1>Sign Up</h1>
    <p>Email Address</p>
    <input type="email" v-model="email" aria-describedby="emailHelp" placeholder="Enter email">
    <p>Password (6+ characters)</p>
    <div id="imgDiv">
        <img v-if="showPassword" id="eyeImg" src="../assets/314858_hidden_eye_icon.png" @click="this.showPassword = !this.showPassword" alt="show">
        <img v-else id = "eyeImg" src="../assets/315220_eye_icon.png" @click="this.showPassword = !this.showPassword">
      </div>
    <input v-if="showPassword" type="text" v-model="password" placeholder="Enter password">
    <input v-else type="password" v-model="password" placeholder="Enter password">
    <input @click="signup" type="submit" name="" value="Sign Up">
    <a><router-link to="/login">Already have an account?</router-link></a>
  </div>
</div>
</template>

<script>
import app from '../api/firebase';
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth"
import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css'
import Navbar from '../components/Navbar.vue'

export default {
  name: "SignupPage",

  data() {
    const toast = () => {
        createToast(this.toastMessage, {
            hideProgressBar: true,
            timeout: 4000,
            toastBackgroundColor: this.toastBackground
        })
    }

    return {
      email: "",
      password: "",
      toastMessage: "",
      toastBackground: "",
      showPassword: false,
      toast
    }
  },

  components: {
    Navbar
  },

  methods: {
    showToast(message, backgroundColour) {
        this.toastMessage = message
        this.toastBackground = backgroundColour
        this.toast()
    },

    signup() {
      if (!this.email || !this.password) {
        this.showToast("Missing credentials", "red")
        return
      }

      if (this.password.length < 6) {
        this.showToast("Password must be 6 or more characters", "red")
        return
      }

      const auth = getAuth(app)
      createUserWithEmailAndPassword(auth, this.email, this.password).then(() => {
          this.showToast("Signed up successfully", "green")
          this.$router.push({path:'/'})
      })
      .catch((error) => {
        if (error.message.includes("already")) {
          this.showToast("Email already in use", "red")
        }
        else if (error.message.includes("email")) {
          this.showToast("Invalid email", "red")
        }
        else {
          this.showToast(error.message, "red")
        }
      })
    }
  }
}
</script>

<style scoped>
#background {
  margin: 0;
  padding: 0;
  width:100%;
  height: 100%;
  position: absolute;
  background-color: #e0e0e0;
  font-family: sans-serif;
}

.loginbox {
  height: 420px;
  width: 320px;
  background: #000;
  color: #fff;
  top: 50%;
  left:50%;
  position: absolute;
  transform: translate(-50%,-50%);
  box-sizing: border-box;
  padding: 70px 30px;
}

#imgDiv{
  height:10%;
  width:10%;
  right: 40px;
  bottom:150px;
  position: absolute;
}

#eyeImg{
  height:80%;
  width:100%;
}

#eyeImg:hover{
  transform: scale(1.1);
}

h1 {
  margin: 0;
  padding: 0 0 20px;
  font-size: 22px;
  text-align:center;
}

.loginbox p {
  margin: 0;
  padding:0;
  font-weight: bold;

}

.loginbox input {
  width:100%;
  margin-bottom: 20px;
}

.loginbox input[type="email"], input[type="password"], input[type="text"] {
  border: none;
  border-bottom: 1px solid #fff;
  background: transparent;
  outline: none;
  height: 40px;
  color: #fff;
  font-size: 16px;

}

.loginbox input[type="submit"]:hover {
  cursor: pointer;
  background: #66a3ff;
  color: #000;

}

.loginbox a {
  text-decoration: none;
  font-size: 12px;
  line-height: 20px;
  color: darkgray;
}

.loginbox a:hover {
  color: #ffc107;
}

.loginbox input[type="submit"] {
  border: none;
  outline: none;
  height:40px;
  background: #0052cc;
  font-size: 18px;
  border-radius:20px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  position: absolute;
  top:-50px;
  left: calc(50% - 50px);
}
</style>