<template>
  <div class="container-cards">
    <div class="icon"><i :class="icon"></i></div>
    <div class="results">
      <div class="results-number">{{ results }}</div>
      <div class="results-title">
        <p>{{ minusText(title) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      icon: {
        type: String,
        default: 'fa-solid fa-user'
      },
      title: {
        type: String,
        default: 'Titulo'
      },
      results: {
        type: [Number, String],
        default: 0
      }
    },
    methods: {
      minusText(value) {
        if (!value) return
        let minus = value.toLowerCase()
        return minus.split('_').join(' ')
      }
    }
  }
</script>

<style scoped>
  .container-cards {
    width: 300px;
    max-width: 300px;
    height: 115px;
    background-color: #fff;
    box-shadow: 0px 17px 11px 0px rgba(0, 0, 0, 0.1);
    border-radius: 13px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 0;
    margin: 10px;
  }

  .icon i {
    font-size: 35px;
    color: #7720ba;
  }

  .results {
    display: flex;
    flex-direction: column;
    align-items: end;
  }

  .results .results-number {
    font-size: 1.6em;
    font-weight: 600;
    color: #333;
  }

  .results .results-title {
    font-size: 1em;
    color: #333;
  }

  p {
    text-transform: capitalize;
  }
</style>
