<template>
  <v-card>
    <title-negative-margin
      title="Formulário Vendas"
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
            <v-col cols="4">
              <validation-provider v-slot="{ errors }" name="telefone contato" rules="required">
                <v-text-field
                  dense
                  :error-messages="errors"
                  outlined
                  placeholder="Insira um telefone de contato"
                  v-model="formVendaNet.telefone"
                  v-mask="['(##) ####-####', '(##) #####-####']"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4">
              <validation-provider v-slot="{ errors }" name="cod. contrato" required="rules">
                <v-text-field
                  id="cod"
                  outlined
                  dense
                  :error-messages="errors"
                  v-mask="'###'"
                  v-model="formVendaNet.cod"
                  prepend-inner-icon="mdi-map-search"
                  :label="formVendaNet.operacao == 'CLARO BOX' ? 'Código Cidade' : 'Código Cidade'"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <!--Formulario CLARO BOX e CLARO-->
            <v-col cols="4">
              <validation-provider v-slot="{ errors }" name="contrato" rules="required">
                <v-text-field
                  id="contrato"
                  v-mask="'########-#'"
                  v-model="formVendaNet.contrato"
                  outlined
                  dense
                  :error-messages="errors"
                  ref="contrato"
                  label="Contrato"
                ></v-text-field>
              </validation-provider>
            </v-col>

            <v-col v-if="formVendaNet.contrato" cols="4" class="mt-n7">
              <validation-provider v-slot="{ errors }" rules="required" name="elegivel">
                <v-select
                  outlined
                  id="elegivel"
                  dense
                  :error-messages="errors"
                  v-model="formVendaNet.clienteElegivel"
                  :items="[
                    { value: 2, description: 'Sim' },
                    { value: 1, description: 'Nao' }
                  ]"
                  item-text="description"
                  item-value="value"
                  label="Cliente Elegível?"
                  @change="loadMotivosFormVenda()"
                ></v-select>
              </validation-provider>
            </v-col>

            <v-col cols="4" v-if="formVendaNet.clienteElegivel == 2" class="mt-n7">
              <validation-provider v-slot="{ errors }" name="contato" rules="required">
                <v-select
                  id="formaContato"
                  outlined
                  dense
                  :error-messages="errors"
                  v-model="formVendaNet.formaContato"
                  :items="[
                    { value: 2, description: 'Ativo' },
                    { value: 1, description: 'Receptivo' }
                  ]"
                  item-text="description"
                  item-value="description"
                  label="Forma de Contato?"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col
              cols="4"
              v-if="formVendaNet.clienteElegivel == 2 && formVendaNet.formaContato"
              class="mt-n7"
            >
              <validation-provider v-slot="{ errors }" name="aceitou oferta" rules="required">
                <v-select
                  id="aceitouOferta"
                  outlined
                  dense
                  :error-messages="errors"
                  v-model="formVendaNet.clienteAceitouOferta"
                  :items="simnao"
                  item-text="description"
                  item-value="value"
                  @change="loadTipoFormVenda()"
                  label="Cliente Aceitou Oferta?"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col
              cols="4"
              class="mt-n7"
              v-if="formVendaNet.clienteElegivel == 1 || formVendaNet.clienteAceitouOferta == 2"
            >
              <validation-provider v-slot="{ errors }" name="motivo" rules="required">
                <v-select
                  id="motivo"
                  outlined
                  dense
                  :error-messages="errors"
                  v-model="formVendaNet.motivo"
                  :items="motivosFormVenda"
                  item-text="DESCRICAO"
                  item-value="COD"
                  label="Motivo"
                  @change="formVendaNet.motivo == 3 ? loadSubmotivosFormVenda() : ''"
                ></v-select>
              </validation-provider>
            </v-col>

            <v-col cols="4" v-if="formVendaNet.motivo == 3" class="mt-n7">
              <validation-provider v-slot="{ errors }" rules="required" name="motivo contato">
                <v-select
                  id="motivoContato"
                  outlined
                  dense
                  :error-messages="errors"
                  :items="submotivosFormVenda"
                  item-text="DESCRICAO"
                  item-value="COD"
                  label="Motivo do Contato"
                  v-model="formVendaNet.motivoContato"
                ></v-select>
              </validation-provider>
            </v-col>

            <v-col cols="4" v-if="formVendaNet.clienteAceitouOferta == 1" class="mt-n7">
              <validation-provider v-slot="{ errors }" name="tipo venda" rules="required">
                <v-select
                  outlined
                  dense
                  :error-messages="errors"
                  v-model="formVendaNet.tipo"
                  :items="tipoFormVenda"
                  item-text="TIPO_VENDA"
                  item-value="ID_TIPOS"
                  label="Tipo"
                  @change="formVendaNet.tipo == 5 ? loadListCodChecagem() : loadProdutoFormVenda()"
                ></v-select>
              </validation-provider>
            </v-col>

            <v-col
              cols="4"
              class="mt-n7"
              v-if="formVendaNet.clienteAceitouOferta == 1 && formVendaNet.tipo != 5"
            >
              <validation-provider v-slot="{ errors }" name="produto" rules="required">
                <v-select
                  outlined
                  :error-messages="errors"
                  dense
                  v-model="formVendaNet.produto"
                  :items="produtoFormVenda"
                  item-text="DESC_PRODUTO"
                  item-value="ID_PRODUTO"
                  label="Produto"
                  no-data-text="Primeiro selecione o tipo"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="4" v-if="formVendaNet.produto" class="mt-n7">
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
                  v-mask="['##/##/####']"
                  v-model="formVendaNet.dataInstalacao"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4" v-if="formVendaNet.produto" class="mt-n7">
              <validation-provider v-slot="{ errors }" name="valor plano atual" rules="required">
                <v-text-field
                  dense
                  outlined
                  :error-messages="errors"
                  label="Valor atual do plano claro tv"
                  v-mask="['#.##', '##.##', '###.##']"
                  v-model="formVendaNet.valorAtualPlano"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4" v-if="formVendaNet.produto" class="mt-n7">
              <validation-provider v-slot="{ errors }" name="valor plano novo" rules="required">
                <v-text-field
                  dense
                  :error-messages="errors"
                  outlined
                  label="Valor do novo plano"
                  v-mask="['#.##', '##.##', '###.##']"
                  v-model="formVendaNet.valorNovoPlano"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4" v-if="formVendaNet.tipo == 5" class="mt-n7">
              <validation-provider v-slot="{ errors }" name="cod. checagem" rules="required">
                <v-select
                  outlined
                  dense
                  :error-messages="errors"
                  v-model="formVendaNet.checagem"
                  :items="listaCodChecagem"
                  item-text="MOTIVO"
                  item-value="ID"
                  label="Cod. Checagem"
                ></v-select>
              </validation-provider>
            </v-col>
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
  </v-card>
