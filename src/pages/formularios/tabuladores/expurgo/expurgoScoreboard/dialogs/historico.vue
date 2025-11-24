<template>
  <!-- v-model="dialogHistoricoDeExpurgo" -->

  <v-dialog
    persistent
    :model-value="dialogHistoricoDeExpurgo"
    @update:modelValue="val => $emit('update:dialogHistoricoDeExpurgo', val)"
  >
    <v-card>
      <title-negative-margin title="Historico de Expurgo">
        <v-text-field
          style="margin-top: -20px; margin-right: 10px"
          v-model="search"
          append-icon="mdi-magnify"
          label="Pesquisar"
          single-line
          hide-details
        ></v-text-field>

        <v-btn icon @click="$emit('closeDialogHistoricoDeExpurgo')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </title-negative-margin>

      <v-data-table
        no-data-text="Não há informações no momento!"
        class="text-no-wrap"
        dense
        :headers="getHeaders"
        :items="historicoExpurgo"
        :search="search"
        no-results-text="Nada encontrado!"
      >
        <template v-slot:item.SITUACAO_EXPURGO="{ item }">
          <template v-if="item.SITUACAO_EXPURGO == 'APROVADO'">
            <span style="color: green">{{ item.SITUACAO_EXPURGO }}</span>
          </template>

          <template
            v-else-if="
              item.SITUACAO_EXPURGO == 'PENDENTE APROVAÇÃO' ||
              item.SITUACAO_EXPURGO == 'PENDENTE APROVACAO'
            "
          >
            <v-tooltip right color="orange">
              <template v-slot:activator="{ attrs, on }">
                <span style="color: rgb(228, 129, 15)" v-bind="attrs" v-on="on">
                  {{ item.SITUACAO_EXPURGO }}
                </span>
              </template>

              <span>O expurgo está pendente de validação.</span>
            </v-tooltip>
          </template>

          <template v-else-if="item.SITUACAO_EXPURGO == 'REPROVADO'">
            <v-tooltip right color="red">
              <template v-slot:activator="{ attrs, on }">
                <span style="color: red" v-bind="attrs" v-on="on">{{ item.SITUACAO_EXPURGO }}</span>
              </template>

              <span>
                Expurgo reprovado. Caso não concorde com o retorno entre em contato com o
                <strong>Gestor!</strong>
              </span>
            </v-tooltip>
          </template>
        </template>
      </v-data-table>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      dialogHistoricoDeExpurgo: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      search: '',
      getHeaders: [
        { text: 'Situação', value: 'SITUACAO_EXPURGO', align: 'center' },
        { text: 'Data Inicio', value: 'DATA_INICIO', align: 'center' },
        { text: 'Data Fim', value: 'DATA_FIM', align: 'center' },
        { text: 'Almope', value: 'ALMOPE', align: 'center' },
        { text: 'Nome Operador', value: 'NOME_OPE', align: 'center' },
        { text: 'Supervisor', value: 'SUPERVISOR', align: 'center' },
        { text: 'Coordenador', value: 'COORDENADOR', align: 'center' },
        { text: 'Indicador', value: 'INDICADOR', align: 'center' },
        { text: 'Justificativa', value: 'JUSTIFICATIVA', align: 'center' },
        {
          text: 'Quem Realizou Cadastro',
          value: 'QUEM_REALIZOU_CADASTRO',
          align: 'center'
        }
      ]
    }),
    computed: {
      historicoExpurgo() {
        let historicoExpurgo = this.$store.getters.historicoExpurgo
        return historicoExpurgo ? historicoExpurgo : []
      }
    },
    methods: {
      loadHistoricoExpurgo() {
        this.$store.dispatch('loadHistoricoExpurgo')
      }
    },
    watch: {
      dialogHistoricoDeExpurgo() {
        if (this.dialogHistoricoDeExpurgo == true) {
          this.loadHistoricoExpurgo()
        }
      }
    }
  }
</script>

<style></style>
