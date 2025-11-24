<template>
  <div class="card">
    <h6>{{ title }}</h6>
    <p>{{ value }}</p>
  </div>
</template>
<script>
  export default {
    props: {
      title: {
        type: String,
        default: 'Titulo'
      },
      value: {
        type: String,
        default: 'SubTitulo'
      }
    },
    data: () => ({}),
    methods: {
      convertToDecimalBR(valor) {
        return (valor / 100).toLocaleString(undefined, {
          style: 'percent',
          minimumFractionDigits: 2
        })
      }
    }
  }
</script>
<style scoped>
  .card {
    position: relative;
    width: 200px;
    height: 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-bottom: 3px solid #9909b6;
  }

  p {
    margin: 0;
    padding: 0;
  }
</style>
