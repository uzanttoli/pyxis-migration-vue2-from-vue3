<template>
  <v-dialog v-model="dialog" width="70%">
    <v-card color="#385F73" dark>
      <v-card-title>Casos Fechados</v-card-title>
      <v-card-subtitle>Casos tratados como finalizados</v-card-subtitle>
      <span style="font-size: 13px; margin-left: 20px">
        <i class="fa-solid fa-triangle-exclamation" style="color: orange"></i>
        Selecione um mês para carregamento dos dados.
      </span>
      <v-col>
        <v-text-field
          v-model="search"
          outlined
          dense
          placeholder="Pesquisar"
          label="Pesquisar"
        ></v-text-field>
        <v-row>
          <v-col>
            <v-select
              :items="filter['ano']"
              outlined
              dense
              placeholder="Selecione um ano"
              label="Selecione um ano"
              v-model="anoSelecionado"
            ></v-select>
          </v-col>
          <v-col>
            <v-select
              :items="filter['meses']"
              outlined
              dense
              v-model="mesSelecionado"
              @change="loadMeusCasosFechados()"
              placeholder="Selecione um mês"
              label="Selecione um mês"
            ></v-select>
          </v-col>
        </v-row>
        <!-- <pre>{{getHeaders}}</pre> -->
        <v-data-table
          :search="search"
          no-data-text="Não há casos finalizados ainda"
          :items="dados"
          :loading="loading"
          :headers="getHeaders"
          loading-text="Carregando..."
          no-results-text="Nada encontrado..."
          class="text-no-wrap custom-scroll"
          :footer-props="footerProps"
        >
          <template v-slot:item.NUM_CASO="{ item }">
            <v-btn
              small
              target="_blank"
              elevation="0"
              color="#385F73"
              :href="
                'https://vendas.conexaoclarobrasil.com.br/venda/acompanhamento/detalhe/' +
                item.NUM_CASO
              "
            >
              <span>Conexão/</span>
              <span>{{ item.NUM_CASO }}</span>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
  import Utils from '../../../../../data/services/common/Utils.js'
  import { Tratativa } from '../../../../../data/services/bko/trade/Tratativa.js'
  export default {
    props: {
      value: Boolean
    },
    data: () => ({
      search: null,
      loading: false,
      footerProps: {
        itemsPerPageText: 'Itens por página:',
        pageText: '{0}-{1} de {2}',
        perPageText: 'Itens por página:'
      },
      dados: [],
      anoSelecionado: null,
      mesSelecionado: null
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      dialog: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      },
      filter() {
        return {
          meses: Utils.monthFilter(12, this.anoSelecionado),
          ano: Utils.yearFilter(2)
        }
      },
      getHeaders() {
        let dados = this.dados[0]
        if (!dados) return

        let headers = Object.keys(dados).map(item => {
          return {
            text: item,
            value: item,
            align: 'center'
          }
        })
        return headers
      }
    },
    methods: {
      async loadMeusCasosFechados() {
        this.loading = true
        this.dados = await Tratativa.loadCasosFechados(this.usuario.almope, this.mesSelecionado)
        this.loading = false
      }
    },
    async created() {
      await this.loadMeusCasosFechados()
      // this.anoSelecionado = new Date().getFullYear().toString();
    }
  }
</script>

<style scoped></style>
