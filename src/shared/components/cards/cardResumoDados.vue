<template>
  <div class="Card-Container">
    <div class="Main-Card">
      <h3>TEMPO LOGADO</h3>
      <span class="dot">
        <h1>76%</h1>
      </span>
    </div>

    <div class="Result-DES">
      <div class="Summary">
        <h3 class="Sum-Top">Resumo</h3>
        <div class="container-resumo">
          <div class="Resumo">
            <p class="Reac">Alimentação:</p>
            <p class="Reac-Score">00:11:34</p>
          </div>
          <div class="Resumo">
            <p class="Reac">Treinamento:</p>
            <p class="Reac-Score">00:11:34</p>
          </div>
        </div>
      </div>

      <div class="Continue-BTN">
        <p class="Continue">Justificar</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {}
</script>

<style scoped>
  .Card-Container {
    background-color: #fffeff;
    width: 360px;
    height: 250px;
    border: solid transparent;
    border: 0;
    display: flex;
    border-radius: 30px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .Main-Card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-image: linear-gradient(
      215deg,
      hsl(252deg 100% 67%) 0%,
      hsl(251deg 97% 65%) 0%,
      hsl(250deg 94% 64%) 0%,
      hsl(249deg 91% 62%) 2%,
      hsl(248deg 89% 61%) 13%,
      hsl(247deg 87% 59%) 71%,
      hsl(245deg 85% 57%) 83%,
      hsl(243deg 83% 56%) 92%,
      hsl(241deg 81% 54%) 100%
    );
    width: 180px;
    height: 250px;
    float: left;
    border: solid transparent;
    border-radius: 30px;
    border: 0;
    color: #d0c1ff;
    box-shadow: 0 0 100px rgba(70, 39, 202, 1) inset;
  }

  .dot {
    height: 120px;
    width: 120px;
    padding: 10px;
    border-radius: 50%;
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    background-image: linear-gradient(
      180deg,
      hsl(255deg 72% 45%) 0%,
      hsl(254deg 70% 47%) 11%,
      hsl(254deg 68% 49%) 22%,
      hsl(253deg 67% 50%) 33%,
      hsl(252deg 70% 52%) 44%,
      hsl(251deg 73% 53%) 56%,
      hsl(250deg 76% 55%) 67%,
      hsl(249deg 80% 56%) 78%,
      hsl(248deg 83% 58%) 89%,
      hsl(247deg 87% 60%) 100%
    );
  }

  h1 {
    color: #fff;
    font-size: 2em;
    position: relative;
    bottom: 3px;
  }

  h3 {
    font-weight: normal;
    font-size: 18px;
    margin-bottom: 12px;
  }

  h5 {
    position: relative;
    bottom: 40px;
    opacity: 0.65;
    font-weight: normal;
  }
  .Result-DES {
    width: 50%;
    float: right;
    position: relative;
  }

  .Sum-Top {
    font-weight: 900;
    font-size: 18px;
  }

  .Resumo {
    display: flex;
  }

  .Reac {
    font-size: 12px;
  }

  .Reac,
  .Reac-Score {
    padding: 0;
    margin: 0;
    font-size: 14.5px;
  }

  .Continue-BTN {
    color: #fff;
    font-size: 15px;
    width: 130px;
    height: 35px;
    border: solid transparent;
    border-radius: 50px;
    background-color: #303b59;
    margin: 30px auto 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .Continue {
    padding: 0;
    margin: 0;
  }

  .Summary {
    height: 70%;
    padding: 10px;
  }

  .container-resumo {
    height: 100%;
    overflow: auto;
  }
</style>
