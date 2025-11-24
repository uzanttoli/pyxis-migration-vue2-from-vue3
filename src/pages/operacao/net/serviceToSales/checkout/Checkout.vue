<template>
  <v-container>
    <v-col class="mt-3">
      <v-card class="mt-3 rounded-xl">
        <v-col>
          <div
            class="py-2 btn-toggle"
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-direction: row;
            "
          >
            <div
              class="my-3 mb-6"
              style="display: flex; flex-direction: column; justify-content: center"
            >
              <label for="btn-toggle">Escolha uma fila:</label>
              <v-btn-toggle
                dense
                class="rounded-lg"
                id="btn-toggle"
                mandatory
                v-model="tipoFilaSelecionada"
                @change="loadItemsMotivoMacro()"
                active-class="blue darken-3"
              >
                <v-btn
                  class="text-capitalize"
                  :disabled="dadosTratativa != '' || isLoading"
                  v-for="(item, i) in tipoFila"
                  :key="i"
                  :value="item.VALOR_BTN"
                  :class="item.VALOR_BTN == tipoFilaSelecionada ? 'white--text' : ''"
                  tile
                  depressed
                >
                  <i
                    v-if="item.VALOR_BTN == tipoFilaSelecionada"
                    class="fa-solid fa-circle-check"
                    style="color: greenyellow; margin-right: 5px"
                  ></i>
                  {{ item.NOME_BTN }}
                </v-btn>
                <span v-if="isLoadBtn">Carregando botões...</span>
              </v-btn-toggle>
            </div>
            <div>
              <v-btn icon to="/pyxis/service-to-sales/backoffice/">
                <v-icon>fa-solid fa-xmark</v-icon>
              </v-btn>
            </div>
          </div>
        </v-col>
        <v-divider></v-divider>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            padding: 8px;
          "
          v-if="isLoading"
          class="mb-n4"
        >
          <v-progress-circular
            :value="10"
            indeterminate
            color="cyan accent-4"
          ></v-progress-circular>
          <span style="color: #757575; font-style: italic">
            Carregando dados da tratativa... Após o carregamento você poderá trocar de fila
          </span>
        </div>
        <v-col>
          <FieldSet title="Dados Contato" classCustom="my-0 pa-4">
            <v-row>
              <v-col sm="4" xl="3" v-if="tipoFilaSelecionada == 'BLINDAGEM'">
                <v-text-field
                  outlined
                  dense
                  label="Nome cliente indicação:"
                  :value="dadosTratativa && dadosTratativa.NOME_CLIENTE_INDICACAO"
                  :readonly="true"
                ></v-text-field>
              </v-col>
              <v-col sm="4" xl="3" v-if="tipoFilaSelecionada == 'BLINDAGEM'">
                <v-text-field
                  outlined
                  dense
                  label="CPF indicação:"
                  :value="dadosTratativa && dadosTratativa.CPF_INDICACAO"
                  :readonly="true"
                ></v-text-field>
              </v-col>
              <v-col sm="4" xl="3" v-if="tipoFilaSelecionada == 'BLINDAGEM'">
                <v-text-field
                  outlined
                  dense
                  label="SSID Indicação"
                  :value="dadosTratativa && dadosTratativa.SSID_INDICACAO"
                  :readonly="true"
                ></v-text-field>
              </v-col>
              <v-col sm="4" xl="3" class="mt-n3">
                <v-text-field
                  outlined
                  dense
                  label="Cod. Cidade:"
                  :value="dadosTratativa && dadosTratativa.COD_CIDADE"
                  :readonly="true"
                ></v-text-field>
              </v-col>
              <v-col sm="4" xl="3" class="mt-n3">
                <v-text-field
                  label="Contrato:"
                  outlined
                  dense
                  :value="dadosTratativa && dadosTratativa.NUM_CONTRATO"
                  :readonly="true"
                ></v-text-field>
              </v-col>
              <v-col sm="4" xl="3" class="mt-n3">
                <v-text-field
                  label="Cidade:"
                  outlined
                  dense
                  :value="dadosTratativa && dadosTratativa.DSC_MUNICIPIO_BI"
                  :readonly="true"
                ></v-text-field>
              </v-col>
              <v-col sm="4" xl="3" class="mt-n3">
                <v-text-field
                  label="Nome Cliente:"
                  outlined
                  dense
                  :value="dadosTratativa && dadosTratativa.NOME_CLIENTE"
                  :readonly="true"
                ></v-text-field>
              </v-col>
              <v-col sm="4" xl="3" class="mt-n3">
                <v-text-field
                  label="Vendedor:"
                  outlined
                  dense
                  :value="dadosTratativa && dadosTratativa.VENDEDOR"
                  :readonly="true"
                ></v-text-field>
              </v-col>
              <v-col sm="4" xl="3" class="mt-n3">
                <v-text-field
                  label="Login:"
                  outlined
                  dense
                  :value="dadosTratativa && dadosTratativa.LOGIN_VENDA"
                  :readonly="true"
                ></v-text-field>
              </v-col>
              <v-col sm="4" xl="3" class="mt-n3">
                <v-text-field
                  label="Data Venda/Indicação"
                  outlined
                  dense
                  :value="dadosTratativa && dadosTratativa.DATA_VENDA_BRUTA"
                  :readonly="true"
                ></v-text-field>
              </v-col>
              <v-col sm="4" xl="3" class="mt-n3">
                <v-text-field
                  outlined
                  dense
                  label="Telefone Contato"
                  :value="dadosTratativa && dadosTratativa.TELEFONE_CONTATO"
                  :readonly="true"
                ></v-text-field>
              </v-col>
              <v-col class="mt-n7" cols="12">
                <v-textarea
                  readonly
                  outlined
                  label="Observação do contato"
                  placeholder="Observação do contato"
                  :value="dadosTratativa && dadosTratativa.OBSERVACAO_CHECKOUT"
                  auto-grow
                ></v-textarea>
              </v-col>
            </v-row>
          </FieldSet>
          <FieldSet
            title="Dados Tratativa BKO"
            classCustom="my-0 pa-4 mt-2"
            v-if="tipoFilaSelecionada != 'BLINDAGEM'"
          >
            <v-row>
              <v-col sm="4" xl="3">
                <v-text-field
                  outlined
                  dense
                  label="Tentativa de Contato"
                  :value="dadosTratativa && dadosTratativa.STATUS_CONTATO"
                  :readonly="true"
                ></v-text-field>
              </v-col>
              <v-col sm="4" xl="3">
                <v-text-field
                  outlined
                  dense
                  label="Caso ativo?"
                  :value="dadosTratativa && dadosTratativa.CASO_ATIVO"
                  :readonly="true"
                ></v-text-field>
              </v-col>
              <v-col sm="4" xl="3">
                <v-text-field
                  outlined
                  dense
                  label="Motivo:"
                  :value="dadosTratativa && dadosTratativa.MOTIVO_MACRO"
                  :readonly="true"
                ></v-text-field>
              </v-col>
              <v-col sm="4" xl="3">
                <v-text-field
                  outlined
                  dense
                  label="SubMotivo:"
                  :value="dadosTratativa && dadosTratativa.MOTIVO_MICRO"
                  :readonly="true"
                ></v-text-field>
              </v-col>
              <v-col sm="12" xl="12" class="mt-n7">
                <v-textarea
                  outlined
                  dense
                  label="Descrição:"
                  :value="dadosTratativa && dadosTratativa.OBSERVACAO"
                  :readonly="true"
                ></v-textarea>
              </v-col>
            </v-row>
          </FieldSet>
          <FieldSet title="Tratativa" classCustom="my-0 pa-4 mt-2">
            <div
              class="d-flex justify-center align-center gap-2 mb-4"
              v-if="tipoFilaSelecionada === 'INDICACAO'"
            >
              <v-text-field
                placeholder="Pesquisar ID Mailing"
                outlined
                dense
                v-model.number="pesquisarMailingId"
                hide-details
                type="number"
              ></v-text-field>
              <v-btn
                color="orange"
                :disabled="pesquisarMailingId == null || pesquisarMailingId == ''"
                class="white--text mx-0 rounded-r-xl rounded-bl-xl"
                style="margin-top: -6px; margin-right: -15px"
                @click="carregarNovoCaso('pesquisar')"
              >
                Pesquisar
              </v-btn>
            </div>
            <v-divider v-if="tipoFilaSelecionada === 'INDICACAO'"></v-divider>
            <v-row class="mt-1">
              <v-col>
                <ValidationObserver v-slot="{ invalid, validate }" ref="observer">
                  <form @submit.prevent="validate().then(submit)">
                    <v-row>
                      <v-col cols="3" v-if="tipoFilaSelecionada == 'INDICACAO'">
                        <ValidationProvider
                          v-slot="{ errors }"
                          name="Nome do cliente"
                          rules="required"
                        >
                          <v-text-field
                            outlined
                            dense
                            required
                            :error-messages="errors"
                            label="Nome do cliente"
                            @change="e => nomeClienteUpper(e.toUpperCase())"
                            v-model="form.nomeCliente"
                            :readonly="dadosTratativa == ''"
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="3" v-if="tipoFilaSelecionada == 'INDICACAO'">
                        <ValidationProvider
                          v-slot="{ errors }"
                          name="CPF do cliente"
                          rules="required|min:14"
                        >
                          <v-text-field
                            outlined
                            dense
                            required
                            :error-messages="errors"
                            label="CPF do cliente"
                            placeholder="###.###.###-##"
                            v-mask="[masks.cpf]"
                            v-model="form.cpfCliente"
                            :readonly="dadosTratativa == ''"
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="3" v-if="tipoFilaSelecionada == 'INDICACAO'">
                        <ValidationProvider
                          v-slot="{ errors }"
                          name="SSID do cliente"
                          rules="required|min:14"
                        >
                          <v-text-field
                            outlined
                            dense
                            required
                            :error-messages="errors"
                            label="SSID do cliente"
                            placeholder="(##) #####-####"
                            v-mask="[masks.telefoneBrFixo]"
                            v-model="form.ssid"
                            :readonly="dadosTratativa == ''"
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="3">
                        <ValidationProvider
                          v-slot="{ errors }"
                          name="venda realizada"
                          rules="required"
                        >
                          <v-autocomplete
                            outlined
                            dense
                            required
                            :error-messages="errors"
                            label="Venda Realizada?"
                            :items="['SIM', 'NÃO']"
                            v-model="form.tratativaCorreta"
                            @change="loadItemsMotivoMacro"
                            :readonly="dadosTratativa == ''"
                          ></v-autocomplete>
                        </ValidationProvider>
                      </v-col>
                      <v-col
                        cols="3"
                        v-if="
                          form.tratativaCorreta == 'NÃO' ||
                          (form.tratativaCorreta == 'SIM' && tipoFilaSelecionada == 'BLINDAGEM')
                        "
                      >
                        <ValidationProvider
                          v-slot="{ errors }"
                          name="motivo macro"
                          rules="required"
                        >
                          <v-autocomplete
                            outlined
                            dense
                            required
                            :error-messages="errors"
                            label="Qual Motivo Macro?"
                            :items="listMotivoMacro"
                            item-text="MOTIVO_MACRO"
                            item-value="MOTIVO_MACRO"
                            v-model="form.motivoMacro"
                            @change="loadItemsMotivosMicro"
                            :readonly="dadosTratativa == ''"
                          ></v-autocomplete>
                        </ValidationProvider>
                      </v-col>
                      <v-col
                        cols="3"
                        v-if="
                          (form.tratativaCorreta == 'NÃO' && form.motivoMacro) ||
                          (form.tratativaCorreta == 'SIM' &&
                            tipoFilaSelecionada == 'BLINDAGEM' &&
                            form.motivoMacro)
                        "
                      >
                        <ValidationProvider
                          v-slot="{ errors }"
                          name="motivo micro"
                          rules="required"
                        >
                          <v-autocomplete
                            outlined
                            dense
                            :error-messages="errors"
                            required
                            label="Qual Motivo Micro?"
                            v-model="form.motivoMicro"
                            :items="itemsSubmotivo"
                            item-text="MOTIVO_MICRO"
                            item-value="MOTIVO_MICRO"
                            :readonly="dadosTratativa == ''"
                          ></v-autocomplete>
                        </ValidationProvider>
                      </v-col>
                      <v-col
                        cols="12"
                        class="mt-n5 mb-5"
                        v-if="
                          tipoFilaSelecionada === 'INDICACAO' &&
                          (form.tratativaCorreta == 'SIM' ||
                            form.motivoMicro == 'ATIVO SEM SUCESSO - CLIENTE APTO')
                        "
                      >
                        <div
                          class="d-flex flex-column gap-1 border pa-2"
                          style="border-radius: 4px"
                        >
                          <div>
                            <div style="margin-bottom: 20px">
                              <span style="font-weight: bold">REGISTRAR TODAS AS INFORMAÇÕES:</span>
                              <br />
                            </div>
                            <span>DESCRIÇÃO OFERTA/PLANO:</span>
                            <input-component
                              placeholder="Descrever nome do plano"
                              v-model="nomePlano"
                              :required="true"
                            />
                            <br />
                          </div>
                          <div>
                            <span>MIGRAÇÃO DA LINHA:</span>
                            <input-component
                              placeholder="DDD + Número da linha"
                              v-model="migracaoLinha"
                              v-mask="['(##) #####-####']"
                              :required="true"
                            />
                            <br />
                          </div>
                          <div>
                            <span>VALORES ANTIGOS:</span>
                            TV
                            <input-component
                              placeholder="R$ ###.##"
                              size="5"
                              v-model="valoresPlanos.antigos.tv"
                              :mask="['##.##', '###.##']"
                            />
                            + PA
                            <input-component
                              placeholder="R$ ###.##"
                              size="5"
                              v-model="valoresPlanos.antigos.pontoAdicional"
                              :mask="['##.##', '###.##']"
                            />
                            + A LA CARTE
                            <input-component
                              placeholder="R$ ###.##"
                              size="5"
                              v-model="valoresPlanos.antigos.aLaCarte"
                              :mask="['##.##', '###.##']"
                            />
                            + BL
                            <input-component
                              placeholder="R$ ###.##"
                              size="5"
                              v-model="valoresPlanos.antigos.virtua"
                              :mask="['##.##', '###.##']"
                            />
                            + NETFONE ILIMITADO TOTAL BR
                            <input-component
                              placeholder="R$ ###.##"
                              size="5"
                              v-model="valoresPlanos.antigos.netFone"
                              :mask="['##.##', '###.##']"
                            />
                            + LINHA MÓVEL
                            <input-component
                              placeholder="R$ ###.##"
                              size="5"
                              v-model="valoresPlanos.antigos.linhaMovel"
                              :mask="['##.##', '###.##']"
                            />
                            <br />
                          </div>
                          <div>
                            VALORES INDIVIDUAIS APÓS VENDA: TV
                            <input-component
                              placeholder="R$ ###.##"
                              size="5"
                              v-model="valoresPlanos.posVend.tv"
                              :mask="['##.##', '###.##']"
                            />
                            + PA
                            <input-component
                              placeholder="R$ ###.##"
                              size="5"
                              v-model="valoresPlanos.posVend.pontoAdicional"
                              :mask="['##.##', '###.##']"
                            />
                            + A LA CARTE
                            <input-component
                              placeholder="R$ ###.##"
                              size="5"
                              v-model="valoresPlanos.posVend.aLaCarte"
                              :mask="['##.##', '###.##']"
                            />
                            + BL
                            <input-component
                              placeholder="R$ ###.##"
                              size="5"
                              v-model="valoresPlanos.posVend.virtua"
                              :mask="['##.##', '###.##']"
                            />
                            + NETFONE ILIMITADO TOTAL BR
                            <input-component
                              placeholder="R$ ###.##"
                              size="5"
                              v-model="valoresPlanos.posVend.netFone"
                              :mask="['##.##', '###.##']"
                            />
                            + LINHA MÓVEL
                            <input-component
                              placeholder="R$ ###.##"
                              size="5"
                              v-model="valoresPlanos.posVend.linhaMovel"
                              :mask="['##.##', '###.##']"
                            />
                          </div>
                          <div>
                            VALOR TOTAL ANTIGO:
                            <input-component
                              placeholder="R$ ###.##"
                              size="5"
                              :readonly="true"
                              v-model="calcValorPlanoTotal.valorFinalAntigo"
                            />
                            VALOR TOTAL PÓS VENDA:
                            <input-component
                              placeholder="R$ ###.##"
                              size="5"
                              :readonly="true"
                              v-model="calcValorPlanoTotal.valorFinalPosVenda"
                            />
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="12" class="mt-n1">
                        <v-row>
                          <v-col>
                            <ValidationProvider
                              v-slot="{ errors }"
                              name="observação"
                              rules="required"
                            >
                              <v-textarea
                                outlined
                                dense
                                :error-messages="errors"
                                required
                                label="Observação"
                                v-model="form.observacao"
                                :readonly="dadosTratativa == ''"
                              ></v-textarea>
                            </ValidationProvider>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col class="mt-n7">
                        <div style="display: flex; justify-content: end">
                          <v-btn
                            color="blue"
                            class="rounded-bl-xl rounded-r-xl mr-2 white--text"
                            @click="carregarNovoCaso"
                          >
                            Novo caso
                          </v-btn>
                          <v-btn
                            v-if="
                              ((form.motivoMacro == 'CLIENTE PEDIU PRA LIGAR DEPOIS' ||
                                form.motivoMacro == 'TENTATIVA DE CONTATO SEM SUCESSO') &&
                                (form.motivoMicro == 'CLIENTE PEDIU PRA LIGAR DEPOIS' ||
                                  form.motivoMicro == 'TENTATIVA DE CONTATO SEM SUCESSO')) ||
                              (form.tratativaCorreta == 'SIM' &&
                                tipoFilaSelecionada == 'BLINDAGEM' &&
                                form.motivoMicro == 'TENTATIVA DE CONTATO SEM SUCESSO' &&
                                dadosTratativa != '')
                            "
                            color="orange"
                            class="rounded-bl-xl rounded-r-xl mr-2 white--text"
                            @click="abrirSheetFooterAgendar = true"
                          >
                            Agendar
                          </v-btn>
                          <v-btn
                            type="submit"
                            color="success"
                            class="rounded-bl-xl rounded-r-xl mr-2"
                            :disabled="invalid"
                          >
                            Salvar
                          </v-btn>
                          <v-btn
                            color="error"
                            class="rounded-bl-xl rounded-r-xl"
                            @click="limparDadosForm"
                          >
                            Limpar
                          </v-btn>
                        </div>
                      </v-col>
                    </v-row>
                  </form>
                </ValidationObserver>
              </v-col>
            </v-row>
          </FieldSet>
        </v-col>
      </v-card>
    </v-col>
    <RightSideBarTratativa />
    <AgendamentoComponent
      :abrirSheetFooterAgendar="abrirSheetFooterAgendar"
      @updated-close="abrirSheetFooterAgendar = !abrirSheetFooterAgendar"
      @updated:salvar="agendamentoCaso"
    ></AgendamentoComponent>
  </v-container>
