<template>
  <div class="quem-somos" id="quem-somos">
    <p class="text-h3 font-weight-bold my-7">Quem somos?</p>
    <div class="content">
      <div class="card">
        <img src="../../../assets/img/time_devs/img_diego.png" alt="" />
        <p class="_title">Diego Rodrigues</p>
        <p class="function">Tech Leader</p>
        <div class="divider"></div>
        <p class="content-text">
          Responsável por liderar o time de desenvolvimento da Pyxis, com a função de arquitetar e
          elaborar uma visão técnica do projeto, levando em consideração as necessidades e objetivos
          dos seus usuários.
        </p>
        <div class="_info">
          <a href="https://www.linkedin.com/in/dihrodrigs/" target="_blank">
            <i class="fa-brands fa-linkedin"></i>
          </a>
          <a href="mailto:dpassos@almavivadobrasil.com.br">
            <i class="fa-solid fa-envelope"></i>
          </a>
        </div>
      </div>
      <div class="card">
        <img src="../../../assets/img/time_devs/carlos_ed.png" alt="" />
        <p class="_title">Carlos Eduardo</p>
        <p class="function">Analista de Dados</p>
        <div class="divider"></div>
        <p class="content-text">
          Responsável por tirar insights dos dados, análise de negócio, construção de rotinas e
          scripts SQL, criação de tabelas, procedures, views, coleta, mineração e modelagem de
          dados.
        </p>
        <div class="_info">
          <a
            href="https://www.linkedin.com/in/carlos-eduardo-silva-santos-6b558988/"
            target="_blank"
          >
            <i class="fa-brands fa-linkedin"></i>
          </a>
          <a href="mailto:cesantos@almavivadobrasil.com.br">
            <i class="fa-solid fa-envelope"></i>
          </a>
        </div>
      </div>
      <div class="card">
        <img src="../../../assets/img/time_devs/uanderson.png" alt="" />
        <p class="_title">Uanderson Oliveira</p>
        <p class="function">Desenvolvedor Full Stack</p>
        <div class="divider"></div>
        <p class="content-text">
          Desenvolver soluções customizadas utilizando HTML, CSS, Javascript, VueJs, Vuetify, PHP
          (Codeigniter e Ratchet) e NodeJs, parametrização de servidores, codificação, interface e
          documentação de projetos.
        </p>
        <div class="_info">
          <a href="https://www.linkedin.com/in/uzanttoli/" target="_blank">
            <i class="fa-brands fa-linkedin"></i>
          </a>
          <a href="mailto:uoliveira@almavivadobrasil.com.br">
            <i class="fa-solid fa-envelope"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {}
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;700&display=swap"); */
  .quem-somos {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #291569;
    color: #fff;
    /* margin-top: 50px; */
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
    font-size: 25px;
    text-align: center;
    margin: 0;
    font-weight: 600;
  }

  .function {
    font-size: 18px;
  }

  .divider {
    height: 1px;
    width: 100%;
    margin: 10px 0;
    background-color: #f0f0f0;
  }

  .content-text {
    text-align: justify;
  }

  .card img {
    width: 150px;
    border-radius: 50%;
    border: 3px inset #f0f0f0;
    /* padding: 10px 0; */
    margin: 20px;
  }

  ._info {
    gap: 5px;
  }

  ._info a {
    margin: 5px;
  }

  ._info a i {
    font-size: 20px;
    color: white;
  }
</style>
