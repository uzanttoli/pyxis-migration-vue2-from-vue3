<template>
  <Login @updated:reset="isReset = true" />
</template>

<script>
  import Login from './login.vue'
  // import ResetLogin from "./recoverPassword.vue";
  export default {
    components: {
      Login
      // ResetLogin,
    },
    data: () => ({
      isReset: false
    })
  }
</script>

<style></style>
