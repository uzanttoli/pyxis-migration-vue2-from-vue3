<template>
  <v-card class="bordered-card full-width relative" outlined>
    <div class="action-top">
      <slot name="action-top"></slot>
    </div>
    <div class="slot-text">
      <slot></slot>
    </div>
    <div class="action-bottom">
      <slot name="action-bottom"></slot>
    </div>
  </v-card>
</template>

<script>
  export default {
    name: 'ui-section',
    data() {
      return {}
    }
  }
</script>

<style scoped>
  .slot-text {
    color: #8d8888;
  }

  .full-width {
    width: 100% !important;
  }

  .bordered-card {
    border: 2px dashed #8d8888;
    padding: 40px;
    border-radius: 8px;
    text-align: center;
  }

  .action-top {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
  }
  .action-bottom {
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
