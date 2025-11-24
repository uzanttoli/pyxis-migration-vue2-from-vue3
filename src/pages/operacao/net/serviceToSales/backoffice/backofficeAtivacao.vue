<template>
  <div class="mt-7">
    <!-- <v-row align="center" justify="center"> -->
    <div style="display: flex">
      <!-- <tabuladorAtivacao
        class="mx-2 mt-2"
        style="flex: 1;"
        :tipoFila="tipoFilaSelecionada"
        @update-portabilidade="dialogPortabilidade = true"
      ></tabuladorAtivacao> -->
      <component
        class="mx-2 mt-2"
        style="flex: 1"
        :is="componentDefault"
        :tipoFila="tipoFilaSelecionada"
        :novoCasoAtivacao="casoAtivacaoPortabilidade"
        @update-portabilidade="dialogPortabilidade = true"
        @update:tratar-portabilidade="dadosTratativaPortabilidade"
        @update:return-tabulador="changeComponent"
      ></component>
    </div>
    <right-side-bar-tratativa :base="dados">
      <!-- <div>
          <div class="px-2 pt-2 btn-toggle">
            <label for="btn-toggle" style="font-size: 12px; font-weight: 600;"
              >Escolha uma fila:</label
            >
            <v-btn-toggle
              dense
              id="btn-toggle"
              dark
              color="deep-purple white--text"
              v-model="tipoFilaSelecionada"
              style="width: 100%;"
            >
              <v-col cols="12" class="pa-1">
                <v-btn
                  width="100%"
                  v-for="(item, i) in tipoFila"
                  :key="i"
                  :value="item.value"
                  tile
                  depressed
                  class="text-capitalize"
                  style="position: relative;"
                  :disabled="item.disabled"
                >
                  <span
                    class="material-symbols-outlined"
                    :style="
                      `position: absolute; left: 0px; color: ${item.color};`
                    "
                  >
                    {{ item.icon }}
                  </span>
                  {{ item.nome }}</v-btn
                >
              </v-col>
            </v-btn-toggle>
          </div>
        </div> -->
    </right-side-bar-tratativa>
    <!-- </v-row> -->
  </div>
</template>

<script>
  import RightSideBarTratativa from '../../../../backoffice/RightSideBarTratativa.vue'
  import tabuladorAtivacao from './formAtivacaoS2S.component.vue'
  import tabuladorPortabilidade from './formPortabilidadeS2S.component.vue'

  import config from '@/core/config'
  export default {
    components: {
      tabuladorAtivacao,
      RightSideBarTratativa,
      tabuladorPortabilidade
    },
    data: () => ({
      dados: [],
      tipoFilaSelecionada: 'aceite',
      dialogPortabilidade: false,
      componentDefault: 'tabulador-ativacao',
      casoAtivacaoPortabilidade: [],
      tipoFila: [
        {
          nome: 'Aceite',
          value: 'aceite',
          icon: 'thumb_up',
          color: 'green',
          disabled: false
        },
        {
          nome: 'Ura não aceite',
          value: 'ura-nao-aceite',
          icon: 'call_quality',
          color: 'red',
          disabled: false
        },
        {
          nome: 'Ura não Transferido',
          value: 'ura-nao-transferido',
          icon: 'phone_missed',
          color: 'orange',
          disabled: false
        }
      ]
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      changeComponent(e) {
        this.componentDefault = e
      },
      dadosTratativaPortabilidade(e) {
        this.casoAtivacaoPortabilidade = e
        this.componentDefault = 'tabulador-portabilidade'
      },
      loadMeuResumoTratativas() {
        let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/minhas_tratativa/${this.usuarioAlmope}`
        this.$api.get(urlData).then(res => {
          this.dados = res.data
        })
      }
    },
    created() {
      this.loadMeuResumoTratativas()
    }
  }
</script>

<style></style>
