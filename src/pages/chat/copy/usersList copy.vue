<template>
  <div class="wrapper">
    <section class="users">
      <header>
        <div class="content">
          <img
            :src="myAvatar ? imagemPerfil(myAvatar) : '../../assets/img/Avatar/padrao.png'"
            alt=""
          />
          <div class="details">
            <span class="my-name">{{ formatadedName(nome) }}</span>
            <v-icon>mdi-dots-vertical</v-icon>
            <p>Online</p>
          </div>
        </div>
      </header>
      <div class="search">
        <input
          type="text"
          placeholder="Procure por um nome..."
          v-model="itemFilter"
          @change="userFilter()"
        />
      </div>

      <div class="users-list">
        <details class="ui-details">
          <summary class="mr-2">
            Conversas Recentes
            <v-icon small>fa-solid fa-clock-rotate-left</v-icon>
          </summary>
        </details>
        <details class="ui-details">
          <summary class="mr-2">
            Contatos Favoritos
            <v-icon color="red" small>fa-solid fa-heart</v-icon>
          </summary>
          <router-link
            v-for="(item, i) in userFilter()"
            :key="i"
            :to="`${item.ALMOPE_PARA}`"
            class="mt-2"
          >
            <!-- :href="'chat/' + item.almope" -->
            <div class="content" @click="coletaUser(item)">
              <img v-if="item.AVATAR_PARA != null" :src="imagemPerfil(item.AVATAR_PARA)" alt="" />
              <img v-else src="../../assets/img/Avatar/padrao.png" alt="" />
              <div class="details">
                <span :title="item.NOME_PARA">{{ formatadedName(item.NOME_PARA) }}</span>
                <p>{{ formatadedName(item.CARGO_PARA) }}</p>
              </div>
            </div>
            <div class="status-dot"><i class="fas fa-circle"></i></div>
          </router-link>
        </details>
      </div>
    </section>
  </div>
</template>

<script>
  import config from '../../../core/config'
  export default {
    data: () => ({
      usuarios: [
        // { almope: 4602597, nome: "Uanderson", message: "oi" },
        // { almope: 4637725, nome: "Cadu", message: "oi" },
        // { almope: 4172639, nome: "Diego", message: "oi" },
        // { almope: 4175516, nome: "Victor", message: "oi" },
      ],
      itemFilter: null
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      nome() {
        return this.$store.getters.usuario.nome
      },
      myAvatar() {
        let myAvatar = this.$store.getters.myAvatar
        return myAvatar ? myAvatar : ''
      },
      filtro() {
        return this.$store.getters.usuario.filtro
      },
      produto() {
        return this.$store.getters.usuario.produto
      }
    },
    methods: {
      userFilter() {
        if (this.itemFilter == null) {
          return this.usuarios
        } else {
          const valorProcurado = this.itemFilter.toLowerCase()

          return this.usuarios.filter(item => {
            const valores = Object.values(item)
            return valores.some(valor => {
              return String(valor).toLowerCase().includes(valorProcurado)
            })
          })
        }
      },
      coletaUser(item) {
        this.$emit('updated:user-select', item)
      },
      async loadListUsers() {
        let urlData = `${config.baseUrl}api/shared/chat/users_list/${this.usuarioAlmope}/${this.filtro}/${this.produto}`
        var res = await this.$api.get(urlData)
        this.usuarios = res.data
      },
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      },
      formatadedName(value) {
        if (!value) return

        let nameSplit = value.split(' ')
        let name = []
        for (let i = 0; i < nameSplit.length; i++) {
          let primeiroNome = nameSplit[i][0]
          name.push(primeiroNome + nameSplit[i].toLowerCase().slice(1))
        }
        return name.join().replaceAll(',', ' ')
      },
      loadMyAvatar() {
        return this.$store.dispatch('loadMyAvatar', this.usuarioAlmope)
      }
    },
    created() {
      this.loadListUsers()
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap"); */
  * {
    /* font-family: "Poppins", sans-serif; */
    text-decoration: none;
  }

  body {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    min-height: 92vh !important;
    background: #f7f7f7 !important;
    padding: 0 10px !important;
  }
  .wrapper {
    background: #fff;
    max-width: 95vw;
    display: flex;
    width: 100%;
    height: 92vh;
    border-radius: 16px;
    margin-top: 25px;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1), 0 32px 64px -48px rgba(0, 0, 0, 0.5);
  }

  /* Users List CSS Start */
  .users {
    padding: 14px 30px;
    width: 100%;
  }

  .users header,
  .users-list a {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #e6e6e6;
    justify-content: space-between;
  }
  .wrapper img {
    object-fit: cover;
    border-radius: 50%;
  }
  .users header img {
    height: 50px;
    width: 50px;
  }
  :is(.users, .users-list) .content {
    display: flex;
    align-items: center;
  }

  .my-name {
    width: 125px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :is(.users, .users-list) .content .details {
    color: #000;
    margin-left: 20px;
    font-family: 'Poppins', sans-serif;
    height: 50px;
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :is(.users, .users-list) .details span {
    font-size: 18px;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
  }
  .users header .logout {
    display: block;
    background: #333;
    color: #fff;
    outline: none;
    border: none;
    padding: 7px 15px;
    text-decoration: none;
    border-radius: 5px;
    font-size: 17px;
  }

  .users .search {
    margin: 30px 0;
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
  }
  .users .search .text {
    font-size: 18px;
  }
  .users .search input {
    position: absolute;
    height: 42px;
    width: calc(100% - 50px);
    font-size: 16px;
    padding: 5px 13px;
    border: 1px solid #e6e6e6;
    outline: none;
    border-radius: 5px 5px 5px 5px;
  }

  .users-list {
    min-height: 680px;
    max-height: 680px;
    overflow-y: auto;
  }
  :is(.users-list, .chat-box)::-webkit-scrollbar {
    width: 0px;
  }
  .users-list a {
    padding-bottom: 10px;
    margin-bottom: 15px;
    padding-right: 15px;
    border-bottom-color: #f1f1f1;
  }
  .users-list a:last-child {
    margin-bottom: 0px;
    border-bottom: none;
  }
  .users-list a img {
    height: 40px;
    width: 40px;
  }
  .users-list a .details p {
    color: #67676a;
  }
  .users-list a .status-dot {
    font-size: 12px;
    /* color: #468669; */
    color: #ccc;
    padding-left: 10px;
  }
  .users-list a .status-dot.offline {
    color: #ccc;
  }

  .ui-details {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    /* margin-bottom: 10px; */
  }

  .ui-details summary {
    font-weight: bold;
    cursor: pointer;
    color: #67676a;
  }

  .ui-details p {
    /* margin-top: 10px; */
  }
</style>
