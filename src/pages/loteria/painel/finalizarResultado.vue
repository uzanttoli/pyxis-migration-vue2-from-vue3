<template>
  <div>
    <concursos-em-andamento-resultado
      @update:bilhete="bilheteSelecionado"
      @update:loadDados="returnStateDados"
      :loadDados="loadDados"
    ></concursos-em-andamento-resultado>
    <v-col v-if="concursos != ''">
      <bloco-component title="Selecione um concurso">
        <v-chip-group
          v-model="selection"
          :value="selection"
          active-class="deep-purple--text text--accent-4"
        >
          <!-- mandatory -->
          <v-chip
            v-for="(concurso, i) in concursos"
            :key="i"
            @click="selectConcurso(concurso.CONCURSO)"
          >
            {{ concurso.CONCURSO }}
          </v-chip>
        </v-chip-group>
      </bloco-component>
    </v-col>
    <v-col>
      <bloco-component title="Finalizar Concurso">
        <v-textarea outlined v-model="dadosConcurso"></v-textarea>
        <div style="display: flex; align-items: center">
          <p style="padding: 0; margin: 0; font-weight: bold; font-size: 12px">
            * Para finalizar o concurso e anunciar os ganhadores, selecione o bilhete e o número do
            concurso primeiro.
            <span style="color: red">Baixe o modelo aqui.</span>
          </p>
          <v-tooltip bottom>
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                icon
                :href="`${process.env.VUE_APP_PYXIS_API_CHAT}/arquivos/modelo/PADRAO_LOTERIA.xlsx`"
              >
                <v-icon>fa-solid fa-file-arrow-down</v-icon>
              </v-btn>
            </template>
            <span>Baixar modelo</span>
          </v-tooltip>
        </div>
        <v-row justify="end" class="mx-2">
          <v-btn class="rounded-bl-xl rounded-r-xl mx-2" color="error" @click="limparFormulario">
            Limpar
          </v-btn>
          <v-btn
            class="rounded-bl-xl rounded-r-xl"
            color="success"
            @click="finalizarConcurso"
            :disabled="!this.formularioValid()"
          >
            Finalizar
          </v-btn>
        </v-row>
      </bloco-component>
    </v-col>
  </div>
</template>

<script>
  import BlocoComponent from '../../../shared/components/bloco/bloco.component.vue'
  import ConcursosEmAndamentoResultado from '../concursosEmAndamentoResultado.vue'

  import config from '../../../core/config'
  import alerts from '../../../mixins/alerts.mixins'
  export default {
    components: { ConcursosEmAndamentoResultado, BlocoComponent },
    mixins: [alerts],
    data: () => ({
      selection: null,
      concursos: [],
      concurso: null,
      dadosConcurso: '',
      bilhete: null,
      loadDados: false
    }),
    methods: {
      returnStateDados() {
        this.loadDados = false
      },
      limparFormulario() {
        this.dadosConcurso = ''
        this.bilhete = null
        this.concurso = null
      },
      formularioValid() {
        return this.concurso && this.bilhete && this.dadosConcurso
      },
      async finalizarConcurso() {
        try {
          const dados = this.dadosConcurso
          const arrayDeObjetos = []

          const linhas = dados.trim().split('\n')
          linhas.forEach(linha => {
            const coluna = linha.trim().split('\t')
            const objeto = {
              ALMOPE_RESG: coluna[0],
              NUMERO_RESG: coluna[1],
              BILHETE_RESG: this.bilhete,
              CONCURSO_RESG: this.concurso
            }
            arrayDeObjetos.push(objeto)
          })

          let result = arrayDeObjetos.filter(item => {
            return isNaN(item.ALMOPE_RESG) === false
          })

          let urlData = `${config.baseUrl}api/shared/loteria/configuracao/finalizar_concurso`
          await this.$api.post(urlData, result).then(() => {
            this.toast(
              'Dados do(s) ganhador(es) foram salvos com sucesso. O concurso também foi finalizado.',
              'bottom-right',
              false,
              7000,
              'success'
            )
            this.loadDados = true
            this.limparFormulario()
            this.loadConcursos()
          })
        } catch (error) {
          this.toast(
            'Dados não foram salvos, tente novamente. Caso o erro persista entre em contato com o administrador!',
            'bottom-right',
            false,
            7000,
            'error'
          )
        }
      },
      selectConcurso(item) {
        this.concurso = item
      },
      bilheteSelecionado(item) {
        this.bilhete = item
        this.loadConcursos(item)
      },
      loadConcursos(bilhete) {
        if (!bilhete || bilhete == '') return
        let urlData = `${config.baseUrl}api/shared/loteria/configuracao/concursos_ativos/${bilhete}`
        this.$api.get(urlData).then(res => {
          this.concursos = res.data
        })
      }
    }
  }
</script>

<style></style>
