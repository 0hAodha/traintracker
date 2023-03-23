<template>
<Navbar />
<h1>Account Settings</h1>
<p v-if="this.user">Your Email: {{ this.user.email }}</p>
<div>
    <h3>Send a password reset email</h3>
    <button @click="resetPasswordEmail()" type="submit" name="" value="Send Password reset email" class="button">Send Password Reset Email</button>

    <h3>Enter your current password to edit account settings</h3>
    <input v-if="showCurrentPassword" type="text" v-model="currentPassword" placeholder="Enter existing password">
    <input v-else type="password" v-model="currentPassword" placeholder="Enter existing password">
    <!-- <div id="imgDiv1"> -->
    <!--     <img v-if="showPassword" id="eyeImg" src="../assets/314858_hidden_eye_icon.png" @click="this.showPassword = !this.showPassword" alt="show"> -->
    <!--     <img v-else id = "eyeImg" src="../assets/315220_eye_icon.png" @click="this.showPassword = !this.showPassword"> -->
    <!--   </div> -->

    <h3>Change email</h3>
    <input type="email" v-model="newEmail" aria-describedby="emailHelp" placeholder="Enter new email">
    <button @click="updateUserEmail()" type="submit" name="" value="Update Email">Update email</button>

    <h3>Change password</h3>
    <input v-if="showNewPassword" type="text" v-model="newPassword" placeholder="Enter new password">
    <input v-else type="password" v-model="newPassword" placeholder="Enter new password">

    <!-- <div id="imgDiv2"> -->
    <!--     <img v-if="showPassword" id="eyeImg" src="../assets/314858_hidden_eye_icon.png" @click="this.showPassword = !this.showPassword" alt="show"> -->
    <!--     <img v-else id = "eyeImg" src="../assets/315220_eye_icon.png" @click="this.showPassword = !this.showPassword"> -->
    <!--   </div> -->
    <button @click="updateUserPassword()" type="submit" name="" value="Update Password">Update Password</button>

    <h3>Delete account</h3>
    <button @click="deleteUserAccount()" type="submit" name="" value="Delete Account">Delete Account</button>

    <h3>Delete map filter preferences data</h3>
    <button @click="deleteUserPreferences()">Delete preferences</button>
</div>
</template>

<script>
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions"
import { getAuth, updateEmail, updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css'
import Navbar from '../components/Navbar.vue'
import app from '../api/firebase'
const auth = getAuth();

export default {
    name: "AccountPage",

    components: {
      Navbar,
    },

    data() {
        const toast = () => {
            createToast(this.toastMessage, {
                hideProgressBar: true,
                timeout: 4000,
                toastBackgroundColor: this.toastBackground
            })
        }

        return {
            user: null,
            newEmail: "",
            newPassword: "",
            currentPassword: "",
            toastMessage: "",
            toastBackground: "",
            reAuthSuccessful: false,
            showCurrentPassword: false,
            showNewPassword: false,
            toast
        }
    },

    created() {
        this.user = auth.currentUser
    },

    methods: {
        showToast(message, backgroundColour) {
            this.toastMessage = message
            this.toastBackground = backgroundColour
            this.toast()
        },
        
        async authenticateUser(password) {
            var credential = await EmailAuthProvider.credential(this.user.email, password)
            await reauthenticateWithCredential(this.user, credential).then(() => {
                this.reAuthSuccessful = true
            })
            .catch((error) => {
                this.reAuthSuccessful = false
                if (error.message.includes("wrong")) {
                    this.showToast("Wrong password inputted", "red")
                }
                else {
                    this.showToast(error.message, "red")
                }
            })
        },

        resetCredentials() {
            this.newEmail = ""
            this.newPassword = ""
            this.currentPassword = ""
            this.reAuthSuccessful = false
        },

        updateUserEmail() {
            if (!this.newEmail || !this.currentPassword) {
                this.showToast("Missing password input", "red")
                return
            }

            this.authenticateUser(this.currentPassword).then(() => {
                if (!this.reAuthSuccessful) return
                updateEmail(this.user, this.newEmail).then(() => {
                    this.resetCredentials()
                    this.showToast("Email successfully updated", "green")
                })
                .catch((error) => {
                    this.showToast(error.message, "red")
                })
            })
        },

        updateUserPassword() {
            if (!this.newPassword || !this.currentPassword) {
                this.showToast("Missing password input", "red")
                return
            }

            this.authenticateUser(this.currentPassword).then(() => {
                if (!this.reAuthSuccessful) return
                updatePassword(this.user, this.newPassword).then(() => {
                    this.resetCredentials()
                    this.showToast("Password successfully updated", "green")
                })
                .catch((error) => {
                    this.showToast(error.message, "red")
                })
            })
        },

        deleteUserAccount() {
            if (!this.currentPassword) {
                this.showToast("Missing password input", "red")
                return
            }
            
            this.authenticateUser(this.currentPassword).then(() => {
                if (!this.reAuthSuccessful) return
                deleteUser(this.user).then(() => {
                    this.resetCredentials()
                    this.showToast("Account successfully deleted", "green")
                    this.$router.push({path:'/'})
                })
                .catch((error) => {
                    this.showToast(error.message, "red")
                })
            })
        },

        resetPasswordEmail() {
            sendPasswordResetEmail(auth, this.user.email).then(() => {
                this.showToast("Reset password email sent", "green")
            })
            .catch((error) => {
                this.showToast(error.message, "red")
            })
        },

        deleteUserPreferences() {
            if (!this.currentPassword) {
                this.showToast("Missing password input", "red")
                return
            }
            
            this.authenticateUser(this.currentPassword).then(() => {
                if (!this.reAuthSuccessful) return
                const functions = getFunctions(app)
                let host = window.location.hostname
                if (host === '127.0.0.1' || host === 'localhost') {
                    connectFunctionsEmulator(functions, host, 5001);
                }
                
                const deletePreferencesData = httpsCallable(functions, 'deletePreferences')
                deletePreferencesData().then(() => {
                    this.resetCredentials()
                    this.showToast("Successfully map deleted filter preferences", "green")
                })
                .catch((error) => {
                    this.showToast(error.message, "red")
                })
            })
            .catch((error) => {
                this.showToast(error.message, "red")
            })
        }
    }
}
</script>

<style scoped>
button {
  background-color: blue;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  margin: 10px;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background-color: darkblue;
}

button:focus {
    outline: none;
}

.eye-button {
  background-color: grey;
}

#imgDiv1{
  height:8%;
  left:190px;
  top:260px;
  position: absolute;
}

#imgDiv2{
  height:8%;
  left:330px;
  top:400px;
  position: absolute;
}

#eyeImg{
  height:60%;
  width:100%;
}

#eyeImg:hover{
  transform: scale(1.3);
}
</style>
