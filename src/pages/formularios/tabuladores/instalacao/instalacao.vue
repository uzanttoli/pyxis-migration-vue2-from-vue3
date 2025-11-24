<template>
  <v-card>
    <title-negative-margin
      title="Cadastro Instalações"
      className="rounded-r-xl"
    ></title-negative-margin>

    <v-col cols="12">
      <v-card-text class="pl-0 mt-n8">
        <div class="mt-2">
          <v-icon color="red">fa-solid fa-heart-pulse</v-icon>
          {{ `Olá ${nome}, tenha um excelente dia de vendas!` }}
        </div>

        <v-divider class="mt-2"></v-divider>
      </v-card-text>
    </v-col>

    <v-col>
      <validation-observer v-slot="{ invalid, validate }" ref="observer">
        <form @submit.prevent="validate().then(submit)">
          <v-row>
            <v-col cols="4" class="py-0">
              <validation-provider v-slot="{ errors }" name="telefone contato" rules="required">
                <v-text-field
                  dense
                  :error-messages="errors"
                  outlined
                  placeholder="Insira um telefone de contato"
                  v-model="formVendaInstalacao.telefone"
                  v-mask="['(##) ####-####', '(##) #####-####']"
                ></v-text-field>
              </validation-provider>
            </v-col>

            <v-col cols="4" class="py-0">
              <validation-provider v-slot="{ errors }" name="nome skill" rules="required">
                <v-autocomplete
                  dense
                  :error-messages="errors"
                  outlined
                  label="Selecione o skill que você está atendendo."
                  placeholder="O skill fica disponivel na tela do nice"
                  item-text="NomeCompetencia"
                  v-model="formVendaInstalacao.SkillSummary"
                  :items="listSummary"
                ></v-autocomplete>
              </validation-provider>
            </v-col>

            <v-col cols="4" class="py-0">
              <validation-provider v-slot="{ errors }" rules="required" name="elegivel">
                <v-select
                  outlined
                  id="elegivel"
                  dense
                  :error-messages="errors"
                  v-model="formVendaInstalacao.clienteElegivel"
                  :items="[
                    { value: 'SIM', description: 'SIM' },
                    { value: 'NÃO', description: 'NÃO' }
                  ]"
                  item-text="description"
                  item-value="value"
                  label="Cliente Elegível?"
                  @change="
                    loadFormOptionsParent(
                      'TABULADOR S2S MOVEL',
                      'MOTIVO',
                      'CLIENTE ELEGIVEL',
                      formVendaInstalacao.clienteElegivel,
                      'motivos'
                    )
                  "
                ></v-select>
              </validation-provider>
            </v-col>

            <v-col cols="4" class="py-0">
              <validation-provider v-slot="{ errors }" name="cidade" required="rules">
                <v-autocomplete
                  dense
                  v-model="formVendaInstalacao.codCidade"
                  :items="listCidades"
                  item-text="NOME_CIDADE"
                  item-value="COD_CIDADE"
                  :error-messages="errors"
                  no-data-text="Não há items"
                  label="Cidade"
                  placeholder="Cidade"
                  outlined
                  @change="filterCodCidade"
                ></v-autocomplete>
              </validation-provider>

              <input type="hidden" name="CodCidade" v-model="formVendaInstalacao.codCidade" />
            </v-col>

            <template v-if="formVendaInstalacao.clienteElegivel == 'SIM'">
              <v-col cols="4" class="py-0">
                <validation-provider v-slot="{ errors }" name="contrato" rules="required">
                  <v-text-field
                    id="contrato"
                    v-mask="'########-#'"
                    v-model="formVendaInstalacao.contrato"
                    outlined
                    dense
                    :error-messages="errors"
                    ref="contrato"
                    label="Contrato"
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </template>

            <v-col cols="4" v-if="formVendaInstalacao.clienteElegivel == 'SIM'" class="py-0">
              <validation-provider v-slot="{ errors }" name="contato" rules="required">
                <v-select
                  id="formaContato"
                  outlined
                  dense
                  :error-messages="errors"
                  v-model="formVendaInstalacao.formaContato"
                  :items="[
                    { value: 'ATIVO', description: 'Ativo' },
                    { value: 'RECEPTIVO', description: 'Receptivo' }
                  ]"
                  item-text="description"
                  item-value="description"
                  label="Forma de Contato?"
                ></v-select>
              </validation-provider>
            </v-col>

            <v-col
              cols="4"
              v-if="
                formVendaInstalacao.clienteElegivel == 'SIM' && formVendaInstalacao.formaContato
              "
              class="py-0"
            >
              <validation-provider v-slot="{ errors }" name="aceitou oferta" rules="required">
                <v-select
                  id="aceitouOferta"
                  outlined
                  dense
                  :error-messages="errors"
                  v-model="formVendaInstalacao.clienteAceitouOferta"
                  :items="simnao"
                  item-text="description"
                  item-value="value"
                  @change="
                    loadFormOptionsParent(
                      'TABULADOR S2S MOVEL',
                      'MOTIVO NÃO ACEITE',
                      'CLIENTE NAO ACEITOU',
                      formVendaInstalacao.clienteAceitouOferta,
                      'motivos'
                    ),
                      loadFormOptions('TABULADOR S2S MOVEL', 'TIPO_PRODUTO', 'tipoFormVenda')
                  "
                  label="Cliente Aceitou Oferta?"
                ></v-select>
              </validation-provider>
            </v-col>

            <v-col
              cols="4"
              v-if="
                formVendaInstalacao.clienteElegivel == 'NÃO' ||
                formVendaInstalacao.clienteAceitouOferta == 'NÃO'
              "
              class="py-0"
            >
              <validation-provider v-slot="{ errors }" name="motivo" rules="required">
                <v-select
                  id="motivo"
                  outlined
                  dense
                  :error-messages="errors"
                  v-model="formVendaInstalacao.motivo"
                  :items="motivos"
                  item-text="VALOR_CAMPO"
                  item-value="VALOR_CAMPO"
                  label="Motivo"
                ></v-select>
              </validation-provider>
            </v-col>

            <template
              v-if="
                formVendaInstalacao.clienteElegivel == 'SIM' &&
                formVendaInstalacao.clienteAceitouOferta == 'SIM'
              "
            >
              <v-col cols="4" class="py-0">
                <validation-provider v-slot="{ errors }" name="tipo produto" rules="required">
                  <v-select
                    outlined
                    dense
                    :error-messages="errors"
                    v-model="formVendaInstalacao.tipoVenda"
                    :items="tipoFormVenda"
                    item-text="VALOR_CAMPO"
                    item-value="VALOR_CAMPO"
                    label="Tipo"
                    @change="
                      loadFormOptionsParent(
                        'TABULADOR S2S MOVEL',
                        'PRODUTOS',
                        'TIPO_PRODUTO',
                        formVendaInstalacao.tipoVenda,
                        'produtoFormVenda'
                      )
                    "
                  ></v-select>
                </validation-provider>
              </v-col>

              <v-col cols="4" class="py-0">
                <validation-provider v-slot="{ errors }" name="produto" rules="required">
                  <v-select
                    outlined
                    :error-messages="errors"
                    dense
                    v-model="formVendaInstalacao.produto"
                    :items="produtoFormVenda"
                    item-text="VALOR_CAMPO"
                    item-value="VALOR_CAMPO"
                    label="Produto"
                    no-data-text="Primeiro selecione o tipo"
                  ></v-select>
                </validation-provider>
              </v-col>

              <v-col cols="4" class="py-0">
                <validation-provider
                  v-slot="{ errors }"
                  name="data instação"
                  rules="required|date_format:dd/MM/yyyy"
                >
                  <v-text-field
                    dense
                    :error-messages="errors"
                    outlined
                    label="Data da Instalação"
                    placeholder="dd/mm/aaaa"
                    v-mask="['##/##/####']"
                    v-model="formVendaInstalacao.dataInstalacao"
                  ></v-text-field>
                </validation-provider>
              </v-col>

              <v-col cols="4" class="py-0">
                <validation-provider
                  v-slot="{ errors }"
                  name="intervalo instalacao"
                  rules="required"
                >
                  <v-select
                    outlined
                    :error-messages="errors"
                    dense
                    v-model="formVendaInstalacao.intervalo"
                    :items="['08:00 - 12:00', '12:00 - 18:00', '18:00 - 20:00']"
                    label="Selecione o intervalo"
                    no-data-text="Nenhum intervalo para exibir"
                  ></v-select>
                </validation-provider>
              </v-col>

              <v-col cols="4" class="py-0">
                <validation-provider
                  v-slot="{ errors }"
                  name="segundo telefone contato"
                  rules="required"
                >
                  <v-text-field
                    dense
                    :error-messages="errors"
                    outlined
                    placeholder="Segundo telefone para contato"
                    v-model="formVendaInstalacao.telefone2"
                    v-mask="['(##) ####-####', '(##) #####-####']"
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </template>

            <v-col>
              <v-row justify="end" class="mb-1 mr-2">
                <v-btn
                  class="rounded-bl-xl rounded-r-xl mr-2"
                  type="submit"
                  color="success"
                  :disabled="invalid"
                  :loading="loadingVenda"
                >
                  <v-icon class="mr-1" small>fa-solid fa-floppy-disk</v-icon>
                  Salvar
                </v-btn>

                <v-btn
                  class="rounded-bl-xl rounded-r-xl"
                  color="error"
                  @click="limparDadosFormulario()"
                >
                  <v-icon class="mr-1" small>fa-solid fa-trash</v-icon>
                  Limpar
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
        </form>
      </validation-observer>
    </v-col>

    <v-dialog v-model="abrirModal" width="470" style="z-index: 7">
      <v-img :src="imgS"></v-img>
    </v-dialog>
  </v-card>
