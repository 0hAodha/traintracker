<template>
    <nav class="navbar navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">
      <img src="https://cdn.discordapp.com/attachments/1017419092447207436/1063092138029625394/pixil-frame-0.png" alt="mascot" width="55" height="40" class="d-inline-block align-text-middle">
      <b>Irish Rail Tracker</b>
    </a>
    <a class = "navbarLink"><router-link to="/">Home</router-link></a>
    <a class = "navbarLink"><router-link to="/insights">Insights</router-link></a>
  </div>
</nav>
</template>

<script>
export default {
    name: "navbar"
}
</script>

<style scoped>

    .navbarLink{
    font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size: 150%;
    
    }

</style>