<template>
  <v-sheet>
    <v-col class="px-0 py-5 ml-n2">
      <v-toolbar class="elevation-0" dense>
        <v-btn-toggle
          v-model="agrupamento"
          @change="loadConfigInaderencia()"
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
    <!-- <div style="display: flex; place-content:center; flex-wrap: wrap;">
      <minimal-cards v-for="i in 10" :key="i"></minimal-cards>
      <minimal-cards v-for="(dados, i) in dadosGerencial" :key="i" ></minimal-cards>
    </div> -->

    <v-col cols="12" md="12" v-for="(item, i) in inaderenciaConfig" :key="i">
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
      ></component>
      <v-spacer></v-spacer>
    </v-col>
  </v-sheet>
</template>

<script>
  import strGetParamMixin from '../../../shared/mixins/stringToUrlGetParam'
  import tabelaInaderencia from '../inaderencia/table/inaderencia'

  const cardDadosFila = () => import('../../../shared/components/cards/cardDadosInaderencia.vue')
  import config from '../../../core/config'

  // import minimalCards from "../../../shared/components/cards/minimalCards.vue";
  // import NotFound from "../../../utils/notFound.vue";

  export default {
    name: 'inaderencia-component',
    mixins: [strGetParamMixin],
    components: {
      tabelaInaderencia,
      cardDadosFila
      // minimalCards,
      // NotFound,
    },
    data: function () {
      return {
        isNotFound: false,
        dadosGerencial: [],
        loading: false,
        toggleDac: 2,
        subMenuIcones: {
          N1: 'mdi-phone-in-talk',
          RETENÇÃO: 'mdi-phone-message',
          'CM ATD MTF': 'mdi-phone-return',
          'RET ATD N1': 'mdi-phone-return',
          'MASSIVO SP': 'mdi-phone-return',
          'SINERGIA CE e RJ': 'mdi-phone-return',
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
      agrupamento: {
        get: function () {
          return this.$store.getters.inaderenciaAgrupamento
        },
        set: function (newValue) {
          this.$store.dispatch('setAgrupamentoInaderencia', newValue)
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
      inaderenciaConfig() {
        return this.$store.getters.inaderenciaConfig
      },
      agrupamentosProduto() {
        return this.$store.getters.inaderenciaAgrupamentos.map(element => element.AGRUPAMENTO)
      }
    },
    methods: {
      notFound() {
        this.isNotFound = true
      },
      formartarPerc(value) {
        return (value * 100).toFixed(2).concat('%')
      },
      loadGerencialHC() {
        let urlData = `${config.baseUrl}api/shared/inaderencia/gerencial_hc/${this.agrupamento}`
        this.$api.get(urlData).then(res => {
          this.dadosGerencial = res.data[0]
        })
      },
      async loadConfigInaderencia() {
        await this.$store.dispatch('loadConfigInaderencia', {
          produto: this.produtoAtual,
          agrupamento: this.agrupamento
        })
      },
      loadProdutos() {
        this.$store.dispatch('loadProdutosInaderencia', {
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
        await this.$store.dispatch('loadAgrupamentosInaderencia', this.produtoAtual)
      },

      async reloadData() {
        await this.loadAgrupamentosPorProdutos()
        await this.loadConfigInaderencia()
        this.loadGerencialHC()
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

<style></style>
