<template>
  <!-- v-model="openDialogMember" -->
  <v-dialog
    width="600"
    persistent
    :model-value="openDialogMember"
    @update:modelValue="val => $emit('update:openDialogMember', val)"
  >
    <v-card :loading="loadingUsers">
      <v-row class="pa-0 ma-0" align="center">
        <v-card-title>Membros</v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="openDialogAddMemberGroup = true" v-if="isAdministrador(usuarioAlmope)">
          <v-icon small color="black">fa-solid fa-user-plus</v-icon>
        </v-btn>
        <v-btn @click="$emit('update:close')" icon class="mr-2">
          <v-icon small color="red">fa-solid fa-xmark</v-icon>
        </v-btn>
      </v-row>
      <v-divider></v-divider>
      <v-col>
        <v-card class="overflow-auto card-over overflow-x-hidden" max-height="600" elevation="0">
          <ul class="user-list">
            <li class="user-item" v-for="(item, i) in usuariosMember" :key="i">
              <img
                class="header-img"
                v-if="item.name_avatar != null"
                :src="imagemPerfil(item.name_avatar)"
                alt=""
              />
              <img v-else src="../../assets/img/Avatar/padrao.png" alt="Imagem do usuário" />
              <div class="user-info" :title="item.almope_receiver">
                <h4 class="user-name">{{ item.name_receiver }}</h4>
                <div style="display: flex">
                  <!-- <p class="user-role text-capitalize">
                    Sou {{ item.job_receiver }}
                  </p> -->
                  <v-chip
                    x-small
                    :color="item.permission == 'MANAGER' ? 'cyan darken-3' : 'grey darken-1'"
                    class="white--text"
                  >
                    {{ item.permission == 'MANAGER' ? 'ADMINISTRADOR' : 'MEMBRO' }}
                  </v-chip>
                </div>
              </div>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ attrs, on }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    icon
                    :disabled="isSend"
                    :loading="isSend"
                    small
                    @click="toAssignAdministrator(item.almope_receiver, item.permission)"
                    v-if="isAdministrador(usuarioAlmope) && item.almope_receiver != usuarioAlmope"
                  >
                    <v-icon :color="item.permission == 'MEMBER' ? 'green' : 'red'" small>
                      {{
                        item.permission == 'MEMBER'
                          ? 'fa-solid fa-square-plus'
                          : 'fa-solid fa-square-minus'
                      }}
                    </v-icon>
                  </v-btn>
                </template>
                <span>
                  {{
                    item.permission == 'MEMBER' ? 'Atribuir Administrador' : 'Remover Administrador'
                  }}
                </span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ attrs, on }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    v-if="item.almope_receiver != usuarioAlmope"
                    icon
                    small
                    @click="changeRoute(item.almope_receiver)"
                  >
                    <v-icon color="blue lighten-3" small>fa-solid fa-message</v-icon>
                  </v-btn>
                </template>
                <span>Conversar com usuário</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ attrs, on }">
                  <v-btn
                    :disabled="isSend"
                    @click="removeMember(item.almope_receiver)"
                    v-bind="attrs"
                    v-on="on"
                    icon
                    small
                    v-if="isAdministrador(usuarioAlmope)"
                  >
                    <v-icon color="red" small>fa-solid fa-trash-can</v-icon>
                  </v-btn>
                </template>
                <span>
                  {{ item.almope_receiver == usuarioAlmope ? 'Sair do grupo' : 'Remover usuário' }}
                </span>
              </v-tooltip>
            </li>
            <!-- Adicione mais <li> para cada usuário na lista -->
          </ul>
        </v-card>
      </v-col>
    </v-card>
    <add-member-group
      :openDialogAddMemberGroup="openDialogAddMemberGroup"
      :usersparticipateGroup="usuariosMember"
      @update:close="openDialogAddMemberGroup = !openDialogAddMemberGroup"
      @update:new-users-group="isNewUsersGroup"
    ></add-member-group>
  </v-dialog>
