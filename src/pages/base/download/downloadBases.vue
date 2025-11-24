<template>
  <v-container>
    <div style="display: flex; gap: 20px">
      <v-card style="margin-top: 3rem; flex: 1" class="rounded-xl">
        <title-negative-margin
          title="Download De Bases"
          icon="mdi-database"
          className="rounded-r-xl"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                icon
                small
                class="mr-2"
                v-bind="attrs"
                v-on="on"
                @click="configTable = !configTable"
                :disabled="arrDadosConsulta == ''"
              >
                <v-icon size="20" color="orange">fa-solid fa-table</v-icon>
              </v-btn>
            </template>
            <span>Personalize as colunas que deseja baixar</span>
          </v-tooltip>
          <v-tooltip bottom v-if="tipoPerfil == 'ADMINISTRADOR'">
            <template v-slot:activator="{ attrs, on }">
              <v-btn icon small class="mr-2" v-bind="attrs" v-on="on" @click="isConfig = !isConfig">
                <v-icon size="20" color="red">fa-solid fa-sliders</v-icon>
              </v-btn>
            </template>
            <span>Configurar</span>
          </v-tooltip>
        </title-negative-margin>
        <v-divider></v-divider>
        <!-- <pre>{{ arrDadosConsulta }}</pre> -->
        <v-col>
          <v-row>
            <v-col cols="12" md="5" sm="6">
              <v-autocomplete
                id="base"
                dense
                :items="listaDeBases"
                item-text="NOME_FANTASIA"
                item-value="ID_BASE"
                label="Escolha uma base"
                placeholder="Escolha uma base"
                v-model="idSelecionado"
                @change="loadMaxData"
                no-data-text="Não há bases no momento!"
                outlined
              ></v-autocomplete>
            </v-col>

            <!--  -->
            <v-col cols="12" sm="6" md="4">
              <!-- <label for="label" class="white--text font-weight-medium"
                >Data Inicio/Data Fim</label
              > -->
              <v-menu
                id="label"
                v-model="dataRange"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
                persistent
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateRangeText"
                    class="font-weight-bold"
                    label="Data inicio/Data fim"
                    placeholder="Data inicio/Data fim"
                    outlined
                    prepend-inner-icon="fa-regular fa-calendar"
                    readonly
                    v-bind="attrs"
                    :error-messages="
                      dates.length > 0 && dates.length < 2
                        ? 'Necessário selecionar duas datas...'
                        : ''
                    "
                    dense
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="dates"
                  range
                  no-title
                  locale="pt"
                  color="blue lighten-1"
                  :min="dates ? dates[0] : dates"
                  :max="maxQtdDownloadDia"
                  @change="dateIsInverted(), dateMaxQuantidade()"
                >
                  <template class="">
                    <!-- <v-divider></v-divider> -->
                    <v-btn
                      class=""
                      block
                      color="orange lighten-1 white--text"
                      small
                      @click="dates = []"
                    >
                      Resetar
                    </v-btn>
                  </template>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="3">
              <!-- <v-row class="ma-0 pa-0" align="center" justify="center"> -->
              <div style="display: flex">
                <v-col class="ma-0 pa-0 mr-2">
                  <v-btn
                    :class="!this.baixarIsValid() ? 'grey' : 'cor-padrao white--text'"
                    block
                    @click="preVisualizarBase"
                    :disabled="!this.baixarIsValid()"
                  >
                    <v-icon>fa-solid fa-magnifying-glass</v-icon>
                    Carregar
                  </v-btn>
                </v-col>
                <v-col class="ma-0 pa-0">
                  <download-excel
                    :data="novoArrayData"
                    :name="nameTratado()"
                    :worksheet="nameTratado()"
                  >
                    <v-btn class="success mr-2" block :disabled="arrDadosConsulta == ''">
                      <v-icon>fa-solid fa-file-arrow-down</v-icon>
                      Baixar
                    </v-btn>
                  </download-excel>
                </v-col>
              </div>
              <!-- </v-row> -->
            </v-col>
          </v-row>
        </v-col>
      </v-card>
      <v-card style="margin-top: 3rem; width: 400px !important" v-if="configTable">
        <title-negative-margin title="Personalizar" className="rounded-r-xl">
          <v-btn icon @click="configTable = false">
            <v-icon>fas fa-close</v-icon>
          </v-btn>
        </title-negative-margin>
        <v-col cols="12">
          <v-autocomplete
            outlined
            dense
            single-line
            placeholder="Colunas"
            :items="itemsHeaders"
            multiple
            v-model="configColumnsTable.columns"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index === 0" small>
                <span>{{ item.text }}</span>
              </v-chip>
              <span v-if="index === 1" class="grey--text text-caption">
                (+{{ configColumnsTable.columns.length - 1 }} outros)
              </span>
            </template>
          </v-autocomplete>

          <div class="mt-n4">
            <p class="pa-0 ma-0" style="font-size: 13px">
              *Caso queira salvar essas alterações, escolha um nome.
            </p>
            <v-text-field
              placeholder="Escolhe um nome para sua base"
              outlined
              dense
              @keydown.enter="salvarPersonalizacao"
              v-model="nomePersonalizadoBase"
              :disabled="!colunasValida"
            >
              <template v-slot:append>
                <v-tooltip bottom>
                  <template v-slot:activator="{ attrs, on }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      color="success"
                      icon
                      class="mx-0"
                      style="margin-top: -6px"
                      @click="salvarPersonalizacao"
                      :disabled="!colunasValida"
                    >
                      <v-icon>fa-solid fa-floppy-disk</v-icon>
                    </v-btn>
                  </template>
                  <span>Clique aqui para salvar</span>
                </v-tooltip>
              </template>
            </v-text-field>
          </div>
          <!-- <div style="display: flex; justify-content: end;" class="mt-n3">
          </div> -->
        </v-col>
      </v-card>
    </div>
    <v-card class="mt-7 mb-7 rounded-xl">
      <PreviewBases
        :nome="nomeColuna"
        :consulta="previewConsulta"
        :date="date"
        :dadosConsulta="novoArrayData"
        :dateFim="dateFim"
        :fonte="fonte"
        :responsavel="responsavel"
        @updated:naoHaDados="validacaoDados = true"
        @update:carregando="baixandoInfor = true"
        @update:carregou="baixandoInfor = false"
      />
    </v-card>
    <load-envio-dados
      :envioDados="baixandoInfor"
      :msg="returnTextTime"
      :activeMsg="true"
    ></load-envio-dados>
    <ConfiguracaoDownload v-if="isConfig" />
  </v-container>
