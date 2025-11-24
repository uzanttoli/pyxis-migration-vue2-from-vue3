<template>
  <v-container fluid>
    <div class="transition-swing">
      <div style="display: flex; align-items: center; justify-content: space-between">
        <div>
          <p style="padding: 0; margin: 0" class="text-h6 gray--text">
            <i class="fa-solid fa-circle-nodes mr-1 red--text"></i>
            Bem vindo,
            <span style="text-transform: capitalize">{{ nameUser }}!</span>
          </p>
          <span style="font-size: 12px">* Selecione uma fila para iniciar as tratativas</span>
        </div>
        <div v-if="usuarioPerfil == 'ADMINISTRADOR'">
          <v-btn icon @click="isConfig = true">
            <v-icon>fa-solid fa-gear</v-icon>
          </v-btn>
        </div>
      </div>
      <v-divider></v-divider>
      <div style="display: flex">
        <div style="display: flex; width: 100%; flex-wrap: wrap; justify-content: start">
          <v-col v-for="(item, i) in itemsCard" :key="i" xl="6" md="6" sm="12" lg="6">
            <card-fila
              :to="
                item.TITULO === NOVO_ATV_BKO
                  ? {
                      name: 'Tratativa Por Produto',
                      params: {
                        produto: $store.getters.usuario.id_produto.toLowerCase()
                      }
                    }
                  : item.ROUTE
              "
              :title="item.TITULO"
              :description="item.DESCRIPTION"
              :qtd="item.QTD"
            />
          </v-col>
        </div>
      </div>
    </div>
    <DialogConfiguracaoVue :dialogConfig="isConfig" @update:close-dialog="isConfig = false" />
  </v-container>
</template>
<script>
  import { Tratamento } from '../../../../../js/Tratamento'
  import config from '../../../../../core/config'
  import DialogConfiguracaoVue from './gerenciamento/dialogConfiguracao.vue'
  import CardFila from './_components/CardFila.vue'
  import produto from '@/pages/serviceToSales/backoffice/produto.json'
  export default {
    components: { DialogConfiguracaoVue, CardFila },
    data: () => ({
      itemsCard: [],
      isConfig: null,
      tab: null,
      NOVO_ATV_BKO: 'BACKOFFICE S2S'
    }),
    computed: {
      produto() {
        return produto
      },
      myProduct() {
        return this.$store.getters.usuario.produto
      },
      usuarioPerfil() {
        return this.$store.getters.usuario.filtro
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      nameUser() {
        let nome = new Tratamento(this.$store.getters.usuario.nome)
        return nome.myPrimaryName
      }
    },
    methods: {
      loadListConfigFila() {
        let urlData = `${config.baseUrl}api/shared/service_to_sales/silente/fila/config_fila/${this.usuarioPerfil}/${this.usuarioAlmope}`
        this.$api.get(urlData).then(res => {
          this.itemsCard = res.data
        })
      }
    },
    created() {
      this.loadListConfigFila()
    },
    watch: {
      length(val) {
        this.tab = val - 1
      }
    }
  }
</script>
<style scoped>
  h1 {
    color: #333;
  }

  .search {
    margin-top: 25px;
    width: 350px;
  }

  .img_model {
    width: 80vw;
    /* min-width: 50vw; */
    position: fixed;
    bottom: 10px;
  }
</style>
