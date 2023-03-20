import {getAuth, onAuthStateChanged} from "firebase/auth"
import app from '../api/firebase';

function isAuth(to, from, next) {
    const auth = getAuth(app)
    onAuthStateChanged(auth, (user) => {
        // user is logged in, continue to page
        if (user) {
            return next()
        }
        // user is logged out, send back to home page
        else {
            return next({path: "/"})
        }
    })
}

function loadPage(component) {
    return () => import(`@/pages/${component}.vue`)
}

export default [
    { path: "/", component:loadPage("MapPage") },
    { path: "/insights", component:loadPage("InsightsPage") },
    { path: "/account", component:loadPage('AccountPage'), beforeEnter: isAuth },
    { path: "/signup", component:loadPage('SignUpPage') },
    { path: "/login", component:loadPage('LoginPage') },
    { path: "/:catchAll(.*)", component:loadPage('404Page') }
]