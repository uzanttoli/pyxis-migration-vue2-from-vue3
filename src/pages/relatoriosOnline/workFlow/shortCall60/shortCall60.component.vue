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
            @change="loadConfigWorkflow()"
          >
            <v-btn v-for="(item, i) in agrupamentosWorkflow" :key="i" :value="item.AGRUPAMENTO">
              {{ item.AGRUPAMENTO }}
            </v-btn>
          </v-btn-toggle>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-col cols="12" v-for="(item, i) in configWorkflow" :key="i">
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
  import tabelaShortcall60 from './table/tableShortCall60.component.vue'
  export default {
    name: 'shortcall60-component',
    mixins: [strGetParamMixin],
    components: {
      tabelaShortcall60
    },
    data: () => ({
      produtoAtual: 'COMBO TOTAL'
    }),
    computed: {
      configWorkflow() {
        return this.$store.getters.configWorkflow
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
      loadConfigWorkflow() {
        this.$store.dispatch('loadConfigWorkflow', this.produtoAtual)
      },
      loadAgrupamentosWorkflow() {
        this.$store.dispatch('loadAgrupamentosWorkflow')
      }
    },
    created() {
      this.loadAgrupamentosWorkflow()
      this.loadConfigWorkflow()
    }
  }
</script>

<style></style>
