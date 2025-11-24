<template>
  <v-sheet>
    <v-col class="px-0 py-5 ml-n4">
      <v-toolbar class="elevation-0" dense>
        <v-btn-toggle
          v-model="agrupamento"
          @change="loadConfigTmt()"
          tile
          color="deep-purple accent-3"
          group
          mandatory
        >
          <v-btn
            v-for="(item, i) in agrupamentosProduto"
            :key="i"
            :value="item"
            @click="agrupamentoSelecionado(item)"
          >
            <v-icon color="black" size="20" class="mr-2">{{ subMenuIcones[item] }}</v-icon>
            {{ item }}
          </v-btn>
        </v-btn-toggle>
      </v-toolbar>
    </v-col>

    <v-divider></v-divider>

    <v-row class="mt-5">
      <v-col cols="12" md="12" v-for="(item, i) in tmtConfig" :key="i">
        <component
          :is="item.component"
          :key="i"
          :title="item.title"
          :titleIcon="item.titleIcon"
          :actionUrl="item.endpoint"
          :dac="item.dac"
          :meta="prepararSkillMeta(item)"
          :skill="item.skill"
          :skillType="item.skillType"
          :grouping="agrupamento"
          :numSuperior="item.numSuperior"
          :withSkill="item.withSkill"
          :agrupamentoSelecionado="itemSelecionado"
        ></component>
        <v-spacer></v-spacer>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
  import strGetParamMixin from '../../../shared/mixins/stringToUrlGetParam'
  import tabelaTmtIntervaloGerencial from './table/tabelaTmtIntervaloGerencial.vue'

  export default {
    name: 'tmt-component',
    mixins: [strGetParamMixin],
    components: {
      tabelaTmtIntervaloGerencial
    },
    data: function () {
      return {
        itemSelecionado: 'N1',
        loading: false,
        toggleDac: 2,
        subMenuIcones: {
          N1: 'fa-solid fa-phone-volume',
          RETENÇÃO: 'fa-solid fa-phone-volume',
          SENIORIDADE: 'fa-solid fa-sitemap'
          // 'CM ATD MTF': 'mdi-phone-return',
          // 'MTF ATD CM': 'mdi-phone-return',
          // 'RET ATD N1': 'mdi-phone-return',
          // 'TRANSBORDO EXTERNO': 'fa-solid fa-phone-volume',
          // 'TRANSBORDO INTERNO': 'fa-solid fa-phone-volume',
          // HOME: 'mdi-home-account',
          // MIX: 'mdi-phone-alert',
          // SKILL: 'mdi-phone-log',
          // CAMPANHA: 'mdi-select-group',
          // 'DTH N1': 'fa-solid fa-phone-arrow-down-left',
          // 'DTH RET': 'mdi-phone-return',
          // '177': 'fa-solid fa-phone-volume'
        }
      }
    },
    computed: {
      operacao() {
        return this.$store.getters.usuario.produto
      },
      filtro() {
        let filtro = this.$store.getters.usuario.filtro
        return filtro
      },
      produtos() {
        return this.$store.getters.produtos
      },
      agrupamento: {
        get: function () {
          return this.$store.getters.tmtAgrupamento
        },
        set: function (newValue) {
          this.$store.dispatch('setAgrupamentoTmt', newValue)
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
      tmtConfig() {
        return this.$store.getters.tmtConfig
      },
      agrupamentosProduto() {
        return this.$store.getters.tmtAgrupamentos.map(element => element.AGRUPAMENTO)
      }
    },
    methods: {
      agrupamentoSelecionado(item) {
        this.itemSelecionado = item
      },
      loadConfigTmt() {
        this.$store.dispatch('loadConfigTmt', {
          produto: this.produtoAtual,
          agrupamento: this.agrupamento
        })
      },
      loadProdutos() {
        this.$store.dispatch('loadProdutos', {
          filtro: this.filtro,
          operacao: this.operacao
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
        await this.$store.dispatch('loadAgrupamentosPorProdutos', this.produtoAtual)
      },
      reloadData() {
        this.loadAgrupamentosPorProdutos()
        this.loadConfigTmt()
      }
    },
    watch: {
      produtoAtual() {
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
