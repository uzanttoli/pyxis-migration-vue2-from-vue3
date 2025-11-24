<template>
  <div class="text-center">
    <!-- v-model="dialogDeletarCadastro" -->
    <v-dialog
      width="1600"
      persistent
      :model-value="dialogDeletarCadastro"
      @update:modelValue="val => $emit('update:dialogDeletarCadastro', val)"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Excluir Cadastro.
          <v-spacer></v-spacer>
          <v-btn icon @click="$emit('closeDialogDeletarCadastro')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card class="mt-5">
          <v-data-table
            dense
            class="text-no-wrap"
            loading-text="Carregando..."
            no-data-text="Não há informações no momento!"
            :search="search"
          >
            <template v-slot:header>
              <thead class="grey lighten-3">
                <tr class="grey lighten-3">
                  <th class="text-center">Matricula</th>
                  <th class="text-center">Nome</th>
                  <th class="text-center">Data</th>
                  <th class="text-center">Periodo</th>
                  <th class="text-center">Tipo Periodo</th>
                  <th class="text-center">Qtde. Horas</th>
                  <th class="text-center">Valor Desconto</th>
                  <th class="text-center">Causa Raiz</th>
                  <th class="text-center">Excluir</th>
                </tr>
              </thead>
            </template>
            <template v-slot:body>
              <tbody>
                <tr v-for="(item, i) in meusCadastrosDeErro" :key="i">
                  <td class="text-center">{{ item.MATRICULA }}</td>
                  <td class="text-center">{{ item.NOME }}</td>
                  <td class="text-center">
                    {{ item.DATA.split('-').reverse().join('/') }}
                  </td>
                  <td class="text-center">{{ item.DESCRICAO_PERIODO }}</td>
                  <td class="text-center">
                    {{ item.DESCRICAO_TIPO_DESCONTO }}
                  </td>
                  <td class="text-center">
                    {{ item.QTDE_HORAS.substring(0, 8) }}
                  </td>
                  <td class="text-center">
                    {{ 'R$ ' + item.VALOR_DESCONTO.split('.').join(',') }}
                  </td>
                  <td class="text-center">{{ item.DESCRICAO_CAUSA_RAIZ }}</td>
                  <td class="text-center">
                    <v-tooltip left color="red">
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn
                          icon
                          color="red"
                          v-bind="attrs"
                          v-on="on"
                          @click="deleteCadastroErroPagamento(item.ID_CADASTRO)"
                          :disabled="item.DATA_ENVIO != null || periodoCadastro == false"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                      <span>Excluir cadastro. Essa operação não será desfeita!</span>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-card>
      </v-card>
      <v-overlay :value="carregandoDados">
        <v-card color="primary" dark>
          <v-card-text>
            Excluindo...
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-overlay>
    </v-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'DeletarCadastro',
    props: {
      dialogDeletarCadastro: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      carregandoDados: false,
      ID_CADASTRO: '',
      dialogConfirmacao: false,
      search: ''
    }),
    computed: {
      prazoCadastro() {
        let prazoCadastro = this.$store.getters.prazoCadastro[0]
        if (prazoCadastro) {
          return prazoCadastro
        } else {
          return []
        }
      },
      ...mapGetters(['meusCadastrosDeErro']),
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      periodoCadastro() {
        // data padrão
        let dataCadastro = this.prazoCadastro
        let dataInicio = dataCadastro.INICIO
        let dataInicioF = dataInicio.length == 1 ? '0' + dataInicio : dataInicio
        let dataFim = dataCadastro.FIM
        let dataFimF = dataFim.length == 1 ? '0' + dataFim : dataFim
        let data = new Date()
        let dia = data.getDate().toString()
        let diaFormatado = dia.length == 1 ? '0' + dia : dia
        //
        if (diaFormatado >= dataInicioF) {
          if (diaFormatado <= dataFimF) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      }
    },
    // mounted() {
    //   this.loadMeusCadastrosDeErro();
    // },
    methods: {
      loadPrazoCadastro() {
        this.$store.dispatch('loadPrazoCadastro')
      },
      loadMeusCadastrosDeErro() {
        this.$store.dispatch('loadMeusCadastrosDeErro', this.usuarioAlmope)
      },
      deleteCadastroErroPagamento(item) {
        this.carregandoDados = true
        setTimeout(() => {
          this.$store.dispatch('deleteCadastroErroPagamento', item).then(() => {
            this.loadMeusCadastrosDeErro()
          })
          this.carregandoDados = false
        }, 3000)
      }
    },
    watch: {
      dialogDeletarCadastro() {
        if (this.dialogDeletarCadastro == true) {
          this.loadPrazoCadastro()
          this.loadMeusCadastrosDeErro()
        }
      }
    },
    created() {}
  }
</script>

<style></style>
