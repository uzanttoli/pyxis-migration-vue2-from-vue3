<template>
  <v-container fluid class="mt-5">
    <v-card class="rounded-xl">
      <div style="display: flex; justify-content: space-between; padding: 10px">
        <div class="ma-2" style="display: flex; justify-content: center">
          <v-btn-toggle
            class="rounded-lg"
            mandatory
            v-model="tratativaAtual"
            dense
            active-class="blue darken-3"
          >
            <template v-for="(item, i) in buttons" :key="i">
              <v-tooltip bottom>
                <template v-slot:activator="{ attrs, on }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    class="text-capitalize"
                    :value="item.value"
                    :class="item.value == tratativaAtual ? 'white--text' : ''"
                  >
                    <i
                      v-if="item.value == tratativaAtual"
                      class="fa-solid fa-circle-check"
                      style="color: greenyellow; margin-right: 5px"
                    ></i>
                    {{ item.text }}
                  </v-btn>
                </template>

                <span v-html="item.info"></span>
              </v-tooltip>
            </template>
          </v-btn-toggle>
        </div>

        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              icon
              to="/pyxis/service-to-sales/checkout-vendas-pend-atv/download-evidencias"
              style="position: relative; margin-top: 5px"
            >
              <i style="font-size: 35px; color: rgb(255, 202, 40)" class="fa-solid fa-folder"></i>

              <div
                style="
                  position: absolute;
                  bottom: 1px;
                  right: -8px;
                  background-color: #fff;
                  border-radius: 30px;
                  width: 20px;
                  height: 20px;
                  align-items: center;
                  display: flex;
                  justify-content: center;
                "
              >
                <i style="color: rgb(191, 54, 12)" class="fa-solid fa-circle-down"></i>
              </div>
            </v-btn>
          </template>

          <span>Baixar Evidências</span>
        </v-tooltip>
      </div>

      <component :is="tratativaAtual"></component>
    </v-card>

    <right-side-bar-tratativa title="Resumo Tratativa" :base="base"></right-side-bar-tratativa>
  </v-container>
</template>

<script>
  import RightSideBarTratativa from '../../../../backoffice/RightSideBarTratativa.vue'
  import checkAtivacoes from './forms/checkAtivacoes.vue'
  import vendaNaoLocalizada from './forms/vendaNaoLocalizada.vue'
  import gross from './forms/gross.vue'
  import config from '../../../../../core/config'
  export default {
    components: {
      checkAtivacoes,
      vendaNaoLocalizada,
      RightSideBarTratativa,
      gross
    },
    data: () => ({
      tratativaAtual: null,
      tempo: null,
      interval: null,
      base: [],
      buttons: [
        {
          text: 'Ativações',
          value: 'check-ativacoes',
          info: "BKO Ativação encerrou a tratativa do caso como 'ATIVO', </br>porém, em uma data posterior a tratativa a venda </br>ainda consta como PENDENTE no controle de ativações."
        },
        {
          text: 'Venda Não Localizada',
          value: 'venda-nao-localizada',
          info: 'Auditoria consiste nos casos de VENDAS TABULADAS pelo </br>colaborador do S2S e que não foram identificadas no relatório </br>oficial de vendas da Claro (IN).'
        },
        {
          text: 'Gross',
          value: 'gross',
          info: 'Auditoria consiste nos casos de VENDAS TABULADAS </br>pelo colaborador do S2S como GROSS, porém, não foi</br> localizada OS de CHIP, sendo assim, classificadas como MIG.'
        }
      ]
    }),
    computed: {
      tabulador() {
        if (this.tratativaAtual == 'check-ativacoes') {
          return 1
        } else if (this.tratativaAtual == 'venda-nao-localizada') {
          return 2
        } else if (this.tratativaAtual == 'gross') {
          return 3
        }
        return 1
      }
    },
    methods: {
      loadDadosCards() {
        let urlData = `${config.baseUrl}api/shared/service_to_sales/validacao_venda/listar_dados_cards`
        this.$api
          .get(urlData, {
            params: {
              almope: this.$store.getters.usuario.almope,
              tabulador: this.tabulador
            }
          })
          .then(res => {
            this.base = res.data
          })
      }
    },
    watch: {
      tratativaAtual: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.loadDadosCards()
        }
      }
    },
    created() {
      this.loadDadosCards()
    }
  }
</script>

<style scoped>
  .box-time {
    font-size: 18px;
    padding: 0;
    margin: 0;
  }

  .box-tempo-tratativa {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .rel {
    background-color: #202020a2;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px 12px;
    border-radius: 10px;
    position: fixed;
    top: 35px;
    opacity: 0.6;
  }
</style>
