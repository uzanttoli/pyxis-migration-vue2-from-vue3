<template>
  <div class="como-podemos-te-ajudar" id="como-podemos-te-ajudar">
    <p class="text-h3 font-weight-bold my-7">
      Como podemos
      <span style="color: #ffff00">te ajudar?</span>
    </p>
    <div class="content">
      <div class="card">
        <img src="../../../assets/img/icons/icons8-painel-de-instrumentos-50.png" alt="" />
        <p class="_title">Progresso na Excelência de Desempenho</p>
        <p class="content-text">
          Crie equipes autogerenciáveis, estabeleça metas criteriosas adaptadas ao desenvolvimento
          individual dos colaboradores, ofereça suporte quando necessário e recompense o desempenho
          excepcional.
        </p>
      </div>
      <div class="card">
        <img src="../../../assets/img/icons/icons8-lugar-coletivo-seguro-50.png" alt="" />
        <p class="_title">Intensificação do Comprometimento das Equipes</p>
        <p class="content-text">
          Revitalize o vínculo entre os colaboradores e a empresa, fomentando maior compromisso e
          envolvimento.
        </p>
      </div>
      <div class="card">
        <img src="../../../assets/img/icons/icons8-aprendizagem-50.png" alt="" />
        <p class="_title">Gerenciamento do Saber</p>
        <p class="content-text">
          Faça da qualificação da sua empresa um processo ainda mais atrativo através da gamificação
          e disponibilização do conteúdo adequado.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {}
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;700&display=swap"); */
  .como-podemos-te-ajudar {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #291569;
    color: #fff;
    margin-top: 50px;
    padding: 15px;
  }

  .content {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
  }
  .card {
    border: 1px solid #fff;
    width: 380px;
    border-radius: 15px;
    padding: 15px;
    margin: 10px;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    color: #f0f0f0;
  }

  ._title {
    font-family: 'Roboto', sans-serif;
    font-size: 20px;
    text-align: center;
  }

  .content-text {
    text-align: center;
  }

  .card img {
    width: 55px;
    padding: 10px 0;
  }
</style>