</template>

<script>
  import config from '@/core/config'
  import alerts from '@/mixins/alerts.mixins'
  import img from '@/assets/img/divulgacoes/image_mandamentos.png'
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import FormOptionsService from '@/data/services/formOptions/formOptions'
  import CadastroInstalacoesService from '@/data/services/Movel/CadastroInstalacoes'
  import Utils from '@/data/services/common/Utils'
  export default {
    components: { ValidationObserver, ValidationProvider },
    name: 'instalacao',
    props: {},
    data: () => ({
      valid: false,
      isDev: false,

      loadingVenda: false,
      date: new Date().toISOString().substring(0, 10),
      menu: false,
      idRepeat: false,
      menuDtVenda: false,
      simnao: [
        { value: 'SIM', description: 'SIM' },
        { value: 'NÃO', description: 'NÃO' }
      ],
      motivos: [],
      motivosNaoOfertou: [],
      motivosNaoVendeu: [],
      listaCodChecagem: [],
      listCidades: [],
      listSummary: [],
      tipos: [],
      produtos: [],
      arrProdutos: [],
      formVendaInstalacao: {
        contrato: null,
        telefone: null,
        clienteElegivel: null,
        clienteAceitouOferta: null,
        cidade: null,
        codCidade: null,
        motivo: null,
        tipoVenda: null,
        produto: null,
        dataInstalacao: null,
        intervalo: null,
        SkillSummary: null
      },
      abrirModal: false,
      tipoFormVenda: [],
      produtoFormVenda: []
    }),
    computed: {
      imgS() {
        return img
      },
      clienteElegivel() {
        return this.formVendaInstalacao.clienteElegivel
      },
      nome() {
        return this.$store.getters.usuario.nome
      }
    },
    mixins: [alerts],
    methods: {
      async listarSkillSummary() {
        this.listSummary = await Utils.getListSkillSummaryBasic('CLARO_MOVEL')
      },
      async submit() {
        try {
          CadastroInstalacoesService.insert(this.formVendaInstalacao)
          this.toast('Registro realizado com sucesso!', 'top-right', false, 2000, 'success')
          this.limparDadosFormulario()
        } catch (e) {
          this.toast(
            'Não foi possivel registrar venda. Tente novamente!',
            'top-right',
            false,
            2000,
            'warning'
          )
        }
      },
      async loadFormOptions(form, field, propertyName) {
        this[propertyName] = []
        const response = await FormOptionsService.getByField(form, field)
        this[propertyName] = response
      },
      async loadFormOptionsParent(form, field, parent, parentValue, propertyName) {
        this[propertyName] = []
        const response = await FormOptionsService.getByParent(form, field, parent, parentValue)
        this[propertyName] = response
      },
      limparDadosFormulario() {
        let newForm = Object.assign({}, this.formVendaInstalacao)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.formVendaInstalacao = newForm
        this.$refs.observer.reset()
        // this.formVendaInstalacao.operacao = "CLARO BOX";
      },
      loadCidades() {
        let urlData = `${config.baseUrl}api/shared/utils/geral/cidades`
        this.$api.get(urlData).then(res => {
          this.listCidades = res.data
        })
      },
      filterCodCidade() {
        let cidades = this.listCidades
        const retorno = cidades.filter(cidade => {
          if (cidade.COD_CIDADE == this.formVendaInstalacao.codCidade) {
            this.formVendaInstalacao.cidade = cidade.NOME_CIDADE
          }
        })
        return retorno
      },
      filterNomeCidade() {
        let cidades = this.listCidades
        return cidades.filter(cidade => {
          if (cidade.NOME_CIDADE == this.formVendaInstalacao.cidade) {
            this.formVendaInstalacao.codCidade = cidade.COD_CIDADE
          }
        })
      }
    },
    watch: {},
    created() {
      this.listarSkillSummary()
      this.isDev = process.env.NODE_ENV === 'development'
      this.loadCidades()

      setTimeout(() => {
        this.abrirModal = true
      }, 500)
    }
  }
</script>

<style></style>
