<template>
  <!-- v-model="dialogValidacaoExpurgo" -->
  <v-dialog
    :model-value="dialogValidacaoExpurgo"
    @update:modelValue="val => $emit('update:dialogValidacaoExpurgo', val)"
    persistent
  >
    <v-card tile>
      <title-negative-margin
        title="Validação Expurgo"
        :downloadExcel="true"
        namePlan="HISTORICO_EXPURGO_SCOREBOARD"
        worksheet="HISTORICO_EXPURGO_SCOREBOARD"
        :base="dadosParaValidar"
      >
        <v-spacer></v-spacer>
        <v-text-field
          style="margin: -20px 10px 0px auto"
          v-model="search"
          append-icon="mdi-magnify"
          label="Digite o Almope (Operador) ou Nome (realizou cadastro)"
          single-line
          hide-details
        ></v-text-field>
        <v-btn icon @click="$emit('closeDialogValidacaoExpurgo')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </title-negative-margin>
      <v-data-table
        :search="search"
        dense
        fixed-header
        :headers="getHeaders"
        :items="dadosParaValidar"
        no-results-text="Nada encontrado!"
        no-data-text="Não há pendências de expurgos no momento!"
        :loading="atualizandoDadosExpurgo"
        loading-text="Carregando..."
      >
        <template v-slot:item.VALIDAR="{ item }">
          <v-tooltip bottom color="green">
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                icon
                color="green"
                value="APROVADO"
                @click="updateFormValidacaoExpurgo('APROVADO', item)"
              >
                <v-icon>mdi-check</v-icon>
              </v-btn>
            </template>
            <span>Aprovar</span>
          </v-tooltip>
          <v-tooltip bottom color="red">
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                icon
                color="red"
                value="REPROVADO"
                @click="updateFormValidacaoExpurgo('REPROVADO', item)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <span>Reprovar</span>
          </v-tooltip>
        </template>
      </v-data-table>
      <load-hastag
        :activeMsg="true"
        :envioDados="atualizandoDadosExpurgo"
        msg="Atualizando dados..."
      ></load-hastag>
    </v-card>
  </v-dialog>
</template>

<script>
  import config from '../../../../../../core/config'
  import loadHastag from '../../../../../../shared/components/load/loadHastag.vue'
  export default {
    components: { loadHastag },
    props: {
      dialogValidacaoExpurgo: { type: Boolean, default: false }
    },
    data: () => ({
      search: '',
      atualizandoDadosExpurgo: false,
      formValidacaoExpurgo: {
        ID_EXPURGO: '',
        ALMOPE: '',
        DATA: '',
        DATA_INICIO: '',
        DATA_FIM: '',
        INDICADOR: '',
        JUSTIFICATIVA: '',
        SITUACAO: '',
        USUARIO_CADASTRO: '',
        DATA_HORA_REGISTRO: '',
        IP_MAQUINA_CADASTRO: ''
      },
      getHeaders: [
        {
          text: 'Validar',
          value: 'VALIDAR',
          sortable: false,
          width: '120px'
        },
        {
          text: 'Data Inicio',
          value: 'DATA_INICIO',
          sortable: false
        },
        {
          text: 'Data Fim',
          value: 'DATA_FIM',
          sortable: false
        },
        {
          text: 'Almope',
          value: 'ALMOPE',
          sortable: false
        },
        {
          text: 'Nome Operador',
          value: 'NOME_OPE',
          sortable: false
        },
        {
          text: 'Supervisor',
          value: 'SUPERVISOR',
          sortable: false
        },
        {
          text: 'Coordenador',
          value: 'COORDENADOR',
          sortable: false
        },
        {
          text: 'Indicador',
          value: 'INDICADOR',
          sortable: false
        },
        {
          text: 'Justificativa',
          value: 'JUSTIFICATIVA',
          sortable: false
        },
        {
          text: 'Quem Realizou Cadastro',
          value: 'QUEM_REALIZOU_CADASTRO',
          sortable: false
        }
      ]
    }),
    computed: {
      dadosParaValidar() {
        let dadosParaValidar = this.$store.getters.dadosParaValidar
        return dadosParaValidar ? dadosParaValidar : []
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },

      ipMaquina() {
        return localStorage.getItem('ip')
      }
    },
    methods: {
      updateFormValidacaoExpurgo(value, item) {
        this.atualizandoDadosExpurgo = true
        this.formValidacaoExpurgo.ID_EXPURGO = item.ID_EXPURGO
        this.formValidacaoExpurgo.SITUACAO = value
        this.formValidacaoExpurgo.USUARIO_VALIDACAO = this.usuarioAlmope
        this.formValidacaoExpurgo.IP_MAQUINA_VALIDACAO = this.ipMaquina

        let urlData = `${config.baseUrl}api/shared/formularios/tabulador_expurgo/validar_expurgos`
        this.$api.post(urlData, this.formValidacaoExpurgo).then(() => {
          this.atualizandoDadosExpurgo = false
          this.loadDadosParaValidar()
        })
      },
      loadDadosParaValidar() {
        this.$store.dispatch('loadDadosParaValidar')
      }
    },
    watch: {
      dialogValidacaoExpurgo() {
        if (this.dialogValidacaoExpurgo == true) {
          this.loadDadosParaValidar()
        }
      }
    },
    created() {}
  }
</script>

<style scoped></style>
