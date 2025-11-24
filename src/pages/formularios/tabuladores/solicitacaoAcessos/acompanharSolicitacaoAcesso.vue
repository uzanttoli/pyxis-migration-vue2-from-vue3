<template>
  <v-dialog v-model="_dialogAcompanharSolicitacao">
    <v-card>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <v-card-title>Status Solicitação</v-card-title>
        <div style="padding: 8px">
          <v-btn icon @click="$emit('update:close')">
            <v-icon>fa-solid fa-xmark</v-icon>
          </v-btn>
        </div>
      </div>
      <v-data-table
        :headers="headersToShow"
        :items="dados"
        dense
        style="font-size: 10px; !important"
        class="text-no-wrap"
      >
        <template v-slot:item.STATUS="{ item }">
          <v-chip x-small :class="classChip(item.STATUS)">
            {{ item.STATUS }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </v-dialog>
</template>

<script>
  import config from '../../../../core/config'
  export default {
    props: {
      dialogAcompanharSolicitacao: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      usersFocal: [4602597],
      headers: [
        { text: 'Status', value: 'STATUS', align: 'center' },
        //   { text: "Ação", value: "ACAO", align: "center" },
        { text: 'Almope', value: 'ALMOPE', align: 'center' },
        { text: 'Nome', value: 'NOME', align: 'center' },
        { text: 'Supervisor', value: 'SUPERVISOR', align: 'center' },
        { text: 'Tipo Atend.', value: 'TIPO_ATENDIMENTO', align: 'center' },
        { text: 'BR', value: 'BR', align: 'center' },
        { text: 'Sistema Erro', value: 'SISTEMA_COM_ERRO', align: 'center' },
        { text: 'Improdutivo', value: 'IMPRODUTIVO', align: 'center' },
        { text: 'Data Cadastro', value: 'DATA_CADASTRO', align: 'center' }
      ],
      dados: []
    }),
    computed: {
      _dialogAcompanharSolicitacao: {
        get() {
          return this.dialogAcompanharSolicitacao
        },
        set(newVal) {
          return newVal
        }
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      isUsersFocal() {
        return this.usersFocal.includes(this.usuarioAlmope)
      },
      headersToShow() {
        return this.isUsersFocal
          ? this.headers
          : this.headers.filter(header => header.value != 'ACAO')
      }
    },
    methods: {
      classChip(value) {
        return value == 'EM TRATAMENTO' ? 'blue white--text' : 'green white--text'
      },
      loadBaseAnalitica() {
        let urlData = `${config.baseUrl}api/shared/formularios/solicitacao_acessos/dados_analitico`
        this.$api.get(urlData).then(res => {
          this.dados = res.data
        })
      }
    },
    created() {
      this.loadBaseAnalitica()
    }
  }
</script>

<style></style>
