<template>
  <!-- v-model="dialogValidacaoImprodutivo" -->
  <v-sheet>
    <v-dialog
      persistent
      width="1500"
      :model-value="dialogValidacaoImprodutivo"
      @update:modelValue="val => $emit('update:dialogValidacaoImprodutivo', val)"
    >
      <v-form>
        <v-card>
          <title-negative-margin title="Validacao de Improdutivos" className="rounded-r-xl">
            <v-spacer></v-spacer>
            <v-text-field
              style="margin-top: -20px; margin-right: 10px"
              v-model="search"
              append-icon="mdi-magnify"
              label="Pesquisar"
              single-line
              hide-details
            ></v-text-field>
            <v-btn icon @click="$emit('closeDialogValidacaoImprodutivo')">
              <!-- <v-icon>mdi-close</v-icon> -->
              <v-icon>fa-solid fa-xmark</v-icon>
            </v-btn>
          </title-negative-margin>
          <v-data-table
            dense
            class="text-no-wrap"
            no-data-text="Não há dados no momento!"
            hide-default-footer
          >
            <template v-slot:header>
              <thead>
                <tr>
                  <th v-for="(item, i) in getHeader" :key="i" class="text-center">
                    {{ item.title }}
                  </th>
                </tr>
              </thead>
            </template>
            <template v-slot:body>
              <tbody>
                <tr v-for="(item, i) in filteredItems" :key="i">
                  <td justify-center>
                    <v-tooltip right color="primary">
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn
                          class="ml-2"
                          v-bind="attrs"
                          v-on="on"
                          icon
                          @click="
                            ;(dialogValidacao = !dialogValidacao), dadosValidacaoRetorno(item)
                          "
                        >
                          <v-icon color="green">mdi-check-network-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>Validar improdutivo!</span>
                    </v-tooltip>
                  </td>
                  <td class="text-center">{{ item.ALMOPE }}</td>
                  <td class="text-center">{{ item.NOME }}</td>
                  <td class="text-center">{{ item.SUPERIOR1 }}</td>
                  <td class="text-center">{{ item.SUPERIOR2 }}</td>
                  <td class="text-center">{{ item.REGIONAL }}</td>
                  <td class="text-center">{{ item.AGRUPAMENTO }}</td>
                  <td class="text-center">{{ item.SITUACAO }}</td>
                  <td class="text-center">{{ item.MOTIVOS }}</td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog v-model="dialogValidacao" width="500">
      <v-card>
        <title-negative-margin title="Validar"></title-negative-margin>
        <v-col>
          <v-select
            dense
            outlined
            label="Validação"
            v-model="VALIDACAO"
            :items="listaDeValidacao"
            item-text="VALIDACAO"
            item-value="ID_IMPRODUTIVOS_VALIDACAO"
          ></v-select>
          <v-textarea
            outlined
            auto-grow
            row-height="15"
            label="Observação"
            v-model="OBSERVACAO_ATUALIZADA"
          ></v-textarea>
          <v-btn
            depressed
            color="green"
            class="white--text"
            :disabled="!this.formIsValidValidacao()"
            block
            @click="updateDataFormCadastroImprodutivoAction()"
          >
            Validar
            <v-icon class="ml-2">mdi-check-all</v-icon>
          </v-btn>
        </v-col>
        <v-overlay :value="validandoDados">
          <v-card color="primary" dark>
            <v-card-text>
              Validando... Aguarde!
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-overlay>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script>
  export default {
    props: {
      dialogValidacaoImprodutivo: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      search: '',
      validandoDados: false,
      dialogValidacao: false,
      OBSERVACAO_ATUALIZADA: '',
      VALIDACAO: '',
      dadosValidacao: {
        AGRUPAMENTO: '',
        ALMOPE: '',
        ID_IMPRODUTIVOS: '',
        MOTIVOS: '',
        NOME: '',
        REGIONAL: '',
        SITUACAO: '',
        SUPERIOR1: '',
        SUPERIOR2: ''
      },
      getHeader: [
        {
          title: 'Validacao'
        },
        {
          title: 'Almope'
        },
        {
          title: 'Nome'
        },
        {
          title: 'Supervisor'
        },
        {
          title: 'Coordenador'
        },
        {
          title: 'Regional'
        },
        {
          title: 'Agrupamento'
        },
        {
          title: 'Situação'
        },
        {
          title: 'Motivos'
        }
      ]
    }),
    computed: {
      filteredItems() {
        let items = []
        items = this.listaDeValidacaoImprodutivos.filter(item => {
          return (
            item.ALMOPE.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
            item.NOME.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
            item.SUPERIOR1.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
            item.SUPERIOR2.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
            item.REGIONAL.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
            item.AGRUPAMENTO.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
            item.SITUACAO.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
            item.MOTIVOS.toLowerCase().indexOf(this.search.toLowerCase()) > -1
          )
        })
        return items
      },
      usuarioNome() {
        return this.$store.getters.usuario.nome
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      listaDeValidacao() {
        let listaDeValidacao = this.$store.getters.listaDeValidacao
        return listaDeValidacao ? listaDeValidacao : []
      },
      listaDeValidacaoImprodutivos() {
        let listaDeValidacaoImprodutivos = this.$store.getters.listaDeValidacaoImprodutivos
        return listaDeValidacaoImprodutivos ? listaDeValidacaoImprodutivos : []
      }
    },
    methods: {
      formIsValidValidacao() {
        return this.OBSERVACAO_ATUALIZADA && this.OBSERVACAO_ATUALIZADA
      },
      limparFormValidacao() {
        return (this.OBSERVACAO_ATUALIZADA = ''), (this.VALIDACAO = '')
      },
      loadListaDeValidacao() {
        this.$store.dispatch('loadListaDeValidacao')
      },
      date() {
        let date = new Date()
        let day = date.getDate().toString()
        let dayF = day.length == 1 ? '0' + day : day

        let month = (date.getMonth() + 1).toString()
        let monthF = month.length == 1 ? '0' + month : month

        let year = date.getFullYear()

        let hours = date.getHours().toString()
        let hoursF = hours.length == 1 ? '0' + hours : hours

        let minutes = date.getMinutes().toString()
        let minutesF = minutes.length == 1 ? '0' + minutes : minutes

        let seconds = date.getSeconds().toString()
        let secondsF = seconds.length == 1 ? '0' + seconds : seconds

        return dayF + '/' + monthF + '/' + year + ' ' + hoursF + ':' + minutesF + ':' + secondsF
      },
      updateDataFormCadastroImprodutivoAction() {
        if (this.VALIDACAO == 1) {
          this.validandoDados = true
          setTimeout(() => {
            this.$store.dispatch('deleteDataAction', this.dadosValidacao.ALMOPE).then(() => {
              this.loadListaDeValidacaoImprodutivos()
              // this.text = "Validar";
              this.limparFormValidacao()
              this.validandoDados = false
              this.dialogValidacao = false
            })
          }, 3000)
        } else {
          this.validandoDados = true
          setTimeout(() => {
            this.dadosValidacao.DATA_HORA_ATUALIZADA = this.date()
            this.dadosValidacao.VALIDACAO = this.VALIDACAO
            this.dadosValidacao.OBSERVACAO_ATUALIZADA = this.OBSERVACAO_ATUALIZADA
            this.dadosValidacao.USUARIO_ATUALIZACAO = this.usuarioAlmope
            this.$store
              .dispatch('updateDataFormCadastroImprodutivoAction', this.dadosValidacao)
              .then(() => {
                this.loadListaDeValidacaoImprodutivos()
                // this.text = "Validar";
                this.limparFormValidacao()
                this.validandoDados = false
                this.dialogValidacao = false
              })
          }, 3000)
        }
      },
      dadosValidacaoRetorno(item) {
        return (
          (this.dadosValidacao.AGRUPAMENTO = item.AGRUPAMENTO),
          (this.dadosValidacao.ALMOPE = item.ALMOPE),
          (this.dadosValidacao.ID_IMPRODUTIVOS = item.ID_IMPRODUTIVOS),
          (this.dadosValidacao.MOTIVOS = item.MOTIVOS),
          (this.dadosValidacao.NOME = item.NOME),
          (this.dadosValidacao.REGIONAL = item.REGIONAL),
          (this.dadosValidacao.SITUACAO = item.SITUACAO),
          (this.dadosValidacao.SUPERIOR1 = item.SUPERIOR1),
          (this.dadosValidacao.SUPERIOR2 = item.SUPERIOR2)
        )
      },
      loadListaDeValidacaoImprodutivos() {
        this.$store.dispatch('loadListaDeValidacaoImprodutivos', this.usuarioNome)
      }
    },
    watch: {
      dialogValidacao() {
        if (this.dialogValidacao == false) {
          this.loadListaDeValidacaoImprodutivos()
        }
      },
      dialogValidacaoImprodutivo() {
        if (this.dialogValidacaoImprodutivo == true) {
          this.loadListaDeValidacaoImprodutivos()
        }
      }
    },
    created() {
      this.loadListaDeValidacao()
    }
  }
</script>

<style></style>
