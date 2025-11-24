<template>
  <v-card>
    <title-negative-margin title="Visita Técnica" className="rounded-r-xl"></title-negative-margin>
    <v-col>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form @submit.prevent="submit">
          <v-row>
            <v-col class="my-0 py-0" cols="3">
              <validation-provider
                v-slot="{ errors }"
                name="contrato"
                rules="required|min:14|max:14"
              >
                <v-text-field
                  outlined
                  required
                  dense
                  :error-messages="errors"
                  placeholder="Contrato"
                  v-model="formVisita.CONTRATO"
                  v-mask="[masks.contratoComCodCidade]"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="my-0 py-0" cols="3">
              <validation-provider
                v-slot="{ errors }"
                name="nome do cliente"
                rules="required|alpha_spaces"
              >
                <v-text-field
                  placeholder="Nome do Cliente"
                  outlined
                  dense
                  required
                  :error-messages="errors"
                  v-model="formVisita.NOME_CLIENTE"
                ></v-text-field>
              </validation-provider>
            </v-col>

            <!-- <div
            class="mx-2 mt-2"
            style="display: flex; gap: 10px; flex-wrap: wrap"
          > -->
            <v-col class="my-0 py-0" cols="3">
              <validation-provider
                v-slot="{ errors }"
                rules="required"
                name="agendamento foi concluido"
              >
                <v-select
                  outlined
                  dense
                  placeholder="Agendamento foi concluído?"
                  :items="simNao"
                  v-model="formVisita.AGENDAMENTO_CONCLUIDO"
                  :error-messages="errors"
                  required
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col class="my-0 py-0" cols="3" v-if="formVisita.AGENDAMENTO_CONCLUIDO == 'SIM'">
              <validation-provider v-slot="{ errors }" name="qual produto" rules="required">
                <v-select
                  outlined
                  dense
                  :error-messages="errors"
                  required
                  :items="produtos"
                  v-model="formVisita.PRODUTO"
                  placeholder="Qual produto?"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col class="my-0 py-0" cols="3" v-if="formVisita.AGENDAMENTO_CONCLUIDO == 'SIM'">
              <validation-provider
                v-slot="{ errors }"
                name="status do equipamento"
                rules="required"
              >
                <v-select
                  dense
                  outlined
                  :error-messages="errors"
                  required
                  :items="statusEquipamento"
                  v-model="formVisita.STATUS_EQUIPAMENTO"
                  placeholder="Qual status do equipamento?"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col class="my-0 py-0" cols="3" v-if="formVisita.AGENDAMENTO_CONCLUIDO == 'SIM'">
              <validation-provider
                v-slot="{ errors }"
                name="falha informada pelo cliente"
                rules="required"
              >
                <v-select
                  dense
                  outlined
                  required
                  :items="falhaInformada"
                  item-text="NOME_SUP_OPCAO2"
                  item-value="NOME_SUP_OPCAO2"
                  :error-messages="errors"
                  v-model="formVisita.FALHA_EQUIPAMENTO"
                  placeholder="Falha informada pelo cliente?"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col class="my-0 py-0" cols="3" v-if="formVisita.AGENDAMENTO_CONCLUIDO == 'SIM'">
              <validation-provider
                v-slot="{ errors }"
                name="número para contato"
                rules="required|min:14|max:15"
              >
                <v-text-field
                  dense
                  outlined
                  required
                  :error-messages="errors"
                  v-model="formVisita.MELHOR_TEL_CONTATO"
                  placeholder="Melhor número de contato"
                  v-mask="['(##) ####-####', '(##) #####-####']"
                  label="Melhor número de contato"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="my-0 py-0" v-if="formVisita.AGENDAMENTO_CONCLUIDO == 'SIM'">
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                v-model:return-value="date"
                transition="scale-transition"
                offset-x
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="Melhor horário para retorno"
                  >
                    <v-text-field
                      v-model="computedDateFormatted"
                      outlined
                      dense
                      :error-messages="errors"
                      label="Melhor horário para retorno (ativo)"
                      readonly
                      required
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </validation-provider>
                </template>
                <v-date-picker v-model="date" no-title scrollable locale="pt-br" :min="dateNow">
                  <div style="margin-top: -35px; z-index: 1; width: 100%">
                    <v-divider></v-divider>
                    <div style="display: flex; flex-direction: column; margin: 10px 0">
                      <label for="standard">Horário para contato (Obrigatório)</label>
                      <validation-provider
                        v-slot="{ errors }"
                        rules="required"
                        name="horário para contato"
                      >
                        <div style="display: flex; flex-direction: column">
                          <input
                            :style="
                              errors.length > 0
                                ? 'border: 1px solid red;'
                                : 'border: 1px solid #9d9d9d;'
                            "
                            type="time"
                            class="input-time"
                            id="standard"
                            required
                            v-model="time"
                          />
                          <span style="font-size: 11px; color: red">{{ errors[0] }}</span>
                        </div>
                      </validation-provider>
                    </div>
                    <v-spacer></v-spacer>
                    <div style="display: flex; justify-content: end">
                      <v-btn text color="error" @click="menu = false">Cancelar</v-btn>
                      <v-btn text color="success" @click="$refs.menu.save(date)">OK</v-btn>
                    </div>
                  </div>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="my-0 py-0" cols="3" v-if="formVisita.AGENDAMENTO_CONCLUIDO == 'NAO'">
              <validation-provider v-slot="{ errors }" name="motivo" rules="required">
                <v-select
                  dense
                  outlined
                  required
                  placeholder="Motivo?"
                  :items="motivos"
                  :error-messages="errors"
                  item-text="NOME_SUP_OPCAO1"
                  item-value="NOME_SUP_OPCAO1"
                  v-model="formVisita.MOTIVO"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col
              class="my-0 py-0"
              cols="3"
              v-if="formVisita.MOTIVO == 'LIGAÇÃO CAIU' || formVisita.MOTIVO == 'FALHA SOLAR'"
            >
              <validation-provider v-slot="{ errors }" name="submotivo" rules="required">
                <v-select
                  dense
                  outlined
                  required
                  :items="submotivo"
                  item-text="NOME_SUP_OPCAO2"
                  item-value="NOME_SUP_OPCAO2"
                  placeholder="Submotivo"
                  :error-messages="errors"
                  v-model="formVisita.SUBMOTIVO"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col class="my-0 py-0" cols="3" v-if="formVisita.MOTIVO == 'FALHA SOLAR'">
              <validation-provider
                v-slot="{ errors }"
                name="Descrição do erro"
                rules="required|max:500"
              >
                <v-textarea
                  :error-messages="errors"
                  placeholder="Descrição do erro"
                  outlined
                  required
                  v-model="formVisita.DESCRICAO_FALHA"
                  counter="500"
                ></v-textarea>
              </validation-provider>
            </v-col>
          </v-row>
          <v-col>
            <v-row justify="end">
              <v-btn
                class="rounded-r-xl rounded-bl-xl mr-2"
                depressed
                color="error"
                @click="limparForm"
              >
                Limpar
              </v-btn>
              <v-btn
                type="submit"
                class="rounded-r-xl rounded-bl-xl"
                :disabled="invalid"
                depressed
                color="success"
              >
                Cadastrar
              </v-btn>
            </v-row>
          </v-col>
        </form>
      </validation-observer>
    </v-col>
  </v-card>
