<template>
  <!-- v-model="editarProduto" -->

  <v-dialog
    :model-value="editarProduto"
    @update:modelValue="val => $emit('update:editarProduto', val)"
    persistent
    width="1000"
  >
    <v-col>
      <v-card class="mx-auto">
        <v-alert type="success" v-if="atualizado">Dados Editado com sucesso!</v-alert>

        <title-negative-margin title="Editar produto">
          <v-btn fab depressed small rounded @click="$emit('updated:closeEditarProduto')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </title-negative-margin>

        <div class="px-3 pb-3 subtitle-1">Informações atuais:</div>

        <v-row align="center" class="px-4">
          <v-col v-for="(field, i) in textFieldEditProd()" :key="i" :cols="field.cols">
            <v-text-field
              :label="field.label"
              outlined
              rounded
              dense
              readonly
              filled
              :class="field.class"
              v-model="field.value"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-divider class="pa-3"></v-divider>

        <div class="px-3 pb-3 subtitle-1">Editar:</div>

        <v-form ref="form" lazy-validation v-model="valid">
          <v-row align="center" class="px-4">
            <v-col>
              <v-text-field
                label="Quantidade"
                rounded
                outlined
                dense
                type="number"
                filled
                v-model="quantidade"
              ></v-text-field>
            </v-col>

            <v-col>
              <v-text-field
                label="Preço"
                rounded
                outlined
                type="number"
                dense
                filled
                v-model="preco"
              ></v-text-field>
            </v-col>

            <v-col>
              <v-text-field
                label="Limite de Compra"
                rounded
                outlined
                type="number"
                dense
                filled
                v-model="limiteCompra"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="px-4 mt-n4" align="center">
            <v-col cols="12">
              <v-select
                filled
                rounded
                dense
                outlined
                chips
                :items="agrupamentoLoja"
                item-text="AGRUPAMENTO"
                v-model="publicoAlvo"
                small-chips
                label="Grupo"
                no-data-text="Não há informações"
                multiple
              ></v-select>
            </v-col>
          </v-row>

          <v-row class="px-6 py-2" align="center" justify="end">
            <v-btn
              color="green"
              class="white--text"
              @click="editarProdutoCadastro"
              :disabled="this.editIsValid()"
            >
              Salvar
            </v-btn>
          </v-row>
        </v-form>
      </v-card>
    </v-col>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      editarProduto: {
        type: Boolean,
        default: false
      },
      produtoEditar: {
        type: [Object, Array],
        require: true
      }
    },
    data: () => ({
      atualizado: false,
      valid: false,
      publicoAlvo: ['ADMINISTRADOR', 'GERENTE', 'COORDENADOR'],
      quantidade: '',
      preco: '',
      limiteCompra: ''
    }),
    mounted() {},
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      agrupamentoLoja() {
        let agrupamentoLoja = this.$store.getters.agrupamentoLoja
        agrupamentoLoja.unshift({ AGRUPAMENTO: 'TODOS' })
        return agrupamentoLoja ? agrupamentoLoja : []
      },
      replacePublicoAlvo() {
        let replaceIn = this.publicoAlvo
        return replaceIn.toString().replaceAll(',', ';')
      },
      dataAtual() {
        const hoje = new Date()
        const dia = hoje.getDate().toString().padStart(2, '0')
        const mes = String(hoje.getMonth() + 1).padStart(2, '0')
        const ano = hoje.getFullYear()
        return `${dia} / ${mes} / ${ano}`
      }
    },
    methods: {
      clearFormEdicao() {
        return (
          (this.quantidade = ''),
          (this.preco = ''),
          (this.publicoAlvo = ['ADMINISTRADOR', 'GERENTE', 'COORDENADOR']),
          (this.limiteCompra = '')
        )
      },
      editIsValid() {
        return (
          this.quantidade == '' &&
          this.preco == '' &&
          this.limiteCompra == '' &&
          this.replacePublicoAlvo.length == 33
          // this.publicoAlvo.length < 33
        )
      },
      textFieldEditProd() {
        let arrFields = [
          {
            label: 'Produto',
            cols: '4',
            value: this.produtoEditar.NOME_PRODUTO,
            class: ''
          },
          {
            label: 'Quantidade Disponivel',
            cols: '3',
            value: this.produtoEditar.QUANTIDADE_DISPONIVEL,
            class: ''
          },
          {
            label: 'Preço',
            cols: '3',
            value: this.produtoEditar.PRECO,
            class: ''
          },
          {
            label: 'Limite de compra',
            cols: '2',
            value: this.produtoEditar.LIMITE_COMPRA,
            class: ''
          },
          {
            label: 'Publico alvo',
            cols: '12',
            value: this.produtoEditar.REGIONAL,
            class: 'mt-n6'
          }
        ]
        return arrFields
      },
      editarProdutoCadastro() {
        this.atualizado = true
        let data = {
          idProduto: this.produtoEditar.ID_PRODUTO,
          publicoAlvo:
            this.replacePublicoAlvo.length > 33
              ? this.replacePublicoAlvo
              : this.produtoEditar.REGIONAL,
          editadoPor: this.usuarioAlmope,
          editadoEm: this.dataAtual,
          quantidade:
            this.quantidade != '' ? this.quantidade : this.produtoEditar.QUANTIDADE_DISPONIVEL,
          preco: this.preco != '' ? this.preco : this.produtoEditar.PRECO,
          limiteCompra:
            this.limiteCompra != '' ? this.limiteCompra : this.produtoEditar.LIMITE_COMPRA
        }

        this.$store.dispatch('editarProdutoCadastro', data)
        this.$emit('updated:atualizado')
        this.clearFormEdicao()
        setTimeout(() => {
          this.$emit('updated:closeEditarProduto')
          this.atualizado = false
        }, 2000)
      },
      loadAgrupamentoLoja() {
        this.$store.dispatch('loadAgrupamentoLoja')
      }
    },
    created() {
      this.loadAgrupamentoLoja()
    }
  }
</script>

<style scoped></style>
