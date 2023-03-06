function loadPage(component) {
    return () => import(`@/pages/${component}.vue`)
}
export default [
    {path: "/", component:loadPage("MapPage")},
    {path: "/insights", component:loadPage("InsightsPage")},
    {path: "/signup", component:loadPage("signup")},
    {path: "/login", component:loadPage("loginpage")}
]