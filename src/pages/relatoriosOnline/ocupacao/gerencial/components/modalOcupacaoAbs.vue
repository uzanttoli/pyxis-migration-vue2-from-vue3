<template>
  <!-- v-model="dialogOcupacaoAbs" -->
  <v-dialog
    :model-value="dialogOcupacaoAbs"
    @update:modelValue="val => $emit('update:dialogOcupacaoAbs', val)"
    persistent
    class="modal-ocupacao"
    width="2100"
  >
    <v-card class="rounded-l-xl overflow-x-hidden modal-ocupacao" max-height="800">
      <v-card-title style="display: flex; justify-content: space-between">
        <span>
          Detalhes do
          <strong>{{ title }}</strong>
        </span>
        <div style="display: flex">
          <v-tooltip bottom>
            <template v-slot:activator="{ attrs, on }">
              <download-excel
                :data="dados"
                name="PYXIS_BASE_ABS_OCUPACAO"
                worksheet="PYXIS_BASE_ABS_OCUPACAO"
              >
                <v-btn icon color="green" v-bind="attrs" v-on="on">
                  <v-icon size="20">fa-solid fa-file-arrow-down</v-icon>
                </v-btn>
              </download-excel>
            </template>
            <span>Baixar dados</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ attrs, on }">
              <v-btn icon @click="$emit('update:close-dialog')" v-bind="attrs" v-on="on">
                <v-icon>fas fa-close</v-icon>
              </v-btn>
            </template>
            <span>Fechar</span>
          </v-tooltip>
        </div>
      </v-card-title>
      <v-container fluid>
        <div
          class="card-item"
          style="
            display: flex;
            gap: 20px;
            justify-content: center;
            align-items: center;
            box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.08);
            border-radius: 25px;
            padding: 10px;
            position: relative;
          "
        >
          <graph-modal-ocupacao-abs
            style="flex: 1"
            apiUrl="api/shared/ocupacao/dados_grafico_justificativa_abs"
            nameArea="Percentual"
            nameColumn="Quantidade"
            :agrupamento="title"
            @upload:load-completed="loadCompleted"
            :produtoParams="produtoParams"
          ></graph-modal-ocupacao-abs>
          <v-progress-circular
            v-if="loadGrafico"
            :value="20"
            indeterminate
            size="20"
            style="position: absolute; top: 20px; right: 20px"
          ></v-progress-circular>
        </div>
        <div
          class="card-item"
          style="
            display: flex;
            gap: 20px;
            box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.08);
            border-radius: 25px;
            margin-top: 20px;
            max-height: 500px;
            overflow-x: auto;
          "
        >
          <table-modal-ocupacao-abs :dados="dados"></table-modal-ocupacao-abs>
        </div>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
  import GraphModalOcupacaoAbs from '../charts/graphModalOcupacaoAbs.vue'
  import tableModalOcupacaoAbs from './tableModalOcupacaoAbs.vue'

  export default {
    components: {
      tableModalOcupacaoAbs,
      GraphModalOcupacaoAbs
    },
    props: {
      dialogOcupacaoAbs: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ''
      },
      dados: {
        type: [Array, Object],
        required: true
      },
      produtoParams: {
        type: String
      }
    },
    data: () => ({
      loadGrafico: true
    }),
    computed: {},
    methods: {
      loadCompleted() {
        this.loadGrafico = false
      }
    }
  }
</script>

<style scoped>
  .modal-ocupacao {
  }

  .modal-ocupacao::-webkit-scrollbar {
    width: 10px !important;
  }

  .modal-ocupacao::-webkit-scrollbar-track {
    background: rgb(255, 255, 254) !important;
  }

  .modal-ocupacao::-webkit-scrollbar-thumb {
    background-color: rgb(143, 14, 143) !important;
    border-radius: 25px !important;
    border: 3px solid rgb(245, 245, 245) !important;
  }
</style>
