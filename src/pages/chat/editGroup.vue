<template>
  <v-col>
    <v-row>
      <v-col v-for="(item, i) in fieldsEditGroup" :key="i" :cols="item.cols" :class="item.class">
        <component
          :is="item.component"
          :label="item.label"
          :value="formEditGroup[item.model]"
          @input="updateFormField(item.model, $event)"
          :items="item.items ? items[item.items] : null"
        ></component>
      </v-col>
    </v-row>
    <v-row justify="end" class="mb-2">
      <v-btn
        color="success"
        class="rounded-bl-xl rounded-r-xl mr-2"
        @click="sendMessage"
        :disabled="isSend"
        :loading="isSend"
      >
        Salvar
      </v-btn>
    </v-row>
  </v-col>
</template>

<script>
  import VTextField from '../../shared/components/vuetifyComponents/VTextField.vue'
  import VTextArea from '../../shared/components/vuetifyComponents/VTextArea.vue'
  import VSelect from '../../shared/components/vuetifyComponents/VSelect.vue'
  import alerts from '../../mixins/alerts.mixins'
  import axios from 'axios'
  export default {
    components: { VTextField, VTextArea, VSelect },
    props: {
      openEditGroup: {
        type: Boolean,
        default: false
      },
      infoProps: {
        type: [Array, Object],
        require: true
      },
      fileImg: {
        type: [File],
        require: true
      }
    },
    mixins: [alerts],
    data: () => ({
      tab: null,
      isSend: false,
      fieldsEditGroup: [
        {
          id: 1,
          component: 'v-text-field',
          label: 'Nome do grupo: ',
          model: 'nomeGroup',
          items: null,
          cols: 6,
          class: null
        },
        {
          id: 2,
          component: 'v-select',
          label: 'Enviar mensagens',
          model: 'envioMensagens',
          items: 'itemsEnvioMensagem',
          cols: 6,
          class: null
        },
        {
          id: 3,
          component: 'v-text-area',
          label: 'Descrição do grupo ',
          model: 'descricaoGrupo',
          items: null,
          cols: 12,
          class: 'mt-n7'
        }
      ],
      itemsEnvioMensagem: [
        {
          id: 1,
          text: 'Todos',
          value: 1
        },
        {
          id: 2,
          text: 'Apenas Administradores',
          value: 0
        }
      ],
      formEditGroup: {
        nomeGroup: null,
        descricaoGrupo: null,
        envioMensagens: null
      }
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      userRouter() {
        return this.$route.params.id
      },
      items() {
        return {
          itemsEnvioMensagem: this.itemsEnvioMensagem
        }
      }
    },
    methods: {
      retornDataInfo() {
        this.formEditGroup.envioMensagens = this.infoProps.all_sending * 1
        this.formEditGroup.descricaoGrupo = this.infoProps.group_description
      },
      updateFormField(model, value) {
        this.formEditGroup[model] = value
      },
      async sendMessage() {
        this.isSend = true
        let file = this.fileImg
        let nameFile = file?.name
        let groupName = this.formEditGroup.nomeGroup
        const data = {
          almope_change: this.usuarioAlmope,
          group_name: this.formEditGroup.nomeGroup,
          name_avatar: nameFile ? nameFile : this.infoProps.name_avatar,
          group_description: this.formEditGroup.descricaoGrupo,
          all_sending: this.formEditGroup.envioMensagens,
          id: this.userRouter
        }
        await this.$api.post('api/mysql/chat/group/update_info_group', data).then(() => {
          if (nameFile || this.infoProps.group_name != groupName) {
            this.$emit('atualizarDadosDoPerfil')
          }
          this.$emit('atualizarInfoGrupo', {
            type: 'updateInfoGroup',
            almope_send: this.usuarioAlmope,
            almope_receiver: this.userRouter
          })
          this.toast('Dados atualizados com sucesso!', 'center', false, 3500, 'success')
          this.isSend = false
        })
        if (nameFile) {
          if (this.infoProps.name_avatar) {
            axios.get(
              `${process.env.VUE_APP_PYXIS_API_CHAT}/arquivos/delete_img/${this.infoProps.name_avatar}`
            )
          }
          const formData = new FormData()
          formData.append('image', this.fileImg)
          await axios
            .post(`${process.env.VUE_APP_PYXIS_API_CHAT}/arquivos/upload_img_perfil`, formData, {
              headers: { 'Content-Type': false }
            })
            .then(() => {
              if (nameFile || this.infoProps.group_name != groupName) {
                this.$emit('atualizarDadosDoPerfil')
              }
              this.isSend = false
            })
        }
      }
    },
    watch: {
      userRouter() {
        this.formEditGroup.nomeGroup = this.$route.query.name_group
      }
    },
    created() {
      this.formEditGroup.nomeGroup = this.$route.query.name_group
      this.$nextTick(() => {
        this.retornDataInfo()
      })
    }
  }
</script>

<style scoped>
  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px thick black;
  }

  .container-img {
    display: flex;
    justify-content: space-around;
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
</style>
