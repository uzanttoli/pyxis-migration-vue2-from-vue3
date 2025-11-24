<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      margin: 25px;
      gap: 10px;
    "
  >
    <div class="card">
      <h2>{{ title ? title : 'Sem titulo' }}</h2>
    </div>
    <div class="resultado">
      <span style="font-weight: 600; font-size: 25px">{{ result ? result : 0 }}</span>
    </div>
    <div class="spinner">
      <div class="spinner1"></div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['title', 'result']
  }
</script>

<style scoped>
  .resultado {
    color: #fff;
    position: absolute;
    bottom: 30px;
    z-index: 1;
  }

  .spinner {
    background-image: linear-gradient(rgb(186, 66, 255) 35%, rgb(0, 225, 255));
    width: 100px;
    height: 100px;
    /* animation: spinning82341 1.7s linear infinite; */
    text-align: center;
    border-radius: 50px;
    filter: blur(1px);
    box-shadow: 0px -5px 20px 0px rgb(186, 66, 255), 0px 5px 20px 0px rgb(0, 225, 255);
  }

  .spinner1 {
    background-color: #07182e;
    width: 100px;
    height: 100px;
    border-radius: 50px;
    filter: blur(10px);
  }

  @keyframes spinning82341 {
    to {
      transform: rotate(360deg);
    }
  }

  .card {
    width: 190px;
    height: 50px;
    margin-bottom: 10px;
    /* background: #07182E; */
    position: relative;
    display: flex;
    place-content: center;
    place-items: center;
    overflow: hidden;
    border-radius: 20px;
  }

  .card h2 {
    z-index: 1;
    color: white;
    font-size: 1.19em;
  }

  .card::before {
    content: '';
    position: absolute;
    width: 45px;
    background-image: linear-gradient(180deg, rgb(0, 183, 255), rgb(255, 48, 255));
    height: 400%;
    /* animation: rotBGimg 3s linear infinite; */
    transition: all 0.2s linear;
    transform: rotate(76deg);
  }

  @keyframes rotBGimg {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .card::after {
    content: '';
    position: absolute;

    background-color: rgb(20, 19, 50);
    inset: 5px;
    border-radius: 15px;
  }
  /* .card:hover:before {
  background-image: linear-gradient(180deg, rgb(81, 255, 0), purple);
  animation: rotBGimg 3.5s linear infinite;
} */
</style>
