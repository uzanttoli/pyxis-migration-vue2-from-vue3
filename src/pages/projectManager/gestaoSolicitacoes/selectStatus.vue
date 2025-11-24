<template>
  <div class="select-wrapper">
    <label for="" style="font-size: 14px; font-weight: bold">Status:</label>
    <select v-model="select">
      <option data-content="<i class='fa fa-address-book-o'></i>" value="aberto">Aberto</option>
      <option value="Em execucao">Em execução</option>
      <option value="Finalizado">Finalizado</option>
      <option value="Cancelado">cancelado</option>
    </select>
    <div class="select-arrow">
      <i class="fa fa-caret-down"></i>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      myId: {
        type: [String, Number],
        required: true
      }
    },
    data: () => ({
      select: null
    }),
    methods: {}
  }
</script>

<style scoped>
  .select-wrapper {
    position: relative;
    display: inline-block;
    margin-right: 6px;
  }

  .select-wrapper select {
    padding: 0 0 0 3px;
    font-size: 14px;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
  }

  .select-wrapper select option {
    background-color: #fff;
    color: #333;
  }

  .select-arrow {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .select-arrow i {
    transition: transform 0.3s;
  }

  .select-wrapper.select-up .select-arrow i {
    transform: rotate(180deg);
  }
</style>
