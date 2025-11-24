<template>
  <v-card class="rounded-lg mt-6" elevation="8" height="92vh">
    <div class="header">
      <div style="display: flex; flex-direction: row; align-items: center" class="mb-n7">
        <img v-if="myAvatar" class="header-img" :src="imagemPerfil(myAvatar)" />
        <img v-else class="header-img" src="../../assets/img/Avatar/padrao.png" />
        <v-card-title style="width: 90%">
          <v-col class="ma-0 pa-0">
            <v-text-field
              outlined
              dense
              placeholder="Pesquise aqui..."
              class="rounded-xl"
              autofocus
              v-model="itemFilter"
              @change="userFilter()"
            ></v-text-field>
          </v-col>
          <v-speed-dial v-model="fab" direction="bottom" absolute style="right: 10px">
            <template v-slot:activator>
              <v-btn v-model="fab" dark fab small class="primary ma-2 mt-n5" elevation="0">
                <v-icon v-if="fab" small>fa-solid fa-xmark</v-icon>
                <v-icon v-else small>fa-solid fa-ellipsis-vertical</v-icon>
              </v-btn>
            </template>
            <v-tooltip right>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  fab
                  dark
                  small
                  color="green"
                  class="mt-n4"
                  v-bind="attrs"
                  v-on="on"
                  @click="isSearchUser = !isSearchUser"
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </template>
              <span>Pesquisar Usuário</span>
            </v-tooltip>
            <v-tooltip right>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  :disabled="filtro == 'OPERADOR'"
                  fab
                  dark
                  small
                  color="indigo"
                  v-bind="attrs"
                  v-on="on"
                  @click="isCreateGroup = !isCreateGroup"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>Criar Grupo</span>
            </v-tooltip>
          </v-speed-dial>
        </v-card-title>
      </div>
    </div>

    <div class="search">
      <v-tabs v-model="tab" centered icons-and-text height="54" show-arrows>
        <v-tabs-slider></v-tabs-slider>
        <v-tab href="#tab-1">
          <v-badge
            bordered
            color="primary"
            v-if="countNotification"
            :content="newListNotification.length"
            offset-x="10"
            offset-y="-5"
          >
            <span style="font-size: 10px" class="font-tab">Notificações</span>
          </v-badge>
          <span style="font-size: 10px" class="font-tab" v-else>Notificações</span>
          <v-icon class="tab-icon" small>fa-regular fa-bell</v-icon>
        </v-tab>

        <v-tab href="#tab-2">
          <span style="font-size: 10px" class="font-tab">Recentes</span>
          <v-icon class="tab-icon" small>fa-regular fa-comments</v-icon>
        </v-tab>

        <v-tab href="#tab-3">
          <span style="font-size: 10px" class="font-tab">Favoritos</span>
          <v-icon class="tab-icon" small>fa-regular fa-star</v-icon>
        </v-tab>

        <v-tab href="#tab-4">
          <span style="font-size: 10px" class="font-tab">Grupos</span>
          <v-icon class="tab-icon" small>fa-solid fa-people-group</v-icon>
        </v-tab>
      </v-tabs>
    </div>
    <div class="users-list">
      <v-tabs-items v-model="tab">
        <v-tab-item :value="'tab-' + 1">
          <v-card flat>
            <router-link
              v-for="(item, i) in newListNotification"
              :key="i"
              :to="{
                name: 'ChatId',
                params: { id: item.almope_send },
                query: {
                  type_chat: 'private',
                  // name_receiver: item.name_send,
                  with: 'almavivadobrasil',
                  product: produto
                }
              }"
            >
              <div
                class="container"
                :class="$route.params.id == item.almope_send ? 'blue lighten-5' : ''"
              >
                <!-- :href="'chat/' + item.almope" -->
                <div class="content" @click="coletaUser(item)">
                  <v-badge
                    bordered
                    bottom
                    :color="item.online_receiver == 1 ? 'green' : 'red'"
                    :content="item.quantidade"
                    offset-x="13"
                    offset-y="15"
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
                    <span :title="item.name_send">{{ formatadedName(item.name_send) }}</span>
                    <p style="font-weight: 500">Nova mensagem!</p>
                  </div>
                </div>
                <!-- <div class="status-dot"><i class="fas fa-circle"></i></div> -->
              </div>
            </router-link>
          </v-card>
        </v-tab-item>
        <v-tab-item :value="'tab-' + 2">
          <v-card flat>
            <loadInfoChat class="mt-3" :loading="loadListRecent" />
            <router-link
              v-for="(item, i) in userFilterRecentes()"
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
              <div
                class="container"
                :class="$route.params.id == item.almope_receiver ? 'blue lighten-5' : ''"
              >
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
                    <span :title="item.name_receiver" class="mr-1">
                      {{ formatadedName(item.name_receiver) }}
                    </span>

                    <p
                      :style="item.msg_not_read > 0 ? 'font-weight: 500;' : ''"
                      v-html="
                        item.msg_not_read > 0
                          ? '<strong>Nova mensagem disponivel</strong>'
                          : formatadedName(item.job_receiver)
                      "
                    ></p>
                  </div>
                </div>
                <!-- <div class="status-dot"><i class="fas fa-circle"></i></div> -->
              </div>
            </router-link>
          </v-card>
        </v-tab-item>
        <v-tab-item :value="'tab-' + 3">
          <v-card flat>
            <loadInfoChat class="mt-3" :loading="loadDataListUsers" />
            <router-link
              v-for="(item, i) in userFilter()"
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
              <!-- :to="`${item.almope_receiver}`" -->
              <div
                class="container"
                :class="$route.params.id == item.almope_receiver ? 'blue lighten-5' : ''"
              >
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
                    <span :title="item.name_receiver">
                      {{ formatadedName(item.name_receiver) }}
                    </span>
                    <p>{{ formatadedName(item.job_receiver) }}</p>
                  </div>
                </div>
                <!-- <div class="status-dot"><i class="fas fa-circle"></i></div> -->
              </div>
            </router-link>
          </v-card>
        </v-tab-item>
        <v-tab-item :value="'tab-' + 4">
          <v-card flat tile>
            <loadInfoChat class="mt-3" :loading="loadDataGroup" />

            <router-link
              v-for="(item, i) in userFilterGroups()"
              :key="i"
              :to="{
                name: 'ChatId',
                params: { id: item.group_id },
                query: {
                  type_chat: 'group',
                  name_group: item.group_name,
                  with: 'almavivadobrasil',
                  product: produto
                }
              }"
            >
              <div
                class="container"
                :class="$route.params.id == item.group_id ? 'blue lighten-5' : ''"
              >
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
                        :src="imagePefilGroup(item.name_avatar)"
                        alt=""
                      />
                      <img v-else src="../../assets/img/Avatar/padrao.png" alt="" />
                    </v-avatar>
                  </v-badge>

                  <div class="details">
                    <span :title="item.group_name">{{ item.group_name }}</span>
                    <p>{{ formatadedName(item.date_creation) }}</p>
                  </div>
                </div>
              </div>
            </router-link>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </div>
    <search-user
      @updated:user-select="userSelected"
      :openDialog="isSearchUser"
      @update:close="isSearchUser = !isSearchUser"
    ></search-user>
    <create-group
      :openDialogCreateGroup="isCreateGroup"
      @update:close="isCreateGroup = !isCreateGroup"
      @update:group-created="groupCreated"
    ></create-group>
  </v-card>
