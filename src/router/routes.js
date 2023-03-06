function loadPage(component) {
    return () => import(`@/pages/${component}.vue`)
}
export default [
    {path: "/", component:loadPage("MapPage")},
    {path: "/insights", component:loadPage("InsightsPage")}
]