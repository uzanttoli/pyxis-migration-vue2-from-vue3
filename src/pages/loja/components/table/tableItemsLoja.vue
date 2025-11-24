<template>
  <v-card class="mt-3">
    <v-data-table>
      <template v-slot:header>
        <thead>
          <tr>
            <th class="text-center" v-for="(item, i) in headers" :key="i">
              {{ item.text }}
            </th>
          </tr>
        </thead>
      </template>
      <template v-slot:body>
        <tbody>
          <tr v-for="produto in listProducts" :key="produto.id" class="text-center">
            <td style="width: 40px; padding-left: 30px">
              {{ produto.ID_PRODUTO }}
            </td>
            <td style="width: 40px; padding-left: 30px">
              <v-img height="100" width="100" :src="link(produto.NOME_ARQUIVO_IMAGEM)"></v-img>
            </td>
            <td>{{ produto.NOME_PRODUTO }}</td>
            <td>
              <v-chip outlined>
                <div class="mr-1">
                  <v-img
                    width="20"
                    src="../../../../assets/img/icons/mdi-icons/icons8-ruble-64.png"
                  ></v-img>
                </div>
                {{ produto.VALOR_RESGATE }}
              </v-chip>
            </td>
            <td>{{ produto.QUANTIDADE }}</td>
            <td>
              <v-btn icon>
                <div>
                  <v-img :src="getImg('icons8-add-shopping-cart-28')"></v-img>
                </div>
              </v-btn>
            </td>
            <td>
              <v-btn icon @click="editItem(produto)">
                <div>
                  <v-img :src="getImg('icons8-edit-28')"></v-img>
                </div>
              </v-btn>
            </td>
            <td>
              <v-btn icon @click="deleteItem(produto)">
                <div>
                  <v-img :src="getImg('icons8-remove-28')"></v-img>
                </div>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  export default {
    data: () => ({
      dataForm: []
    }),
    computed: {
      headers() {
        return [
          {
            text: 'ID Produto',
            align: 'center',
            sortable: true
          },
          {
            text: 'Imagem',
            align: 'center',
            sortable: true
          },
          {
            text: 'Nome',
            align: 'center',
            sortable: true
          },
          {
            text: 'Valor',
            align: 'center',
            sortable: true
          },
          {
            text: 'Quantidade',
            align: 'center',
            sortable: true
          },
          {
            text: 'Resgatar',
            align: 'center',
            sortable: true
          },
          {
            text: 'Editar',
            align: 'center',
            sortable: true
          },
          {
            text: 'Excluir',
            align: 'center',
            sortable: true
          }
        ]
      },
      listProducts() {
        return this.$store.getters.listProducts ? this.$store.getters.listProducts : []
      }
    },
    methods: {
      deleteItem(value) {
        this.confirm = true
        this.dadosDelete.push({
          idProduto: value.ID_PRODUTO
        })
      },
      editItem(value) {
        this.isEdit = true
        this.$emit('editProduto', value)
        if (this.dadosForm == '') {
          this.dadosForm.push({
            idProduto: value.ID_PRODUTO,
            nomeProduto: value.NOME_PRODUTO,
            valorResgate: value.VALOR_RESGATE,
            quantidade: value.QUANTIDADE,
            nomeArquivoImagem: value.NOME_ARQUIVO_IMAGEM
          })
          this.$emit('updated:atualizar')
        } else {
          this.dadosForm = []
          this.dadosForm.push({
            idProduto: value.ID_PRODUTO,
            nomeProduto: value.NOME_PRODUTO,
            valorResgate: value.VALOR_RESGATE,
            quantidade: value.QUANTIDADE,
            nomeArquivoImagem: value.NOME_ARQUIVO_IMAGEM
          })
          this.$emit('updated:atualizar')
        }
      },
      visibleItem(value) {
        this.idDelete = value.ID_PRODUTO
      },
      getImg(value) {
        var img = require.context('../../../../assets/img/icons/mdi-icons/', false, /\.png$/)
        return img('./' + value + '.png')
      },
      link(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/imagens/${img}`
      },
      loadListProducts() {
        this.$store.dispatch('loadListProducts')
      }
    },
    created() {
      this.loadListProducts()
    }
  }
</script>

<style></style>
