<template>
  <div class="card">
    <button @click="$emit('onClick')">
      <i class="fa-solid fa-robot"></i>
    </button>
  </div>
</template>
<script>
  export default {}
</script>
<style scoped>
  .card {
    position: fixed;
    bottom: 40px;
    left: 100px;
    border-radius: 50px;
  }

  button {
  }

  i {
    font-size: 40px;
    color: rgb(0, 76, 255);
  }
</style>
