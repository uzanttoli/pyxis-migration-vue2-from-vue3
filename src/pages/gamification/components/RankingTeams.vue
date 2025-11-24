<template>
  <div class="container" v-if="ranking != ''">
    <img class="imagem-team" :src="imgTeam(image)" />
    <div class="list">
      <ul v-for="(item, index) in ranking" :key="index">
        <img class="img-medalhas" :src="classRanking(index + 1)" v-if="index < 3" />
        <span class="white--text ranking-colocacao" v-else>{{ index + 1 + 'ª' }}</span>
        <div v-if="item.NOME_AVATAR">
          <v-avatar size="50px" class="mr-2">
            <v-img height="100%" :src="imagemPerfil(item.NOME_AVATAR)"></v-img>
          </v-avatar>
        </div>
        <div v-else>
          <v-avatar size="50px" class="mr-2">
            <v-img height="100%" src="../../../assets/img/Avatar/padrao.png"></v-img>
          </v-avatar>
        </div>
        <div>
          <li v-html="item.NOME"></li>
          <li v-html="item.PATENTE"></li>
          <li v-html="item.XP"></li>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
  import config from '../../../core/config'
  export default {
    props: {
      dados: {
        type: Array
      },
      image: {
        type: String
      },
      nomeTime: {
        type: String
      },
      cargoSelect: {
        type: Number
      },
      nomeTimeCarregou: {
        type: Boolean
      }
    },
    data: () => ({
      ranking: []
    }),
    computed: {
      produto() {
        return this.$store.getters.usuario.produto
      },
      numCargo() {
        let cargo = this.$store.getters.usuario.filtro
        if (cargo == 'OPERADOR' || cargo == 'ADMINISTRADOR') {
          return 1
        } else if (cargo == 'SUPERVISOR') {
          return 2
        } else if (cargo == 'COORDENADOR') {
          return 3
        } else if (cargo == 'GERENTE') {
          return 4
        }
        return ''
      },
      considerarCargo() {
        return this.cargoSelect ? this.cargoSelect : this.numCargo
      }
    },
    methods: {
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      },
      userName(value) {
        let oneName = value.split(' ')
        let nameExhibition = `@${oneName[0]}`
        return nameExhibition.toLowerCase()
      },
      classRanking(index) {
        let img = require.context('../../../assets/img/team/medalhas', false, /\.png$/)
        if (index == 1) {
          return img('./ouro.png')
        } else if (index == 2) {
          return img('./prata.png')
        } else if (index == 3) {
          return img('./bronze.png')
        }
      },
      async loadRanking() {
        try {
          // this.ranking = "";
          // this.$emit("update:carregou", true);
          let urlData = `${config.baseUrl}api/shared/gamification/info/top_ranking/${this.produto}/${this.nomeTime}/${this.considerarCargo}`
          var res = await this.$api.get(urlData)
          this.ranking = res?.data
          setTimeout(() => {
            this.$emit('update:carregou', false)
          }, 2000)
        } catch (error) {
          console.error(error)
        }
      },
      imgTeam(img) {
        if (img) {
          let image = require.context('../../../assets/img/team', false, /\.png$/)
          return image('./' + img + '.png')
        }
      }
    },
    watch: {
      cargoSelect() {
        setTimeout(() => {
          this.loadRanking()
        }, 2000)
      },
      nomeTimeCarregou() {
        this.loadRanking()
      }
    },
    created() {
      this.loadRanking()
    }
  }
</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start !important;
    border-radius: 25px;
    width: 350px;
    background: #07182e;
  }
  .list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-decoration: none;
    z-index: 0;
  }
  .imagem-team {
    width: 250px;
    border-radius: 250px;
    padding: 10px;
    z-index: 0;
  }

  ul {
    display: flex;
    flex-direction: row;
    align-items: center;
    list-style-type: none;
    z-index: 0;
  }

  ul img {
    width: 70px;
    padding: 10px;
    border-radius: 150px;
    z-index: 0;
  }

  li {
    color: white;
  }
  /* .container {
  width: 300px;
  background: #07182e;
  position: relative;
  display: flex;
  place-content: center;
  place-items: center;
  overflow: hidden;
  border-radius: 20px;
} */

  @media screen and (max-width: 3000px) {
    .container {
      width: 350px;
      background: #07182e;
      position: relative;
      display: flex;
      margin-bottom: 10px;
      padding: 10px;
      place-content: center;
      place-items: center;
      overflow: hidden;
      border-radius: 20px;
    }
  }

  @media screen and (max-width: 1900px) {
    .container {
      width: 300px;
      background: #07182e;
      position: relative;
      display: flex;
      place-content: center;
      place-items: center;
      overflow: hidden;
      border-radius: 20px;
    }
  }

  .container::before {
    content: '';
    position: absolute;
    width: 100px;
    /* background-image: linear-gradient(180deg, rgb(0, 236, 255), rgb(255, 14, 61)); */
    height: 130%;
    animation: rotBGimg 4s linear infinite;
    transition: all 0.2s linear;
  }

  @keyframes rotBGimg {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  /* .container::after {
  content: "";
  position: absolute;
  background: #005acf;
  inset: 5px;
  border-radius: 15px;
} */

  .img-medalhas {
    width: 60px;
    margin-left: -30px;
  }

  .ranking-colocacao {
    margin-left: 0px;
    margin-right: 15px;
  }

  .align-medalha {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  span {
    font-size: 18px;
    font-weight: 700;
  }
</style>
