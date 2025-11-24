<template>
  <v-card>
    <title-negative-margin title="Tratativa BKO Ativação S2S"></title-negative-margin>
    <v-card-title class="text-h6">
      Dados Para Tratativa
      <div class="box cor-padrao">
        <div class="box-tempo-tratativa">
          <span class="box-span">
            Tempo {{ novoCasoAtivacao.NUM_CONTRATO ? 'de tratativa' : 'disponivel' }}
          </span>
          <p class="box-time">
            {{ tempo == 'NaN:NaN:NaN' ? '00:00:00' : tempo }}
          </p>
        </div>
        <v-divider class="pa-2"></v-divider>
        <div class="box-consolidado-mes">
          <span class="box-mes">Consolidado Mês</span>
          <p class="box-quantidade-mes">
            {{ consolidadoMes ? consolidadoMes.CONSOLIDADO_MES : '0' }}
          </p>
        </div>
        <v-divider class="pa-2"></v-divider>
        <div class="box-consolidado-dia">
          <span class="box-dia">Consolidado Dia</span>
          <p class="box-quantidade-dia">
            {{ consoliadoDia ? consoliadoDia.CONSOLIDADO_DIA : '0' }}
          </p>
        </div>
        <v-divider class="pa-2"></v-divider>
        <div class="box-quantidade-ativados">
          <span class="box-ativados">Qtd. Ativação</span>
          <p class="box-quantidade-ativo-mes">
            {{ minhasAtivacoes ? minhasAtivacoes.CASOS_ATIVOS : '0' }}
          </p>
        </div>
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <v-card>
      <v-col class="pa-4">
        <v-row>
          <v-col cols="2" class="pa-0 mt-6">
            <TextareaButton label="COD" :text="novoCasoAtivacao.COD_CIDADE" />
          </v-col>
          <v-col cols="3" class="pa-0 mt-6">
            <TextareaButton label="Contrato" :text="novoCasoAtivacao.NUM_CONTRATO" />
          </v-col>
          <v-col cols="4" class="pa-0 mt-6">
            <TextareaButton label="Cidade" :text="novoCasoAtivacao.DSC_MUNICIPIO_BI" />
          </v-col>
          <v-col cols="3" class="pa-0 mt-6">
            <TextareaButton
              label="Data Venda"
              :text="novoCasoAtivacao.DATA_VENDA_BRUTA | formatedDate"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" class="pa-0">
            <TextareaButton label="Vendedor" :text="novoCasoAtivacao.VENDEDOR" />
          </v-col>
          <v-col cols="6" class="pa-0">
            <TextareaButton label="Supervisor" :text="novoCasoAtivacao.SUPERVISOR" />
          </v-col>
        </v-row>
      </v-col>
      <v-divider class="mt-n5"></v-divider>
      <v-card-title class="text-h6">
        Tratativa
        <v-spacer></v-spacer>
      </v-card-title>
      <v-row class="pa-0 ma-0">
        <v-col>
          <v-select
            :disabled="!novoCasoAtivacao.ID_MAILING"
            outlined
            label="Caso ativo?"
            no-data-text="Não há status"
            :items="casoAtivo"
            item-text="CASO_ATIVO"
            item-value="ID_STATUS"
            v-model="itemsTratados.itemCasoAtivo"
            @change="loadCausaMacro()"
          ></v-select>
        </v-col>
        <v-col v-if="itemsTratados.itemCasoAtivo != null">
          <v-select
            outlined
            label="Motivo"
            no-data-text="Não há motivos"
            :items="causaMacro"
            item-text="MOTIVO_MACRO"
            item-value="ID_MOTIVO_MACRO"
            v-model="itemCausaMacro"
            @change="loadCausaMicro()"
          ></v-select>
        </v-col>
        <v-col v-if="itemCausaMacro != null">
          <v-select
            outlined
            label="SubMotivo"
            no-data-text="Não há submotivos"
            :items="causaMicro"
            item-text="MOTIVO_MICRO"
            item-value="ID_MOTIVO_MICRO"
            v-model="itemsTratados.itemCausaMicro"
          ></v-select>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-col class="mt-n5">
          <v-row class="ma-0 justify-space-around" align="center">
            <v-btn width="190" color="blue" class="white--text" @click="loadNovoCasoAtivacao()">
              Novo tratamento
            </v-btn>
            <v-btn
              width="190"
              color="orange"
              class="white--text"
              @click="agendar = true"
              :disabled="!this.agendarValido()"
            >
              Agendar
            </v-btn>
            <v-btn
              width="190"
              color="green"
              class="white--text"
              @click="atualizarCasoActions"
              :disabled="!this.formIsValid()"
            >
              Salvar
            </v-btn>
            <v-btn
              width="190"
              color="red"
              class="white--text"
              @click="clearForm"
              :disabled="!this.clearFormIsValid()"
            >
              Limpar
            </v-btn>
          </v-row>
        </v-col>
      </v-card-actions>
    </v-card>
    <ModalBottom
      :sheet="agendar"
      @closeSchedule="agendar = !agendar"
      :dadosAgenda="dadosAgendamento"
      @updated:agendado="agendado = true"
    />
    <v-overlay :value="load">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<script>
  import TextareaButton from '../../../../shared/components/textareaButton/textfieldButton.component.vue'
  import ModalBottom from './modalBottom.component.vue'

  export default {
    components: {
      TextareaButton,
      ModalBottom
    },
    data: () => ({
      drawer: true,
      tempo: null,
      load: false,
      mini: true,
      agendado: false,
      interval: null,
      countInterval: 0,
      agendar: false,
      itemCausaMacro: null,
      itemsTratados: {
        statusTratamentoBko: 3,
        itemCasoAtivo: null,
        itemCausaMicro: null
      },
      itemsTratadosDefault: {
        statusTratamentoBko: 3,
        itemCasoAtivo: null,
        itemCausaMicro: null
      }
    }),
    filters: {
      formatedDate(value) {
        if (!value) {
          return ''
        }
        return value.split('-').reverse().join('/')
      }
    },
    computed: {
      novoCasoAtivacao() {
        let novoCaso = this.$store.getters.novoCasoAtivacao

        return novoCaso ? novoCaso : []
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      casoAtivo() {
        return this.$store.getters.casoAtivo
      },
      causaMacro() {
        return this.$store.getters.causaMacro
      },
      causaMicro() {
        return this.$store.getters.causaMicro
      },
      dadosAgendamento() {
        let dados = this.novoCasoAtivacao
        let dadosCompleto = {
          idMailing: dados.ID_MAILING,
          itemCasoAtivo: this.itemsTratados.itemCasoAtivo,
          itemCausaMacro: this.itemCausaMacro,
          itemCausaMicro: this.itemsTratados.itemCausaMicro,
          almopeTratamentoFechamento: this.usuarioAlmope,
          dataFimTratamento: this.moment().format('YYYY-MM-DD HH:MM:SS'),
          tempoTratamento: this.diferencaTempo(),
          statusTratamentoBko: 2
        }
        return dadosCompleto
      },
      consoliadoDia() {
        return this.$store.getters.consoliadoDia
      },
      consolidadoMes() {
        return this.$store.getters.consolidadoMes
      },
      minhasAtivacoes() {
        return this.$store.getters.minhasAtivacoes
      }
    },
    mounted() {
      this.interval = setInterval(() => {
        this.tempo = this.diferencaTempo()
      }, 1000)
    },
    methods: {
      clearContent() {
        let dados = this.novoCasoAtivacao
        dados.ID_MAILING = null
        dados.DATA_INICIO_TRATAMENTO = new Date()
        dados.COD_CIDADE = null
        dados.NUM_CONTRATO = null
        dados.DSC_MUNICIPIO_BI = null
        dados.DATA_VENDA_BRUTA = null
        dados.VENDEDOR = null
        dados.SUPERVISOR = null
      },
      loadConsolidadoMes() {
        this.$store.dispatch('loadConsolidadoMes', this.usuarioAlmope)
      },
      loadConsoliadoDia() {
        this.$store.dispatch('loadConsoliadoDia', this.usuarioAlmope)
      },
      loadMinhasAtivacoes() {
        this.$store.dispatch('loadMinhasAtivacoes', this.usuarioAlmope)
      },
      diferencaTempo() {
        let inicio = new Date(this.novoCasoAtivacao.DATA_INICIO_TRATAMENTO)
        let fim = new Date()
        let diferenca = new Date(fim - inicio)

        let hours = diferenca.getUTCHours().toString()
        let hoursF = hours.length == 1 ? '0' + hours : hours
        let minutes = diferenca.getUTCMinutes().toString()
        let minutesF = minutes.length == 1 ? '0' + minutes : minutes
        let seconds = diferenca.getUTCSeconds().toString()
        let secondsF = seconds.length == 1 ? '0' + seconds : seconds

        var resultado = hoursF + ':'
        resultado += minutesF + ':'
        resultado += secondsF
        return resultado
      },
      tempoTratativa() {
        return setInterval(() => {
          this.diferencaTempo
        }, 1000)
      },
      clearFormIsValid() {
        return (
          this.itemsTratados.itemCasoAtivo != null ||
          this.itemCausaMacro != null ||
          this.itemsTratados.itemCausaMicro != null
        )
      },
      clearForm() {
        Object.assign(this.itemsTratados, this.itemsTratadosDefault)
      },
      agendarValido() {
        return (
          (this.itemCausaMacro == 2 || this.itemCausaMacro == 1) &&
          this.itemsTratados.itemCausaMicro != null &&
          this.itemsTratados.itemCausaMicro != ''
        )
      },
      formIsValid() {
        return (
          this.itemsTratados.itemCasoAtivo != null &&
          this.itemCausaMacro != null &&
          this.itemCausaMacro != 2 &&
          this.itemCausaMacro != 1 &&
          this.itemsTratados.itemCausaMicro != null &&
          this.itemsTratados.itemCausaMicro != 2 &&
          this.itemsTratados.itemCausaMicro != 1
        )
      },
      novoCasoIsValid() {
        return this.novoCasoAtivacao.ID_MAILING != ''
      },

      async atualizarCasoActions() {
        this.load = true
        let data = {
          procedimento: 1,
          statusTratamento: 3,
          almope: this.usuarioAlmope,
          casoAtivo: this.itemsTratados.itemCasoAtivo,
          motivoMacro: this.itemCausaMacro,
          motivoMicro: this.itemsTratados.itemCausaMicro,
          dataAgendamento: null,
          idMailing: this.novoCasoAtivacao.ID_MAILING
        }
        await this.$store.dispatch('atualizarCasoActions', data)
        this.clearContent()
        this.reloadBase()
        this.clearForm()
        this.load = false
      },
      loadCausaMicro() {
        this.$store.dispatch('loadCausaMicro', this.itemCausaMacro)
      },
      loadCausaMacro() {
        this.$store.dispatch('loadCausaMacro', this.itemsTratados.itemCasoAtivo).then(() => {
          this.itemsTratados.itemCausaMicro = null
        })
      },
      loadCasoAtivo() {
        this.$store.dispatch('loadCasoAtivo')
      },
      async loadNovoCasoAtivacao() {
        try {
          this.load = true
          await this.$store.dispatch('loadNovoCasoAtivacao', this.usuarioAlmope)
          this.load = false
        } catch (error) {
          return error
        }
      },
      reloadBase() {
        this.loadConsoliadoDia()
        this.loadConsolidadoMes()
      }
    },
    watch: {
      itemCausaMacro() {
        this.itemsTratados.itemCausaMicro = null
      },
      agendado() {
        if (this.agendado == true) {
          this.clearForm()
          this.agendado = false
        }
      }
    },
    created() {
      this.loadMinhasAtivacoes()
      this.loadCasoAtivo()
      this.loadConsoliadoDia()
      this.loadConsolidadoMes()
    },
    beforeUnmount: function () {
      clearInterval(this.interval)
    }
  }
</script>

<style scoped>
  .demo {
    font-family: sans-serif;
    border: 1px solid #eee;
    border-radius: 2px;
    padding: 20px 30px;
    margin-top: 1em;
    margin-bottom: 40px;
    user-select: none;
    overflow-x: auto;
    padding: 10px 20px;
    background: #f3beb8;
    border: 1px solid #f09898;
  }

  .box {
    width: 150px;
    height: 280px;
    position: fixed;
    z-index: 1000;
    right: 1rem;
    top: 10rem;
    text-align: center;
    border-radius: 10px;
    color: #ffffff;
    background-color: #591b3d;
  }

  .box-span {
    font-size: 10px;
    text-align: center;
  }

  .box-time {
    margin-top: -10px;
  }
  .box-consolidado-dia {
    margin-top: -20px;
  }
  .box-dia {
    font-size: 10px;
    text-align: center;
  }

  .box-quantidade-dia {
    margin-top: -10px;
  }

  .box-consolidado-mes {
    margin-top: -20px;
  }
  .box-mes {
    font-size: 10px;
    text-align: center;
  }

  .box-quantidade-mes {
    margin-top: -10px;
  }

  .box-quantidade-ativados {
    margin-top: -20px;
  }
  .box-ativados {
    font-size: 10px;
    text-align: center;
  }

  .box-quantidade-ativo-mes {
    margin-top: -10px;
  }
  .cor-padrao {
    background-image: linear-gradient(220deg, rgb(0, 236, 255), rgb(143, 14, 143));
  }
</style>
