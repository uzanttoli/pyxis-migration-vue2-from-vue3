<template>
  <div class="footer-login">
    <div class="content-footer">
      <div class="img">
        <img src="../../../assets/img/core/logo4.png" alt="" />
      </div>
      <div class="img">
        <a href="https://www.almavivadobrasil.com.br/pt-br/" target="_blank">
          <img
            style="height: 60px; width: 215px"
            src="../../../assets/img/core/Almaviva do Brasil.png"
            alt=""
          />
        </a>
      </div>
      <div class="img">
        <img src="../../../assets/img/core/cco.png" alt="" />
      </div>
      <!-- <div class="_tech">
        <p style="margin: 0;">Tecnologias Utilizadas</p>
        <div class="imgs_tech">
          <img v-for="(item, i) in arrayImg" :key="i" :src="item.img" :alt="item.alt" />

          <img src="../../../assets/img/core/mysql.png" style="width: 32px;" />
          <img src="../../../assets/img/core/sql-server.png" style="width: 35px;" />
        </div>
      </div> -->
    </div>
    <h2>Tecnologias Utilizadas</h2>
    <div class="slider">
      <div class="slide-track">
        <div class="slide" v-for="(item, i) in arrayImg" :key="i">
          <img :src="item.img" :alt="item.alt" />
        </div>
      </div>
    </div>
    <div id="footer">
      Copyright &copy; {{ date }} |
      <strong>{{ nameFooter }}</strong>
    </div>
  </div>
</template>

<script>
  export default {
    data: () => ({
      nameFooter: 'Centro de Controle Operacional',
      arrayImg: [
        {
          img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg'
        },
        {
          img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg'
        },
        {
          img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'
        },
        {
          img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original-wordmark.svg'
        },
        {
          img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuetify/vuetify-original.svg'
        },
        {
          img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg'
        },
        {
          img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/codeigniter/codeigniter-plain-wordmark.svg'
        },
        {
          img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg'
        },
        {
          img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg'
        },
        {
          img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-plain-wordmark.svg'
        },
        {
          img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original-wordmark.svg'
        },
        {
          img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/composer/composer-original.svg'
        },
        {
          img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-plain-wordmark.svg'
        },
        {
          img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg'
        },
        {
          img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nginx/nginx-original.svg'
        },
        {
          img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/puppeteer/puppeteer-original.svg'
        },
        {
          img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original-wordmark.svg'
        },
        {
          img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-original-wordmark.svg'
        }
      ]
    }),
    computed: {
      date() {
        let data = new Date()
        let ano = data.getFullYear()
        return ano
      }
    }
  }
</script>

<style scoped>
  .footer-login {
    color: #ffffff;
    background-color: #333333;
    min-height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .content-footer {
    min-height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    width: 90%;
    padding: 10px;
    border-bottom: 1px solid #919191;
  }

  .info-nav {
  }
  .img {
    width: 250px;
    display: flex;
    align-items: center;
    gap: 15px;
  }

  li {
    list-style: none;
    line-height: 25px;
    font-weight: 600;
    color: #dfdfdf;
  }

  .img img {
    width: 80%;
  }

  #footer {
    padding: 20px;
  }

  a {
    text-decoration: none;
    color: #dfdfdf;
  }

  a:visited {
    color: inherit;
  }

  body {
    /* background-color: #2c2c2c; */
    color: white;
    font-family: sans-serif;
    text-align: center;
    padding-top: 50px;
  }

  h2 {
    margin-top: 40px;
    font-size: 1.5em;
    margin-bottom: 40px;
  }

  .slider {
    height: 100px;
    margin: auto;
    overflow: hidden;
    position: relative;
    width: 90%;
  }

  .slider::before,
  .slider::after {
    content: '';
    height: 100%;
    position: absolute;
    width: 15%;
    z-index: 2;
  }

  .slider::before {
    left: 0;
    top: 0;
    /* background: linear-gradient(to right, #2c2c2c 0%, rgba(44, 44, 44, 0) 100%); */
  }

  .slider::after {
    right: 0;
    top: 0;
    /* background: linear-gradient(to left, #2c2c2c 0%, rgba(44, 44, 44, 0) 100%); */
  }

  .slide-track {
    display: flex;
    width: calc(150px * 18);
    animation: scroll 20s linear infinite;
  }

  .slider:hover .slide-track {
    animation-play-state: paused;
  }

  .slide {
    height: 100px;
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
  }

  .slide img {
    max-width: 80px;
    height: auto;
  }

  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(calc(-150px * 9));
    }
  }
</style>
