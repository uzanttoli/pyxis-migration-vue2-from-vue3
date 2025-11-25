<template>
  <form @submit.prevent="submitForm">
    <div v-for="(pergunta, index) in perguntas" :key="index">
      <label>{{ pergunta.texto }}:</label>
      <input v-if="pergunta.tipo === 'text'" v-model="respostas[index]" />
      <select v-else-if="pergunta.tipo === 'select'" v-model="respostas[index]">
        <option v-for="opcao in pergunta.opcoes" :key="opcao">{{ opcao }}</option>
      </select>
    </div>
    <button type="submit">Enviar</button>
  </form>
</template>

<script>
  export default {
    name: 'pesquisa-component',
    data() {
      return {
        perguntas: [
          {
            texto: 'teste',
            tipo: 'select',
            opcoes: ['Muito bom ', 'Quero muito']
          },
          {
            texto: 'teste2',
            tipo: 'text'
          }
        ],
        respostas: []
      }
    }
    //   async created() {
    //     // const response = await axios.get("/api/perguntas");
    //     // this.perguntas = response.data;
    //     this.respostas = new Array(this.perguntas.length).fill("");
    //   },
  }
</script>

<style></style>
