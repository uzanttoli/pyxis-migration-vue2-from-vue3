<template>
  <!-- v-model="abrirTabelaPrecoResidencial" -->

  <v-dialog
    persistent
    width="90%"
    :model-value="abrirTabelaPrecoResidencial"
    @update:modelValue="val => $emit('update:abrirTabelaPrecoResidencial', val)"
  >
    <v-card>
      <v-card-title>
        Preço residencial
        <v-spacer></v-spacer>

        <v-btn icon @click="$emit('update:closeTabelaPrecoResidencial')">
          <v-icon>fa fa-close</v-icon>
        </v-btn>
      </v-card-title>

      <div style="display: flex; justify-content: center">
        <div style="width: 99%; margin: 10px">
          <v-alert border="bottom" colored-border type="warning" elevation="2">
            Tabela de preço Virtua com sugestões de melhoria para o cliente, por isso não é possivel
            executar nenhuma ação por aqui.
            <mark>
              Oferte a que melhor se adeque ao plano do cliente e siga o cadastro no NET SALES!
            </mark>
          </v-alert>
        </div>
      </div>

      <v-data-table
        dense
        :headers="getHeaders"
        no-data-text="Cliente já possui valores abaixo da tabela vigente"
        :items="dadosTabelaPrecoResidencial"
      ></v-data-table>
    </v-card>
  </v-dialog>
</template>

<script>
  import config from '../../core/config'
  export default {
    props: {
      abrirTabelaPrecoResidencial: {
        type: Boolean,
        default: false
      },
      dadosFormulario: {
        type: [Array, Object]
      }
    },
    data: () => ({
      getHeaders: [
        {
          text: 'Descrição Plano',
          value: 'DESC_PLANO',
          align: 'center',
          sortable: false
        },
        {
          text: 'Valor Assinatura',
          value: 'VALOR_PLANO',
          align: 'center',
          sortable: false
        },
        {
          text: 'Resgates Inclusos',
          value: 'DESC_ASSI_RESG_INCLUSOS',
          align: 'center',
          sortable: false
        },
        {
          text: 'Observação',
          value: 'DESC_OBSERVACAO',
          align: 'center',
          sortable: false
        }
      ],
      dadosTabelaPrecoResidencial: []
    }),
    methods: {
      loadDadosTabelaPrecoResidencial() {
        let urlData = `${config.baseUrl}api/shared/smartsales/televendas/sugestao_smart_residencial/${this.dadosFormulario.nomeCidade}/${this.dadosFormulario.velocidadeVirtua}/${this.dadosFormulario.valorAssinaturaVirtua}`
        this.$api.get(urlData).then(res => {
          this.dadosTabelaPrecoResidencial = res.data
        })
      }
    },
    watch: {
      abrirTabelaPrecoResidencial() {
        if (this.abrirTabelaPrecoResidencial == true) {
          this.loadDadosTabelaPrecoResidencial()
        }
      }
    }
  }
</script>

<style></style>
