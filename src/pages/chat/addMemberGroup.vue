<template>
  <!-- v-model="openDialogAddMemberGroup" -->
  <v-dialog
    persistent
    width="500"
    :model-value="openDialogAddMemberGroup"
    @update:modelValue="val => $emit('update:openDialogAddMemberGroup', val)"
  >
    <v-card elevation="3">
      <v-row class="pa-0 ma-0" align="center">
        <v-card-title>Adicionar membros</v-card-title>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('update:close')" icon class="mr-2">
          <v-icon small color="red">fa-solid fa-xmark</v-icon>
        </v-btn>
      </v-row>
      <v-divider></v-divider>
      <v-col class="mx-0 px-0">
        <v-card class="overflow-auto card-over" max-height="600" elevation="0">
          <v-col>
            <v-text-field
              outlined
              dense
              placeholder="Informe o nome do membro"
              label="Informe o nome do membro"
              autofocus
              v-model="itemFilter"
              @change="userFilter()"
            ></v-text-field>
          </v-col>
          <ul class="user-list">
            <li
              class="user-item"
              v-for="(item, i) in userFilter()"
              :key="i"
              @click="insertUser(item, i)"
              :class="usersIncludesGroup(item)"
              style="cursor: pointer"
            >
              <img src="../../assets/img/Avatar/padrao.png" alt="Imagem do usuário" />
              <div class="user-info" :title="item.almope_receiver">
                <h4 class="user-name">{{ item.name_receiver }}</h4>
                <p class="user-role">{{ item.job_receiver }}</p>
              </div>
              <v-spacer></v-spacer>
              <v-chip
                v-if="usersIncludesGroup(item) == 'blue lighten-5'"
                class="mr-3"
                small
                color="error"
                @click="removerUser(item)"
              >
                Remover
              </v-chip>
            </li>
            <!-- Adicione mais <li> para cada usuário na lista -->
          </ul>
        </v-card>
      </v-col>
      <v-col>
        <v-row align="center" justify="center">
          <v-btn class="mb-2" color="success" @click="createGroup">Adicionar membros</v-btn>
        </v-row>
      </v-col>
    </v-card>
    <loadhastag
      :activeMsg="true"
      :envioDados="addUserGroup"
      msg="Adicionando novos usuários"
    ></loadhastag>
  </v-dialog>
</template>

<script>
  import config from '../../core/config'
  import alerts from '../../mixins/alerts.mixins'
  import loadhastag from '../../shared/components/load/loadHastag.vue'
  export default {
    components: { loadhastag },
    props: {
      openDialogAddMemberGroup: {
        type: Boolean,
        default: false
      },
      usersparticipateGroup: {
        type: [Array, Object],
        require: true
      }
    },
    mixins: [alerts],
    data: () => ({
      usuarios: [],
      usersSelected: [],
      nameGroup: null,
      maxLength: 20,
      message: '',
      itemFilter: null,
      addUserGroup: false
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      userRouter() {
        return this.$route.params.id
      },
      listUsers() {
        let item = this.getDifferentValues(this.usuarios, this.usersparticipateGroup)
        return item
      }
    },
    methods: {
      getDifferentValues(array1, array2) {
        const differentValues = array1.filter(item1 => {
          return !array2.some(
            item2 =>
              item2.almope_receiver === item1.almope_receiver &&
              item2.name_receiver === item1.name_receiver
          )
        })

        return differentValues
      },
      userFilter() {
        if (this.itemFilter == null) {
          return this.listUsers
        } else {
          const valorProcurado = this.itemFilter.toLowerCase()

          return this.listUsers.filter(item => {
            const valores = Object.values(item)
            return valores.some(valor => {
              return String(valor).toLowerCase().includes(valorProcurado)
            })
          })
        }
      },
      async createGroup() {
        try {
          this.addUserGroup = true

          let usersSelected = this.usersSelected

          let users = usersSelected.map(user => {
            return {
              id_group: this.userRouter,
              almope_member: user.almope_receiver
            }
          })

          // Inserir usuario criador no grupo;

          await this.$api.post('api/mysql/chat/actions/users_group', users)

          this.addUserGroup = false
          // Limpar form
          this.usersSelected = []
          this.itemFilter = null
          this.$emit('update:new-users-group')
          this.$emit('update:close')
        } catch (e) {
          console.error(e)
        }
      },
      // removerUser(item) {},
      insertUser(item) {
        if (this.usersSelected.includes(item)) {
          let result = this.usersSelected.filter(user => {
            return user.almope_receiver != item.almope_receiver
          })
          this.usersSelected = result
        } else {
          this.usersSelected.push(item)
        }
      },
      async loadListUsers() {
        let urlData = `${config.baseUrl}api/mysql/chat/contact/list_users_group/${this.usuarioAlmope}`
        var result = await this.$api.get(urlData)
        let e = result.data

        // const filteredArray = e.filter(
        //   (item1) =>
        //     !this.usersparticipateGroup.some(
        //       (item2) => item2.almope_receiver === item1.almope_receiver
        //     )
        // );

        this.usuarios = e
      },
      usersIncludesGroup(value) {
        if (this.usersSelected.includes(value)) {
          return 'blue lighten-5'
        } else {
          return ''
        }
      },
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      }
    },
    watch: {
      openDialogAddMemberGroup() {
        if (this.openDialogAddMemberGroup == true) {
          this.loadListUsers()
        }
      }
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
