<template>
  <v-card>
    <title-negative-margin
      title="Reset de Senha - Beedoo"
      className="rounded-r-xl"
    ></title-negative-margin>
    <v-textarea
      v-if="almopeLiberacao(this.processArray(), this.almope)"
      outlined
      class="mx-2"
      label="Insira os almopes atualizados"
      :placeholder="placeholder"
      v-model="arrAlmopesTratados"
      autofocus
    ></v-textarea>
    <v-textarea
      v-else
      outlined
      class="mx-2"
      label="Insira almope e senha"
      :placeholder="placeholder"
      v-model="arrAlmopes"
    ></v-textarea>
    <v-col class="mt-n3">
      <v-btn
        v-if="almopeLiberacao(this.processArray(), this.almope)"
        @click="sendData(2)"
        depressed
        block
        :class="
          !sendIsValid()
            ? 'grey rounded-r-xl rounded-bl-xl'
            : 'cor-padrao white--text rounded-r-xl rounded-bl-xl'
        "
        :disabled="!sendIsValid()"
      >
        Atualizar
      </v-btn>
      <v-btn
        v-else
        @click="sendData(1)"
        depressed
        block
        :disabled="!sendIsValid()"
        :class="
          !sendIsValid()
            ? 'grey rounded-r-xl rounded-bl-xl'
            : 'cor-padrao white--text rounded-r-xl rounded-bl-xl'
        "
      >
        Enviar
      </v-btn>
    </v-col>
  </v-card>
</template>

<script>
  import validacao from '../../../../mixins/validacao'
  import alerts from '../../../../mixins/alerts.mixins'
  export default {
    props: {
      permission: {
        type: [Array, String],
        require: true
      }
    },
    mixins: [validacao, alerts],
    data: () => ({
      arrAlmopes: null,
      arrAlmopesTratados: null,
      dataTreat: []
    }),
    computed: {
      almope() {
        return this.$store.getters.usuario.almope
      },
      placeholder() {
        return this.almopeLiberacao(this.processArray(), this.almope)
          ? `Importante: Necessário conforme exemplo abaixo para que os dados sejam atualizados! \nALMOPE \n${this.$store.getters.usuario.almope}`
          : `Importante: Necessário conforme exemplo abaixo para que os dados sejam enviados! \nALMOPE SENHA \n${this.$store.getters.usuario.almope} ALM#${this.$store.getters.usuario.almope}`
      }
    },
    methods: {
      sendIsValid() {
        return this.arrAlmopes || this.arrAlmopesTratados
      },
      processArray() {
        let data = this.permission
        let dataSplit = data.split(',')
        let arr = []

        for (let i = 0; i < dataSplit.length; i++) {
          arr.push(dataSplit[i] * 1)
        }

        return arr
      },
      async processarDadosCadastro() {
        // Divide os dados em linhas
        const texto = this.arrAlmopes

        const arrayDeObjetos = []

        const linhas = texto.trim().split('\n')

        await linhas.forEach(linha => {
          const colunas = linha.split('\t')
          const objeto = {
            ACAO: 1,
            ALMOPE: parseInt(colunas[0]),
            SENHA: colunas[1],
            USUARIO_CAD_ALT: this.$store.getters.usuario.almope
          }

          arrayDeObjetos.push(objeto)
        })

        let result = arrayDeObjetos.filter(item => {
          return isNaN(item.ALMOPE) === false
        })

        this.dataTreat = result
      },

      async processarDadosAtualizados() {
        // Divide os dados em linhas
        const texto = this.arrAlmopesTratados

        const arrayDeObjetos = []

        const linhas = texto.trim().split('\n')

        await linhas.forEach(linha => {
          const colunas = linha.split('\t')
          const objeto = {
            ACAO: 2,
            ALMOPE: parseInt(colunas[0]),
            USUARIO_CAD_ALT: this.$store.getters.usuario.almope
          }

          arrayDeObjetos.push(objeto)
        })

        let result = arrayDeObjetos.filter(item => {
          return isNaN(item.ALMOPE) === false
        })

        this.dataTreat = result
      },
      async sendData(value) {
        value == 1 ? await this.processarDadosCadastro() : await this.processarDadosAtualizados()
        this.$api
          .post(
            `api/shared/reset_password/beedoo/exec_acao/${value}`,
            JSON.stringify(this.dataTreat)
          )
          .then(() => {
            this.dataTreat = ''
            value == 1 ? (this.arrAlmopes = null) : (this.arrAlmopesTratados = null)
            this.toast(
              value == 1 ? 'Enviado com sucesso' : 'Dados Atualizados',
              'bottom-end',
              false,
              3000,
              'success'
            )
          })
          .catch(e => {
            console.error(e)
          })
      }
    }
  }
</script>

<style scoped>
  .cor-padrao {
    background-image: linear-gradient(220deg, rgb(143, 14, 143), rgb(0, 236, 255));
  }
</style>
