<template>
  <div class="container-sales">
    <painel-sales class="mt-2"></painel-sales>
    <v-tooltip bottom v-if="filtro != 'OPERADOR'">
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          fab
          class="btn"
          color="blue"
          small
          to="/pyxis/service-to-sales/smart-sales/configuracao"
        >
          <v-icon color="white" small>fa-solid fa-paintbrush</v-icon>
        </v-btn>
      </template>
      <span>Editar</span>
    </v-tooltip>
    <!-- <comunicado-importante
      styleImg="width:50vw; max-height: 210vh; padding: 10px 0px"
      maxWidth="60vw"
      title="TOP S2S - CLIQUE NA IMAGEM"
      :srcImg="require('@/assets/img/divulgacoes/imagem.jpg')"
      href="https://consultanumero.abrtelecom.com.br/consultanumero/consulta/consultaSituacaoAtualCtg"
    >
    </comunicado-importante> -->
  </div>
</template>

<script>
  // import comunicadoImportante from "@/shared/components/comunication/comunicado.vue";
  import PainelSales from './painelSales.vue'
  export default {
    components: { PainelSales },
    computed: {
      filtro() {
        return this.$store.getters.usuario.filtro
      }
    }
  }
</script>

<style scoped>
  .container-sales {
    height: 100vh;
    /* padding: 10px; */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .btn {
    position: absolute;
    right: 10px;
    top: 50px;
  }
</style>
