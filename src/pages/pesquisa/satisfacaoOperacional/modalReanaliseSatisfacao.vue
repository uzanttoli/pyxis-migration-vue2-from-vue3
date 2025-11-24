<template>
  <v-dialog
    v-model="openModalReanalise"
    max-width="700"
    class="overflow-x-hidden"
    persistent
    z-index="1"
  >
    <v-card class="rounded-xl">
      <div
        style="display: flex; flex-direction: column; justify-content: center; align-items: center"
      >
        <div>
          <img src="../../../assets/img/core/festejando-min.png" />
        </div>
        <div
          class="text"
          style="
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            text-align: justify;
          "
        >
          <p class="text-h5 font-weight-medium">
            Muito obrigado pela participação na última pesquisa!
          </p>
          <div class="pa-3 px-7">
            <p>
              Gostaria de reforçar que sua contribuição é muito importante para que possamos
              melhorar nosso ambiente de trabalho.
            </p>
            <p>
              Reitero que a pesquisa é
              <strong><mark>TOTALMENTE CONFIDENCIAL</mark></strong>
              e está sendo avaliada diretamente pela alta gestão do produto.
            </p>
            <p>
              Sendo assim, se
              <span style="background-color: #d32f2f; color: white; padding: 2px; font-weight: 600">
                você recebeu algum tipo de orientação ou foi coagido
              </span>
              quanto as respostas, você pode optar por realizar a pesquisa novamente, isso serve
              para que os resultados sejam sempre fidedignos e para que possamos ter ações
              assertivas.
            </p>
          </div>
        </div>
        <div
          style="display: flex; flex-direction: column; gap: 5px; padding: 10px 25px; width: 100%"
        >
          <v-btn color="success" block @click="openModalSatisfacao">
            Sim, gostaria de responder novamente a pesquisa
          </v-btn>
          <v-btn color="warning" block @click="naoRefazerAvaliacao">
            Não gostaria de responder novamente
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
  import config from '../../../core/config'
  export default {
    data: () => ({
      openModalReanalise: false
    }),
    methods: {
      openModalSatisfacao() {
        this.$emit('update:reanalise-satisfacao', {
          modal: true,
          refazer: 1
        })
        this.openModalReanalise = false
      },
      async naoRefazerAvaliacao() {
        let data = {
          almope: this.$store.getters.usuario.almope,
          reavaliacao: 0
        }
        let urlData = `${config.baseUrl}api/shared/pesquisa/satisfacao/decisao_reavaliacao`
        await this.$api.post(urlData, data)
        this.openModalReanalise = false
      },
      async loadDadosValidacaoRefazerAvaliacao() {
        let urlData = `${config.baseUrl}api/shared/pesquisa/satisfacao/validacao_refazer_avaliacao`
        var res = await this.$api.get(urlData, {
          params: {
            almope: this.$store.getters.usuario.almope
          }
        })
        let data = res?.data[0]
        if (data) {
          let agora = this.moment().format('YYYY-MM-DD')
          let dataPesquisa = this.moment(data?.DATA_PESQUISA)
          let diferenca24h = dataPesquisa.diff(agora, 'seconds')
          if (diferenca24h < 0) {
            this.openModalReanalise = true
          }
        } else {
          this.openModalReanalise = false
        }
      }
    },
    created() {
      this.loadDadosValidacaoRefazerAvaliacao()
    }
  }
</script>

<style scoped>
  img {
    height: 300px;
    background-size: contain;
    background-repeat: no-repeat;
  }
</style>
