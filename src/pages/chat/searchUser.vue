<template>
  <!-- v-model="openDialog" -->
  <v-dialog
    width="360"
    persistent
    :model-value="openDialog"
    @update:modelValue="val => $emit('update:openDialog', val)"
  >
    <v-card elevation="5">
      <v-row class="pa-0 ma-0" align="center">
        <v-card-title>Pesquisar Usuário</v-card-title>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('update:close')" icon class="mr-2">
          <v-icon small color="red">fa-solid fa-xmark</v-icon>
        </v-btn>
      </v-row>
      <v-text-field
        outlined
        dense
        class="mx-2"
        placeholder="Digite o Almope/Nome desejado..."
        v-model="pesquisa"
        @keyup.enter="loadListUsers"
      ></v-text-field>
      <v-card class="overflow-auto" max-height="600" elevation="0">
        <router-link
          v-for="(item, i) in usuarios"
          :key="i"
          :to="{
            name: 'ChatId',
            params: { id: item.almope_receiver },
            query: {
              type_chat: 'private',
              with: 'almavivadobrasil',
              product: produto
            }
          }"
        >
          <div class="container">
            <!-- :href="'chat/' + item.almope" -->
            <div class="content" @click="coletaUser(item)">
              <v-badge
                bordered
                bottom
                :color="item.online_receiver == 1 ? 'green' : 'red'"
                dot
                offset-x="10"
                offset-y="10"
              >
                <v-avatar size="40">
                  <img
                    v-if="item.name_avatar != null"
                    :src="imagemPerfil(item.name_avatar)"
                    alt=""
                  />
                  <img v-else src="../../assets/img/Avatar/padrao.png" alt="" />
                </v-avatar>
              </v-badge>

              <div class="details">
                <span :title="item.name_receiver">{{ formatadedName(item.name_receiver) }}</span>
                <p>{{ formatadedName(item.job_receiver) }}</p>
              </div>
            </div>
            <!-- <div class="status-dot"><i class="fas fa-circle"></i></div> -->
          </div>
        </router-link>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
  import config from '../../core/config'
  export default {
    props: {
      openDialog: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      usuarios: [],
      pesquisa: null
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      produto() {
        return this.$store.getters.usuario.produto
      }
    },
    methods: {
      async loadListUsers() {
        let urlData = `${config.baseUrl}api/mysql/chat/contact/list_users/${this.pesquisa}/${this.usuarioAlmope}`
        var result = await this.$api.get(urlData)
        this.usuarios = result.data
      },
      coletaUser(item) {
        this.$emit('updated:user-select', item)
        this.$emit('update:close')
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
      }
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap"); */
  * {
    /* font-family: "Poppins", sans-serif; */
    text-decoration: none;
  }
  .header {
    display: flex;
    flex-direction: row;
    padding: 10px 10px 10px 20px;
    align-items: center;
  }
  .header .header-img {
    height: 55px;
    border-radius: 50%;
  }

  .my-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .search {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid #e6e6e6;
  }
  .users-list {
    height: 70%;
    overflow-y: auto;
    overflow-x: hidden;
    margin: 10px;
  }
  .users-list::-webkit-scrollbar {
    width: 0px;
  }
  .container {
    display: flex;
    align-items: center;
    margin-bottom: -20px;
  }

  .content {
    display: flex;
    align-items: center;
    width: 90%;
  }

  .content .details {
    color: #000;
    margin-left: 20px;
    font-family: 'Poppins', sans-serif;
    height: 50px;
    width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .container {
    width: 100%;
  }

  .details span {
    font-size: 18px;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
  }

  .details p {
    font-size: 12px;
    font-weight: 400;
    font-family: 'Poppins', sans-serif;
  }

  a img {
    height: 40px;
    width: 40px;
  }

  a {
    /* padding-bottom: 10px; */
    /* margin-bottom: 15px; */
    padding-right: 15px;
    border-bottom-color: #f1f1f1;
  }

  a:last-child {
    margin-bottom: 0px;
    border-bottom: none;
  }
</style>
