<template>
  <v-card>
    <title-negative-margin :title="title">
      <span style="border: 1px solid #bdbdbd; height: 20px" class="mr-1"></span>
      <v-tooltip bottom color="green">
        <template v-slot:activator="{ attrs, on }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            icon
            color="green"
            @click="dialogHistoricoDeExpurgo = !dialogHistoricoDeExpurgo"
          >
            <v-icon>fa-solid fa-magnifying-glass</v-icon>
          </v-btn>
        </template>
        <span>Pesquisar</span>
      </v-tooltip>
      <template v-if="cargo == 'GERENTE' || cargo == 'ADMINISTRADOR'">
        <v-tooltip bottom color="blue">
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              icon
              color="blue"
              v-bind="attrs"
              v-on="on"
              @click="dialogValidacaoExpurgo = !dialogValidacaoExpurgo"
            >
              <v-icon>fa-solid fa-envelopes-bulk</v-icon>
            </v-btn>
          </template>
          <span>Validação de Expurgo</span>
        </v-tooltip>
      </template>
    </title-negative-margin>
    <v-divider></v-divider>
    <v-form>
      <template v-if="cargo == 'GERENTE' || cargo == 'ADMINISTRADOR' || cargo == 'COORDENADOR'">
        <v-col>
          <v-row style="margin-bottom: -40px">
            <v-col>
              <v-text-field
                placeholder="Informe o almope"
                outlined
                :rules="almopeRules"
                dense
                v-model="formularioExpurgo.almope"
                v-mask="masks.almope"
                label="Almope"
              ></v-text-field>
            </v-col>
            <v-col v-if="this.expurgo == 'diario'">
              <v-text-field
                placeholder="DD/MM/AAAA"
                outlined
                v-mask="masks.data"
                dense
                v-model="formularioExpurgo.dataInicio"
                label="Data Inicio"
              ></v-text-field>
            </v-col>
            <v-col v-if="this.expurgo == 'diario'">
              <v-text-field
                placeholder="DD/MM/AAAA"
                outlined
                v-mask="masks.data"
                dense
                v-model="formularioExpurgo.dataFim"
                label="Data Fim"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-select
                v-if="this.relatorio != 'ocupacao'"
                outlined
                dense
                no-data-text="Informe primeiro o almope!"
                :items="indicadoresExpurgo"
                placeholder="Informe um indicador"
                v-model="formularioExpurgo.indicador"
                label="Indicador"
                item-value="INDICADOR"
                item-text="INDICADOR"
              ></v-select>
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-row style="margin-bottom: -50px">
            <v-col cols="12">
              <v-textarea
                outlined
                v-model="formularioExpurgo.justificativa"
                dense
                placeholder="Descreva sua solicitação"
                label="Justificativa"
                rows="2"
                auto-grow
                :error-messages="
                  formularioExpurgo.justificativa.length <= 300
                    ? ''
                    : 'Tamanho maximo de 300 caracteres'
                "
                counter="300"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-row style="margin-top: 20px" class="pa-2">
            <v-spacer></v-spacer>
            <v-btn
              class="rounded-r-xl rounded-bl-xl white--text mr-2"
              color="blue darken-3"
              depressed
              @click="abrirModalAprovar = true"
              v-if="filtro == 'ADMINISTRADOR' || filtro == 'GERENTE'"
            >
              Aprovar + de 1
            </v-btn>
            <v-btn
              class="rounded-r-xl rounded-bl-xl white--text mr-2"
              color="orange"
              depressed
              @click="abrirModalCadastrar = true"
              v-if="filtro != 'OPERADOR' || filtro != 'SUPERVISOR' || filtro != 'COORDENADOR'"
            >
              Cadastrar + de 1
            </v-btn>
            <v-btn
              color="success"
              class="rounded-r-xl rounded-bl-xl white--text mr-2"
              depressed
              @click="saveDataFormBase()"
              :disabled="!this.formIsValid()"
            >
              Enviar
            </v-btn>
            <v-btn
              color="error"
              class="rounded-r-xl rounded-bl-xl white--text"
              depressed
              @click="clearForm()"
              :disabled="!this.clearIsValid()"
            >
              Limpar
            </v-btn>
          </v-row>
        </v-col>
      </template>
      <template v-else>
        <v-alert text prominent type="error" icon="mdi-cloud-alert">
          Você não tem permissão para realizar solicitações de
          <strong>Expurgo.</strong>
          Solicite ao seu Superior para abrir a solicitação!
          <br />
          Ahhh... Mas, você pode consultar as solicitações de Expurgo e se elas foram
          <strong style="color: green">APROVADAS</strong>
          ou
          <strong>REPROVADAS</strong>
          clicando na Lupa
          <v-icon color="red" @click="dialogHistoricoDeExpurgo = !dialogHistoricoDeExpurgo">
            mdi-magnify
          </v-icon>
        </v-alert>
      </template>
    </v-form>
    <validacao-expurgo
      :dialogValidacaoExpurgo="dialogValidacaoExpurgo"
      @closeDialogValidacaoExpurgo="dialogValidacaoExpurgo = !dialogValidacaoExpurgo"
    ></validacao-expurgo>
    <historico-expurgo
      :dialogHistoricoDeExpurgo="dialogHistoricoDeExpurgo"
      @closeDialogHistoricoDeExpurgo="dialogHistoricoDeExpurgo = !dialogHistoricoDeExpurgo"
    ></historico-expurgo>
    <v-overlay :value="enviandoDadosExpurgo">
      <v-card color="primary" dark>
        <v-card-text>
          Enviando... Aguarde!
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-overlay>
    <transition enter-active-class="animated pulse">
      <v-overlay :value="errExpurgo">
        <v-card dark>
          <v-alert type="error" width="500">{{ msgError }}</v-alert>
        </v-card>
      </v-overlay>
    </transition>
    <cadastro-massivo
      :abrirModalCadastrar="abrirModalCadastrar"
      @update:close="abrirModalCadastrar = !abrirModalCadastrar"
      :indicadoresExpurgo="indicadoresExpurgo"
    ></cadastro-massivo>
    <aprovar-massivo
      :abrirModalAprovar="abrirModalAprovar"
      @update:close="abrirModalAprovar = !abrirModalAprovar"
    ></aprovar-massivo>
  </v-card>
