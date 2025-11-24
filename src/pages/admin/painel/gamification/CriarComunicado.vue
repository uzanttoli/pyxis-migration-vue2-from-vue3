<template>
  <v-card elevation="1">
    <v-card-title>Criar comunicado</v-card-title>
    <v-divider></v-divider>
    <pre>{{ xpBonus }}</pre>
    <v-col>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-select
            outlined
            dense
            :items="produtosDisponiveis"
            item-text="PRODUTO"
            label="Informe um produto"
            v-model="formCriarComunicado.produtoSelecionado"
          ></v-select>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-select
            outlined
            dense
            :items="tipoComunicado"
            item-text="TIPO_COMUNICADO"
            item-value="ID"
            label="Informe o tipo do comunicado"
            v-model="formCriarComunicado.tipoComunicadoSelecionado"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            outlined
            dense
            label="Insira um titulo"
            v-model="formCriarComunicado.titulo"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            outlined
            dense
            label="Insira um subtitulo"
            v-model="formCriarComunicado.subtitulo"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-col>
    <v-col class="mt-n7">
      <v-row>
        <v-col cols="12" sm="12" md="6">
          <label for="agrupamentos">Selecione o(s) agrupamento(s)</label>
          <div class="select">
            <select
              multiple
              name="agrupamentos"
              class="esq"
              v-model="formCriarComunicado.agrupamentosSelecionados"
            >
              <option
                v-for="(item, i) in agrupamentosDisponiveis"
                :key="i"
                v-bind:value="item.AGRUPAMENTO"
              >
                {{ item.AGRUPAMENTO }}
              </option>
            </select>
          </div>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <label for="indicadores">Selecione o(s) indicador(es)</label>
          <div class="select">
            <select
              name="indicadores"
              multiple
              class="esq"
              v-model="formCriarComunicado.indicadoresSelecionados"
            >
              <option v-for="(item, i) in indicadoresConfig" :key="i" v-bind:value="item.INDICADOR">
                {{ item.INDICADOR }}
              </option>
            </select>
          </div>
        </v-col>
      </v-row>
    </v-col>
    <v-col v-if="formCriarComunicado.tipoComunicadoSelecionado == 2">
      <v-row>
        <v-col cols="12" sm="12" md="6">
          <v-text-field
            outlined
            dense
            label="Quanto de XP Bonus?"
            type="number"
            v-model="xpBonus"
            prepend-icon="mdi-chevron-double-up"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-text-field
            outlined
            dense
            label="Quanto de HP Bonus?"
            type="number"
            v-model="hpBonus"
            prepend-icon="mdi-heart"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-col>
    <v-col :class="formCriarComunicado.tipoComunicadoSelecionado == 2 ? 'mt-n7' : ''">
      <v-row>
        <!-- DATA INICIO -->
        <v-col cols="12" sm="12" md="3">
          <v-menu
            v-model="dataInicial"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                dense
                outlined
                v-model="computedDateFormattedInicio"
                label="Data inicial"
                persistent-hint
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formCriarComunicado.dateStart"
              no-title
              @input="dataInicial = false"
              locale="pt-br"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <!-- DATA FIM -->
        <v-col cols="12" sm="12" md="3">
          <v-menu
            v-model="dataFim"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                dense
                outlined
                v-model="computedDateFormattedFim"
                label="Data Final"
                persistent-hint
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formCriarComunicado.dateEnd"
              :min="formCriarComunicado.dateStart"
              no-title
              @input="dataFim = false"
              locale="pt-br"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <!-- <v-col cols="12" sm="12" md="3">
          <v-row align="center" justify="center"> 
            <p>Personalizar butao?</p>
            <v-btn-toggle
              v-model="toggleExclusive"
              color="deep-purple accent-3"
              dense
            >
              <v-btn>Sim</v-btn>
              <v-btn>Não</v-btn>
            </v-btn-toggle>
          </v-row>
        </v-col> -->
        <v-col cols="12" sm="12" md="6">
          <v-text-field
            label="Informe um nome para o botão!"
            outlined
            dense
            prepend-icon="mdi-gesture-tap-button"
            v-model="formCriarComunicado.nomeBotao"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-col>
    <v-col class="mt-n7">
      <v-row>
        <v-col>
          <v-textarea
            label="Descrição do comunicado"
            outlined
            auto-grow
            counter="150"
            :rules="[rules.length(150)]"
            v-model="formCriarComunicado.descricaoComunicado"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-col>
    <v-col class="mt-n5">
      <v-row justify="center" align="center" class="pa-2">
        <v-col cols="6">
          <v-btn
            color="success"
            @click="inserirComunicado"
            :loading="loading"
            block
            :disabled="!this.formCriarComunicadoIsValid()"
          >
            Criar
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn
            block
            color="error"
            @click="clearForm"
            :disabled="!this.formCriarComunicadoIsValidClear()"
          >
            Limpar
          </v-btn>
        </v-col>
      </v-row>
      <!-- <pre>{{ formCriarComunicadoIsValidClear() }}</pre> -->
    </v-col>
  </v-card>