</template>

<script>
  import config from '@/core/config'
  import addMemberGroup from './addMemberGroup.vue'
  export default {
    components: { addMemberGroup },
    props: {
      openDialogMember: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      usuariosMember: [],
      isSend: false,
      openDialogAddMemberGroup: false,
      loadingUsers: false
    }),
    computed: {
      produto() {
        return this.$store.getters.usuario.produto
      },
      userRouter() {
        return this.$route.params.id
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      userAdministrador() {
        let user = this.usuariosMember
        return user
          .filter(item => {
            return item.permission == 'MANAGER'
          })
          .map(i => {
            return {
              almope_receiver: i.almope_receiver,
              permission: i.permission
            }
          })
      }
    },
    methods: {
      toAssignAdministrator(user, permission) {
        if (!user) return
        let permissionConsider = ''
        if (permission == 'MEMBER') {
          permissionConsider = 'ADMINISTRADOR'
        } else {
          permissionConsider = 'MEMBER'
        }
        const data = {
          almope: user,
          permission: permissionConsider,
          groupId: this.userRouter
        }
        this.isSend = true
        let urlData = `${config.baseUrl}api/mysql/chat/group/alter_permission`
        this.$api.post(urlData, data).then(() => {
          this.loadListUsersMember()
          this.isSend = false
        })
      },
      isNewUsersGroup() {
        this.loadListUsersMember()
      },
      async removeMember(user) {
        try {
          this.isSend = true
          if (this.$route.query.type_chat == 'group') {
            let urlData = `${config.baseUrl}api/mysql/chat/group/delete_user/${this.userRouter}/${user}`
            await this.$api.get(urlData)
            this.loadListUsersMember()
            this.isSend = false
          }
        } catch (error) {
          console.error(error)
        }
      },
      changeRoute(almope_receiver) {
        this.$router.push({
          name: 'ChatId',
          params: { id: almope_receiver },
          query: {
            type_chat: 'private',
            with: 'almavivadobrasil',
            product: this.produto
          }
        })
        this.$emit('update:close')
      },
      isAdministrador(almope) {
        let user = this.userAdministrador.filter(item => {
          return item.almope_receiver == almope
        })

        if (user.length > 0) {
          return true
        } else {
          return false
        }
      },
      async loadListUsersMember() {
        try {
          this.usuariosMember = []
          this.loadingUsers = true
          if (this.$route.query.type_chat == 'group') {
            let urlData = `${config.baseUrl}api/mysql/chat/group/members/${this.userRouter}`
            var result = await this.$api.get(urlData)
            this.usuariosMember = result.data
            this.loadingUsers = false
          }
        } catch (error) {
          console.error(error)
        }
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
    },
    created() {
      // this.loadListUsersMember();
    },
    watch: {
      openDialogMember() {
        if (this.openDialogMember == true) {
          this.loadListUsersMember()
        }
      }
      // userRouter() {
      //   this.loadListUsersMember();
      // },
    }
  }
</script>

<style scoped>
  .user-list {
    list-style: none;
    padding: 0;
  }

  .user-item {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }

  .user-item img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
    margin-left: 5px;
  }

  .user-info {
    display: flex;
    flex-direction: column;
  }

  .user-name {
    margin: 0;
  }

  .user-role {
    margin: 0;
    font-size: 12px;
    color: gray;
  }

  .card-over::-webkit-scrollbar {
    width: 10px; /* width of the entire scrollbar */
  }

  .card-over::-webkit-scrollbar-track {
    background: rgb(255, 255, 254); /* color of the tracking area */
  }

  .card-over::-webkit-scrollbar-thumb {
    background-color: rgb(143, 14, 143); /* color of the scroll thumb */
    border-radius: 25px; /* roundness of the scroll thumb */
    border: 3px solid rgb(245, 245, 245); /* creates padding around scroll thumb */
  }
</style>
