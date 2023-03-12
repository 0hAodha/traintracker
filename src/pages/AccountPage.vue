<template>
<Navbar />
<h1>Account Settings</h1>
<p>Your Email: {{ displayEmail }}</p>

<div>
    <p>Enter your current password to edit account settings</p>
    <input type="password" v-model="currentPassword" placeholder="Enter existing password">

    <h1>Change email</h1>
    <input type="email" v-model="newEmail" aria-describedby="emailHelp" placeholder="Enter new email">
    <input @click="updateUserEmail" type="submit" name="" value="Update Email">

    <h1>Change password</h1>
    <input type="password" v-model="newPassword" placeholder="Enter new password">
    <input @click="updateUserPassword" type="submit" name="" value="Update Password">

    <h1>Delete account</h1>
    <input @click="deleteUserAccount" type="submit" name="" value="Delete Account">
</div>

<p v-if="missingCredentials">Missing credentials to complete this action</p>
<p v-if="displayFirebaseSuccessMsg">{{ FirebaseSuccessMsg }}</p>
<p v-if="displayFirebaseError">{{ FirebaseError }}</p>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import app from '../api/firebase'
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions"
import { getAuth, updateEmail, updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
const auth = getAuth();
const user = auth.currentUser;

export default {
    name: "AccountPage",

    components: {
      Navbar,
    },

    data() {
        return {
            displayEmail: "",
            newEmail: "",
            newPassword: "",
            currentPassword: "",
            displayFirebaseSuccessMsg: false,
            FirebaseSuccessMsg: "",
            displayFirebaseError: false,
            FirebaseError: "",
            reAuthSuccessful: false,
            missingCredentials: false
        }
    },

    created() {
        const user = auth.currentUser
        this.displayEmail = user.email


        const functions = getFunctions(app)
        let host = window.location.hostname
        if (host === '127.0.0.1' || host === 'localhost') {
            connectFunctionsEmulator(functions, host, 5001);
        }
        const secureFunction = httpsCallable(functions, 'securefunction')
        secureFunction().then((response) => {
            console.log(response);
        })
    },

    methods: {
        async authenticateUser(password) {
            var credential = await EmailAuthProvider.credential(user.email, password)
            await reauthenticateWithCredential(user, credential).then(() => {
                this.reAuthSuccessful = true
            })
            .catch((error) => {
                this.reAuthSuccessful = false
                this.FirebaseError = error.message
                this.displayFirebaseError = true
            })
        },

        resetMessages() {
            this.missingCredentials = false
            this.displayFirebaseError = false
            this.displayFirebaseSuccessMsg = false
        },

        resetCredentials() {
            this.newEmail = ""
            this.newPassword = ""
            this.currentPassword = ""
            this.reAuthSuccessful = false
        },

        updateUserEmail() {
            this.resetMessages()
            if (!this.newEmail || !this.currentPassword) {
                this.missingCredentials = true
                return
            }
            this.authenticateUser(this.currentPassword).then(() => {
                if (!this.reAuthSuccessful) return
                updateEmail(user, this.newEmail).then(() => {
                    this.displayEmail = this.newEmail
                    this.resetCredentials()
                    this.FirebaseSuccessMsg = "Email updated"
                    this.displayFirebaseSuccessMsg = true
                })
                .catch((error) => {
                    this.FirebaseError = error.message
                    this.displayFirebaseError = true
                })
            })
        },

        updateUserPassword() {
            this.resetMessages()
            if (!this.newPassword || !this.currentPassword) {
                this.missingCredentials = true
                return
            }
            this.authenticateUser(this.currentPassword).then(() => {
                if (!this.reAuthSuccessful) return
                updatePassword(user, this.newPassword).then(() => {
                    this.resetCredentials()
                    this.FirebaseSuccessMsg = "Password updated"
                    this.displayFirebaseSuccessMsg = true
                })
                .catch((error) => {
                    this.FirebaseError = error.message
                    this.displayFirebaseError = true
                })
            })
        },

        deleteUserAccount() {
            this.resetMessages()
            if (!this.currentPassword) {
                this.missingCredentials = true
                return
            }
            this.authenticateUser(this.currentPassword).then(() => {
                if (!this.reAuthSuccessful) return
                deleteUser(user).then(() => {
                    this.resetCredentials()
                    this.FirebaseSuccessMsg = "Account deleted"
                    this.displayFirebaseSuccessMsg = true
                    this.$router.push({path:'/'})
                })
                .catch((error) => {
                    this.FirebaseError = error.message
                    this.displayFirebaseError = true
                })
            })
        }
    }
}
</script>

<style scoped>
</style>