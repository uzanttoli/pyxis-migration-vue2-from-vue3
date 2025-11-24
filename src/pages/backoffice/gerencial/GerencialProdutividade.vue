<template>
  <section>
    <div class="my-3 mb-6" style="display: flex; justify-content: center">
      <v-btn-toggle
        class="rounded-lg"
        mandatory
        v-model="produtoAtual"
        dense
        active-class="blue darken-3"
      >
        <v-btn
          class="text-capitalize"
          v-for="(item, i) in produtos"
          :key="i"
          :value="item.FILA_GRUPO"
          :class="item.FILA_GRUPO == produtoAtual ? 'white--text' : ''"
        >
          <i
            v-if="item.FILA_GRUPO == produtoAtual"
            class="fa-solid fa-circle-check"
            style="color: greenyellow; margin-right: 5px"
          ></i>
          {{ item.FILA_GRUPO }}
        </v-btn>
      </v-btn-toggle>
    </div>
    <tratativa-dia-dia :produto="produtoAtual"></tratativa-dia-dia>
    <taxa-ocupacao-mes :produto="produtoAtual"></taxa-ocupacao-mes>
    <!-- <retorno-voz></retorno-voz> -->
  </section>
</template>

<script>
  import config from '../../../core/config'
  // import RetornoVoz from "./tables/RetornoVoz.vue";
  import TaxaOcupacaoMes from './tables/TaxaOcupacaoMes.vue'
  import TratativaDiaDia from './tables/TratativaDiaDia.vue'
  export default {
    components: { TratativaDiaDia, TaxaOcupacaoMes },
    data() {
      return {
        produtos: [],
        produtoAtual: null
      }
    },
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      produtoBko() {
        return this.usuario.produto == 'NET' ? 'COMBO' : 'CLARO'
      }
    },
    methods: {
      loadNameFiltro() {
        let urlData = `${config.baseUrl}api/shared/backoffice/gerencial/produto_fila`
        this.$api
          .get(urlData, {
            params: {
              perfil: this.usuario.filtro,
              produto: this.usuario.produto,
              almope: this.usuario.almope
            }
          })
          .then(result => {
            this.produtos = result.data
            this.produtoAtual = result?.data[0]?.FILA_GRUPO ?? this.produtoBko + ' BKO'
          })
      }
    },
    created() {
      this.loadNameFiltro()
    }
  }
</script>

<style></style>
