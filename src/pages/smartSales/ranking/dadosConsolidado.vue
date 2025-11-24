<template>
  <div class="card-border">
    <div class="dados-consolidado">
      <div v-for="(item, i) in consolidadoRanking" :key="i" style="display: flex; margin: 0 10px">
        <div class="dados">
          <div class="icon">
            <i :class="item.FA_ICON"></i>
          </div>
          <div class="info-dados">
            <p>{{ item.COLUNA }}</p>
            <span class="number">{{ item.VALOR }}</span>
          </div>
        </div>
      </div>
      <img src="../../../assets/img/core/ranking-player.png" />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      consolidadoRanking: {
        type: Array,
        required: true
      }
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Oswald&display=swap"); */
  .dados-consolidado {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    min-height: 130px;
    align-items: center;
    background: linear-gradient(45deg, #ffbc00, #ff0058);
    /* border-radius: 1.2em; */
    padding: 10px;
    /* border-radius: 15px; */
    position: relative;
  }

  .card-border {
    z-index: 0;
    position: relative;
    padding: 1rem;
    box-sizing: border-box;
    background: transparent;
    backdrop-filter: blur(40px);
    border-radius: 0px 2rem;
    background-image: radial-gradient(#2121218a, #212121cc),
      linear-gradient(50deg, #ffbc00 0%, #ff0058 100%);
    background-origin: border-box;
    background-clip: content-box, border-box;
    box-shadow: 1px 1px 0.5rem #ffbc00;
    transition: all 0.5s;
    animation: pulse_3011 4s infinite;
  }

  img {
    width: 350px;
    position: absolute;
    bottom: -70px;
    right: 10px;
  }

  .dados {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .icon {
    background-color: rgb(107, 171, 181);
    padding: 12px;
    border-radius: 7px;
    width: 50px;
    height: 50px;
    text-align: center;
  }

  .icon i {
    font-size: 25px;
    color: #fff;
  }

  .info-dados p {
    margin: 0;
    padding: 0;
    color: #fff;
    font-size: 16px;
    line-height: 30px;
    letter-spacing: 2px;
    font-family: 'Oswald', sans-serif;
  }

  .info-dados span {
    color: #fff;
    font-size: 25px;
    font-weight: 600;
    line-height: 17px;
  }
</style>
