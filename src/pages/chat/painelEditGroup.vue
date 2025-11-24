<template>
  <!-- v-model="openEditGroup" -->

  <v-dialog
    persistent
    width="700"
    :model-value="openEditGroup"
    @update:modelValue="val => $emit('update:openEditGroup', val)"
  >
    <v-card tile>
      <v-card-title>
        Gerenciar Grupo | {{ $route.query.name_group }}
        <v-spacer></v-spacer>

        <v-btn @click="$emit('update-close')" icon><v-icon>fa-solid fa-xmark</v-icon></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card tile>
        <v-col>
          <template v-if="tab == 0">
            <input type="file" hidden ref="fileInput" @change="onFileChange" :disabled="tab != 0" />

            <div class="container-img">
              <img :src="imagePefilGroup(info.name_avatar)" v-if="info.name_avatar" />

              <img src="../../assets/img/Avatar/padrao.png" v-else />

              <i v-if="imageData" class="fa-solid fa-circle-chevron-right"></i>

              <img v-if="imageData" :src="imageData" />

              <v-divider vertical></v-divider>

              <div class="anexo" @click="openImage">
                <i class="fa-solid fa-paperclip"></i>

                <p>Anexar imagem</p>

                <p class="format">image/jpg, image/gif, image/png</p>
              </div>
            </div>
          </template>

          <v-divider class="my-2"></v-divider>

          <v-row>
            <!-- <pre>{{ formEditGroup }}</pre> -->

            <v-tabs v-model="tab">
              <v-tabs-slider></v-tabs-slider>

              <v-tab v-for="(item, i) in abas" :key="i" v-show="item.status == 1">
                {{ item.name }}
                <v-spacer></v-spacer>

                <v-btn icon v-if="item.close"><v-icon>mdi-close</v-icon></v-btn>
              </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <template v-for="item in abas" :key="item.name">
                <v-tab-item v-show="item.status == 1">
                  <component
                    :is="item.component"
                    :infoProps="info"
                    :fileImg="fileImg"
                    @atualizarDadosDoPerfil="dadosAtualizados"
                    @atualizarInfoGrupo="reloadInfoGroup"
                  ></component>
                </v-tab-item>
              </template>
            </v-tabs-items>
          </v-row>
        </v-col>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
  import editGroup from './editGroup.vue'
  import addMemberDemand from './addMemberDemand.vue'
  import config from '../../core/config'
  export default {
    components: { editGroup, addMemberDemand },
    props: {
      openEditGroup: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      tab: null,
      info: [],
      fileImg: null,
      abas: [
        { name: 'Geral', component: 'edit-group', close: false, status: 1 },
        { name: 'Editar Admins', component: null, close: false, status: 0 },
        {
          name: 'Adicionar Membros (+10)',
          component: 'add-member-demand',
          close: false,
          status: 1
        }
      ],
      imageData: null
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      userRouter() {
        return this.$route.params.id
      }
    },
    methods: {
      reloadInfoGroup(e) {
        this.$emit('update:reloadInfo', e)
      },
      dadosAtualizados() {
        this.$emit('retornarDadosAtualizados')
        this.infoGroup()
      },
      imagePefilGroup(img) {
        if (!img) return
        return `${process.env.VUE_APP_PYXIS_API_CHAT}/arquivos/get_image_perfil/${img}`
      },
      infoGroup() {
        let urlData = `${config.baseUrl}api/mysql/chat/group/info_group/${this.userRouter}`
        this.$api.get(urlData).then(res => {
          this.info = res.data[0]
        })
      },
      generateHashName() {
        const date = new Date()
        return date.getTime().toString()
      },
      openImage() {
        this.$refs.fileInput.click()
      },
      onFileChange(e) {
        const file = e.target.files[0]
        const hashName = this.generateHashName()
        const nameKey = this.usuarioAlmope + hashName
        const newName = `${nameKey}.jpg`

        const renamedFile = new File([file], newName, { type: file.type })
        this.fileImg = renamedFile

        this.nameFileImg = renamedFile.name
        let reader = new FileReader()
        reader.onload = e => {
          this.imageData = e.target.result
        }

        reader.readAsDataURL(renamedFile)
      },
      updateFormField(model, value) {
        this.formEditGroup[model] = value
      }
    },
    watch: {
      userRouter() {
        if (this.$route.query.type_chat == 'group') {
          this.infoGroup()
        }
      },
      openEditGroup() {
        if (this.openEditGroup == true) {
          if (this.$route.query.type_chat == 'group') {
            this.infoGroup()
          }
        }
      }
    },
    created() {
      if (this.$route.query.type_chat == 'group') {
        this.infoGroup()
      }
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap"); */
  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px thick black;
  }

  .container-img {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .container-img div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5px;
    cursor: pointer;
    border: 2px solid #9e9a9aa5;
    background: #fefefecb;
    border-radius: 10px;
  }

  .container-img div p {
    margin-bottom: 0px;
    font-size: 14px;
    font-family: 'Space Grotesk', sans-serif;
  }

  .format {
    font-size: 10px !important;
  }

  i {
    font-size: 25px;
    color: #9e9a9aa5;
  }
</style>
