<template>
  <div class="display">
    <!-- <pre>{{operation == '='}}</pre> -->
    <span class="history">
      <i class="fa-solid fa-clock-rotate-left"></i>
    </span>
    <span class="preview" v-if="operation && operation != '='">
      {{ valueIndex1 }}{{ operation
      }}{{ operation != null ? (valueIndex2 == '0' ? '' : valueIndex2) : '' }}
    </span>
    {{ value }}
  </div>
</template>

<script>
  export default {
    props: ['value', 'operationCurrent', 'valueIndex1', 'valueIndex2', 'operation']
  }
</script>

<style scoped>
  .display {
    grid-column: span 4;
    background-color: #0004;

    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 20px;
    font-size: 1.7em;
    overflow: hidden;
    border: none;
    position: relative;
  }

  .operation {
    font-size: 12px;
    padding: 2px;
  }

  .preview {
    top: 10px;
    position: absolute;
    font-size: 13px;
  }
  .history {
    top: 10px;
    left: 10px;
    position: absolute;
    font-size: 18px;
    color: #333;
    cursor: pointer;
  }
</style>
