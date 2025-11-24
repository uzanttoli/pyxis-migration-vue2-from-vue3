<template>
  <v-sheet elevation="0" class="mt-2">
    <v-row class="pa-0 ma-0 ml-0">
      <v-col cols="12">
        <v-toolbar class="elevation-0" dense>
          <v-btn-toggle
            dark
            rounded
            mandatory
            v-model="produtoAtual"
            @change="loadConfigLinhaWorkflow()"
          >
            <v-btn v-for="(item, i) in agrupamentosWorkflow" :key="i" :value="item.AGRUPAMENTO">
              {{ item.AGRUPAMENTO }}
            </v-btn>
          </v-btn-toggle>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-col cols="12" v-for="(item, i) in configLinhaMudaWorkflow" :key="i">
      <component
        :is="item.COMPONENT"
        :key="i"
        :title="item.TITULO"
        :titleIcon="item.ICONE_TITULO"
        :actionUrl="item.ENDPOINT"
        :numSuperior="item.NUM_SUPERIOR"
        :indicador="item.INDICADOR"
        :produtoAtual="item.AGRUPAMENTO"
      ></component>
    </v-col>
  </v-sheet>
</template>

<script>
  import strGetParamMixin from '../../../../shared/mixins/stringToUrlGetParam'
  import tabelaLinhaMuda from './table/tabelaLinhaMuda.component.vue'
  export default {
    name: 'linha-muda-component',
    mixins: [strGetParamMixin],
    components: {
      tabelaLinhaMuda
    },
    data: () => ({
      produtoAtual: 'COMBO TOTAL'
    }),
    computed: {
      configLinhaMudaWorkflow() {
        return this.$store.getters.configLinhaMudaWorkflow
      },

      agrupamentosWorkflow: {
        get: function () {
          return this.$store.getters.agrupamentosWorkflow
        },
        set: function (newValue) {
          this.$store.dispatch('setAgrupamentosWorkflow', newValue)
        }
      }
    },
    methods: {
      loadConfigLinhaWorkflow() {
        this.$store.dispatch('loadConfigLinhaWorkflow', this.produtoAtual)
      },
      loadAgrupamentosWorkflow() {
        this.$store.dispatch('loadAgrupamentosWorkflow')
      }
    },
    created() {
      this.loadAgrupamentosWorkflow()
      this.loadConfigLinhaWorkflow()
    }
  }
</script>

<style></style>
