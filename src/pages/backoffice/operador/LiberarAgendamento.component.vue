<template>
  <!-- v-model="abrirLiberarAgendamento" -->
  <v-dialog
    :model-value="abrirLiberarAgendamento"
    @update:modelValue="val => $emit('update:abrirLiberarAgendamento', val)"
    persistent
    width="1200"
  >
    <v-card class="overflow-hidden">
      <div id="cancelar"></div>
      <title-negative-margin title="Liberar agendamentos">
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('update:close')">
          <v-icon>fa fa-close</v-icon>
        </v-btn>
      </title-negative-margin>
      <v-data-table
        :headers="getHeaders()"
        no-data-text="Você não possui casos agendados para está fila."
        :items="base"
        dense
        class="text-no-wrap"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        hide-default-footer
      >
        <template v-slot:item.LIBERAR_AGENDAMENTO="{ item }">
          <v-btn
            small
            block
            depressed
            class="cor-padrao white--text"
            @click="releaseCase(item.NUM_CASO)"
          >
            liberar
          </v-btn>
        </template>
        <template v-slot:item.OBSERVACAO="{ item }">
          <div class="mt-1">
            <p>
              <strong>Contrato:</strong>
              {{ item.OPER_CONTRATO }}
            </p>
            <p style="line-height: 1px">
              <strong>Observação:</strong>
              {{ item.OBSERVACAO }}
            </p>
          </div>
        </template>
        <template v-slot:footer>
          <v-row class="mt-2 mb-2" align="center" justify="center">
            <span class="mr-4 grey--text">Pág. {{ page }} de {{ numberOfPages }}</span>
            <v-btn
              fab
              color="primary"
              class="mr-1"
              small
              @click="formerPage"
              :disabled="page == 1"
              depressed
            >
              <v-icon small>fa-solid fa-arrow-left</v-icon>
            </v-btn>
            <v-btn
              fab
              color="primary"
              class="ml-1"
              small
              depressed
              :disabled="numberOfPages == 0 || page == numberOfPages"
              @click="nextPage"
            >
              <v-icon small>fa-solid fa-arrow-right</v-icon>
            </v-btn>
          </v-row>
        </template>
      </v-data-table>
    </v-card>
    <loadhastag :envioDados="loadBase"></loadhastag>
  </v-dialog>
</template>

<script>
  import config from '../../../core/config'
  import loadhastag from '../../../shared/components/load/loadHastag.vue'
  export default {
    components: { loadhastag },
    props: {
      abrirLiberarAgendamento: {
        type: Boolean,
        default: false
      },
      config: {
        type: Array,
        require: true
      }
    },
    data: () => ({
      base: [],
      page: 1,
      itemsPerPage: 5,
      loadBase: false
    }),
    computed: {
      numberOfPages() {
        return Math.ceil(this.base.length / this.itemsPerPage)
      },
      almopeUsuario() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      nextPage() {
        if (this.page + 1 <= this.numberOfPages) this.page += 1
      },
      formerPage() {
        if (this.page - 1 >= 1) this.page -= 1
      },
      getHeaders() {
        let header = [
          {
            text: 'LIBERAR_AGENDAMENTO',
            value: 'LIBERAR_AGENDAMENTO'
          },
          {
            text: 'NUM. CASO',
            value: 'NUM_CASO'
          },
          {
            text: 'FILA',
            value: 'FILA'
          },
          {
            text: 'TIPO',
            value: 'TIPO_OCOR'
          },
          {
            text: 'DATA HORA AGENDA',
            value: 'DATA_AGENDAMENTO'
          },
          {
            text: 'DATA HORA SLA',
            value: 'DATA_HORA_SLA'
          },

          {
            text: 'OBSERVAÇÃO',
            value: 'OBSERVACAO'
          }
        ]
        return header
      },
      loadCasesSchedules() {
        this.loadBase = true
        let urlData = `${config.baseUrl}api/shared/backoffice/agendamentos/liberar_agendamentos/${
          this.almopeUsuario
        }/${this.config[3] /*SEGMENTO*/}/${this.config[0] /*ID_FILA*/}`
        this.$api.get(urlData).then(res => {
          this.base = res.data
          this.loadBase = false
        })
      },
      async releaseCase(numCaso) {
        await this.$swal
          .fire({
            title: "<h4 style='color: grey; font-family: Roboto,sans-serif;'>Liberar caso</h4>",
            text: 'Está ação não pode ser desfeita. Continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, Liberar',
            cancelButtonText: 'Cancelar'
          })
          .then(result => {
            if (result.isConfirmed) {
              let dataAgendamento = ''
              let tipoOcorrencia = ''
              let filaNome = ''

              this.$store.dispatch('loadExecutarAcao', {
                filaProcedure: this.config[1],
                paramVerificacao: this.config[2],
                numCaso: numCaso,
                almope: this.almopeUsuario,
                dataAgendamento: dataAgendamento,
                tipoOcorrencia: tipoOcorrencia,
                filaNome: filaNome
              })
              this.$swal
                .fire(
                  "<h2 style='font-family: Roboto,sans-serif;'>Liberado!</h2>",
                  `Caso ${numCaso} foi liberado.`,
                  'success'
                )
                .then(result => {
                  if (result.isConfirmed) {
                    // this.loadCasesSchedules()
                    this.$emit('update:close')
                    this.$emit('update:retornarCasoAgendado')
                  }
                })
            }
          })
      }
    },
    watch: {
      abrirLiberarAgendamento() {
        if (this.abrirLiberarAgendamento == true) {
          this.loadCasesSchedules()
        }
      }
    }
  }
</script>

<style scoped>
  .cor-padrao {
    background-image: linear-gradient(220deg, rgb(0, 236, 255), rgb(115, 25, 143));
  }

  .swal2-title {
    font-size: 1.5rem !important;
    color: white !important;
  }
</style>