</template>

<script>
  import loadEnvioDados from '../../../shared/components/load/loadHastag.vue'
  import PreviewBases from './previewBases/PreviewBases.component.vue'

  import config from '../../../core/config'
  import ConfiguracaoDownload from './config/ConfiguracaoDownload.vue'
  export default {
    components: {
      loadEnvioDados,
      PreviewBases,
      ConfiguracaoDownload
    },
    data: () => ({
      configColumnsTable: {
        columns: null
      },
      isConfig: false,
      baixandoInfor: false,
      configTable: false,
      validacaoDados: false,
      nomePersonalizadoBase: null,
      maxQtdDownloadDia: null,
      itemsColumnsTable: [],
      arrDadosConsulta: [],
      listaDeBases: [],
      date: null,
      menu: false,
      dateFim: null,
      menuFim: false,
      idSelecionado: null,
      quantidadeMax: null,
      intervalText: null,
      consulta: '',
      nomeTabSchema: '',
      nomeColuna: '',
      previewConsulta: '',
      nomeBase: '',
      responsavel: '',
      fonte: '',
      contador: 0,
      dates: [],
      dataRange: null
    }),
    computed: {
      dateRangeText() {
        return this.convertDate(this.dates?.join(' ~ '))
      },
      colunasValida() {
        return this.configColumnsTable.columns?.length > 0
      },
      tipoPerfil() {
        return this.$store.getters.usuario.filtro
      },
      produto() {
        return this.$store.getters.usuario.produto
      },
      dataFormatada() {
        return this.convertDateBR(this.date)
      },
      dataFormatadaFim() {
        return this.convertDateBR(this.dateFim)
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      consultaFinal() {
        let dados = this.consulta
        let data = dados.replace('#DATAINICIO', "'" + this.dates[0] + "'")
        let consultaFinal = data.replace('#DATAFIM', "'" + this.dates[1] + "'")
        return consultaFinal
      },
      maxData() {
        let date = new Date()
        let day = date.getDate().toString()
        let dayFormate = day.length == 1 ? '0' + day : day

        let month = (date.getMonth() + 1).toString()
        let monthFormate = month.length == 1 ? '0' + month : month

        let year = date.getFullYear()

        return `${year}-${monthFormate}-${dayFormate}`
      },
      returnTextTime() {
        return `${
          this.contador <= 10
            ? 'Carregando dados... '
            : 'Carregamento dos dados está demorando mais que o normal...'
        }`
      },

      itemsHeaders() {
        let dados = []
        Object.keys(this.arrDadosConsulta[0]).forEach(item => {
          dados.push({
            text: item,
            value: item,
            align: 'center'
          })
        })
        return dados
      },
      novoArrayData() {
        if (this.configColumnsTable.columns?.length > 0) {
          return this.changeColumns()
        } else {
          let dados = this.arrDadosConsulta
          let novasCol = dados?.map(obj => {
            let novoObj = {}
            let headers = Object.keys(dados[0])
            headers.forEach(header => {
              novoObj[header.replace('. ', ') ')] = obj[header]
            })
            return novoObj
          })
          return novasCol
        }
      }
    },
    methods: {
      changeColumns() {
        let dados = [...this.arrDadosConsulta]
        let novasCol = dados?.map(obj => {
          let novoObj = {}
          this.configColumnsTable.columns?.forEach(header => {
            if (Object.prototype.hasOwnProperty.call(obj, header)) {
              novoObj[header] = obj[header]
            }
          })
          return novoObj
        })
        return novasCol
      },
      convertDate(arrayData) {
        let arrayInicio = []
        let arrayFim = []
        if (arrayData?.length == 23) {
          arrayInicio.push(arrayData.toString().substring(0, 10).replaceAll('-', '/'))
          arrayFim.push(arrayData.toString().substring(13, 23).replaceAll('-', '/'))
        }

        //   array[0]?.dataInicio;

        return `  ${
          arrayInicio.toString().split('/').reverse().join('/') +
          (arrayData?.length == 23 ? ' ~ ' : '') +
          arrayFim.toString().split('/').reverse().join('/')
        }`
      },
      dateIsInverted() {
        if (this.dates) {
          if (this.dates[0] > this.dates[1]) {
            return (this.dates = [this.dates[1], this.dates[0]])
          }
        }
      },
      replaceNulls(obj) {
        if (!obj) return
        for (let key in obj) {
          if (obj[key] == null) {
            obj[key] = '-'
          }
        }
      },
      async salvarPersonalizacao() {
        let colunasSelecionadas = this.configColumnsTable.columns.map(item => item).join(', ')
        let data = {
          ID_BASE: this.idSelecionado,
          ALMOPE: this.usuarioAlmope,
          NOME_PERSONALIZADO: this.nomePersonalizadoBase,
          CONSULTA: this.consulta.split('*').join(colunasSelecionadas)
        }
        let urlData = `${config.baseUrl}api/shared/bases/base_personalizada`
        await this.$api.post(urlData, data)
        this.configTable = false
        this.nomePersonalizadoBase = null
        this.configColumnsTable.columns = ''
        this.loadListaBases()
      },

      columnsTable(e) {
        this.itemsColumnsTable = e
      },
      nameTratado() {
        let data = this.moment().format('DDMMYYYY')
        return `PYXIS_${data}_${this.nomeBase}`
      },
      baixarIsValid() {
        return this.idSelecionado && this.dates.length == 2
      },
      nomeColumm(value, consulta) {
        let nome = value

        return (this.nomeColuna = nome), (this.previewConsulta = consulta)
      },
      timeExec() {
        this.intervalText = null
        this.contador = 0
        this.intervalText = setInterval(() => {
          this.contador++
        }, 1000)
      },
      async preVisualizarBase() {
        this.baixandoInfor = true
        this.timeExec()
        await this.loadConsultaId()
        this.nomeColumm(this.nomeTabSchema, this.consulta)

        this.arrDadosConsulta = []

        let urlData = `${config.baseUrl}api/shared/bases/exec_consulta/`
        const res = await this.$api.get(urlData, {
          params: {
            consulta: this.consultaFinal
          }
        })
        let dados = res?.data
        dados.forEach(this.replaceNulls)
        this.arrDadosConsulta = dados
        clearInterval(this.intervalText)
        this.baixandoInfor = false
      },

      convertDateBR(value) {
        if (!value) return

        const [year, month, day] = value.split('-')
        return `${day}/${month}/${year}`
      },
      dateMaxQuantidade() {
        let date = this.moment(this.dates[0]).add(this.quantidadeMax, 'days').format('YYYY-MM-DD')
        if (date >= this.maxData) {
          date = this.maxData
        }
        this.maxQtdDownloadDia = date
      },
      loadMaxData() {
        let urlData = `${config.baseUrl}api/shared/bases/qtd_dias/${this.idSelecionado}`
        this.$api.get(urlData).then(res => {
          let quantidade = res.data.MAX_DIAS_CONSULTA

          this.quantidadeMax = quantidade
        })
      },
      async loadConsultaId() {
        let urlData = `${config.baseUrl}api/shared/bases/consulta_id/${this.idSelecionado}`
        const res = await this.$api.get(urlData)
        this.consulta = res.data[0]?.CONSULTA
        this.nomeBase = res.data[0]?.NOME_FANTASIA
        this.responsavel = res.data[0]?.RESPONSAVEL
        this.fonte = res.data[0]?.FONTE
      },
      loadListaBases() {
        let urlData = `${config.baseUrl}api/shared/bases/listar_bases/${this.tipoPerfil}/${this.produto}/${this.usuarioAlmope}`
        this.$api
          .get(urlData)
          .then(res => {
            this.listaDeBases = res.data
          })
          .catch(() => {})
      }
    },
    watch: {
      idSelecionado: function (newVal, oldVal) {
        if (oldVal != newVal) {
          return (this.date = null), (this.dateFim = null)
        }
      },
      dates: function (newVal) {
        if (newVal) {
          this.dateMaxQuantidade()
        }
      }
    },
    created() {
      this.loadListaBases()
    },
    beforeUnmount: function () {
      clearInterval(this.intervalText)
    }
  }
</script>

<style scoped>
  .cor-padrao {
    background-image: linear-gradient(220deg, #00ecff, #8f0e8f);
  }
</style>
