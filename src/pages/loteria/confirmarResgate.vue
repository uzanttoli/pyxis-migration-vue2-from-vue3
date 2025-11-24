<template>
  <!-- v-model="openDialogConfirm" -->
  <v-dialog
    :model-value="openDialogConfirm"
    @update:modelValue="val => $emit('update:openDialogConfirm', val)"
    width="400"
    persistent
  >
    <v-card>
      <v-card-title>Confirmar resgate</v-card-title>
      <v-card-text style="display: flex; flex-direction: column; justify-content: center">
        <div style="display: flex; justify-content: center">
          <div :class="className">
            {{ numeroEscolhido }}
          </div>
        </div>
        <p style="text-align: justify">
          Deseja finalizar? Ao finalizar, verificaremos se o número selecionado ainda está
          disponivel.
        </p>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions style="display: flex; justify-content: center; text-align: justify">
        <v-btn depressed color="success" @click="confirmarResgate">Confimar</v-btn>
        <v-btn depressed @click="$emit('close-confirm')" color="error">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import config from '../../core/config'
  import alerts from '../../mixins/alerts.mixins'
  export default {
    props: {
      openDialogConfirm: {
        type: Boolean,
        default: false
      },
      dadosResgate: {
        type: [Array, Object],
        require: true
      }
    },
    data: () => ({
      className: 'numero'
    }),
    mixins: [alerts],
    computed: {
      numeroEscolhido() {
        let dados = this.dadosResgate
        if (dados) {
          let arrayUnique = []
          let countMap = {}

          dados.forEach(element => {
            const { numero } = element
            if (!countMap[numero]) {
              countMap[numero] = 1
              arrayUnique.push({ ...element })
            } else {
              countMap[numero]++
            }
          })
          return arrayUnique[0]?.numero
        } else {
          return 0
        }
      }
    },
    methods: {
      async confirmarResgate() {
        try {
          let urlData = `${config.baseUrl}api/shared/loteria/concurso/resgatar`
          await this.$api.post(urlData, this.dadosResgate)
          this.toast('Número resgatado com sucesso!', 'bottom-right', false, 3000, 'success')
          this.$emit('close-confirm')
          this.$emit('update:atualizarListaNumeros')
        } catch (error) {
          if (error.response.status === 406) {
            this.toast(
              'Você não possui bilhetes disponiveis para resgatar o número!',
              'bottom-right',
              false,
              3000,
              'error'
            )
            this.className = 'bilhete-indisponivel'
            this.$emit('update:atualizarListaNumeros')
          } else if (error.response.status === 403) {
            this.toast('O período de compra encerrou!', 'bottom-right', false, 3000, 'warning')
          } else {
            this.toast(
              'Número já foi resgatado por outro usuário!',
              'bottom-right',
              false,
              3000,
              'warning'
            )
            this.className = 'numero-reservado'
            this.$emit('update:atualizarListaNumeros')
          }
        }
      }
    },
    watch: {
      openDialogConfirm() {
        if (this.openDialogConfirm == true) {
          this.className = 'numero'
        }
      }
    }
  }
</script>

<style scoped>
  .numero {
    background-color: #1b8a1b;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    padding: 5px;
    margin: 5px;
  }

  .numero-reservado {
    background-color: #656565;
    color: white;
    display: flex;
    font-weight: bold;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    padding: 5px;
    margin: 5px;
  }

  .bilhete-indisponivel {
    background-color: #cb0d0d;
    color: white;
    display: flex;
    font-weight: bold;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    padding: 5px;
    margin: 5px;
  }
</style>