</template>

<script>
  import AgendamentoComponent from '../../../../../shared/components/bottomSheet/agendamento.component.vue'
  import RightSideBarTratativa from '@/pages/backoffice/RightSideBarTratativa.vue'
  import FieldSet from '@/shared/components/Fieldset/Fieldset.vue'
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import masks from '../../../../../shared/masks/masks'
  import alerts from '@/mixins/alerts.mixins'
  import config from '@/core/config'
  import Vue from 'vue'

  Vue.component('input-component', {
    props: {
      placeholder: {
        type: String,
        default: 'R$'
      },
      value: {
        type: [String, Number],
        default: ''
      },
      size: {
        type: [Number, String]
      },
      mask: {
        type: [String, Array]
      },
      required: { type: Boolean, default: false },
      readonly: { type: Boolean, default: false }
    },
    template: `<input v-if="mask" v-mask="mask" type="text" style="border: 1px solid #c4c4c4; border-radius: 4px; outline: none; padding: 0px 4px" :placeholder="placeholder || 'R$'" 
              :required="required" :size="size" @input="updateValue" :value="value" :readonly="readonly"/>
             <input v-else type="text" style="border: 1px solid #c4c4c4; border-radius: 4px; outline: none; padding: 0px 4px" :placeholder="placeholder || 'R$'" :required="required" 
              size="size" @input="updateValue" :value="value" :readonly="readonly"/>
    `,
    computed: {},
    methods: {
      updateValue(event) {
        this.$emit('input', event.target.value)
      }
    }
  })

  export default {
    components: {
      // loadhastag,
      FieldSet,
      ValidationObserver,
      ValidationProvider,
      AgendamentoComponent,
      RightSideBarTratativa
    },
    mixins: [alerts],
    data: () => ({
      items: [],
      tipoFila: [],
      listDadosInfo: [],
      dadosTratativa: [],
      itemsSubmotivo: [],
      listMotivoMacro: [],
      nomePlano: null,
      migracaoLinha: null,
      form: {
        tratativaCorreta: null,
        motivoMacro: null,
        motivoMicro: null,
        observacao: '',
        horarioContato: null,
        nomeCliente: null,
        cpfCliente: null,
        ssid: null
      },
      valoresPlanos: {
        antigos: {
          tv: null,
          pontoAdicional: null,
          aLaCarte: null,
          virtua: null,
          netFone: null,
          linhaMovel: null
        },
        posVend: {
          tv: null,
          pontoAdicional: null,
          aLaCarte: null,
          virtua: null,
          netFone: null,
          linhaMovel: null
        }
      },
      pesquisarMailingId: null,
      tipoFilaSelecionada: null,
      fileArquive: null,
      nameFileArquive: null,
      isLoadBtn: false,
      abrirSheetFooterAgendar: false,
      isLoading: false,
      openSheet: false,
      isLoad: false
    }),
    computed: {
      masks() {
        return masks
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      filtro() {
        return this.$store.getters.usuario.filtro
      },
      perfil() {
        return this.$store.getters.usuario.filtro
      },
      textObservacao() {
        return `DESCRIÇÃO OFERTA/PLANO: [###### ${this.nomePlano} #####]
MIGRAÇÃO DA LINHA: [## ${this.migracaoLinha} ##]
VALORES ANTIGOS: TV [R$ ${this.valoresPlanos.antigos.tv || 0}]+ PA [R$ ${
          this.valoresPlanos.antigos.pontoAdicional || 0
        }] +A LA CARTE [R$ ${this.valoresPlanos.antigos.aLaCarte || 0}] + BL [R$ ${
          this.valoresPlanos.antigos.virtua || 0
        }] + NETFONE ILIMITADO TOTAL BR [R$ ${
          this.valoresPlanos.antigos.netFone || 0
        }] + LINHA MÓVEL MOVÉL [R$ ${this.valoresPlanos.antigos.linhaMovel || 0}]
VALORES INDIVIDUAIS APÓS VENDA: TV [R$ ${this.valoresPlanos.posVend.tv || 0}]+ PA [R$ ${
          this.valoresPlanos.posVend.pontoAdicional || 0
        }] +A LA CARTE [R$ ${this.valoresPlanos.posVend.aLaCarte || 0}] + BL [R$ ${
          this.valoresPlanos.posVend.virtua || 0
        }] + NETFONE ILIMITADO TOTAL BR [R$ ${
          this.valoresPlanos.posVend.netFone || 0
        }] + LINHA MÓVEL MOVÉL [R$ ${this.valoresPlanos.posVend.linhaMovel || 0}]
[### Observacao ####]
ATIVO REALIZADO COM SUCESSO
${this.form.observacao}
`
      },
      calcValorPlanoTotal() {
        let valores = this.valoresPlanos
        let arr = ['tv', 'pontoAdicional', 'aLaCarte', 'virtua', 'netFone', 'linhaMovel']
        let arrValores = {
          antigo: [],
          posVenda: []
        }
        for (let i = 0; i <= arr.length; i++) {
          let valoresAntigos = valores.antigos[arr[i]]
          let valoresPosVenda = valores.posVend[arr[i]]
          if (valoresAntigos) {
            arrValores.antigo.push(Number(valoresAntigos))
          }
          if (valoresPosVenda) {
            arrValores.posVenda.push(Number(valoresPosVenda))
          }
        }
        let valorFinalAntigo = arrValores?.antigo?.reduce((acc, val) => acc + val, 0)
        let valorFinalPosVenda = arrValores?.posVenda?.reduce((acc, val) => acc + val, 0)

        return {
          valorFinalAntigo: valorFinalAntigo.toFixed(2),
          valorFinalPosVenda: valorFinalPosVenda.toFixed(2)
        }
      }
    },
    methods: {
      nomeClienteUpper(e) {
        this.form.nomeCliente = e
      },
      loadItemsMotivoMacro() {
        let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/motivos_checkout`
        this.$api
          .get(urlData, {
            params: {
              fila: this.tipoFilaSelecionada,
              vendaRealizada: this.form.tratativaCorreta
            }
          })
          .then(res => {
            this.listMotivoMacro = res.data
          })
      },
      loadItemsMotivosMicro() {
        let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/submotivos_checkout`
        this.$api
          .get(urlData, {
            params: {
              motivoMacro: this.form.motivoMacro
            }
          })
          .then(res => {
            this.itemsSubmotivo = res.data
          })
      },
      loadDadosControleBtn() {
        this.isLoadBtn = true
        let urlData = `${config.baseUrl}api/shared/service_to_sales/validacao_venda/listar_btn_disponivel/${this.perfil}/${this.usuarioAlmope}`
        this.$api.get(urlData).then(res => {
          this.tipoFila = res.data
          this.tipoFilaSelecionada = res.data[0]?.VALOR_BTN
          this.isLoadBtn = false
        })
      },
      agendamentoCaso(dataAgendamento) {
        this.form.horarioContato = dataAgendamento
        this.submit(2)
      },
      async submit(status = 3) {
        this.form.numCaso = this.dadosTratativa.NUM_CASO
        this.form.tipoFila = this.tipoFilaSelecionada
        this.form.statusTratamento = status // 2=agendamento, 3=finalizado;
        this.form.valorPlanoAntigo = this.calcValorPlanoTotal.valorFinalAntigo
        this.form.valorPlanoPosVenda = this.calcValorPlanoTotal.valorFinalPosVenda

        this.form.observacao =
          this.tipoFilaSelecionada === 'INDICACAO' &&
          (this.form.tratativaCorreta == 'SIM' ||
            this.form.motivoMicro == 'ATIVO SEM SUCESSO - CLIENTE APTO')
            ? this.textObservacao
            : this.form.observacao

        let urlDataSend = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/salvar_tratativa`
        await this.$api.post(urlDataSend, this.form)
        this.toast('Checkout salvo com sucesso!', 'top-right', false, 3000, 'success')
        this.limparDadosForm()
        this.dadosTratativa = ''
      },
      async carregarNovoCaso(tipo = 'normal') {
        try {
          if (tipo === 'pesquisar' && this.dadosTratativa.NUM_CASO) {
            this.toast(
              'Para pesquisar novo caso, finalize o caso em tratamento primeiro!',
              'top-right',
              false,
              3000,
              'warning'
            )
            return
          }
          this.isLoad = true
          let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/novo_caso_mailing/`
          const res = await this.$api.get(urlData, {
            params: {
              almope: this.usuarioAlmope,
              perfil: this.filtro,
              fila: this.tipoFilaSelecionada,
              numCaso: this.pesquisarMailingId
              // ${this.usuarioAlmope}/${this.filtro}/${this.tipoFilaSelecionada}
            }
          })
          if (res.data.cod === '404') {
            this.toast(res.data.msg, 'top-right', false, 3000, res.data.status)
          } else {
            this.dadosTratativa = res?.data[0]
            this.loadDadosMotivo()
          }
        } catch (error) {
          this.isLoad = false
        }
      },
      limparDadosForm() {
        const novoFormulario = Object.assign({}, this.form)
        Object.keys(novoFormulario).forEach(key => {
          novoFormulario[key] = null
        })
        this.form = novoFormulario
        this.$refs.observer.reset()
      }
    },
    watch: {
      'form.tratativaCorreta': function (newVal, oldVal) {
        if (oldVal != newVal) {
          this.form.motivoMacro = null
          this.form.motivoMicro = null
          this.form.observacao = null
        }
      },
      'form.motivoMacro': function (newVal, oldVal) {
        if (oldVal != newVal) {
          this.form.motivoMicro = null
          this.form.observacao = null
          this.form.horarioContato = null
        }
      },
      'form.motivoMicro': function (newVal, oldVal) {
        if (oldVal != newVal) {
          this.form.observacao = null
          this.form.horarioContato = null
        }
      },
      tipoFilaSelecionada() {
        this.toast(
          `Você mudou a fila para: ${this.tipoFilaSelecionada}. <br> As tratativas serão consideradas para a fila selecionada!`,
          'top-right',
          false,
          3500,
          'success'
        )
      }
    },
    created() {
      this.loadDadosControleBtn()
    }
  }
</script>

<style scoped>
  label {
    font-size: 12px;
  }
  .btn-toggle {
    display: flex;
    flex-direction: column;
  }

  fieldset {
    padding: 15px;
    border: 1px solid #3333;
    margin-bottom: 15px;
  }
  legend {
    padding: 0 10px;
    font-size: 18px;
  }

  input::placeholder {
    color: #b6b6b6;
    font-style: italic;
  }
</style>
