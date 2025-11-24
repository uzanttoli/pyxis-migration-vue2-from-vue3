<template>
  <div class="infinity-scroll-container w-full">
    <div class="scroll imgbx" style="--t: 35s">
      <div class="content">
        <div v-for="item in items" :key="item.imrSrc" class="image-container">
          <img :src="item.imgSrc" :alt="item.alt" :class="{ highlight: item.highlight }" />
          <span>{{ item.title }}</span>
        </div>
      </div>
      <div class="content">
        <div v-for="item in items" :key="item.imrSrc" class="image-container">
          <img :src="item.imgSrc" :alt="item.alt" :class="{ highlight: item.highlight }" />
          <span>{{ item.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      /* Os items devem ter a estrutura de um array de objetos conforme o exemplo abaixo
    / [{
    /   title: 'Prêmio 1',
    /   imgSrc: 'https://via.placeholder.com/300',
    /   alt: 'Prêmio 1',
    /   description: 'Descrição do prêmio 1', OPCIONAL
    /   highlight: true, OPCIONAL
    / }]
    */
      items: {
        type: Array
      }
    }
  }
</script>

<style scoped>
  .infinity-scroll-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  .scroll {
    position: relative;
    display: flex;
    overflow: hidden;
    width: 100%;
    height: auto;
  }

  .content {
    display: flex;
    animation: scrollAnimation var(--t) linear infinite;
  }

  @keyframes scrollAnimation {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-100%);
    }
  }

  .content span {
    display: inline-block;
    margin: 10px;
    padding: 5px 10px;
    background: #333;
    color: #fff;
    border-radius: 5px;
    text-align: center;
  }
  .image-container {
    display: inline-block;
    margin: 10px;
    color: #fff;
    border-radius: 5px;
    text-align: center;
  }

  .imgbx img {
    width: 300px;
    filter: grayscale(1);
    transition: all 0.3s ease;
  }

  .imgbx img:hover {
    filter: grayscale(0);
  }
  .imgbx .highlight {
    filter: grayscale(0);
  }

  .image-container span {
    margin-top: 5px;
    display: block;
    font-size: 14px;
    color: #ddd;
  }
</style>