</template>
<script>
  import config from '../../../../../core/config'
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import alerts from '../../../../../mixins/alerts.mixins'
  export default {
    components: { ValidationObserver, ValidationProvider },
    name: 'form-televendas',
    props: {},
    data: () => ({
      valid: false,
      loadingVenda: false,
      date: new Date().toISOString().substring(0, 10),
      menu: false,
      idRepeat: false,
      menuDtVenda: false,
      simnao: [
        { value: 1, description: 'Sim' },
        { value: 2, description: 'Nao' }
      ],
      motivos: [],
      motivosNaoOfertou: [],
      motivosNaoVendeu: [],
      listaCodChecagem: [],
      tipos: [],
      produtos: [],
      arrProdutos: [],
      formVendaNet: {
        cod: null,
        contrato: null,
        telefone: null,
        vendeu: null,
        clienteElegivel: null,
        clienteAceitouOferta: null,
        motivo: null,
        tipo: null,
        produto: null,
        canalVenda: null,
        valorNovoPlano: null,
        valorAtualPlano: null,
        dataInstalacao: null
      },

      tipoFormVenda: [],
      produtoFormVenda: []
    }),
    computed: {
      motivosFormVenda() {
        return this.$store.getters.motivosFormVenda
      },
      submotivosFormVenda() {
        return this.$store.getters.submotivosFormVenda
      },
      clienteElegivel() {
        return this.formVendaNet.clienteElegivel
      },
      nome() {
        return this.$store.getters.usuario.nome
      }
    },
    mixins: [alerts],
    methods: {
      loadListCodChecagem() {
        let urlData = `${config.baseUrl}api/shared/televendas/listar_checagem`
        this.$api.get(urlData).then(res => {
          this.listaCodChecagem = res.data
        })
      },
      async submit() {
        try {
          if (this.formVendaNet) {
            this.loadingVenda = true
            this.formVendaNet.almope = this.$store.getters.usuario.almope
            this.formVendaNet.canalVenda = 'UTIL. TELEVENDAS'

            let urlData = `${config.baseUrl}api/shared/televendas/vendas_combo_s2s`
            await this.$api.post(urlData, this.formVendaNet)
            this.toast('Venda cadastrada com sucesso!', 'top-right', false, 2500, 'success')
            this.loadingVenda = false
            this.limparDadosFormulario()
          }
        } catch (e) {
          this.loadingVenda = false
          this.toast(
            'Não foi possivel cadastrar! Tente novamente.',
            'top-right',
            false,
            2500,
            'error'
          )
        }
      },
      loadMotivosFormVenda() {
        return this.$store.dispatch('loadMotivosFormVenda', this.formVendaNet.clienteElegivel)
      },
      loadSubmotivosFormVenda() {
        this.$store.dispatch('loadSubmotivosFormVenda', this.formVendaNet.motivo)
      },
      loadTipoFormVenda() {
        // return this.$store.dispatch("loadTipoFormVenda");
        let urlData = `${config.baseUrl}api/shared/televendas/tipo_venda_campanha/CLARO BOX`
        this.$api.get(urlData).then(res => {
          this.tipoFormVenda = res.data
        })
      },
      loadProdutoFormVenda() {
        let urlData = `${config.baseUrl}api/shared/televendas/tipo_produto_campanha/CLARO BOX`
        this.$api.get(urlData).then(res => {
          this.produtoFormVenda = res.data
        })
      },
      limparDadosFormulario() {
        let newForm = Object.assign({}, this.formVendaNet)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.formVendaNet = newForm
        this.$refs.observer.reset()
      }
    },
    watch: {
      clienteElegivel() {
        if (this.formVendaNet.clienteElegivel) {
          this.formVendaNet.clienteAceitouOferta = ''
          this.formVendaNet.motivo = ''
          this.formVendaNet.tipo = ''
          this.formVendaNet.motivoContato = ''
        }
      },
      motivo() {
        if (this.formVendaNet.motivo) {
          this.formVendaNet.motivoContato = ''
          this.formVendaNet.tipo = ''
        }
      }
    },
    created() {
      // this.loadOperadorasConcorrentes();
      // this.loadProdutosVendaClaro();
      this.loadListCodChecagem()
    }
  }
</script>

<style></style>
