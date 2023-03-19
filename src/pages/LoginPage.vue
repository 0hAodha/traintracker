<template>
<Navbar />
<div id="background">
  <div class="loginbox">
    <img src="https://cdn.discordapp.com/attachments/1017419092447207436/1063092138029625394/pixil-frame-0.png" class="avatar">
    <div v-if="!forgotPassword">
      <h1>Login</h1>
      <p>Email Address</p>
      <input type="email" v-model="email" aria-describedby="emailHelp" placeholder="Enter email">
      <p>Password</p>
      <input type="password" v-model="password" placeholder="Enter password">
      <input @click="login" type="submit" name="" value="Login">
      <a @click="forgotPassword = !forgotPassword; this.email = ''">Forgot password?</a>
      <a><router-link to="/signup">Don't have an account?</router-link></a>
    </div>

    <div v-else>
      <h1>Forgot Password</h1>
      <p>Email Address</p>
      <input type="email" v-model="email" aria-describedby="emailHelp" placeholder="Enter email">
      <input @click="resetPasswordEmail" type="submit" name="" value="Send Reset Email">
      <a @click="forgotPassword = !forgotPassword; this.email = ''">Go back</a>
    </div>
  </div>
</div>


</template>

<script>
import app from '../api/firebase';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"
import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css'
import Navbar from '../components/Navbar.vue'
const auth = getAuth()

export default {
  name: "LoginPage",

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
      forgotPassword: false,
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

    login() {
      const auth = getAuth(app)
      if (!this.email || !this.password) {
        this.showToast("Missing credentials", "red")
        return
      }

      signInWithEmailAndPassword(auth, this.email, this.password).then(() => {
        this.showToast("Logged in successfully", "green")
        this.$router.push({path:'/'})
      })
      .catch((error) => {
        if (error.message.includes("email")) {
          this.showToast("Invalid email", "red")
        }
        else if (error.message.includes("user")) {
          this.showToast("Could not find this user", "red")
        }
        else {
          this.showToast(error.message, "red")
        }
      })
    },

    resetPasswordEmail() {
      if (!this.email) {
        this.showToast("Missing credentials", "red")
        return
      }

      sendPasswordResetEmail(auth, this.email).then(() => {
        this.showToast("Reset password email sent", "green")
        this.email = ""
      })
      .catch((error) => {
        if (error.message.includes("email")) {
          this.showToast("Invalid email", "red")
        }
        else if (error.message.includes("user")) {
          this.showToast("Could not find this user", "red")
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

.loginbox input[type="email"], input[type="password"] {
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
  display: flex
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