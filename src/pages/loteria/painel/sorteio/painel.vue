<template>
  <div class="_container">
    <div class="concursos-andamento">
      <concursos-em-andamento-resultado></concursos-em-andamento-resultado>
    </div>
    <div>
      <div class="container-contador">
        <div class="form">
          <v-text-field
            placeholder="Total de Bolinhas"
            label="Total de Bolinhas"
            v-model="totalAmountNumber"
            outlined
            dense
          ></v-text-field>
        </div>
        <div class="contador">
          <p class="numero_sorteado">{{ randomNumber }}</p>
        </div>
        <v-btn @click="startCounter" depressed>Sortear</v-btn>
      </div>
      <div class="resultado">
        <h2>Resultado</h2>
      </div>
    </div>
  </div>
</template>

<script>
  import concursosEmAndamentoResultado from '../../concursosEmAndamentoResultado.vue'
  export default {
    components: { concursosEmAndamentoResultado },
    data: () => ({
      randomNumber: 0,
      interval: null,
      totalAmountNumber: 0,
      isCounting: false
    }),
    methods: {
      startCounter() {
        if (this.isCounting) return
        this.isCounting = true
        const targetNumber = Math.floor(Math.random() * this.totalAmountNumber) + 1
        this.interval = setInterval(() => {
          this.randomNumber = Math.floor(Math.random() * this.totalAmountNumber) + 1
          if (this.randomNumber === targetNumber) {
            clearInterval(this.interval)
            this.isCounting = false
          }
        }, 100)
        setTimeout(() => {
          clearInterval(this.interval)
          this.isCounting = false
        }, 5000)
      }
    }
  }
</script>

<style scoped>
  ._container {
    padding: 20px;
    display: flex;
  }
  .container-contador {
    /* background-color: #ddd; */
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: center;
    height: 96vh;
    width: 100vw;
  }

  .contador {
    width: 15rem;
    height: 15rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1b8a1b;
    color: #fff;
  }

  p {
    padding: 0px;
    margin: 0px;
  }

  .numero_sorteado {
    font-size: 50px;
  }
</style>
