<template>
  <div class="caixa mt-6">
    <h2 class="titulo">{{ title }}</h2>
    <div class="mt-4">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        Default: 'Title'
      }
    }
  }
</script>

<style scoped>
  .caixa {
    position: relative;
    border: 1px solid #807f7f;
    border-radius: 5px;
    padding: 20px;
  }

  .titulo {
    position: absolute;
    top: -20px;
    background-color: white;
    color: #898989;
    padding: 0 10px;
  }
</style>
