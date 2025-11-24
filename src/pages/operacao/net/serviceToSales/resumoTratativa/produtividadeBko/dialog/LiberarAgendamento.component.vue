<template>
  <!-- v-model="liberarAgendamento" -->
  <v-dialog
    width="600"
    persistent
    :model-value="liberarAgendamento"
    @update:modelValue="val => $emit('update:liberarAgendamento', val)"
  >
    <v-card width="100%" class="mx-auto rounded-xl" color="white" tile>
      <v-card-title class="d-flex align-center justify-space-between flex-wrap mb-2">
        <div class="d-flex align-center">
          <v-progress-circular
            v-if="loading"
            indeterminate
            size="20"
            color="deep-purple"
            class="mr-2"
          ></v-progress-circular>

          <div>
            <div class="text-subtitle-1 font-weight-medium mb-2">Gerenciar agendamento</div>
            <div
              class="pa-2"
              style="
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                background-color: #f9f9f9;
                display: inline-block;
              "
            >
              <div class="text-caption font-weight-medium mb-1 px-1">Liberar agendamento</div>

              <v-btn-toggle v-model="tipoAgendamentoSelecionado" mandatory class="toggle-compact">
                <v-btn
                  v-for="(item, i) in tipoLiberacaoAgendamento"
                  :key="i"
                  :value="item.value"
                  depressed
                  small
                  color="deep-purple"
                  :class="{
                    'white--text': tipoAgendamentoSelecionado === item.value
                  }"
                  @click="inserirPermissaoAgendamento(item.value)"
                  class="text-caption px-3 py-1 mx-1"
                >
                  {{ item.nome }}
                </v-btn>
              </v-btn-toggle>
            </div>
          </div>
        </div>

        <v-btn
          icon
          @click="$emit('updated:close')"
          class="mb-n2"
          absolute
          style="right: 10px; top: 12px"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>
      <v-tabs v-model="tab" grow>
        <v-tab v-for="(tab, i) in tabs" :key="i" @click="loadTipo(tab.label)">
          {{ tab.label }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="tab in tabs" :key="tab.label">
          <component
            :is="tab.component"
            :tipo="tipoSelecionado"
            @update:loading-acoes="loadingAction"
          ></component>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-dialog>
</template>

<script>
  import config from '@/core/config'
  import AgendamentoOsEmAberto from '../table/TabelaAcoesAgendamento.component.vue'
  export default {
    components: { AgendamentoOsEmAberto },
    props: {
      liberarAgendamento: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      tab: null,
      tipoSelecionado: 'OS EM ABERTO',
      tabs: [
        { component: 'AgendamentoOsEmAberto', label: 'OS EM ABERTO' },
        { component: 'AgendamentoOsEmAberto', label: 'REENVIO DE CHIP' },
        {
          component: 'AgendamentoOsEmAberto',
          label: 'TENTATIVA DE CONTATO SEM SUCESSO'
        }
      ],
      tipoLiberacaoAgendamento: [
        { nome: 'PERMITIR', value: 1 },
        { nome: 'NÃO PERMITIR', value: 0 }
      ],
      tipoAgendamentoSelecionado: null,
      loading: false
    }),
    methods: {
      loadingAction(event) {
        this.loading = event
      },
      loadTipo(value) {
        return (this.tipoSelecionado = value)
      },
      async inserirPermissaoAgendamento(value) {
        let data = {
          permitirAgendamento: value,
          alteradoPor: this.$store.getters.usuario.almope
        }
        let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/permitir_agendamento`
        await this.$api.post(urlData, data)
      },
      async loadPermitirAgendamento() {
        try {
          let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/permitir_agendamento/`
          var res = await this.$api.get(urlData)
          this.tipoAgendamentoSelecionado = res?.data[0]?.PERMITIR_AGENDAMENTO ?? ''
        } catch (error) {
          console.error(error)
        }
      }
    },
    created() {},
    watch: {
      liberarAgendamento: function (newVal) {
        if (newVal) {
          this.loadPermitirAgendamento()
        }
      }
    }
  }
</script>

<style scoped>
  .toggle-compact .v-btn {
    border-radius: 8px !important;
    min-width: 90px;
    transition: background-color 0.2s;
  }

  .toggle-compact .v-btn:not(.white--text) {
    background-color: #f0f0f0 !important;
    color: #555 !important;
  }
</style>
