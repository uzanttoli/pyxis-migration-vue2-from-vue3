<template>
  <div>
    <div class="fase-title">
      <div style="display: flex; align-items: center">
        <p class="ma-0 pa-0 mr-2" style="font-size: 14px; font-weight: 600; color: #787878">
          Fase atual
        </p>
        <v-chip
          label
          small
          outlined
          :color="colorStatus(idAtual ? idAtual.STATUS_SOLICITACAO : false)"
        >
          <span style="font-weight: 700; font-size: 15px">
            {{
              dadosTratativa.NOME_STATUS == 'ABERTOS'
                ? 'Caixa de Entrada'
                : dadosTratativa.NOME_STATUS
            }}
          </span>
        </v-chip>
      </div>
      <div>
        <v-switch
          color="green"
          v-model="notificarUser"
          label="Notificar usuário?"
          @change="alterNotification"
        ></v-switch>
      </div>
    </div>
    <v-divider></v-divider>
    <div class="fase-body">
      <div class="field-body">
        <p style="margin: 0; padding: 0; font-size: 14.5px; font-weight: 600; color: #787878">
          Responsável
        </p>
        <div style="display: flex; align-items: center; justify-content: space-between">
          <span
            :style="
              'color:' + dadosTratativa.NOME_DESIGNADO == null
                ? 'grey'
                : '#2d2defd0' + '; font-weight: 600; font-size: 14px;'
            "
          >
            <i class="fa-solid fa-users-gear mr-2" style="color: #939393cf"></i>
            {{
              dadosTratativa.NOME_DESIGNADO == null
                ? 'Solicitação sem responsável!'
                : dadosTratativa.NOME_DESIGNADO
            }}
          </span>
          <div>
            <v-btn
              x-small
              rounded
              depressed
              color="success"
              :disabled="dadosTratativa.ID_STATUS == 5 || dadosTratativa.ID_STATUS == 7"
              @click="selecaoDirecionar = !selecaoDirecionar"
            >
              {{ selecaoDirecionar ? 'Fechar' : 'Direcionar Demanda' }}
              <v-icon x-small class="ml-2">fa-solid fa-arrow-right-arrow-left</v-icon>
            </v-btn>
          </div>
        </div>
        <div v-if="selecaoDirecionar">
          <p
            style="
              margin-top: 2.5em;
              padding: 0;
              font-size: 14.5px;
              font-weight: 600;
              color: #787878;
            "
          >
            Direcionar Demanda
          </p>
          <v-autocomplete
            dense
            outlined
            placeholder="Selecione um analista"
            label="Selecione um analista"
            hide-no-data
            multiple
            :items="analistas"
            :disabled="dadosTratativa.ID_STATUS == 5 || dadosTratativa.ID_STATUS == 7"
            item-text="name"
            item-value="name"
            v-model="usuarioSelecionado"
          >
            <template v-slot:append-outer>
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  text-align: center;
                  align-items: center;
                  margin-top: -10px;
                "
              >
                <v-btn
                  class="mx-0"
                  depressed
                  fab
                  :disabled="
                    (dadosTratativa.ID_STATUS == 5 && dadosTratativa.ID_STATUS == 7) ||
                    usuarioSelecionado == null ||
                    usuarioSelecionado == ''
                  "
                  color="orange"
                  x-small
                  @click="direcionarDemanda"
                >
                  <v-icon size="15" color="white">fa-solid fa-shuffle</v-icon>
                </v-btn>
                <span style="font-size: 10px; margin-top: 3px">Direcionar</span>
              </div>
            </template>
          </v-autocomplete>
        </div>
      </div>
      <div class="field-body">
        <p style="margin-top: 1em; padding: 0; font-size: 14.5px; font-weight: 600; color: #787878">
          Prioridade
        </p>
        <span
          :style="
            'color:' +
            corPrioridade[dadosTratativa.PRIORIDADE] +
            '; font-weight: 600; font-size: 14px; display: flex; align-items: center; margin-top: -7px'
          "
        >
          <i
            :class="'fa-solid fa-' + iconsPrioridade[dadosTratativa.PRIORIDADE]"
            :style="
              'color:' +
              corPrioridade[dadosTratativa.PRIORIDADE] +
              '; font-size: 20px; margin-right: 5px'
            "
          ></i>
          {{ dadosTratativa.PRIORIDADE }}
        </span>
      </div>
      <div>
        <p style="margin-top: 1em; padding: 0; font-size: 14.5px; font-weight: 600; color: #787878">
          Prorrogar prazo
        </p>
        <div style="display: flex; align-items: center; margin-top: -10px">
          <div style="width: 250px">
            <v-input-field
              label="Escolha pra quando quer prorrogar?"
              v-model="dataProrrogada"
            ></v-input-field>
          </div>
          <v-btn
            class="mb-n6 ml-4"
            depressed
            rounded
            color="info"
            small
            :disabled="
              dadosTratativa.ID_STATUS == 5 ||
              dadosTratativa.ID_STATUS == 6 ||
              dadosTratativa.ID_STATUS == 7 ||
              dataProrrogada == null ||
              dataProrrogada == ''
            "
            @click="prorrogarPrazoSolicitacao"
          >
            <v-icon size="14" class="mr-2">fa-solid fa-stopwatch</v-icon>
            Prorrogar prazo
          </v-btn>
        </div>
      </div>
      <div class="mt-8">
        <p style="margin-top: 1em; padding: 0; font-size: 14.5px; font-weight: 600; color: #787878">
          Mudar fase da demanda
        </p>
        <v-autocomplete
          label="Ações"
          solo-inverted
          placeholder="Selecione uma ação"
          :items="itemsAcao"
          :disabled="dadosTratativa.ID_STATUS == 5 || dadosTratativa.ID_STATUS == 7"
          no-data-text="Ações não disponiveis"
          item-text="STATUS_SOLICITACAO"
          item-value="ID"
          v-model="acaoSelecionada"
        >
          <template v-slot:append-outer>
            <div
              style="
                display: flex;
                flex-direction: column;
                text-align: center;
                align-items: center;
                margin-top: -7px;
              "
            >
              <v-btn
                class="mx-0"
                depressed
                fab
                color="green"
                x-small
                @click="alterarStatusDemanda"
                :disabled="acaoSelecionada == null"
              >
                <v-icon size="15" color="white">fa-solid fa-check</v-icon>
              </v-btn>
              <span style="font-size: 10px; margin-top: 3px">Aplicar</span>
            </div>
          </template>
        </v-autocomplete>
      </div>
      <div class="actions">
        <v-btn
          class="mr-3 white--text"
          rounded
          depressed
          color="green"
          @click="aprovarProject = !aprovarProject"
          :loading="loadInicializeProject"
          :disabled="
            (idAtual ? idAtual.ID >= 2 : false) ||
            dadosTratativa.ID_STATUS == 5 ||
            dadosTratativa.ID_STATUS == 7
          "
        >
          Aprovar
        </v-btn>
        <!-- <v-btn
          class="mr-3 white--text"
          rounded
          depressed
          color="info"
          @click="inicializeProject(3)"
          :loading="loadInicializeProject"
          :disabled="idAtual ? idAtual.ID >= 2 && idAtual.ID >= 3 : false"
          >Iniciar Execução</v-btn
        > -->
        <v-btn
          class="mr-3 white--text"
          rounded
          depressed
          color="red"
          @click="inicializeProject(5)"
          :loading="loadInicializeProject"
          :disabled="
            (idAtual ? idAtual.ID >= 7 && idAtual.ID <= 7 : false) ||
            dadosTratativa.ID_STATUS == 5 ||
            dadosTratativa.ID_STATUS == 7
          "
        >
          Cancelar
        </v-btn>
      </div>
      <div style="margin-top: 1em" v-if="aprovarProject">
        <v-alert
          :icon="selecaoDirecionarNoAprovar ? 'mdi-account-group-outline' : 'mdi-exclamation'"
          prominent
          type="success"
        >
          Você gostaria de tratar essa demanda ou direcionar ela para outro analista?
          <div style="gap: 10px; display: flex; margin-top: 10px">
            <v-btn
              small
              rounded
              depressed
              @click="inicializeProject(2)"
              :disabled="dadosTratativa.ID_STATUS == 5 || dadosTratativa.ID_STATUS == 7"
            >
              Apenas Aprovar
            </v-btn>
            <v-btn
              small
              rounded
              type="info"
              depressed
              @click="selecaoDirecionarNoAprovar = !selecaoDirecionarNoAprovar"
              :disabled="dadosTratativa.ID_STATUS == 5 || dadosTratativa.ID_STATUS == 7"
            >
              {{ selecaoDirecionarNoAprovar ? 'Fechar' : 'Aprovar e Direcionar' }}
            </v-btn>
          </div>
          <div
            style="margin-top: 25px; display: flex; align-items: center; flex-direction: column"
            v-if="selecaoDirecionarNoAprovar"
          >
            <div style="display: flex">
              <v-checkbox
                v-for="(item, i) in analistas"
                :key="i"
                class="ma-0 pa-0"
                :label="item.name"
                :value="item.name"
                multiple
                v-model="usuarioSelecionado"
              ></v-checkbox>
              <!-- <v-checkbox
                class="ma-0 pa-0"
                label="Uanderson de Oliveira dos Santos"
                value="4602597"
                v-model="usuarioSelecionado"
                multiple
              ></v-checkbox>
              <v-checkbox
                class="ma-0 pa-0"
                label="Carlos Eduardo Silva Santos"
                value="4637725"
                v-model="usuarioSelecionado"
                multiple
              ></v-checkbox> -->
            </div>
            <div style="width: 100%; display: flex; justify-content: end; margin-top: 10px">
              <v-btn small block color="blue" @click="atribuirDemanda">Direcionar</v-btn>
            </div>
          </div>
        </v-alert>
      </div>
      <v-col class="pa-0 ma-0" v-for="(item, i) in listVerificacao" :key="i">
        <list-verificacao
          :index="i"
          :data="item"
          @delete-task="deleteTasks"
          @add-tasks="addTask"
          @update:reload="reload"
        ></list-verificacao>
      </v-col>
      <div class="add-list-verificacao" v-if="dadosTratativa.ID_STATUS != 5">
        <a @click="createdList = true">+ Adicionar uma lista de verificação</a>
      </div>
      <div v-if="createdList">
        <v-card elevation="0" outlined class="pa-2">
          <div style="display: flex; align-items: center; justify-content: space-between">
            <h5 class="pa-2">Criar lista de verificação</h5>
            <v-btn icon small @click="createdList = false">
              <v-icon size="15">fa-solid fa-xmark</v-icon>
            </v-btn>
          </div>
          <validation-observer ref="observer" v-slot="{ invalid }">
            <form @submit.prevent="submit">
              <v-divider></v-divider>
              <v-col class="mt-4">
                <validation-provider v-slot="{ errors }" name="nome da lista" rules="required">
                  <v-text-field
                    placeholder="Nome da Lista"
                    label="Nome da lista"
                    outlined
                    :error-messages="errors"
                    required
                    v-model="formListCriacao.titulo"
                    dense
                  ></v-text-field>
                </validation-provider>
                <!-- <v-btn>Criar lista</v-btn> -->
              </v-col>
              <h5 class="px-2 mt-n3">Criar lista de verificação</h5>
              <p style="font-size: 10px; color: red" class="px-2">
                Necessário criar ao menos um item!
              </p>
              <v-divider></v-divider>
              <!-- v-for="(item, i) in formListCriacao.lista"
              :key="i" -->
              <div class="my-2">
                <v-col>
                  <validation-provider v-slot="{ errors }" name="tarefa" rules="required">
                    <v-text-field
                      placeholder="Tarefa"
                      label="Tarefa"
                      outlined
                      :error-messages="errors"
                      dense
                      required
                      hide-details
                      v-model="formListCriacao.tarefa"
                      flat
                      solo
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </div>
              <v-col>
                <v-btn class="white--text" depressed type="submit" color="info" :disabled="invalid">
                  Criar lista
                </v-btn>
              </v-col>
            </form>
          </validation-observer>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
  import listVerificacao from './listVerificacao.vue'
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import config from '../../../core/config'
  import acoes from '../../../mixins/projectManager/acoes'
  import VInputField from '../../../shared/components/vuetifyComponents/VInputField.vue'
  import alerts from '../../../mixins/alerts.mixins'
  export default {
    components: {
      listVerificacao,
      ValidationObserver,
      ValidationProvider,
      VInputField
    },
    props: {
      dadosTratativa: {
        type: [Array, Object]
      },
      status: {
        type: [Array, Object]
      }
    },
    data: () => ({
      infoList: [],
      listTasks: [],
      usuarioSelecionado: null,
      notificarUser: true,
      aprovarProject: false,
      dataProrrogada: null,
      listVerificacao: [],
      itemsAcao: [],
      analistas: [
        { name: 'DIEGO PASSOS RODRIGUES', almope: '4172639' },
        { name: 'UANDERSON DE OLIVEIRA DOS SANTOS', almope: '4602597' },
        { name: 'CARLOS EDUARDO SILVA SANTOS', almope: '4637725' }
      ],
      selecaoDirecionar: false,
      list: 0,
      valueDeterminate: 66,
      acaoSelecionada: null,
      textItem: null,
      loadInicializeProject: false,
      idAtual: null,
      selecaoDirecionarNoAprovar: false,
      iconsPrioridade: {
        ALTA: 'fire',
        NORMAL: 'hourglass-half',
        BAIXA: 'snowflake'
      },
      corPrioridade: {
        ALTA: '#ff0000',
        NORMAL: '#90A4AE',
        BAIXA: '#039BE5'
      },
      createdList: false,
      formListCriacao: {
        titulo: null,
        idTarefa: 1,
        tarefa: null
      }
    }),
    mixins: [acoes, alerts],
    computed: {},
    methods: {
      alterNotification(event) {
        this.$router.push({
          name: 'TratativaProjectManager',
          query: {
            notificationUser: event
          }
        })
      },
      prorrogarPrazoSolicitacao() {
        if (!this.dataProrrogada) return
        this.moment.locale('pt-br')
        let now = this.moment().format('YYYY-MM-DD HH:mm')
        let dateF = this.moment(this.dataProrrogada.split('T').join(' '))

        let urlData = `${config.baseUrl}api/shared/project_manager/gestao/prorrogar_prazo`

        if (dateF.diff(now, 'seconds') > 86399) {
          let diasDiff = Math.round(dateF.diff(now, 'seconds') / 86400)
          this.$api
            .post(urlData, {
              TIPO_SLA_ATRIBUIDA: 'DIAS',
              SLA_ATRIBUIDA: diasDiff,
              NUM_SOLICITACAO: this.$route.params.id
            })
            .then(() =>
              this.toast('Prazo prorrogado com sucesso!', 'bottom-right', false, 2000, 'success')
            )
          this.dataProrrogada = null
          this.$emit('updated:load-demanda')
        } else {
          let horasDiff = dateF.diff(now, 'seconds')
          this.$api
            .post(urlData, {
              TIPO_SLA_ATRIBUIDA: 'HORAS',
              SLA_ATRIBUIDA: horasDiff,
              NUM_SOLICITACAO: this.$route.params.id
            })
            .then(() =>
              this.toast('Prazo prorrogado com sucesso!', 'bottom-right', false, 2000, 'success')
            )
          this.dataProrrogada = null
          this.$emit('updated:load-demanda')
        }
      },
      async direcionarDemanda() {
        if (!this.usuarioSelecionado) return
        let data = {
          DESIGNADO_PARA: this.usuarioSelecionado,
          NUM_SOLICITACAO: this.$route.params.id
        }
        let urlData = `${config.baseUrl}api/shared/project_manager/demanda/atribuir_demanda`
        await this.$api.post(urlData, data)
        this.toast('Demanda direcionada com sucesso!', 'bottom-right', false, 2000, 'success')
        this.usuarioSelecionado = null
        this.selecaoDirecionar = false
        this.$emit('updated:load-demanda')
      },
      async atribuirDemanda() {
        let data = {
          APROVADO_POR: this.$store.getters.usuario.almope,
          DESIGNADO_PARA: this.usuarioSelecionado,
          NUM_SOLICITACAO: this.$route.params.id,
          STATUS_SOLICITACAO: 3 //EM EXECUÇÃO
        }
        let urlData = `${config.baseUrl}api/shared/project_manager/demanda/atribuir_demanda`
        await this.$api.post(urlData, data)
        let isNotification = this.$route.query.notificationUser
        await this.cadastrarNotificacao(
          {
            TIPO_NOTIFICACAO: 3,
            NUM_SOLIC_HASH: this.dadosTratativa.NUM_SOLIC_HASH
          },
          isNotification
        )
        await this.atualizarUltimasInformacoes({
          NUM_SOLIC_HASH: this.dadosTratativa.NUM_SOLIC_HASH,
          TIPO_NOTIFICACAO: 3
        })
        this.toast('Demanda atribuida com sucesso!', 'bottom-right', false, 2000, 'success')
        this.usuarioSelecionado = null
        this.selecaoDirecionarNoAprovar = false
        this.$emit('updated:load-demanda')
      },
      async inicializeProject(idStatus) {
        this.loadInicializeProject = true
        let data = {
          NUM_SOLICITACAO: this.$route.params.id,
          STATUS_SOLICITACAO: idStatus
        }
        let urlData = `${config.baseUrl}api/shared/project_manager/demanda/alter_status`
        await this.$api.post(urlData, data)
        this.toast('O status do projeto mudou!', 'bottom-right', false, 2000, 'success')
        let isNotification = this.$route.query.notificationUser
        this.cadastrarNotificacao(
          {
            NUM_SOLIC_HASH: this.dadosTratativa.NUM_SOLIC_HASH,
            TIPO_NOTIFICACAO: idStatus
          },
          isNotification
        )
        await this.atualizarUltimasInformacoes({
          NUM_SOLIC_HASH: this.dadosTratativa.NUM_SOLIC_HASH,
          TIPO_NOTIFICACAO: idStatus
        })
        this.loadInicializeProject = false
        this.$emit('updated:load-demanda')
      },
      async executarAcoes() {
        let data = {
          NUM_SOLIC_HASH: this.dadosTratativa.NUM_SOLIC_HASH,
          TIPO_NOTIFICACAO: this.acaoSelecionada
        }
        let isNotification = this.$route.query.notificationUser
        await this.cadastrarNotificacao(data, isNotification)
      },
      async alterarStatusDemanda() {
        let data = {
          NUM_SOLICITACAO: this.$route.params.id,
          STATUS_SOLICITACAO: this.acaoSelecionada
        }
        let urlData = `${config.baseUrl}api/shared/project_manager/demanda/alter_status`
        await this.$api.post(urlData, data)
        this.$emit('updated:load-demanda')
        this.toast('Status alterado com sucesso!', 'bottom-right', false, 2000, 'success')
        let isNotification = this.$route.query.notificationUser
        await this.cadastrarNotificacao(
          {
            NUM_SOLIC_HASH: this.dadosTratativa.NUM_SOLIC_HASH,
            TIPO_NOTIFICACAO: this.acaoSelecionada
          },
          isNotification
        )
        await this.atualizarUltimasInformacoes({
          NUM_SOLIC_HASH: this.dadosTratativa.NUM_SOLIC_HASH,
          TIPO_NOTIFICACAO: this.acaoSelecionada
        })
        this.acaoSelecionada = null
      },
      retirarS(string) {
        if (!string) return
        let s = string[string.length - 1]
        if (s == 'S') return string.slice(0, string.length - 1)
        else return string
      },
      async loadListAcao() {
        // let statusAtual = this.dadosTratativa.NOME_STATUS;

        let urlData = `${config.baseUrl}api/shared/project_manager/gestao/status/`
        var res = await this.$api.get(urlData)
        let data = res?.data
        this.itemsAcao = data
        // let idResult = data.find(
        //   (item) => item.STATUS_SOLICITACAO == statusAtual
        // );
        // this.idAtual = idResult;

        // let resultFilter = data
        //   .filter((result) => {
        //     return result?.ID * 1 > idResult?.ID * 1;
        //   })
        //   .map((item) => {
        //     return {
        //       COLOR: item.COLOR,
        //       STATUS_SOLICITACAO: this.retirarS(item.STATUS_SOLICITACAO),
        //       ID: item?.ID,
        //     };
        //   })
        //   .filter((remove) => {
        //     return remove.STATUS_SOLICITACAO != "ATRASADO";
        //   });

        // this.itemsAcao =
        //   statusAtual == "ABERTOS" || statusAtual == "ATRASADOS"
        //     ? res.data
        //     : resultFilter;
        // if (resultFilter == "") {
        //   return res.data;
        // }
      },
      async reload() {
        await this.loadListVerificacao()
      },
      clearForm() {
        let newForm = Object.assign({}, this.formListCriacao)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.formListCriacao = newForm
      },
      async submit() {
        try {
          let isValid = await this.$refs.observer.validate()
          if (isValid) {
            this.formListCriacao.numSolicitacao = this.$route.params.id
            this.formListCriacao.idList = this.listVerificacao.length + 1
            this.formListCriacao.checkItem = 0
            this.formListCriacao.usuarioCriacao = this.$store.getters.usuario.almope
            let urlData = `${config.baseUrl}api/shared/project_manager/gestao/created_list`
            await this.$api.post(urlData, this.formListCriacao)
            this.clearForm()
            this.loadListVerificacao()
            this.createdList = false
          }
        } catch (error) {
          console.error(error)
        }
      },
      addCreatedListTask() {
        this.formListCriacao.lista.push({
          tarefa: null
        })
      },
      colorStatus(string) {
        if (!string) return
        if (string == 'ABERTOS') {
          return 'grey'
        }

        let i = this.status
          .filter(item => {
            return item.STATUS_SOLICITACAO == string
          })
          .map(itemFilter => {
            return { COLOR: itemFilter.COLOR }
          })

        return i[0].COLOR
      },
      async loadListVerificacao() {
        let urlData = `${config.baseUrl}api/shared/project_manager/gestao/list_verificacao/${this.$route.params.id}`
        var res = await this.$api.get(urlData)
        this.listVerificacao = res.data
      },
      deleteTasks(event) {
        const { ID_LISTA, ID } = event

        const lista = this.listVerificacao.find(list => list.ID_LIST === ID_LISTA)

        if (lista) {
          lista.ITEMS_LIST = lista.ITEMS_LIST.filter(task => task.ID != ID)
        }
      },
      async addTask() {
        // const { ID_LISTA } = event;

        // const lista = this.listVerificacao.find((list) => list.ID_LIST === ID_LISTA);
        // lista.ITEMS_LIST.unshift(event);
        await this.loadListVerificacao()
      }
    },
    created() {
      this.loadListVerificacao()
      setTimeout(() => {
        this.loadListAcao()
      }, 1000)
    }
  }
