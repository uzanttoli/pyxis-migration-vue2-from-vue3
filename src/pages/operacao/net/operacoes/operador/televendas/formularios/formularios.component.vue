<template>
  <v-sheet elevation="4" max-width="980" max-height="600">
    <title-negative-margin title="Formulário Vendas"></title-negative-margin>
    <div class="pa-5">
      <v-form ref="form">
        <v-row dense>
          <v-col cols="12">
            <v-card-text class="pl-0 mt-n8">
              <div class="mt-2">
                <v-icon color="red">fa-solid fa-heart-pulse</v-icon>
                {{ `Olá ${nome}, tenha um excelente dia de vendas!` }}
              </div>
              <v-divider class="mt-2"></v-divider>
            </v-card-text>
          </v-col>
          <v-col cols="4">
            <v-select
              v-model="formVendaNet.operacao"
              :items="['NET']"
              label="Operação"
              :rules="[() => !!formVendaNet.operacao || 'É necessário selecionar']"
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-mask="'###'"
              v-model="formVendaNet.ddd"
              prepend-inner-icon="mdi-map-search"
              :label="formVendaNet.operacao == 'NET' ? 'Código Cidade' : 'Código Cidade'"
            ></v-text-field>
          </v-col>
          <!--Formulario NET e CLARO-->
          <template>
            <v-col cols="4" xl="4">
              <v-text-field
                v-mask="'########-#'"
                v-model="formVendaNet.contrato"
                ref="contrato"
                label="Contrato"
                :rules="[
                  () =>
                    (!!formVendaNet.contrato && formVendaNet.contrato.length <= 10) ||
                    'O contrato precisa ter até 10 caracteres'
                ]"
              ></v-text-field>
            </v-col>

            <v-col cols="4" xl="4" v-if="formVendaNet.contrato">
              <v-select
                v-model="formVendaNet.clienteElegivel"
                :items="[
                  { value: 2, description: 'Sim' },
                  { value: 1, description: 'Nao' }
                ]"
                item-text="description"
                item-value="value"
                label="Cliente Elegível?"
                @change="loadMotivosFormVenda()"
                :rules="[() => !!formVendaNet.clienteElegivel || 'É necessário selecionar']"
              ></v-select>
            </v-col>

            <v-col cols="4" xl="4" v-if="formVendaNet.clienteElegivel == 2">
              <v-select
                v-model="formVendaNet.clienteAceitouOferta"
                :items="simnao"
                item-text="description"
                item-value="value"
                @change="loadTipoFormVenda()"
                label="Cliente Aceitou Oferta?"
                :rules="[() => !!formVendaNet.clienteAceitouOferta || 'É necessário selecionar']"
              ></v-select>
            </v-col>

            <v-col
              cols="4"
              xl="4"
              v-if="formVendaNet.clienteElegivel == 1 || formVendaNet.clienteAceitouOferta == 2"
            >
              <v-select
                v-model="formVendaNet.motivo"
                :items="motivosFormVenda"
                item-text="DESCRICAO"
                item-value="COD"
                label="Motivo"
                @change="formVendaNet.motivo == 3 ? loadSubmotivosFormVenda() : ''"
              ></v-select>
            </v-col>

            <v-col cols="4" xl="4" v-if="formVendaNet.motivo == 3">
              <v-select
                :items="submotivosFormVenda"
                item-text="DESCRICAO"
                item-value="COD"
                label="Motivo do Contato"
                v-model="formVendaNet.motivoContato"
              ></v-select>
            </v-col>

            <v-col cols="4" xl="4" v-if="formVendaNet.clienteAceitouOferta == 1">
              <v-select
                v-model="formVendaNet.tipo"
                :items="tipoFormVenda"
                item-text="DESCRICAO"
                item-value="COD"
                label="Tipo"
                @change="loadProdutoFormVenda()"
                :rules="[() => !!formVendaNet.tipo || 'É necessário selecionar']"
              ></v-select>
            </v-col>

            <v-col cols="12" xl="12" v-if="formVendaNet.clienteAceitouOferta == 1">
              <v-select
                v-model="formVendaNet.produto"
                :items="produtoFormVenda"
                item-text="DESCRICAO"
                item-value="COD"
                label="Produto"
                :rules="[() => !!formVendaNet.produto || 'É necessário selecionar']"
              ></v-select>
            </v-col>
          </template>

          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
          <v-row class="mr-5" justify="center">
            <v-col cols="6">
              <v-btn
                class="ma-5"
                color="success"
                :loading="loadingVenda"
                block
                @click="saveDadosVendasNet()"
                :disabled="!this.formVendaIsValid() || this.loadingVenda"
              >
                <v-icon class="mr-1">fa-solid fa-floppy-disk</v-icon>
                Salvar
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                class="mt-5"
                :disabled="this.loadingVenda"
                block
                color="error"
                @click="limparDadosFormulario()"
              >
                <v-icon class="mr-1">fa-solid fa-trash</v-icon>
                Limpar
              </v-btn>
            </v-col>
          </v-row>
        </v-row>
      </v-form>
    </div>
  </v-sheet>
