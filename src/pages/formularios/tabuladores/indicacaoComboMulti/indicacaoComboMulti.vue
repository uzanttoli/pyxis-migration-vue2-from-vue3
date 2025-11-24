<template>
  <v-card>
    <img style="" src="@/assets/img/core/novoIndicacaoComboMulti.png" alt="" />
    <title-negative-margin
      title="Indicação Combo Multi"
      className="rounded-r-xl"
    ></title-negative-margin>
    <v-col class="pt-0">
      <v-row>
        <v-col v-for="(item, i) in dadosResumoTratativa" :key="i">
          <CardIndicacao :title="item.title" :valor="item.valor" />
        </v-col>
      </v-row>
    </v-col>
    <v-divider></v-divider>
    <v-col class="mt-3">
      <validation-observer v-slot="{ invalid, validate }" ref="observer">
        <form @submit.prevent="validate().then(submit)">
          <v-row>
            <v-col cols="8" class="py-0">
              <validation-provider v-slot="{ errors }" name="nome cliente" rules="required">
                <v-text-field
                  dense
                  outlined
                  placeholder="Nome cliente"
                  label="Nome Cliente"
                  :error-messages="errors"
                  v-model="formIndicacao.nomeCliente"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4" class="py-0">
              <validation-provider v-slot="{ errors }" name="CPF" rules="required">
                <v-text-field
                  dense
                  outlined
                  placeholder="CPF"
                  label="CPF"
                  v-model="formIndicacao.cpf"
                  v-mask="masks.cpf"
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4" class="py-0">
              <validation-provider v-slot="{ errors }" name="cidade" rules="required">
                <v-autocomplete
                  dense
                  outlined
                  placeholder="Cidade"
                  label="Cidade"
                  v-model="formIndicacao.cidade"
                  :error-messages="errors"
                  :items="listCidades"
                  item-text="NOME_CIDADE"
                  no-data-text="Cidade não encontrada!"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="4" class="py-0">
              <validation-provider v-slot="{ errors }" name="ssid - telefone" rules="required">
                <v-text-field
                  dense
                  outlined
                  placeholder="SSID - Telefone contato"
                  label="SSID - Telefone contato"
                  v-model="formIndicacao.telefoneContato"
                  v-mask="masks.phone"
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <!-- validacao de produto -->
            <v-col
              cols="4"
              class="py-0"
              v-if="usuario.produto == 'CLARO' || usuario.filtro == 'ADMINISTRADOR'"
            >
              <!--criar component-->
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
                  <div style="margin-top: -10px; z-index: 1; width: 100%">
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
            <v-col cols="12" class="py-0">
              <validation-provider v-slot="{ errors }" name="ssid - telefone" rules="">
                <v-textarea
                  dense
                  outlined
                  placeholder="Observação"
                  label="Observação"
                  v-model="formIndicacao.observacao"
                  :error-messages="errors"
                ></v-textarea>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row justify="end" class="ma-0 pa-0 mt-2">
            <v-btn
              color="success"
              class="rounded-bl-xl rounded-r-xl mr-2"
              :disabled="invalid"
              type="submit"
            >
              Salvar
            </v-btn>
            <v-btn color="error" class="rounded-bl-xl rounded-r-xl" @click="limparDadosForm()">
              Limpar
            </v-btn>
          </v-row>
        </form>
      </validation-observer>
    </v-col>
  </v-card>
</template>

<script>
  import { IndicacaoMultiReservaService } from '@/data/services/tabuladores/index'
  import { ValidationProvider, ValidationObserver } from 'vee-validate'
  import alerts from '../../../../mixins/alerts.mixins'
  import Utils from '@/data/services/common/Utils'
  import CardIndicacao from './cardIndicacao.vue'
  import masks from '@/shared/masks/masks'
  import config from '@/core/config'
  export default {
    components: { ValidationObserver, ValidationProvider, CardIndicacao },
    data: () => ({
      formIndicacao: {
        nomeCliente: null,
        cpf: null,
        cidade: null,
        telefoneContato: null,
        observacao: null,
        horarioContato: null
      },
      dadosResumoTratativa: [],
      listCidades: [],
      date: null,
      menu: false,
      time: null
    }),
    mixins: [alerts],
    computed: {
      masks() {
        return masks
      },
      computedDateFormatted() {
        return this.formatDate(this.date)
      },
      dateNow() {
        this.moment.locale('pt-br')
        return this.moment().format('YYYY-MM-DD hh:mm:ss')
      },
      usuario() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      async loadDados() {
        const result = await IndicacaoMultiReservaService.getResumoTratativaTabulacao(
          this.usuario.almope
        )
        this.dadosResumoTratativa = Utils.normalizeObj(result)
      },
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
        this.formIndicacao.horarioContato = this.computedDateFormatted
        this.formIndicacao.almopeUsuario = this.usuario.almope
        this.formIndicacao.origemMailing = this.usuario.produto
        const urlData = `${config.baseUrl}api/shared/formularios/indicacao_multi_reserva/adicionar`
        await this.$api.post(urlData, this.formIndicacao)
        this.limparDadosForm()
        this.toast('Indicação realizada com sucesso!', 'bottom-right', false, 3500, 'success')
      },
      loadCidades() {
        let urlData = `${config.baseUrl}api/shared/utils/geral/cidades`
        this.$api.get(urlData).then(res => {
          this.listCidades = res.data
        })
      },
      limparDadosForm() {
        const novoFormulario = Object.assign({}, this.formIndicacao)
        Object.keys(novoFormulario).forEach(key => {
          novoFormulario[key] = null
        })
        this.$refs.observer.reset()
        this.formIndicacao = novoFormulario
      }
    },
    created() {
      this.loadCidades()
      this.loadDados()
    },
    watch: {}
  }
</script>

<style scoped>
  p {
    font-family: 'Poppins', sans-serif;
    text-align: center;
  }
</style>
