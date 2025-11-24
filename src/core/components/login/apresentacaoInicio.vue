<template>
  <div class="_container">
    <div class="image-container">
      <img src="../../../assets/img/core/bodyPass.jpg" alt="" id="image-animation" />
      <div class="text-overlay">
        <div class="content-text">
          <div class="apr1">
            <p class="text-h2 text-center">
              Vivemos para transformar
              <strong class="strong">grandes ideias</strong>
            </p>
            <i class="fa-solid fa-lightbulb lightbulb"></i>
          </div>
          <div class="apr2">
            <p class="text-h7 text-justify" style="margin-top: 10px">
              Nosso objetivo é garantir a eficiência operacional através da automação de processos,
              análise de dados, melhor colaboração e comunicação dos colaboradores, que são
              possiveis pelo nossos insights valiosos, proporcionando uma maior sustentabilidade e
              competividade da companhia frente ao mercado.
            </p>
            <!-- <a href="#about">Saiba Mais</a> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {}
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+Osmanya&display=swap"); */
  ._container {
    height: 800px;
    width: 100%;
  }

  ._title-apresentacao {
    font-family: 'Noto Sans Osmanya', sans-serif !important;
    font-size: 25px !important;
    text-align: center;
  }

  .image-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(1px);
  }

  .text-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;
    justify-content: center;
  }

  .apr1,
  .apr2 {
    max-width: 450px;
    flex: 1;
    padding: 10px;
  }

  .text-overlay h1,
  .text-overlay h6,
  .text-overlay p {
    color: white;
    font-family: 'Noto Sans Osmanya', sans-serif;
    font-size: 18px;
  }

  a {
    color: white !important;
    text-decoration: none;
    background-image: linear-gradient(220deg, rgb(143, 14, 143), rgb(0, 236, 255));
    padding: 5px 20px;
    border-radius: 25px;
    display: inline-block;
  }

  a:visited {
    color: rgb(255, 255, 255);
  }

  .content-text {
    display: flex;
    flex-wrap: wrap;
    gap: 60px;
  }

  .strong {
    font-style: italic;
    color: #ffee00;
    font-weight: 600;
  }

  .apr1 {
    position: relative;
  }

  .apr1::before {
    content: '';
    position: absolute;
    left: 65px;
    bottom: 30px;
    width: 0;
    max-width: 350px;
    height: 3px;
    background: #ffee00;
    transition: width 0.3s ease-in-out;
    animation: transition 3s infinite;
  }

  @keyframes transition {
    0% {
      width: 0%;
      transition: width 0.3s ease-in-out;
    }
    /* 50% {
    width: 50%;
    transition: width 0.3s ease-in-out;
  } */
    100% {
      width: 100%;
      transition: width 0.3s ease-in-out;
    }
  }

  .lightbulb {
    animation: transitionLight 3s infinite;
    position: absolute;
    right: -25px;
    bottom: 30px;
    font-size: 55px;
    transform: rotate(15deg);
  }

  @keyframes transitionLight {
    0% {
      color: #fff;
    }

    100% {
      color: #ffee00;
    }
  }
</style>
