<template>
<Navbar />
<div id="accountDiv">
    <div id="mainDiv">
        <h1>Account Settings</h1>
        <p style="text-align:center" v-if="this.user">Your email: <b>{{ this.user.email }}</b><br><span id="passReset" @click="resetPasswordEmail()">Send password reset email</span></p>

        <h3>Enter your current password to edit the below settings</h3>
        <div id="currentPassword">
            <img v-if="showCurrentPassword" id="eyeImg" src="../assets/314858_hidden_eye_icon.png" @click="this.showCurrentPassword = !this.showCurrentPassword" alt="show">
            <img v-else id = "eyeImg" src="../assets/315220_eye_icon.png" @click="this.showCurrentPassword = !this.showCurrentPassword">
            <input v-if="showCurrentPassword" type="text" v-model="currentPassword" placeholder="Enter existing password">
            <input v-else type="password" v-model="currentPassword" placeholder="Enter existing password">
        </div>
        <h3>Change email</h3>
        <input type="email" v-model="newEmail" aria-describedby="emailHelp" placeholder="Enter new email">
        <button @click="updateUserEmail()" id="emailUpdate" type="button" class="btn btn-primary" value="Update Email">Update email</button>

        
        <h3>Change password</h3>
        <div id="newPassword">
            <img v-if="showNewPassword" id="eyeImg" src="../assets/314858_hidden_eye_icon.png" @click="this.showNewPassword = !this.showNewPassword" alt="show">
            <img v-else id = "eyeImg" src="../assets/315220_eye_icon.png" @click="this.showNewPassword = !this.showNewPassword">
            <input v-if="showNewPassword" id="newPass" type="text" v-model="newPassword" placeholder="Enter new password">
            <input v-else type="password" id="newPass" v-model="newPassword" placeholder="Enter new password">
            <button @click="updateUserPassword()" id="passUpdate" type="button" class="btn btn-primary">Update Password</button>
        </div>
        

        <button @click="deleteUserPreferences()" id="delPref" type="button" class="btn btn-danger">Delete Map Preferences</button>
        <button @click="deleteUserAccount()" id="delAcc" type="button" class="btn btn-danger" value="Delete Account">Delete Account</button>
        
        
    </div>
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
                    this.showToast("Successfully deleted map filter preferences", "green")
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

h1 {
    color:black;
    text-align: center;
}
h3 {
    font-size: 18px;
    padding-top: 20px;
}
#passReset {
    font-size: 17px;
    text-decoration: underline;
    color: #39d3fa;
}
#passReset:hover {
    color: #3993fa;
    cursor: pointer;
}
#accountDiv {
    position:absolute;
    right:0px;
    left:0px;
    bottom:0px;
    background-color: rgb(255, 255, 255);
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
}
#mainDiv{
    position: inherit;
    padding: 15px;
    background-color: rgb(255, 255, 255);
    width: 45%;
    height: 80%;
    top: 14%;
    text-align: left;
    box-shadow: 0 0 4px 4px #b6b6b6;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
#emailUpdate, #passUpdate {
    position: absolute;
    right: 20%;
    width: 26%;
    order: 3;
}

input {
    border:none;
    border-bottom: 1px solid #000000;
    background: transparent;
    outline: none;
    width: 40%;
}

#delAcc {
    position: absolute;
    bottom: 10px;
    left:10px;
}

#delPref {
    position: absolute;
    bottom: 10px;
    left:160px;
}

#newPassword, #currentPassword{
    display:flex;
    align-items: center;
}


#eyeImg{
    width: 6%;
    height: 10%;
    order: 2;
}

#eyeImg:hover{
    transform: scale(1.1);
}

::placeholder{
    font-size: 14px;;
}

@media screen and (max-width: 786px) {

    
    #mainDiv{
    position: inherit;
    padding: 15px;
    background-color: rgb(255, 255, 255);
    width: 90%;
    height: 80%;
    top: 14%;
    text-align: left;
    box-shadow: 0 0 4px 4px #b6b6b6;
    }

    #delAcc {
    position: absolute;
    bottom: 10px;
    left:10px;
    height: 10%;
    }

    #delPref {
    width: 50%;
    left: 150px;
    right: 10px;
    height: 10%;
    }

    button{
    font-size: 12px;
    }

}

</style>
