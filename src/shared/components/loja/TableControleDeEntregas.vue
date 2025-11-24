<template>
  <v-row>
    <v-col cols="12">
      <v-card class="mx-auto mt-7">
        <v-alert :type="type" v-if="isValid">{{ text }}</v-alert>
        <title-negative-margin title="Controle De Estoque">
          <v-tooltip bottom>
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                color="white"
                v-bind="attrs"
                v-on="on"
                fab
                depressed
                small
                to="/pyxis/gerenciamento-estoque/produtos"
              >
                <v-icon color="primary">mdi-keyboard-return</v-icon>
              </v-btn>
            </template>
            <span>Voltar</span>
          </v-tooltip>
        </title-negative-margin>
        <v-data-table
          :headers="getHeaders()"
          no-data-text="Não foram encontrados dados no momento"
          v-model:items="controleDeEntregas"
          class="text-no-wrap"
          dense
          :items-per-page="20"
        >
          <template v-slot:[`item.${DATA_ENTREGA}`]="{ item }">
            <template v-if="item.DATA_ENTREGA == null">
              <FieldDataEntrega
                :idVenda="item.ID_VENDAS"
                :idProduto="item.ID_PRODUTO"
                @updated:data="validacao"
              />
            </template>
            <template v-else>
              {{ item.DATA_ENTREGA }}
            </template>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import FieldDataEntrega from './FieldDataEntrega.vue'
  export default {
    components: { FieldDataEntrega },
    data: () => ({
      text: '',
      type: '',
      isValid: false
    }),
    computed: {
      controleDeEntregas() {
        let controleDeEntregas = this.$store.getters.controleDeEntregas
        return controleDeEntregas ? controleDeEntregas : []
      }
    },
    methods: {
      validacao(e) {
        ;(this.text = e.msg), (this.type = e.type), (this.isValid = e.invalido)
        setTimeout(() => {
          this.isValid = false
        }, 3000)
      },
      getHeaders() {
        let arrHeaders = [
          {
            text: 'ID Venda',
            align: 'center',
            value: 'ID_VENDAS'
          },
          {
            text: 'Data da Compra',
            align: 'center',
            value: 'DATA_COMPRA'
          },
          {
            text: 'Produto',
            align: 'center',
            value: 'NOME_PRODUTO'
          },
          {
            text: 'Qtd. Comprado',
            align: 'center',
            value: 'QUANTIDADE_COMPRA'
          },
          {
            text: 'Almope',
            align: 'center',
            value: 'ALMOPE_COMPRA'
          },
          {
            text: 'Nome',
            align: 'center',
            value: 'NOME'
          },
          {
            text: 'Supervisor',
            align: 'center',
            value: 'SUPERIOR1'
          },
          {
            text: 'Coordenador',
            align: 'center',
            value: 'SUPERIOR2'
          },
          {
            text: 'Data Entrega',
            align: 'center',
            value: 'DATA_ENTREGA'
          },

          {
            text: 'Operação',
            align: 'center',
            value: 'OPERACAO'
          }
        ]
        return arrHeaders
      },
      loadControleDeEntregas() {
        this.$store.dispatch('loadControleDeEntregas')
      }
    },
    watch: {},
    created() {
      this.loadControleDeEntregas()
    }
  }
</script>

<style scoped></style>
