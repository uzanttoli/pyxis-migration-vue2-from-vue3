<template>
  <div class="card-container">
    <div
      :class="
        title == 'MAIS OPÇÕES'
          ? 'card-pricing-maisopcoes'
          : title == 'BLACK FRIDAY'
          ? 'card-pricing-blackfriday'
          : 'card-pricing'
      "
    >
      <div class="blackfriday" v-if="title == 'BLACK FRIDAY'">
        <img src="../../assets/img/core/blackfriday.png" />
      </div>
      <div class="melhor-oferta" v-if="title == 'OFERTA IDEAL'">
        <img src="../../assets/img/core/coroa.png" alt="" />
      </div>
      <div class="title">
        <div style="display: flex; justify-content: center">
          <img class="fa" src="../../assets/img/core/claro.png" />
        </div>
        <h2>{{ textMinus(title) }}</h2>
      </div>
      <div class="description-plan">
        <p>{{ textMinus(descriptionPlan) }}</p>
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <i
              v-bind="attrs"
              v-on="on"
              v-show="condicoesOfertas != null"
              class="fa-solid fa-circle-info"
              style="
                font-size: 16px;
                color: #e3e3e3;
                margin-top: 0px;
                margin-left: 10px;
                cursor: pointer;
              "
            ></i>
          </template>
          <span>{{ condicoesOfertas }}</span>
        </v-tooltip>
      </div>
      <div style="width: 100%; display: flex; justify-content: center">
        <div style="box-shadow: 0 0 1px 1px #ffffff; width: 200px"></div>
      </div>
      <div class="description">
        <p>{{ textMinus(description) }}</p>
      </div>
      <div class="price">
        <h4>R$ {{ price }}</h4>
        <p>/mês</p>
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <i
              v-bind="attrs"
              v-on="on"
              class="fa-solid fa-circle-info"
              style="font-size: 16px; color: #e3e3e3; margin-top: -25px; margin-left: 10px"
            ></i>
          </template>
          <span>{{ observacaoProduto }}</span>
        </v-tooltip>
      </div>
      <div class="option">
        <ul>
          <li>
            <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
            <span style="font-weight: bold">
              TV:
              {{ valorTv == null || valorTv == '' ? 'Não possui' : formatMoney(valorTv) }}
            </span>
          </li>
          <li
            style="display: flex; align-items: center; cursor: pointer"
            @click="abrirTabelaPrecoResidencial = true"
          >
            <div class="mr-3">
              <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
              <span style="font-weight: bold">
                Virtua:
                {{
                  valorVirtua == null || valorVirtua == ''
                    ? ' Não possui'
                    : formatMoney(valorVirtua)
                }}
              </span>
            </div>
            <i class="fa-solid fa-circle-info" style="font-size: 20px; color: #ffeb3b"></i>
          </li>
          <li>
            <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
            <span :style="valorIsento" style="font-weight: bold">
              Fone:
              {{ valorFone == null || valorFone == '' ? 'Não possui' : formatMoney(valorFone) }}
            </span>
            <span style="font-style: italic">
              {{ this.valorTv && this.valorVirtua && this.valorFone ? 'Valor Isento' : '' }}
            </span>
          </li>
          <li>
            <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
            <span style="font-weight: bold">
              Valor Total:
              {{ calcularValor(valorTv, valorVirtua, valorFone, price) }}
            </span>
            <span style="font-style: italic">(c/ linha móvel)</span>
          </li>
        </ul>
      </div>
      <a @click="cadastrarOferta">Cadastrar</a>
    </div>
    <template v-if="title != 'MAIS OPÇÕES'">
      <div
        v-for="(item, i) in ofertasConcorrentes"
        :key="i"
        v-show="isVisible(descriptionPlan, item.TIPO_PLANO)"
        style="
          display: flex;
          justify-content: space-around;
          width: 350px;
          align-items: center;
          background-color: #f0f0f0;
          margin-top: 20px;
          border-radius: 15px;
        "
      >
        <comparacao-planos
          v-for="(item2, i) in item.ITEMS"
          :key="i + '2'"
          :img="item2.DESC_OPERADORA_PLANO"
          :gb="item2.DESC_FRANQUIA"
          :valorConcorrente="item2.VALOR_PLANO"
          :valorGb="item2.DESC_GIGA_VALOR"
          :tipoPlano="item2.TIPO_PLANO"
        ></comparacao-planos>
      </div>
    </template>

    <tabela-preco-residencial
      :abrirTabelaPrecoResidencial="abrirTabelaPrecoResidencial"
      :dadosFormulario="dadosFormulario"
      @update:closeTabelaPrecoResidencial="
        abrirTabelaPrecoResidencial = !abrirTabelaPrecoResidencial
      "
    ></tabela-preco-residencial>
    <!-- script de oferta -->
    <script-utilizacao-movel
      @update:seguirCadastro="seguirCadastro"
      :scriptOpen="scriptOpen"
      @updated:close-script="scriptOpen = !scriptOpen"
      :indexOferta="index"
    ></script-utilizacao-movel>
  </div>