</template>

<script>
  import config from '../../core/config'
  import CreateGroup from './createGroup.vue'
  import searchUser from './searchUser.vue'
  import loadInfoChat from './loadInfoChat.vue'
  export default {
    components: { searchUser, CreateGroup, loadInfoChat },
    props: {
      validateIsReceivedMessage: {
        type: Boolean,
        default: false
      },
      validateIsRecentUsers: {
        type: Boolean,
        default: false
      },
      changeTabRecent: {
        type: Boolean,
        default: false
      },
      realoadDataUserGroup: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      usuarios: [],
      tab: null,
      itemFilter: null,
      fab: false,
      isCreateGroup: false,
      isSearchUser: false,
      loadDataGroup: false,
      loadDataListUsers: false,
      loadListRecent: false,
      listSendRecent: [],
      listReceiverRecent: []
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
      },
      listMyGroup() {
        let list = this.$store.getters.listMyGroup
        return list ? list : []
      },
      listNotificationMessages() {
        let listNotification = this.$store.getters.listNotificationMessages
        return listNotification ? listNotification : []
      },
      newListNotification() {
        let list = this.listNotificationMessages
        const uniqueArray = []
        const countMap = {}

        list?.forEach(item => {
          const { almope_send } = item
          // Verifica se o item já existe no novo array
          if (!countMap[almope_send]) {
            countMap[almope_send] = 1
            uniqueArray.push({ ...item, quantidade: 1 })
          } else {
            countMap[almope_send]++
          }
        })

        uniqueArray.forEach(item => {
          item.quantidade = countMap[item.almope_send]
        })

        return uniqueArray
      },
      countNotification() {
        return this.listNotificationMessages ? this.listNotificationMessages.length : 0
      },
      listUsersRecents() {
        let send = this.listSendRecent
        let receiver = this.listReceiverRecent
        let concat = [...send, ...receiver]

        const arrayUnique = []
        const countMap = {}

        concat.forEach(item => {
          const { almope_receiver } = item

          if (!countMap[almope_receiver]) {
            countMap[almope_receiver] = 1
            arrayUnique.push({ ...item })
          } else {
            countMap[almope_receiver]++
          }
        })
        this.$emit('update:list-array-recent', arrayUnique)
        return arrayUnique
      }
    },
    methods: {
      loadListSendRecent() {
        this.loadListRecent = true
        let urlData = `${config.baseUrl}api/mysql/chat/contact/users_recent_send/${this.usuarioAlmope}`
        this.$api.get(urlData).then(result => {
          this.listSendRecent = result.data
        })
      },
      loadListReceiverRecent() {
        let urlData = `${config.baseUrl}api/mysql/chat/contact/users_recent_receiver/${this.usuarioAlmope}`
        this.$api.get(urlData).then(result => {
          this.listReceiverRecent = result.data
          this.loadListRecent = false
        })
      },
      imagePefilGroup(img) {
        if (!img) return
        return `${process.env.VUE_APP_PYXIS_API_CHAT}/arquivos/get_image_perfil/${img}`
      },
      insertCountNotification() {
        this.$store.dispatch('insertCountNotification', this.newListNotification.length)
      },
      groupCreated() {
        this.loadListMyGroup()
      },
      loadListNotificationMessages() {
        this.$store.dispatch('loadListNotificationMessages', this.usuarioAlmope)
      },
      loadListMyGroup() {
        this.loadDataGroup = true
        this.$store.dispatch('loadListMyGroup', this.usuarioAlmope).then(() => {
          this.loadDataGroup = false
        })
      },

      loadListUsersRecent() {
        this.loadListSendRecent()
        this.loadListReceiverRecent()
      },
      userSelected(item) {
        this.$emit('updated:user-repass-selected', item)
      },
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
      userFilterRecentes() {
        if (this.itemFilter == null) {
          return this.listUsersRecents
        } else {
          const valorProcurado = this.itemFilter.toLowerCase()

          return this.listUsersRecents.filter(item => {
            const valores = Object.values(item)
            return valores.some(valor => {
              return String(valor).toLowerCase().includes(valorProcurado)
            })
          })
        }
      },
      userFilterGroups() {
        if (this.itemFilter == null) {
          return this.listMyGroup
        } else {
          const valorProcurado = this.itemFilter.toLowerCase()

          return this.listMyGroup.filter(item => {
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
        this.loadDataListUsers = true
        let urlData = `${config.baseUrl}api/mysql/chat/contact/favorite/${this.usuarioAlmope}`
        var result = await this.$api.get(urlData)
        this.usuarios = result.data
        this.loadDataListUsers = false
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
      this.loadListUsersRecent()
      this.loadListMyGroup()
      this.loadListNotificationMessages()
    },
    watch: {
      changeTabRecent() {
        if (this.changeTabRecent == true) {
          this.tab = `tab-2`
        }
      },
      validateIsRecentUsers() {
        if (this.validateIsRecentUsers == true) {
          this.loadListUsersRecent()
        }
      },
      validateIsReceivedMessage() {
        if (this.validateIsReceivedMessage == true) {
          // this.loadListUsers();
          this.loadListUsersRecent()
          this.loadListMyGroup()
          this.loadListNotificationMessages()
        }
      },
      realoadDataUserGroup() {
        if (this.realoadDataUserGroup == true) {
          this.loadListMyGroup()
        }
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
    padding: 0px 0px 0px 20px;
    align-items: center;
  }
  .header .header-img {
    height: 55px;
    width: 55px;
    margin-top: -24px;
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

  .users-list .content {
    display: flex;
    align-items: center;
    width: 90%;
  }

  .users-list .content .details {
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

  .users-list .details span {
    font-size: 18px;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
  }

  .users-list .details p {
    font-size: 12px;
    font-weight: 400;
    font-family: 'Poppins', sans-serif;
  }

  .users-list a img {
    height: 40px;
    width: 40px;
  }

  .users-list a {
    /* padding-bottom: 10px; */
    /* margin-bottom: 15px; */
    padding-right: 15px;
    border-bottom-color: #f1f1f1;
  }

  .users-list a:last-child {
    margin-bottom: 0px;
    border-bottom: none;
  }

  .ui-details {
    border-radius: 4px;
    padding: 7px;
  }

  details summary {
    height: 20px; /* Defina a altura desejada para o summary */
    position: sticky;
    padding: 5px;
    top: 0;
    background-color: #fff; /* Opcional: Defina a cor de fundo desejada */
    z-index: 1; /* Opcional: Defina um z-index maior que o conteúdo do details para garantir que o summary fique sempre à frente */
    bottom: 10px;
  }
  .ui-details summary {
    font-weight: bold;
    cursor: pointer;
    color: #67676a;
  }

  .tab-icon {
    margin-bottom: 8px !important;
  }

  .font-tab {
    font-size: 15px;
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
  }
</style>
