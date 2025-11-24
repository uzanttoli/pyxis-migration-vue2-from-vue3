<template>
  <v-col>
    <div style="display: flex; justify-content: end">
      <v-tooltip bottom>
        <template v-slot:activator="{ attrs, on }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            depressed
            icon
            small
            :href="`${process.env.VUE_APP_PYXIS_API_CHAT}/arquivos/modelo/BASE_IMPORTACAO_MEMBROS.xlsx`"
          >
            <v-icon color="#1565C0">fa-solid fa-file-excel</v-icon>
          </v-btn>
        </template>
        <span>Baixar Modelo</span>
      </v-tooltip>
      <return-data-member-demand :data="dataReturn"></return-data-member-demand>
    </div>
    <v-row>
      <v-col v-for="(item, i) in fieldsDemand" :key="i" :cols="item.cols" :class="item.class">
        <component
          :is="item.component"
          :label="item.label"
          :value="formEditGroup[item.model]"
          :autoGrow="false"
          :maxlength="1000"
          counter="1000"
          @input="updateFormField(item.model, $event)"
          :items="item.items ? items[item.items] : null"
        ></component>
      </v-col>
    </v-row>
    <v-row justify="end" class="mb-2">
      <v-btn
        :disabled="!formEditGroup.arrAlmopes"
        color="success"
        class="rounded-bl-xl rounded-r-xl mr-2"
        @click="addMember"
      >
        Adicionar membros
      </v-btn>
    </v-row>
    <loadhastag :activeMsg="true" msg="Processando..." :envioDados="isSend"></loadhastag>
  </v-col>
</template>

<script>
  import VTextArea from '../../shared/components/vuetifyComponents/VTextArea.vue'
  import alerts from '../../mixins/alerts.mixins'
  import { isNumber } from '@amcharts/amcharts4/core'
  import config from '../../core/config'
  import loadhastag from '../../shared/components/load/loadHastag.vue'
  import returnDataMemberDemand from './returnDataMemberDemand.vue'
  export default {
    components: { VTextArea, loadhastag, returnDataMemberDemand },
    props: {},
    mixins: [alerts],
    data: () => ({
      tab: null,
      isSend: false,
      dataReturn: [],
      fieldsDemand: [
        {
          id: 3,
          component: 'v-text-area',
          label: 'Insira os almopes que farão parte do grupo:',
          model: 'arrAlmopes',
          items: null,
          cols: 12,
          class: 'textArea'
        }
      ],

      formEditGroup: {
        arrAlmopes: null
      }
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      userRouter() {
        return this.$route.params.id
      },
      tratamentData() {
        let almopes = this.formEditGroup.arrAlmopes
        if (almopes) {
          const arrayObjetos = []
          const uniqueArray = []
          const countMap = {}

          const linhas = almopes.trim().split('\n')
          linhas.forEach(linha => {
            const colunas = linha.split('\t')
            let linhaNumber = colunas[0] * 1
            if (isNumber(linhaNumber)) {
              const objeto = {
                almope: linhaNumber,
                permissao: colunas[1],
                idGroup: this.userRouter
              }
              arrayObjetos.push(objeto)
            }
          })

          arrayObjetos.forEach(item => {
            const { almope } = item
            if (!countMap[almope]) {
              countMap[almope] = 1
              uniqueArray.push({ ...item })
            } else {
              countMap[almope]++
            }
          })
          return uniqueArray
        } else {
          return null
        }
      }
    },
    methods: {
      addMember() {
        let arrayAlmope = this.tratamentData
        if (arrayAlmope.length >= 10) {
          this.isSend = true
          let urlData = `${config.baseUrl}api/mysql/chat/group/add_member_plus`
          this.$api.post(urlData, arrayAlmope).then(res => {
            this.dataReturn = res.data
            this.toast('Dados processados com sucesso!', 'top-right', false, 3000, 'success')
            this.formEditGroup.arrAlmopes = null
            this.isSend = false
          })
        } else {
          this.toast(
            'Necessário ter no minimo 10 usuarios para prosseguir...',
            'top-right',
            false,
            3000,
            'warning'
          )
        }
      },
      updateFormField(model, value) {
        this.formEditGroup[model] = value
      }
    },
    watch: {},
    created() {}
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

  .textArea {
    width: 100vw;
  }
</style>
