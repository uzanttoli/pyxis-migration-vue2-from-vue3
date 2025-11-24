<template>
  <div class="content" id="porque-pyxis">
    <div class="content-text">
      <p class="title-content">
        <span style="color: #ff0000">
          Pyxis
          <br />
        </span>
        <span style="font-size: 30px">Por que esse nome?</span>
      </p>
      <p style="color: #291569; text" class="text-justify">
        A Pyxis, ou a "Bússola", é uma constelação do hemisfério celestial sul, no século XVIII
        muitas expedições marítimas a utilizavam como guia para traçar as rotas de suas viagens.
        <br />
        <br />
        Logo, a Pyxis possui esse nome, pois o cerne dessa ferramenta está na sua habilidade de
        capacitar e guiar os colaboradores a assumirem o controle da sua jornada, melhorando seu
        desempenho e acelerando seu desenvolvimento, ao mesmo tempo em que os aproxima de forma mais
        profunda dos valores e objetivos da organização.
      </p>
    </div>
    <div class="content-img">
      <img src="../../../assets/img/core/bussula.png" alt="" />
    </div>
  </div>
</template>

<script>
  export default {}
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;700&display=swap"); */
  .content {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    margin: 35px;
    gap: 45px;
  }

  .content-text {
    max-width: 450px;
    padding: 20px;
  }

  .title-content {
    font-family: 'Roboto', sans-serif;
    font-size: 45px;
    font-weight: 600;
    color: #291569;
    line-height: 50px;
  }
  .content-img {
    max-width: 400px;
  }

  .content-img img {
    width: 100%;
  }
</style>
