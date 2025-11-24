<template>
  <div v-if="showLoading" class="loading">
    <div class="loading-spinner"></div>
    <div class="loading-text">{{ textAtualizacao }} ({{ uploadPercentage }}%)</div>
  </div>
</template>

<script>
  export default {
    props: {
      showLoading: Boolean,
      uploadPercentage: Number,
      textAtualizacao: String
    }
  }
</script>

<style scoped>
  .loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .loading-spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: 4px solid #06fff3;
    border-bottom: 4px solid #fa03d9;
    width: 50px;
    height: 50px;
    animation: spin 1.5s linear infinite;
  }

  .loading-text {
    margin-top: 16px;
    font-size: 18px;
    font-weight: bold;
    color: #707070;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
