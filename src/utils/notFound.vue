<template>
  <div class="card-container" v-if="isNotFound">
    <img src="../assets/img/geral/notFound.png" alt="" />
    <div class="con-title">
      <h1>Não há dados</h1>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      isNotFound: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300&display=swap"); */
  .card-container {
    display: flex;
    flex-direction: column;
    place-items: center;
  }

  .card-container img {
    width: 300px;
  }
  .con-title {
    margin-top: -30px;
  }

  h1 {
    font-family: 'Josefin Sans', sans-serif;
    letter-spacing: 2px;
    color: #656565;
  }
</style>
