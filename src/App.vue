<template>
  <div id="app">
    <nav class="navbar is-dark">
      <div class="navbar-brand">
        <span class="navbar-item">proddle</span>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <router-link class="navbar-item" to="/">Home</router-link>
          <router-link class="navbar-item" to="/about">About</router-link>
          <router-link class="navbar-item" to="/tomato">Tomato</router-link>
        </div>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
}
#nav {
}
</style>
