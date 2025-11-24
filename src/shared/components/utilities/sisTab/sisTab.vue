<template>
  <v-dialog max-width="800" v-model="dialogSisTab" persistent>
    <v-col cols="12" class="pa-2">
      <v-card ref="form">
        <title-negative-margin title="Sistema de Tabulação">
          <v-btn icon @click.stop="$emit('closeSisTab')">
            <!-- <v-icon>mdi-close</v-icon> -->
            <v-icon>fa-solid fa-xmark</v-icon>
          </v-btn>
        </title-negative-margin>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="sisTab.nameClient"
                label="Número Chamador"
                class="ml-5"
                placeholder="Número Chamador"
                outlined
              ></v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="6">
              <v-select
                class="mr-5"
                item-text="DES"
                item-value="VALUE"
                :items="unidadeNegocio"
                @change="loadTipoSolicitacao()"
                v-model="sisTab.produto"
                label="Informe a Bandeira"
                outlined
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="sisTab.nameContact"
                class="ml-5"
                label="Produto"
                no-data-text="Informe o primeiro a bandeira"
                outlined
              ></v-select>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="6">
              <v-select
                class="mr-5"
                item-text="DES"
                item-value="VALUE"
                :items="tipoSolicitacao"
                no-data-text="Informe primeiro o produto"
                @change="loadDetalheSolicitacao()"
                v-model="sisTab.solicitacao"
                label="Motivo"
                outlined
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <v-text-field
                class="ml-5"
                v-model="sisTab.numberPhone"
                label="Número de Telefone"
                placeholder="Insira o numero de contato"
                outlined
              ></v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="6">
              <v-select
                class="mr-5"
                v-model="sisTab.detalhe"
                :items="detalheSolicitacao"
                no-data-text="Selecione primeiro a solicitação."
                item-text="DES"
                item-value="VALUE"
                label="Detalhe"
                outlined
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="sisTab.contractProtocol"
                class="ml-5"
                label="Número o Contrato / Protocolo"
                placeholder="Insira o numero do contrato ou protocolo"
                outlined
              ></v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="6">
              <v-select
                class="mr-5"
                v-model="sisTab.canaisCritico"
                :items="canaisCritico"
                label="Mencionou canais criticos?"
                outlined
              ></v-select>
            </v-col>
          </v-row>

          <v-textarea
            filled
            auto-grow
            v-model="sisTab.observacao"
            label="Observação"
            rows="4"
            row-height="25"
            shaped
          ></v-textarea>
          <v-row>
            <v-btn color="primary" class="ml-5 mb-5" :disabled="!this.formIsValid()">ENVIAR</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!this.formFilled()"
              color="red white--text"
              @click="limparCampos()"
              class="mr-5 mb-5"
            >
              LIMPAR
            </v-btn>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      dialogSisTab: {
        type: Boolean,
        default: true
      }
    },
    data: () => ({
      canaisCritico: ['SIM', 'NÃO'],
      sisTab: {
        nameClient: null,
        nameContact: null,
        numberPhone: null,
        contractProtocol: null,
        produto: null,
        solicitacao: null,
        detalhe: null,
        canalCritico: null,
        observacao: null
      },
      sisTabDefault: {
        nameClient: null,
        nameContact: null,
        numberPhone: null,
        contractProtocol: null,
        produto: null,
        solicitacao: null,
        detalhe: null,
        canalCritico: null,
        observacao: null
      }
    }),
    computed: {
      unidadeNegocio() {
        return this.$store.getters.unidadeNegocio
      },
      tipoSolicitacao() {
        return this.$store.getters.tipoSolicitacao
      },
      detalheSolicitacao() {
        return this.$store.getters.detalheSolicitacao
      }
    },
    methods: {
      loadUnidadeNegocio() {
        this.$store.dispatch('loadUnidadeNegocio')
      },
      loadTipoSolicitacao() {
        if (this.sisTab.produto) this.sisTab.solicitacao = null
        this.$store.dispatch('loadTipoSolicitacao', this.sisTab.produto)
      },
      loadDetalheSolicitacao() {
        if (this.sisTab.solicitacao) this.sisTab.detalhe = null
        this.$store.dispatch('loadDetalheSolicitacao', {
          produto: this.sisTab.produto,
          solicitacao: this.sisTab.solicitacao
        })
      },
      limparCampos() {
        Object.assign(this.sisTab, this.sisTabDefault)
      },
      formIsValid() {
        return (
          this.sisTab.nameClient &&
          this.sisTab.nameContact &&
          this.sisTab.numberPhone &&
          this.sisTab.contractProtocol &&
          this.sisTab.produto &&
          this.sisTab.solicitacao &&
          this.sisTab.detalhe &&
          this.sisTab.canaisCritico &&
          this.sisTab.observacao
        )
      },
      formFilled() {
        return (
          this.sisTab.nameClient ||
          this.sisTab.nameContact ||
          this.sisTab.numberPhone ||
          this.sisTab.contractProtocol ||
          this.sisTab.produto ||
          this.sisTab.solicitacao ||
          this.sisTab.detalhe ||
          this.sisTab.canaisCritico ||
          this.sisTab.observacao
        )
      },
      initializeData() {
        this.loadUnidadeNegocio()
      }
    },
    watch: {
      dialogSisTab() {
        if (this.dialogSisTab && this.unidadeNegocio.length <= 0) this.initializeData()
      }
    },
    created() {
      // this.loadUnidadeNegocio();
    }
  }
</script>

<style></style>
