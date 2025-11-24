<template>
  <div class="recursos" id="about">
    <p class="text-h3 font-weight-bold my-7">Sobre</p>
    <div class="_container-img">
      <img src="../../../assets/img/core/dsf.png" alt="" />
      <div class="content">
        <div class="card">
          <p class="_title">Plataforma Digital de Gestão de Pessoas</p>
          <p class="contet-text">
            Acessibilidade do colaborador as avaliações de desempenho e produtividade, análise de
            clima, feedback, com o intuito de garantir a evolução do seus indicadores.
          </p>
        </div>
        <div class="card">
          <p class="_title">Overview/Dashboard de Indicadores</p>
          <p class="contet-text">
            Maior eficiência do gerenciamento dos KPI’s, através de dashboards de indicadores que
            permitem um acompanhamento online e histórico de maneira estratégica e otimizada.
          </p>
        </div>
        <div class="card">
          <p class="_title">Interações</p>
          <p class="contet-text">
            Desde que foi desenvolvida em 2018, contamos com mais de 4.5K usuários e uma média de
            aproximadamente 3M de interações por ano.
          </p>
        </div>
        <div class="card">
          <p class="_title">Gamification</p>
          <p class="contet-text">
            Engajamento e reconhecimento através da gamificação, onde toda dinâmica e desafios do
            jogo são com base na análise comportamental e mapeamento de perfil dos colaboradores.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {}
</script>

<style scoped>
  .recursos {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* margin-top: 50px; */
    padding: 15px;
    color: #291569;
  }

  ._container-img {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 50px;
  }

  ._container-img img {
    width: 550px;
  }

  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .card {
    width: 365px;
    padding: 15px;
    margin: 10px;
    box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
  }

  p {
    padding: 0;
    margin: 0;
  }
  .card ._title {
    font-size: 17px;
    font-weight: 600;
    text-align: center;
  }

  .card .contet-text {
    font-size: 15px;
    margin-top: 10px;
    text-align: justify;
  }

  /* .card:nth-child(1) {
  padding: 10px;
  margin: 10px;
  background-color: rgb(238, 194, 194);
  box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
}
.card:nth-child(2) {
  padding: 10px;
  margin: 10px;
  background-color: #e9d903;
  box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
} */
</style>
