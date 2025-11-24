<template>
  <div class="history-panel">
    <h3>Histórico de Cálculos</h3>
    <ul>
      <li v-for="(calculation, index) in history" :key="index">
        {{ calculation.value1 }} {{ calculation.operation }} {{ calculation.value2 }} =
        {{ calculation.calc }}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      history: {
        type: Array,
        default: () => []
      }
    }
  }
</script>

<style scoped>
  .history-panel {
    border: 1px solid #ccc;
    padding: 10px;
    margin-top: 10px;
  }

  .history-panel h3 {
    font-size: 18px;
    margin-bottom: 5px;
  }

  .history-panel ul {
    list-style: none;
    padding: 0;
  }

  .history-panel li {
    margin-bottom: 5px;
  }
</style>
