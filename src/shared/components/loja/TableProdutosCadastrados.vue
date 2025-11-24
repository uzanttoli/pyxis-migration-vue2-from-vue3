<template>
  <v-col cols="12">
    <v-card class="mx-auto mt-7">
      <title-negative-margin title="Produtos Cadastrados"></title-negative-margin>
      <v-row align="center" justify="end" class="pr-4 pb-4">
        <v-btn
          class="rounded-xl"
          small
          color="primary"
          :to="{ name: 'NovoProduto', params: { id: 'cadastrar-produto' } }"
        >
          <v-icon color="white">mdi-plus</v-icon>
          <span class="white--text">Adicionar item</span>
        </v-btn>
        <span class="d-flex justify-start">
          <v-switch inset class="ml-3" label="Ativo" v-model="ativo"></v-switch>
        </span>
      </v-row>
      <v-data-table
        :items="listarProdutos"
        :headers="getHeader()"
        :fixed-header="true"
        :loading="loading"
        class="text-no-wrap"
        no-data-text="Não foi encontrado nenhuma informação"
        dense
      >
        <template v-slot:[`item.${NOME_ARQUIVO_IMAGEM}`]="{ item }">
          <v-avatar>
            <v-img height="60" :src="link(item.NOME_ARQUIVO_IMAGEM)"></v-img>
          </v-avatar>
        </template>
        <template v-slot:[`item.${ACOES}`]="{ item }">
          <v-tooltip bottom v-if="item.FIX_PRODUTO != 1">
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                rounded
                x-small
                depressed
                :disabled="
                  (item.MAX_FIX_PRODUTO >= 2 && item.FIX_PRODUTO != 1) || item.STATUS_PRODUTO != 1
                "
                fab
                @click="atualizarFixarProduto(item.ID_PRODUTO, 1)"
                color="green"
                class="mr-1"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon color="white">fas fa-thumbtack</v-icon>
              </v-btn>
            </template>
            <span>Fixar</span>
          </v-tooltip>
          <v-tooltip bottom v-else>
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                rounded
                x-small
                depressed
                fab
                :disabled="
                  (item.MAX_FIX_PRODUTO >= 2 && item.FIX_PRODUTO != 1) || item.STATUS_PRODUTO != 1
                "
                @click="atualizarFixarProduto(item.ID_PRODUTO, 0)"
                color="green"
                class="mr-1"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon color="white">mdi-pin-off</v-icon>
              </v-btn>
            </template>
            <span>Desfixar</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                rounded
                x-small
                depressed
                fab
                :disabled="item.STATUS_PRODUTO != 1"
                color="blue"
                class="mr-1"
                v-bind="attrs"
                v-on="on"
                @click=";(dialogEditarProduto = true), produtoParaEditar(item)"
              >
                <v-icon color="white">mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Editar</span>
          </v-tooltip>
          <v-tooltip bottom v-if="item.STATUS_PRODUTO == 1">
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                rounded
                x-small
                depressed
                fab
                color="red"
                v-bind="attrs"
                v-on="on"
                @click="atualizarStatusProduto(item.ID_PRODUTO, 0)"
              >
                <v-icon color="white">mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Deletar</span>
          </v-tooltip>
          <v-tooltip bottom v-else>
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                rounded
                x-small
                depressed
                fab
                color="orange"
                v-bind="attrs"
                v-on="on"
                @click="atualizarStatusProduto(item.ID_PRODUTO, 1)"
              >
                <v-icon color="white">mdi-restart</v-icon>
              </v-btn>
            </template>
            <span>Ativar</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <EditarProduto
      @updated:closeEditarProduto="dialogEditarProduto = !dialogEditarProduto"
      :editarProduto="dialogEditarProduto"
      :produtoEditar="dadosParaEditar"
      @updated:atualizado="dadosAtualizados = true"
    />
  </v-col>
</template>

<script>
  import EditarProduto from './EditarProduto.vue'
  export default {
    components: { EditarProduto },
    data: () => ({
      ativo: true,
      loading: false,
      overlay: false,
      dialogEditarProduto: false,
      dadosParaEditar: [],
      dadosAtualizados: false
    }),
    computed: {
      listarProdutos() {
        let listarProdutos = this.$store.getters.listarProdutos
        return listarProdutos ? listarProdutos : []
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
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
      produtoParaEditar(value) {
        return (this.dadosParaEditar = value)
      },
      getHeader() {
        let arrHeader = [
          {
            text: 'Imagem',
            class: '',
            align: 'center',
            value: 'NOME_ARQUIVO_IMAGEM'
          },
          {
            text: 'ID Produto',
            class: '',
            align: 'center',
            value: 'ID_PRODUTO'
          },
          {
            text: 'Regional',
            class: '',
            align: 'center',
            value: 'REGIONAL'
          },
          {
            text: 'Categoria',
            class: '',
            align: 'center',
            value: 'NOME_CATEGORIAS'
          },
          {
            text: 'Produto',
            class: '',
            align: 'center',
            value: 'NOME_PRODUTO'
          },
          {
            text: 'Preço',
            class: '',
            align: 'center',
            value: 'PRECO'
          },
          {
            text: 'Quantidade Disponivel',
            class: '',
            align: 'center',
            value: 'QUANTIDADE_DISPONIVEL'
          },
          {
            text: 'Limite Compra',
            class: '',
            align: 'center',
            value: 'LIMITE_COMPRA'
          },
          {
            text: 'Criado por',
            class: '',
            align: 'center',
            value: 'CRIADO_POR'
          },
          {
            text: 'Criado em',
            class: '',
            align: 'center',
            value: 'DATA_CADASTRO'
          },
          {
            text: 'Editado por',
            class: '',
            align: 'center',
            value: 'EDITADO_POR'
          },
          {
            text: 'Editado em',
            class: '',
            align: 'center',
            value: 'EDITADO_EM'
          },
          {
            text: 'Ações',
            class: '',
            align: 'center',
            value: 'ACOES'
          }
        ]
        return arrHeader
      },
      atualizarFixarProduto(value, status) {
        this.overlay = true
        this.$store
          .dispatch('atualizarFixarProduto', {
            fixProduto: status,
            idProduto: value,
            editadoPor: this.usuarioAlmope,
            editadoEm: this.dataAtual
          })
          .then(() => {
            this.loadListarProdutos()
            this.overlay = false
          })
      },
      atualizarStatusProduto(value, status) {
        this.overlay = true
        this.$store
          .dispatch('atualizarStatusProduto', {
            visivel: status,
            idProduto: value,
            editadoPor: this.usuarioAlmope,
            editadoEm: this.dataAtual
          })
          .then(() => {
            this.loadListarProdutos()
            this.overlay = false
          })
      },
      async loadListarProdutos() {
        this.loading = true
        let status = this.ativo == true ? 1 : 0
        await this.$store.dispatch('loadListarProdutos', status)
        this.loading = false
      },
      link(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/imagem_produto/${img}`
      }
    },
    watch: {
      dadosAtualizados() {
        if (this.dadosAtualizados == true) {
          this.loadListarProdutos()
          setTimeout(() => {
            this.dadosAtualizados = false
          }, 2000)
        }
      },
      ativo() {
        this.loadListarProdutos()
      }
    },
    created() {
      this.loadListarProdutos()
    }
  }
</script>

<style></style>