</template>

<script>
  import historicoExpurgo from './dialogs/historico.vue'
  import validacaoExpurgo from './dialogs/validacao.vue'
  import masks from '../../../../../shared/masks/masks'
  import CadastroMassivo from './dialogs/cadastroMassivo.vue'
  import config from '../../../../../core/config'
  import AprovarMassivo from './dialogs/aprovarMassivo.vue'
  export default {
    name: 'expurgo-component',
    props: {
      dialogExpurgo: {
        type: Boolean,
        default: true
      }
    },
    components: {
      validacaoExpurgo,
      historicoExpurgo,
      CadastroMassivo,
      AprovarMassivo
    },
    data: () => ({
      enviar: false,
      abrirModalCadastrar: false,
      abrirModalAprovar: false,
      dialogValidacaoExpurgo: false,
      dialogHistoricoDeExpurgo: false,
      expurgo: 'diario',
      msgError:
        'Envio não realizado. Aparentemente você está tentando cadastrar um expurgo já tabulado, caso não seja isso, verifique os dados e tente novamente!',
      title: `Expurgo`,
      enviandoDadosExpurgo: false,
      relatorio: '',
      ocupacao: false,
      formularioExpurgo: {
        almope: null,
        indicador: '',
        dataInicio: '',
        dataFim: '',
        justificativa: ''
      },
      formularioExpurgoDefault: {
        almope: null,
        indicador: '',
        dataInicio: '',
        dataFim: '',
        justificativa: ''
      },
      almopeRules: [almope => almope?.length == 7 || 'Necessário 7 digitos']
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      cargo() {
        return this.$store.getters.usuario.filtro
      },
      errExpurgo() {
        return this.$store.getters.errExpurgo
      },
      masks() {
        return masks
      },
      indicadoresExpurgo() {
        let indicadoresExpurgo = this.$store.getters.indicadoresExpurgo
        return indicadoresExpurgo ? indicadoresExpurgo : []
      },
      ipMaquina() {
        return localStorage.getItem('ip')
      },
      filtro() {
        return this.$store.getters.usuario.filtro
      }
    },
    methods: {
      clearIsValid() {
        return (
          this.formularioExpurgo.almope ||
          this.formularioExpurgo.indicador ||
          this.formularioExpurgo.dataInicio ||
          this.formularioExpurgo.justificativa ||
          this.formularioExpurgo.dataFim
        )
      },
      cargoIsValid() {
        return this.cargo == 'GERENTE'
      },
      formIsValid() {
        if (this.expurgo == 'diario') {
          return (
            (this.cargo == 'GERENTE' ||
              this.cargo == 'ADMINISTRADOR' ||
              this.cargo == 'COORDENADOR') &&
            this.formularioExpurgo.almope &&
            this.formularioExpurgo.almope.length == 7 &&
            this.formularioExpurgo.indicador &&
            this.formularioExpurgo.dataInicio &&
            this.formularioExpurgo.justificativa.length <= 300
          )
        }
      },
      clearForm() {
        Object.assign(this.formularioExpurgo, this.formularioExpurgoDefault)
      },
      saveDataFormBase() {
        this.enviandoDadosExpurgo = true
        this.formularioExpurgo.usuarioAlmope = this.$store.getters.usuario.almope
        this.formularioExpurgo.justificativa = this.formularioExpurgo.justificativa.toUpperCase()
        this.formularioExpurgo.idMaquinaCadastro = this.ipMaquina

        let urlData = `${config.baseUrl}api/shared/formularios/tabulador_expurgo/score_individual/`
        this.$api.post(urlData, this.formularioExpurgo).then(() => {
          this.clearForm()
          this.enviandoDadosExpurgo = false
        })
      },
      loadIndicadoresExpurgo() {
        this.$store.dispatch('loadIndicadoresExpurgo')
      }
    },
    watch: {
      expurgo() {
        this.loadIndicadoresExpurgo()
        this.formularioExpurgo.dataInicio = ''
      }
    },
    created() {
      this.loadIndicadoresExpurgo()
    }
  }
</script>

<style scoped></style>