</template>

<script>
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import masks from '../../../../shared/masks/masks'
  import config from '../../../../core/config'
  import alerts from '../../../../mixins/alerts.mixins'
  export default {
    components: { ValidationObserver, ValidationProvider },
    data: () => ({
      formVisita: {
        CONTRATO: null,
        NOME_CLIENTE: null,
        PRODUTO: null,
        AGENDAMENTO_CONCLUIDO: null,
        STATUS_EQUIPAMENTO: null,
        FALHA_EQUIPAMENTO: null,
        MOTIVO: null,
        SUBMOTIVO: null,
        DESCRICAO_FALHA: null,
        DATA_AGENDAMENTO: null,
        MELHOR_TEL_CONTATO: null
      },
      teste: false,
      simNao: ['SIM', 'NAO'],
      produtos: ['TV', 'CLAROBOX', 'VIRTUA', 'FONE', 'TODOS OS PRODUTOS'],
      statusEquipamento: ['ONLINE', 'OFFLINE'],
      dadosValidacao: [],
      date: null,
      time: null,
      menu: null
    }),
    mixins: [alerts],
    computed: {
      masks() {
        return masks
      },
      falhaInformada() {
        //Valida se o campo tem o nome de falha informada pelo cliente e qual o produto foi selecionado.
        let items = this.dadosValidacao.filter(item => {
          return (
            item.NOME_CAMPO == 'FALHA INFORMADA PELO CLIENTE?' &&
            item.NOME_SUP_OPCAO1 == this.formVisita.PRODUTO
          )
        })
        return items
      },
      motivos() {
        //Valida se o campo tem o nome de motivo.
        let items = this.dadosValidacao.filter(item => {
          return item.NOME_CAMPO == 'MOTIVO?'
        })
        return items
      },
      submotivo() {
        //Valida se o campo tem o nome de motivo e qual motivo foi selecionado.
        let items = this.dadosValidacao.filter(item => {
          return item.NOME_CAMPO == 'MOTIVO?' && item.NOME_SUP_OPCAO1 == this.formVisita.MOTIVO
        })
        return items
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      dateNow() {
        this.moment.locale('pt-br')
        return this.moment().format('YYYY-MM-DD hh:mm:ss')
      },
      computedDateFormatted() {
        return this.formatDate(this.date)
      }
    },
    methods: {
      formatDate(date) {
        if (!date) return null
        let dateMinutes = new Date()
        let hours = dateMinutes.getHours().toString()
        let hoursF = hours.length == 1 ? '0' + hours : hours

        let minutes = dateMinutes.getMinutes().toString()
        let minutesF = minutes.length == 1 ? '0' + minutes : minutes

        let timeF = `${hoursF}:${minutesF}`

        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year} ${this.time ? this.time : timeF}`
      },
      async submit() {
        try {
          const isValid = await this.$refs.observer.validate()
          if (isValid) {
            this.formVisita.ALMOPE_CADASTRO = this.usuarioAlmope
            this.formVisita.DATA_AGENDAMENTO = this.computedDateFormatted
            let urlData = `${config.baseUrl}api/shared/formularios/visita_tecnica/cadastro`
            await this.$api.post(urlData, this.formVisita)
            this.toast('Cadastro realizado com sucesso!', 'top-right', false, 2000, 'success')
            this.limparForm()
          }
        } catch (error) {
          this.toast('Não foi possível realizar o cadastro!', 'top-right', false, 2000, 'error')
        }
      },
      loadDadosValidacao() {
        let urlData = `${config.baseUrl}api/shared/formularios/visita_tecnica/validacao_campos`
        this.$api.get(urlData).then(res => {
          this.dadosValidacao = res.data
        })
      },
      limparForm() {
        let newForm = Object.assign({}, this.formVisita)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.formVisita = newForm
        this.$refs.observer.reset()
      }
    },
    created() {
      this.loadDadosValidacao()
    },
    watch: {
      'formVisita.MOTIVO': function () {
        if (this.formVisita.MOTIVO == 'FALHA SOLAR') {
          this.swalConfirmation(
            () => {},
            'Atenção!',
            'Informe a falha ao gestor imediato, siga as orientações passada por ele e após a coleta das evidências oferte Site ou App para prosseguir com gendamento técnico.',
            '',
            '',
            '',
            false,
            true,
            'Fechar'
          )
        }
      },
      'formVisita.AGENDAMENTO_CONCLUIDO': function (oldVal, newVal) {
        if (oldVal !== newVal) {
          this.formVisita.STATUS_EQUIPAMENTO = null
          this.formVisita.FALHA_EQUIPAMENTO = null
          this.formVisita.MOTIVO = null
          this.formVisita.PRODUTO = null
          this.formVisita.SUBMOTIVO = null
          this.formVisita.DESCRICAO_FALHA = null
        }
      }
    }
  }
</script>

<style scoped>
  label {
    display: block;
    font-size: 0.8em;
    font-weight: bold;
  }

  .input-time {
    padding: 8px;
    border: 1px solid #9d9d9d;
    border-radius: 4px;
  }

  .input-time {
    font-size: 17px;
    color: #616161;
    cursor: pointer;
    line-height: normal;
  }

  .input-time:focus {
    outline: none;
  }
</style>