</script>

<style scoped>
  /* FASES */
  .fase-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
  }

  .fase-body {
    margin-top: 24px;
  }

  .field-body {
    margin-bottom: 10px;
  }

  .status-fase {
  }

  .status-fase-title {
    margin-bottom: 15px;
  }

  .actions {
    gap: 10px;
  }

  .lista-verificacao {
    margin-top: 15px;
  }

  .no-box-shadow ::v-deep .v-expansion-panel__container {
    box-shadow: none !important;
  }

  .add-task {
    margin-top: 10px;
  }

  .tarefa {
    display: flex;
    align-items: center;
  }

  .label-checked {
    text-decoration: line-through;
    font-style: italic;
    color: #5555;
  }

  .tasks-checklist-item-add-btn {
    /* color: #80868e;
  font-size: 14px;
  text-decoration: none;
  border-bottom: 1px dashed;
  position: relative;
  margin-left: 12px;
  top: 10px;
  cursor: pointer;
  transition: 170ms linear all; */
  }

  .label {
    font-size: 15px;
  }
  .checkbox-round input[type='checkbox'] {
    border-radius: 50%;
  }

  .add-list-verificacao {
    margin: 15px 0;
  }

  .add-list-verificacao a {
    text-decoration: none;
    border-bottom: 1px dashed;
    color: #333;
  }
</style>
