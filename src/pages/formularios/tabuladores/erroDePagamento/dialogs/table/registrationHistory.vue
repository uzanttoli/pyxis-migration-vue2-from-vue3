<template>
  <!-- v-model="dialogHistoricoDeCadastro" -->
  <v-dialog
    width="1500"
    persistent
    :model-value="dialogHistoricoDeCadastro"
    @update:modelValue="val => $emit('update:dialogHistoricoDeCadastro', val)"
  >
    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        Histórico de Cadastros
        <v-divider vertical class="px-2"></v-divider>
        <v-col cols="4" class="mt-n6">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('closeDialogHistoricoCadastro')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card max-height="500" class="overflow-auto">
        <v-data-table
          dense
          :loading="loading"
          loading-text="Carregando..."
          :items="historicoDeCadastro"
          class="text-no-wrap"
          :headers="headers"
          :search="search"
          no-data-text="Não há dados no momento!"
          no-results-text="Nada encontrado!"
          :fixed-header="true"
        >
          <template v-slot:item.DATA="{ item }">
            {{ item.DATA.split('-').reverse().join('/') }}
          </template>
          <template v-slot:item.DATA_ENVIO_DE_ACORDO="{ item }">
            <span v-if="item.DATA_ENVIO_DE_ACORDO != 'SEM AUTORIZAÇÃO'">
              <v-tooltip right color="success">
                <template v-slot:activator="{ attrs, on }">
                  <span v-bind="attrs" v-on="on">
                    {{ item.DATA_ENVIO_DE_ACORDO }}
                  </span>
                </template>
                <span>
                  Já possui
                  <strong>DE ACORDO.</strong>
                  Se não encontrou na sua caixa de Email, procure seu Coordenador, ele com certeza
                  recebeu!!!
                </span>
              </v-tooltip>
            </span>
            <span v-else style="color: red">
              <v-tooltip right color="error">
                <template v-slot:activator="{ attrs, on }">
                  <span v-bind="attrs" v-on="on">
                    {{ item.DATA_ENVIO_DE_ACORDO }}
                  </span>
                </template>
                <span>Aguardando autorização do Diretor.</span>
              </v-tooltip>
            </span>
          </template>
          <template v-slot:item.QTDE_HORAS="{ item }">
            {{ item.QTDE_HORAS.substring(0, 8) }}
          </template>
          <template v-slot:item.VALOR_DESCONTO="{ item }">
            {{ 'R$ ' + item.VALOR_DESCONTO.split('.').join(',') }}
          </template>
        </v-data-table>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'HistoricoDeCadastro',
    props: {
      dialogHistoricoDeCadastro: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      loading: false,
      search: '',
      headers: [
        {
          text: 'Data Envio de Acordo',
          align: 'center',
          sortable: false,
          value: 'DATA_ENVIO_DE_ACORDO',
          class: 'no-text-wrap'
        },
        {
          text: 'Matricula',
          align: 'center',
          sortable: false,
          value: 'MATRICULA',
          class: 'no-text-wrap'
        },
        {
          text: 'Almope',
          align: 'center',
          sortable: false,
          value: 'ALMOPE',
          class: 'no-text-wrap'
        },
        {
          text: 'Nome',
          align: 'center',
          sortable: false,
          value: 'NOME',
          class: 'no-text-wrap'
        },
        {
          text: 'Data',
          align: 'center',
          sortable: false,
          value: 'DATA',
          class: 'no-text-wrap'
        },
        {
          text: 'Periodo',
          align: 'center',
          sortable: false,
          value: 'DESCRICAO_PERIODO',
          class: 'no-text-wrap'
        },
        {
          text: 'Tipo Desconto',
          align: 'center',
          sortable: false,
          value: 'DESCRICAO_TIPO_DESCONTO',
          class: 'no-text-wrap'
        },
        {
          text: 'Qtde. Horas',
          align: 'center',
          sortable: false,
          value: 'QTDE_HORAS',
          class: 'no-text-wrap'
        },
        {
          text: 'Valor Desconto',
          align: 'center',
          sortable: false,
          value: 'VALOR_DESCONTO',
          class: 'no-text-wrap'
        },
        {
          text: 'Descrição',
          align: 'center',
          sortable: false,
          value: 'DESCRICAO',
          class: 'no-text-wrap'
        },
        {
          text: 'Causa Raiz',
          align: 'center',
          sortable: false,
          value: 'DESCRICAO_CAUSA_RAIZ',
          class: 'no-text-wrap'
        },
        {
          text: 'Data/Hora Registro',
          align: 'center',
          sortable: false,
          value: 'DATA_HORA_REGISTRO',
          class: 'no-text-wrap'
        },
        {
          text: 'Usuario Cadastro',
          align: 'center',
          sortable: false,
          value: 'USUARIO',
          class: 'no-text-wrap'
        },
        {
          text: 'Nome Cadastro',
          align: 'center',
          sortable: false,
          value: 'NOME_USUARIO',
          class: 'no-text-wrap'
        }
      ]
    }),
    computed: {
      historicoDeCadastro() {
        let historicoDeCadastro = this.$store.getters.historicoDeCadastro
        return historicoDeCadastro ? historicoDeCadastro : []
      }
    },
    methods: {
      loadHistoricoDeCadastro() {
        this.loading = true
        this.$store.dispatch('loadHistoricoDeCadastro')
      }
    },
    watch: {
      historicoDeCadastro() {
        if (this.historicoDeCadastro != '') {
          this.loading = false
        }
      },
      dialogHistoricoDeCadastro() {
        if (this.dialogHistoricoDeCadastro == true) {
          this.loadHistoricoDeCadastro()
        }
      }
    },
    created() {
      // this.loadHistoricoDeCadastro();
    }
  }
</script>

<style scoped></style>
