<template>
  <div class="card-container">
    <div class="card-pricing">
      <div class="title">
        <i class="fa fa-solid fa-circle-xmark" aria-hidden="true"></i>
        <h2 style="text-transform: capitalize; font-size: 30px">
          {{ textMinus(title) }}
        </h2>
      </div>
      <div class="price">
        <p>Selecione o motivo e confira as dicas de argumentação:</p>
      </div>
      <div class="option">
        <ul>
          <li @click="achouCaro = true">
            <i class="fa-solid fa-lightbulb" aria-hidden="true"></i>
            Achou muito caro
          </li>
          <li @click="quemDecideFamilia = true">
            <i class="fa-solid fa-lightbulb" aria-hidden="true"></i>
            Quem decide é a familia
          </li>
          <li @click="querContinuarConcorrente = true">
            <i class="fa-solid fa-lightbulb" aria-hidden="true"></i>
            Quer continuar com o concorrente
          </li>
          <li @click="situacaoFinanceira = true">
            <i class="fa-solid fa-lightbulb" aria-hidden="true"></i>
            Situação financeira ou desemprego
          </li>
        </ul>
      </div>
      <v-divider class="#fff"></v-divider>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form @submit.prevent="submit">
          <div class="selection">
            <validation-provider v-slot="{ errors }" name="motivo" rules="required">
              <label for="select">Escolha um motivo:</label>
              <v-select
                outlined
                dense
                :items="items"
                :error-messages="errors"
                solo
                item-text="DESCRICAO"
                placeholder="Selecione um motivo"
                v-model="motivoNaoAceite"
              >
                <!-- <template #selection="{ item }">
                <p style="color: #ffffff;" class="d-inline-block text-truncate pa-0 ma-0"> {{ item.DESCRICAO }}</p>
              </template> -->
              </v-select>
            </validation-provider>
          </div>
          <div
            style="
              display: flex;
              justify-content: start;
              align-items: start;
              gap: 20px;
              margin-top: -45px;
            "
            v-if="motivoNaoAceite == 'CONCORRÊNCIA | PREÇO MENOR'"
          >
            <validation-provider
              v-slot="{ errors }"
              name="qual concorrente"
              rules="required"
              style="display: flex; gap: 10px; justify-content: start; width: 100%"
            >
              <v-checkbox
                color="green"
                label="Vivo"
                v-model="qualConcorrente"
                value="VIVO"
                :error-messages="errors"
              >
                <template v-slot:label>
                  <span style="color: #fff">Vivo</span>
                </template>
              </v-checkbox>
              <v-checkbox
                color="green"
                label="Tim"
                v-model="qualConcorrente"
                value="TIM"
                :error-messages="errors"
              >
                <template v-slot:label>
                  <span style="color: #fff">Tim</span>
                </template>
              </v-checkbox>
              <v-checkbox
                color="green"
                label="Outra operadora"
                v-model="qualConcorrente"
                value="OUTRA OPERADORA"
                :error-messages="errors"
              >
                <template v-slot:label>
                  <span style="color: #fff">Outra operadora</span>
                </template>
              </v-checkbox>
            </validation-provider>
          </div>
          <div
            class="text-field-concorrencia"
            v-if="motivoNaoAceite == 'CONCORRÊNCIA | PREÇO MENOR' && qualConcorrente"
          >
            <div>
              <validation-provider
                v-slot="{ errors }"
                name="franquia concorrente"
                rules="required|min:1"
              >
                <label style="font-size: 12px; color: #fff">Franquia na concorrente:</label>
                <v-text-field
                  outlined
                  solo
                  dense
                  :error-messages="errors"
                  placeholder="Franquia (GB)"
                  v-mask="['# MB', '## MB', '### MB', '#### MB']"
                  v-model="franquiaConcorrente"
                ></v-text-field>
              </validation-provider>
            </div>
            <div>
              <validation-provider
                v-slot="{ errors }"
                name="valor concorrente"
                rules="required|min:1"
              >
                <label style="font-size: 12px; color: #fff">Valor na concorrente:</label>
                <v-text-field
                  outlined
                  solo
                  dense
                  :error-messages="errors"
                  placeholder="Valor"
                  v-mask="['#.##', '##.##', '###.##']"
                  v-model="valorConcorrente"
                ></v-text-field>
              </validation-provider>
            </div>
          </div>
          <!-- <a @click="finalizar">Finalizar</a> -->
          <v-btn class="button-finalizar" type="submit" :disabled="invalid">Finalizar</v-btn>
        </form>
      </validation-observer>
    </div>

    <v-dialog v-model="achouCaro" width="600">
      <v-card style="display: flex; justify-content: center; padding: 20px 0">
        <img src="../../assets/img/salesAI/achou_muito_caro.jpg" alt="" />
      </v-card>
    </v-dialog>
    <v-dialog v-model="quemDecideFamilia" width="600">
      <v-card style="display: flex; justify-content: center; padding: 20px 0">
        <img src="../../assets/img/salesAI/quem_decide_família.jpg" alt="" />
      </v-card>
    </v-dialog>
    <v-dialog v-model="querContinuarConcorrente" width="600">
      <v-card style="display: flex; justify-content: center; padding: 20px 0">
        <img src="../../assets/img/salesAI/quer_continuar_concorrente.jpg" alt="" />
      </v-card>
    </v-dialog>
    <v-dialog v-model="situacaoFinanceira" width="600">
      <v-card style="display: flex; justify-content: center; padding: 20px 0">
        <img src="../../assets/img/salesAI/situacao_financeira_desemprego.jpg" alt="" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import config from '../../core/config'
  import alerts from '../../mixins/alerts.mixins'
  import { ValidationProvider, ValidationObserver } from 'vee-validate'
  export default {
    components: { ValidationProvider, ValidationObserver },
    props: {
      title: {
        type: String,
        default: 'NÃO ACEITOU OFERTA'
      },
      dadosFormulario: {
        type: [Array, Object]
      }
    },
    data: () => ({
      achouCaro: false,
      quemDecideFamilia: false,
      querContinuarConcorrente: false,
      situacaoFinanceira: false,
      motivoNaoAceite: null,
      franquiaConcorrente: null,
      valorConcorrente: null,
      qualConcorrente: null,
      items: []
    }),
    mixins: [alerts],
    methods: {
      listarMotivosNaoAceiteOferta() {
        let urlData = `${config.baseUrl}api/shared/televendas/dados_campo/MOTIVO_NAO_ACEITE_OFERTA`
        this.$api.get(urlData).then(res => {
          this.items = res.data
        })
      },
      textMinus(string) {
        if (!string) return
        return string.toLowerCase()
      },
      async submit() {
        let isValid = await this.$refs.observer.validate()
        if (isValid) {
          let form = this.dadosFormulario
          form.flagPrice = 0
          form.planoEscolha = null
          form.tipo = null
          form.flag = this.title
          form.clienteAceitou = 'NAO'
          form.almopeCadastro = this.$store.getters.usuario.almope
          form.motivoNaoAceite = this.motivoNaoAceite
          form.franquiaConcorrente = this.franquiaConcorrente
          form.valorConcorrente = this.valorConcorrente
          form.qualConcorrente = this.qualConcorrente
          // setar como null, pois dados somente são preenchidos quando cliente aceita a venda
          form.canalVenda = null
          form.vendaTabulada = null
          form.motivoNaoTransCheck = null
          form.submotivoNaoTransCheck = null

          let urlData = `${config.baseUrl}api/shared/smartsales/televendas/inserir/`
          await this.$api.post(urlData, form)
          this.motivoNaoAceite = null
          this.franquiaConcorrente = null
          this.valorConcorrente = null
          this.qualConcorrente = null
          this.$refs.observer.reset()
          this.toast('Dados cadastrados com sucesso!', 'top-right', false, 4000, 'success'),
            this.$emit('update:dadosEnviadosNaoAceitou')
        }
      },
      async finalizar() {}
    },
    created() {
      this.listarMotivosNaoAceiteOferta()
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css?family=Roboto:300"); */

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

  .card-pricing {
    width: 350px;
    max-width: 350px;
    height: auto;
    background: linear-gradient(-45deg, #494949, #b1b1b1);
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
  .card-container {
    margin-top: 20px;
  }

  .title .fa {
    color: #fff;
    font-size: 100px;
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

  .title {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    justify-content: center;
  }
  .title h2 {
    position: relative;
    margin: 20px 0;
    padding: 0;
    color: #fff;
    font-size: 35px;
    z-index: 2;
    font-family: Roboto;
  }

  .description {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .description p {
    font-size: 15px;
    color: #e3e3e3;
    text-align: center;
  }

  .price {
    display: flex;
    justify-content: center;
    text-align: center;
    font-size: 20px;
    color: #e3e3e3;
    padding: 7px 0 7px 0;
  }

  .option {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 7px 0;
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
    font-weight: 600;
    cursor: pointer;
  }

  .option ul li i {
    margin-right: 12px;
    color: #ffeb3b;
    font-size: 25px;
  }

  .card-pricing .button-finalizar {
    position: relative;
    z-index: 2;
    background: #fff;
    color: #656565;
    width: 150px;
    height: 40px;
    line-height: 40px;
    border-radius: 40px;
    display: block;
    text-align: center;
    margin: -13px auto 0;
    -webkit-border-radius: 40px;
    -moz-border-radius: 40px;
    -ms-border-radius: 40px;
    -o-border-radius: 40px;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    text-decoration: none;
    font-weight: 600;
    text-transform: capitalize;
  }

  .selection {
    padding: 14px 0;
  }

  .selection label {
    color: #fff;
    font-size: 15px;
  }

  .text-field-concorrencia {
    display: flex;
    margin-top: -13px;
    gap: 10px;
  }

  .theme--light.v-label {
    color: #fff !important;
  }
</style>