</template>
<script>
  export default {
    name: 'form-televendas',
    props: {
      dialogModalTelevendas: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      valid: false,
      loadingVenda: false,
      date: new Date().toISOString().substr(0, 10),
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
      tipos: [],
      produtos: [],
      arrProdutos: [],
      formVendaNet: {
        id: null,
        operacao: 'NET',
        ddd: '',
        contrato: '',
        telefone: '',
        ofertou: '',
        vendeu: '',
        clienteElegivel: '',
        clienteAceitouOferta: '',
        motivo: '',
        tipo: '',
        produto: '',
        dataVenda: new Date().toISOString().substr(0, 10),
        acao: 'form',
        motivoContato: null
      },
      defaultFormVendaNet: {
        id: null,
        operacao: 'NET',
        ddd: '',
        contrato: '',
        telefone: '',
        ofertou: '',
        vendeu: '',
        clienteElegivel: '',
        clienteAceitouOferta: '',
        motivo: '',
        tipo: '',
        produto: '',
        dataVenda: new Date().toISOString().substr(0, 10),
        acao: 'form',
        motivoContato: null
      }
    }),
    computed: {
      motivosFormVenda() {
        return this.$store.getters.motivosFormVenda
      },
      tipoFormVenda() {
        return this.$store.getters.tipoFormVenda
      },
      produtoFormVenda() {
        return this.$store.getters.produtoFormVenda
      },
      motivosClaroNaoVendeu() {
        return this.$store.getters.motivosClaroNaoVendeu
      },
      submotivosFormVenda() {
        return this.$store.getters.submotivosFormVenda
      },
      operadorasConcorrentes() {
        return this.$store.getters.operadorasConcorrentes
      },
      produtosVendaClaro() {
        return this.$store.getters.produtosVendaClaro
      },
      operacaoAtual() {
        return this.formVenda.operacao
      },
      clienteElegivel() {
        return this.formVendaNet.clienteElegivel
      },
      nome() {
        return this.$store.getters.usuario.nome
      }
    },
    methods: {
      toggleDialog() {
        this.dialogModalTelevendas = !this.dialogModalTelevendas
      },
      async saveDadosVendasNet() {
        try {
          if (this.formVendaNet) {
            this.loadingVenda = true
            this.formVendaNet.almope = this.$store.getters.usuario.almope
            this.formVendaNet.vendeu = ''
            await this.$store.dispatch('saveDadosVendasNet', this.formVendaNet)
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
              title: 'Dados cadastrados com sucesso!'
            })
            this.loadingVenda = false
            this.limparDadosFormulario()
          }
        } catch (error) {
          if (error.response.status) {
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
              icon: 'error',
              title: error.response.data
            })
            this.loadingVenda = false
          }
        }
      },
      loadMotivosFormVenda() {
        return this.$store.dispatch('loadMotivosFormVenda', this.formVendaNet.clienteElegivel)
      },
      loadSubmotivosFormVenda() {
        this.$store.dispatch('loadSubmotivosFormVenda', this.formVendaNet.motivo)
      },
      loadTipoFormVenda() {
        return this.$store.dispatch('loadTipoFormVenda')
      },
      loadProdutoFormVenda() {
        return this.$store.dispatch('loadProdutoFormVenda')
      },
      loadMotivosClaroNaoVendeu() {
        return this.$store.dispatch('loadMotivosClaroNaoVendeu')
      },
      loadOperadorasConcorrentes() {
        return this.$store.dispatch('loadOperadorasConcorrentes')
      },
      loadProdutosVendaClaro() {
        return this.$store.dispatch('loadProdutosVendaClaro')
      },
      limparDadosFormulario() {
        Object.assign(this.formVendaNet, this.defaultFormVendaNet)
      },
      formVendaIsValid() {
        return (
          (this.formVendaNet.operacao &&
            this.formVendaNet.ddd.length == 3 &&
            this.formVendaNet.contrato.length == 10 &&
            this.formVendaNet.clienteElegivel &&
            this.formVendaNet.clienteAceitouOferta &&
            this.formVendaNet.tipo &&
            this.formVendaNet.produto) ||
          (this.formVendaNet.motivo == 3 && this.formVendaNet.motivoContato) ||
          (this.formVendaNet.motivo != 3 && this.formVendaNet.motivo != '')
          // this.formVendaNet.motivo
        )
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
      },
      dialogModalTelevendas() {
        if (this.dialogModalTelevendas === true) {
          this.loadOperadorasConcorrentes()
          this.loadProdutosVendaClaro()
        }
      }
    },
    created() {
      this.loadOperadorasConcorrentes()
      this.loadProdutosVendaClaro()
    }
  }
</script>

<style></style>