</template>

<script>
  import comparacaoPlanos from './comparacaoPlanos.vue'
  import ScriptUtilizacaoMovel from './scriptUtilizacaoMovel.vue'
  import TabelaPrecoResidencial from './tabelaPrecoResidencial.vue'

  export default {
    components: {
      comparacaoPlanos,
      TabelaPrecoResidencial,
      ScriptUtilizacaoMovel
    },
    props: {
      title: {
        type: String,
        default: 'Melhor Oferta'
      },
      description: {
        type: String,
        default: ''
      },
      price: {
        type: [String, Number],
        default: ''
      },
      observacaoProduto: {
        type: [String, Number],
        default: ''
      },
      melhorOferta: {
        type: Boolean,
        default: false
      },
      valorTv: {
        type: [String, Number],
        default: 0
      },
      valorVirtua: {
        type: [String, Number],
        default: 0
      },
      valorFone: {
        type: [String, Number],
        default: 0
      },
      valorTotal: {
        type: [String, Number],
        default: 0
      },
      dadosFormulario: {
        type: [Array, Object]
      },
      index: {
        type: Number
      },
      ofertasConcorrentes: {
        type: [Array, Object]
      },
      descriptionPlan: {
        type: [String, Number],
        default: 0
      },
      idPlan: {
        type: [String, Number],
        default: 0
      },
      descNetSales: {
        type: String,
        default: ''
      },
      condicoesOfertas: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      abrirTabelaPrecoResidencial: false,
      scriptOpen: false
    }),
    computed: {
      valorIsento() {
        if (this.valorTv && this.valorVirtua && this.valorFone) {
          return 'text-decoration: line-through;'
        }
        return ''
      }
    },
    methods: {
      isVisible(descriptionPlan, tipoPlan) {
        if (descriptionPlan.includes(tipoPlan)) {
          return true
        }
      },
      seguirCadastro() {
        this.scriptOpen = !this.scriptOpen
        let form = this.dadosFormulario
        form.flagPrice = this.price
        form.flag = this.title
        form.planoEscolha = this.idPlan
        form.clienteAceitou = 'SIM'
        form.descNetSales = this.descNetSales
        this.$emit('update:cadastrar-oferta', form)
      },
      cadastrarOferta() {
        this.scriptOpen = true
      },
      formatMoney(value) {
        if (!value) return
        let formated = value.toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL'
        })
        return formated
      },
      valorValido(valor) {
        if (valor != 0 && valor != '' && valor != null) {
          return true
        }
        return false
      },
      calcularValor(value1, value2, value3, value4) {
        let arrayConsiderar =
          this.valorValido(value1) && this.valorValido(value2) && this.valorValido(value3)

        let array = arrayConsiderar
          ? [value1 * 1, value2 * 1, value4 * 1]
          : [value1 * 1, value2 * 1, value3 * 1, value4 * 1]

        let notNull = array.filter(item => {
          return item != null
        })

        let soma = notNull.reduce((valorAtual, proximoValor) => {
          return valorAtual + proximoValor
        })

        return soma.toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL'
        })
      },
      textMinus(string) {
        if (!string) return
        return string.toLowerCase()
      }
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css?family=Roboto:300"); */

  .card-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }

  .melhor-oferta {
    position: absolute;
    transform: rotate(-30deg); /* girar a div -45 graus */
    margin-top: -70px;
    margin-left: -50px;
    display: flex;
    justify-content: center;
  }

  .melhor-oferta img {
    width: 100px;
  }

  .blackfriday {
    position: absolute;
    transform: rotate(30deg); /* girar a div -45 graus */
    margin-top: -90px;
    margin-left: 160px;
    display: flex;
    justify-content: center;
  }
  .blackfriday img {
    width: 250px;
  }
  .card-pricing-maisopcoes {
    width: 350px;
    max-width: 350px;
    height: auto;
    background: linear-gradient(-45deg, #b70817, #d05456);
    border-radius: 15px;
    -webkit-border-radius: 15px;
    -moz-border-radius: 15px;
    -ms-border-radius: 15px;
    -o-border-radius: 15px;
    margin: 0 auto;
    padding: 40px 20px;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }
  .card-pricing-blackfriday {
    width: 350px;
    max-width: 350px;
    height: auto;
    background: linear-gradient(-45deg, #000000, #222222);
    border-radius: 15px;
    -webkit-border-radius: 15px;
    -moz-border-radius: 15px;
    -ms-border-radius: 15px;
    -o-border-radius: 15px;
    margin: 0 auto;
    padding: 40px 20px;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  .card-pricing {
    width: 350px;
    max-width: 350px;
    height: auto;
    background: linear-gradient(-45deg, #fe0847, #feae3f);
    border-radius: 15px;
    -webkit-border-radius: 15px;
    -moz-border-radius: 15px;
    -ms-border-radius: 15px;
    -o-border-radius: 15px;
    margin: 0 auto;
    padding: 40px 20px;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  .card-container:nth-child(2) .card-pricing,
  .card-container:nth-child(2) .card-pricing {
    background: linear-gradient(-45deg, #ffec61, #f321d7);
  }

  .card-container:nth-child(3) .card-pricing,
  .card-container:nth-child(3) .card-pricing {
    background: linear-gradient(-45deg, #24ff72, #9a4eff);
  }

  .card-container:nth-child(4) .card-pricing,
  .card-container:nth-child(4) .card-pricing {
    background: linear-gradient(-45deg, #f403d1, #64b5f6);
  }

  /* .card-pricing:hover {
  transform: scale(1.1);
  -webkit-transform: scale(1.1);
  -moz-transform: scale(1.1);
  -ms-transform: scale(1.1);
  -o-transform: scale(1.1);
} */

  .title img {
    color: #fff;
    font-size: 60px;
    height: 100px;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    text-align: center;
    line-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .title h2 {
    position: relative;
    margin: 20px 0;
    padding: 0;
    color: #fff;
    font-size: 30px;
    text-transform: capitalize;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Roboto;
  }

  .description-plan {
    font-weight: 600;
  }

  .description,
  .description-plan {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .description p,
  .description-plan p {
    font-size: 15px;
    color: #ffffff;
    text-align: center;
    text-transform: capitalize;
  }

  .price {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .price h4,
  p {
    margin: 0;
    padding: 10px 0;
    color: #fff;
    font-size: 40px;
  }

  .price p {
    font-size: 30px;
    color: #e3e3e3;
  }

  .option {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .option ul {
    margin: 0;
    padding: 0;
  }

  .option ul li {
    margin: 0 0 10px;
    padding: 0;
    list-style: none;
    color: #fff;
    font-size: 16px;
  }

  .option ul li i {
    margin-right: 6px;
  }

  .card-pricing a,
  .card-pricing-blackfriday a,
  .card-pricing-maisopcoes a {
    position: relative;
    z-index: 2;
    background: #fff;
    color: #656565;
    width: 175px;
    height: 40px;
    line-height: 40px;
    border-radius: 40px;
    display: block;
    text-align: center;
    margin: 20px auto 0;
    -webkit-border-radius: 40px;
    -moz-border-radius: 40px;
    -ms-border-radius: 40px;
    -o-border-radius: 40px;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    text-decoration: none;
    font-weight: 600;
  }
</style>
