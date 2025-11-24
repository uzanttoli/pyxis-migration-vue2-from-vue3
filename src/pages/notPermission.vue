<template>
  <v-container>
    <div class="container">
      <img src="../assets/img/core/not-found.svg" />
      <h1>Página Não Encontrada!</h1>
      <p>
        Desculpe, a página que você está procurando não pode ser encontrada. Por favor, verifique se
        a URL está correta ou tente acessar pelo menu.
      </p>
      <p><a href="/home">Voltar para a página inicial</a></p>
    </div>
  </v-container>
</template>

<script>
  export default {}
</script>

<style scoped>
  body {
    background-color: #f2f2f2;
    font-family: Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #333;
  }
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  h1 {
    font-size: 32px;
    margin-bottom: 20px;
  }
  p {
    margin-bottom: 20px;
  }
  a {
    color: #007bff;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  img {
    height: 35vh;
  }
</style>
