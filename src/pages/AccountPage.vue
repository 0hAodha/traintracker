<template>
<Navbar />
<h1>Account Settings</h1>
<p v-if="this.user">Your Email: {{ this.user.email }}</p>
<div>
    <h3>Enter your current password to edit account settings</h3>
    <input type="password" v-model="currentPassword" placeholder="Enter existing password">
    <h3>Send a password reset email</h3>
    <input @click="resetPasswordEmail" type="submit" name="" value="Send Password reset email">

    <h3>Change email</h3>
    <input type="email" v-model="newEmail" aria-describedby="emailHelp" placeholder="Enter new email">
    <input @click="updateUserEmail" type="submit" name="" value="Update Email">

    <h3>Change password</h3>
    <input type="password" v-model="newPassword" placeholder="Enter new password">
    <input @click="updateUserPassword" type="submit" name="" value="Update Password">

    <h3>Delete account</h3>
    <input @click="deleteUserAccount" type="submit" name="" value="Delete Account">

    <h3>Delete filter preferences data</h3>
    <button @click="deleteUserPreferences">Delete preferences</button>
</div>

<p v-if="missingCredentials">Missing credentials to complete this action</p>
<p v-if="displayFirebaseSuccessMsg">{{ FirebaseSuccessMsg }}</p>
<p v-if="displayFirebaseError">{{ FirebaseError }}</p>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import app from '../api/firebase'
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions"
import { getAuth, updateEmail, updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider, sendPasswordResetEmail } from "firebase/auth";
const auth = getAuth();

export default {
    name: "AccountPage",

    components: {
      Navbar,
    },

    data() {
        return {
            user: null,
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
        this.user = auth.currentUser
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
                updateEmail(this.user, this.newEmail).then(() => {
                    // might need to reset user here
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
                updatePassword(this.user, this.newPassword).then(() => {
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
                deleteUser(this.user).then(() => {
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
        },

        resetPasswordEmail() {
            sendPasswordResetEmail(auth, this.user.email).then(() => {
                this.FirebaseSuccessMsg = "Reset password email sent"
                this.displayFirebaseSuccessMsg = true
            })
            .catch((error) => {
                this.FirebaseError = error.message
                this.displayFirebaseError = true
            })
        },

        deleteUserPreferences() {
            const functions = getFunctions(app)
            let host = window.location.hostname
            if (host === '127.0.0.1' || host === 'localhost') {
                connectFunctionsEmulator(functions, host, 5001);
            }
            const deletePreferencesData = httpsCallable(functions, 'deletePreferences')
            deletePreferencesData().then(() => {
                this.FirebaseSuccessMsg = "Successfully deleted filter preferences"
                this.displayFirebaseSuccessMsg = true
            })
            .catch((error) => {
                this.FirebaseError = error.message
                this.displayFirebaseError = true
            })
        }
    }
}
</script>

<style scoped>
</style>