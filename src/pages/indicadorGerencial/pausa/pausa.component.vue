<template>
  <v-sheet>
    <v-col class="px-0 py-5 ml-n2">
      <v-toolbar class="elevation-0" dense>
        <v-btn-toggle
          v-model="agrupamento"
          @change="loadConfigPausas()"
          tile
          color="deep-purple accent-3"
          group
          mandatory
        >
          <v-btn v-for="(item, i) in agrupamentosProduto" :key="i" :value="item">
            <v-icon color="black">{{ subMenuIcones[item] }}</v-icon>
            {{ item }}
          </v-btn>
        </v-btn-toggle>
      </v-toolbar>
    </v-col>

    <v-divider></v-divider>
    <div style="display: flex; justify-content: end">
      <p class="ma-0 pa-0 mx-2 my-3 font-weight-regular grey--text">
        <i class="fa-solid fa-clock-rotate-left" v-if="ultAtualizacao.INTERVALO"></i>
        <i class="fa-solid fa-spinner spinner" v-else></i>
        Última atualização:
        {{ ultAtualizacao.INTERVALO ? ultAtualizacao.INTERVALO : '00:00' }}h
      </p>
    </div>
    <div style="display: flex; gap: 10px">
      <card-dados-fila
        v-for="(item, i) in dadosGerencial"
        :key="i"
        :title="item.COLUNA"
        :value="item.VALOR"
      ></card-dados-fila>
    </div>
    <v-col cols="12" md="12" v-for="(item, i) in pausasConfig" :key="i">
      <component
        :is="item.COMPONENT"
        :key="i"
        :title="item.TITULO"
        :titleIcon="item.ICONE_TITULO"
        :actionUrl="item.ENDPOINT"
        :dac="item.DAC"
        :skill="item.SKILL"
        :grouping="item.AGRUPAMENTO"
        :numSuperior="item.NUM_SUPERIOR"
        :withSkill="item.COM_SKILL"
        :produtoSelecionado="produtoAtual"
      ></component>
      <v-spacer></v-spacer>
    </v-col>
  </v-sheet>
</template>

<script>
  import strGetParamMixin from '../../../shared/mixins/stringToUrlGetParam'
  import tabelaPausas from '../pausa/table/tabelaPausas'
  import tabelaPausasResumo from '../pausa/table/tabelaPausasResumo'

  const cardDadosFila = () => import('../../../shared/components/cards/cardDadosPausas.vue')
  import config from '../../../core/config'
  export default {
    name: 'pausa-component',
    mixins: [strGetParamMixin],
    components: {
      tabelaPausas,
      cardDadosFila,
      tabelaPausasResumo
    },
    data: function () {
      return {
        dadosGerencial: [],
        loading: false,
        toggleDac: 2,
        ultAtualizacao: [],
        subMenuIcones: {
          N1: 'mdi-phone-in-talk',
          RETENÇÃO: 'mdi-phone-message',
          'CM ATD MTF': 'mdi-phone-return',
          'RET ATD N1': 'mdi-phone-return',
          HOME: 'mdi-home-account',
          MIX: 'mdi-phone-alert',
          SKILL: 'mdi-phone-log',
          CAMPANHA: 'mdi-select-group',
          SENIORIDADE: 'mdi-account-clock'
        }
      }
    },
    computed: {
      produto() {
        return this.$store.getters.usuario.produto
      },
      perfil() {
        return this.$store.getters.usuario.filtro
      },
      produtos() {
        return this.$store.getters.produtos
      },
      agrupamento: {
        get: function () {
          return this.$store.getters.pausasAgrupamento
        },
        set: function (newValue) {
          this.$store.dispatch('setPausasAgrupamento', newValue)
        }
      },
      produtoAtual: {
        get: function () {
          return this.$store.getters.produto
        },
        set: function (newValue) {
          this.$store.dispatch('setProduto', newValue)
        }
      },
      pausasConfig() {
        return this.$store.getters.pausasConfig
      },
      agrupamentosProduto() {
        return this.$store.getters.pausasAgrupamentos.map(element => element.AGRUPAMENTO)
      }
    },
    methods: {
      loadUltimaAtualizacao() {
        let urlData = `${config.baseUrl}api/shared/pausas/hora_atualizacao`
        this.$api
          .get(urlData, {
            params: {
              produto: this.produtoAtual
            }
          })
          .then(res => {
            this.ultAtualizacao = res?.data[0]
          })
      },
      loadGerencialPausas() {
        let urlData = `${config.baseUrl}api/shared/pausas/gerencial/${this.agrupamento}`
        this.$api.get(urlData).then(res => {
          this.dadosGerencial = res.data
        })
      },
      loadConfigPausas() {
        this.$store.dispatch('loadConfigPausas', {
          produto: this.produtoAtual,
          agrupamento: this.agrupamento
        })
      },
      loadProdutos() {
        this.$store.dispatch('loadProdutosPausas', {
          perfil: this.perfil,
          produto: this.produto
        })
      },
      prepararSkillMeta(item) {
        let tempSkill = item.skill.split(';')
        let tempSkillType = item.skillType.split(';')
        let skillMeta = item.meta.split(';').map(function (x, i) {
          return { skill: tempSkill[i], skillType: tempSkillType[i], meta: x }
        }, this)
        return skillMeta
      },
      async loadAgrupamentosPorProdutos() {
        this.loading = true
        await this.$store.dispatch('loadAgrupamentosPausas', this.produtoAtual)
      },

      reloadData() {
        this.loadAgrupamentosPorProdutos()
        this.loadConfigPausas()
        this.loadGerencialPausas()
        this.loadUltimaAtualizacao()
      }
    },
    watch: {
      produtoAtual() {
        this.reloadData()
      },
      agrupamento() {
        this.reloadData()
      }
    },
    created() {
      this.loadProdutos()
      this.reloadData()
    }
  }
</script>

<style scoped>
  .spinner {
    color: #6d6c6c;
    -webkit-animation: spin 1s linear infinite;
    -moz-animation: spin 1s linear infinite;
    animation: spin 1s linear infinite;
  }

  @-moz-keyframes spin {
    100% {
      -moz-transform: rotate(360deg);
    }
  }
  @-webkit-keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
</style>
