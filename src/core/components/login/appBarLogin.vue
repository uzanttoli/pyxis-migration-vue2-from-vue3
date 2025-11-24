<template>
  <div class="nav-bar">
    <div class="content-bar">
      <div class="content-action">
        <nav>
          <ul>
            <div class="logo">
              <img src="../../../assets/img/core/logonewlayout.png" alt="" />
            </div>
            <v-divider vertical class="mx-4"></v-divider>
            <li style="font-weight: 600; font-size: 16px">
              <button @click="changeLogin">Login</button>
            </li>
            <!-- <li><a href="#about">Sobre</a></li>
            <li>
              <a href="#como-podemos-te-ajudar">Como podemos te ajudar?</a>
            </li>
            <li><a href="#porque-pyxis">Pyxis, por que esse nome?</a></li>
            <li><a href="#quem-somos">Quem somos?</a></li> -->
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data: () => ({}),
    methods: {
      changeLogin() {
        this.$emit('updated-login')
      }
      //   handleScroll() {
      //     const contentBar = document.querySelector(".content-bar");
      //     const rect = contentBar.getBoundingClientRect();
      //     console.log(rect);
      //     this.isWhiteSection = rect.top < 0 && rect.bottom > 0;
      //   },
      // },
      // mounted() {
      //   window.addEventListener("scroll", this.handleScroll);
      // },
      // beforeDestroy() {
      //   window.removeEventListener("scroll", this.handleScroll);
      // },
    }
  }
</script>

<style scoped>
  .nav-bar {
    display: flex;
    justify-content: center;
    position: fixed;
    top: 0;
    z-index: 999;
    width: 100%;
  }

  .content-bar {
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25%;
    padding: 5px;
    position: relative;
  }

  .content-bar::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 110%;
    background-color: #fff;
    box-shadow: 5px 2px 4px 2px rgba(0, 0, 0, 0.1);
  }
  .content-bar::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 110%;
    border-radius: 0;
    background-color: #fff;
    box-shadow: -7px 2px 4px 2px rgba(0, 0, 0, 0.1);
  }

  .content-bar::before {
    left: 0;
    //right: 10px;
    transform: skewX(-40deg);
    transform-origin: 0 100%;
  }

  .content-bar::after {
    //left: 10px;
    right: 0;
    transform: skewX(40deg);
    transform-origin: 0 100%;
  }
  .logo {
    width: 90px;
  }

  .logo img {
    max-width: 100%;
  }

  .content-action {
    z-index: 1;
    display: flex;
  }

  nav {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  nav ul {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  li {
    list-style: none;
    font-size: 13px;
    padding: 10px 0;
    color: #020202;
    position: relative;
  }

  li::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 3px;
    background-color: #291569;
    transition: width 0.3s ease-in-out;
  }

  li:hover::before {
    width: 100%;
    transition: width 0.3s ease-in-out;
  }

  a {
    text-decoration: none;
    color: #333;
  }
  a:visited {
    color: inherit;
  }

  button {
    background-color: #291569;
    color: #fff;
    border: none;
    padding: 6px 30px;
    border-radius: 3px;
    cursor: pointer;
    font-weight: bold;
    transition: 2s;
  }

  button:hover {
    background-color: #9318cc;
    color: #ffffff;
  }
</style>