</template>

<script>
  import config from '../../../../core/config'
  export default {
    data: () => ({
      visivel: 1,
      idTemporadaAtual: '',
      produtosDisponiveis: [],
      tipoComunicado: [],
      agrupamentosDisponiveis: [],
      indicadoresConfig: [],
      produtoSelecionado: null,
      toggleExclusive: '',
      loading: false,
      xpBonus: '',
      hpBonus: '',
      formCriarComunicado: {
        nomeBotao: null,
        produtoSelecionado: null,
        tipoComunicadoSelecionado: null,
        titulo: null,
        subtitulo: null,
        agrupamentosSelecionados: [],
        indicadoresSelecionados: [],
        // dateStart: null,
        dateStart: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substring(0, 10),
        dateEnd: null,
        descricaoComunicado: null
      },
      formCriarComunicadoDefault: {
        nomeBotao: '',
        produtoSelecionado: '',
        tipoComunicadoSelecionado: '',
        titulo: '',
        subtitulo: '',
        agrupamentosSelecionados: [],
        indicadoresSelecionados: [],
        // dateStart: null,
        dateStart: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substring(0, 10),
        dateEnd: null,
        descricaoComunicado: ''
      },
      dataInicial: false,
      dataFim: false,
      optionConsiderar: [],
      agrupamentosSelecionados: [],
      indicadoresSelecionados: [],
      dates: [],
      rules: {
        length: len => v =>
          (v || '').length <= len || `Números de caracteres excedidos. Necessário ${len}`
      }
    }),
    computed: {
      dateRangeText() {
        let data = this.dates
        return data[1]
      },
      computedDateFormattedInicio() {
        return this.formatDate(this.formCriarComunicado.dateStart)
      },
      computedDateFormattedFim() {
        return this.formatDate(this.formCriarComunicado.dateEnd)
      },
      usuario() {
        return this.$store.getters.usuario.almope
      },
      ipMaquina() {
        return localStorage.getItem('ip')
      }
    },
    methods: {
      formatarXpBonus() {
        let i = this.formCriarComunicado.indicadoresSelecionados
        // let bonus = 300;
        if (this.xpBonus || this.hpBonus) {
          var result = i.map(e => {
            if (this.xpBonus && this.hpBonus) {
              return `${e + ' +' + this.xpBonus}xp e ${'-' + this.hpBonus}hp`
            } else if (this.xpBonus) {
              return `${e + ' +' + this.xpBonus}xp`
            } else if (this.hpBonus) {
              return `${e + ' -' + this.hpBonus}hp`
            }
          })
          return result
        }
      },
      clearForm() {
        this.xpBonus = ''
        this.hpBonus = ''
        Object.assign(this.formCriarComunicado, this.formCriarComunicadoDefault)
      },
      formCriarComunicadoIsValid() {
        if (this.formCriarComunicado.tipoComunicadoSelecionado == 1) {
          return (
            this.formCriarComunicado.nomeBotao &&
            this.formCriarComunicado.produtoSelecionado &&
            this.formCriarComunicado.agrupamentosSelecionados &&
            this.formCriarComunicado.indicadoresSelecionados &&
            this.formCriarComunicado.tipoComunicadoSelecionado &&
            this.formCriarComunicado.titulo &&
            this.formCriarComunicado.subtitulo &&
            this.formCriarComunicado.descricaoComunicado &&
            this.formCriarComunicado.descricaoComunicado.length < 151 &&
            this.formCriarComunicado.dateStart &&
            this.formCriarComunicado.dateEnd
          )
        } else if (this.formCriarComunicado.tipoComunicadoSelecionado == 2) {
          return (
            this.formCriarComunicado.nomeBotao &&
            this.formCriarComunicado.produtoSelecionado &&
            this.formCriarComunicado.agrupamentosSelecionados &&
            this.formCriarComunicado.indicadoresSelecionados &&
            this.formCriarComunicado.tipoComunicadoSelecionado &&
            this.formCriarComunicado.titulo &&
            this.formCriarComunicado.subtitulo &&
            this.formCriarComunicado.descricaoComunicado &&
            this.formCriarComunicado.descricaoComunicado.length < 151 &&
            this.formCriarComunicado.dateStart &&
            this.formCriarComunicado.dateEnd &&
            (this.xpBonus != '' || this.hpBonus != '')
          )
        }
      },
      formCriarComunicadoIsValidClear() {
        return (
          this.formCriarComunicado.nomeBotao ||
          this.formCriarComunicado.produtoSelecionado ||
          this.formCriarComunicado.tipoComunicadoSelecionado ||
          this.formCriarComunicado.titulo ||
          this.formCriarComunicado.subtitulo ||
          this.formCriarComunicado.descricaoComunicado ||
          this.formCriarComunicado.dateEnd
        )
      },
      async inserirComunicado() {
        try {
          this.loading = true
          this.formCriarComunicado.almopeCadastro = this.usuario
          this.formCriarComunicado.ipMaquinaCadastro = this.ipMaquina
          this.formCriarComunicado.imagem =
            this.tipoComunicado == 1 ? 'icons8-audio.gif' : 'icons8-fire.gif'
          this.formCriarComunicado.idTemporadaAtual = this.idTemporadaAtual
          this.formCriarComunicado.indicadoresSelecionados = this.formatarXpBonus()

          let urlData = `${config.baseUrl}api/shared/admin/gamification/gerenciador/comunicado`
          let getFormData = object =>
            Object.keys(object).reduce((FormData, key) => {
              FormData.append(key, object[key])
              return FormData
            }, new FormData())
          var res = await this.$api.post(urlData, getFormData(this.formCriarComunicado))
          this.loading = false
          this.clearForm()
          const Toast = this.$swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: toast => {
              toast.addEventListener('mouseenter', this.$swal.stopTimer)
              toast.addEventListener('mouseleave', this.$swal.resumeTimer)
            }
          })
          Toast.fire({
            icon: 'success',
            title: res.data
          })
        } catch (error) {
          console.error(error)
        }
      },
      formatDate(date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      escolherAgrupamentos(e) {
        let dados = e
        this.selecionadosConsiderar = dados
      },
      mover(fonte, destino) {
        var selecionados = fonte.querySelectorAll('option:checked')
        for (var i = 0; i < selecionados.length; i++) {
          fonte.removeChild(selecionados[i])
          destino.appendChild(selecionados[i])
        }
      },

      loadProdutosDisponiveis() {
        let urlData = `${config.baseUrl}api/shared/pyxis/produtos`
        this.$api
          .get(urlData)
          .then(res => {
            this.produtosDisponiveis = res.data
          })
          .catch(e => {
            console.error(e)
          })
      },
      loadTipoComunicado() {
        let urlData = `${config.baseUrl}api/shared/admin/gamification/gerenciador/tipo_comunicado`
        this.$api
          .get(urlData)
          .then(res => {
            this.tipoComunicado = res.data
          })
          .catch(e => {
            console.error(e)
          })
      },
      loadAgrupamentosDisponiveis() {
        let urlData = `${config.baseUrl}api/shared/admin/gamification/gerenciador/agrupamentos_gamification`
        this.$api
          .get(urlData)
          .then(res => {
            this.agrupamentosDisponiveis = res.data
          })
          .catch(e => {
            console.error(e)
          })
      },
      loadIndicadoresConfig() {
        let urlData = `${config.baseUrl}api/shared/admin/gamification/gerenciador/indicadores`
        this.$api
          .get(urlData)
          .then(res => {
            this.indicadoresConfig = res.data
          })
          .catch(e => {
            console.error(e)
          })
      },
      loadTemporada() {
        let urlData = `${config.baseUrl}api/shared/painel_administrativo/gamification/temporada/${this.visivel}`
        this.$api.get(urlData).then(res => {
          let dados = res.data
          dados.map(e => {
            this.idTemporadaAtual = e.ID
          })
        })
      }
    },
    watch: {},
    created() {
      this.loadProdutosDisponiveis()
      this.loadTipoComunicado()
      this.loadAgrupamentosDisponiveis()
      this.loadIndicadoresConfig()
      this.loadTemporada()
    }
  }
</script>

<style scoped>
  select {
    width: 100%;
    height: 100px;
    /* background: #f1f1f3; */
    padding: 5px;
  }

  .select {
    border: 1px solid rgb(170, 165, 165);
    display: flex;
    /* width: 100%; */
    margin: 5px;
  }

  .select-princ {
    display: flex;
    width: 50%;
    flex-direction: column;
  }
  label {
    margin-left: 5px;
  }

  .periodo {
    width: 90%;
    border: 1px solid grey;
    border-radius: 5px;
    font-size: 20px;
    margin: 0px;
    padding: 0px;
  }

  .cor-padrao {
    background-image: linear-gradient(220deg, #00ecff, #8f0e8f);
  }
</style>
