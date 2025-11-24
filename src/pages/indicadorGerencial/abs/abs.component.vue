<template>
  <v-sheet>
    <v-col :cols="agrupamentosProduto.length + 1" class="py-2">
      <v-toolbar class="elevation-0" dense>
        <v-btn-toggle
          v-model="agrupamento"
          @change="loadConfigAbs()"
          shaped
          mandatory
          active-class="primary white--text"
        >
          <v-btn v-for="(item, i) in agrupamentosProduto" :key="i" :value="item">
            <v-icon color="black">{{ subMenuIcones[item] }}</v-icon>
            {{ item }}
          </v-btn>
        </v-btn-toggle>
      </v-toolbar>
    </v-col>

    <v-divider></v-divider>

    <v-row>
      <v-col cols="12" md="12" v-for="(item, i) in absConfig" :key="i" @produtoatual="loadBase()">
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
    </v-row>
  </v-sheet>
</template>

<script>
  import strGetParamMixin from '../../shared/mixins/stringToUrlGetParam'
  import tabelaAbs from '../abs/table/tableAbs'

  export default {
    name: 'abs-component',
    mixins: [strGetParamMixin],
    components: {
      tabelaAbs
    },
    data: function () {
      return {
        loading: false,
        toggleDac: 2,
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
      produtos() {
        return this.$store.getters.produtos
      },
      agrupamento: {
        get: function () {
          return this.$store.getters.absAgrupamento
        },
        set: function (newValue) {
          this.$store.dispatch('setAgrupamento', newValue)
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
      absConfig() {
        return this.$store.getters.absConfig
      },
      agrupamentosProduto() {
        return this.$store.getters.absAgrupamentos.map(element => element.AGRUPAMENTO)
      }
    },
    methods: {
      async loadConfigAbs() {
        await this.$store.dispatch('loadConfigAbs', {
          produto: this.produtoAtual,
          agrupamento: this.agrupamento
        })
      },
      async loadProdutos() {
        await this.$store.dispatch('loadProdutosAbs')
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
        await this.$store.dispatch('loadAgrupamentosAbs', this.produtoAtual)
      },
      async reloadData() {
        await this.loadAgrupamentosPorProdutos()
        await this.loadConfigAbs()
      }
    },
    created() {
      this.loadProdutos()
      this.reloadData()
    }
  }
</script>

<style></style>
