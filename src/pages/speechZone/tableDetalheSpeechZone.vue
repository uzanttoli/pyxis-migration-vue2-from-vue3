<template>
  <v-card class="table">
    <title-negative-margin
      :title="title"
      className="rounded-r-xl"
      :icon="icon"
    ></title-negative-margin>
    <v-data-table
      no-data-text="Não há dados disponiveis..."
      :headers="getHeaders"
      :items="base"
      dense
      :footer-props="footerProps"
    ></v-data-table>
  </v-card>
</template>

<script>
  import config from '../../core/config'
  export default {
    props: {
      title: {
        type: String,
        default: 'title'
      },
      numSuperior: {
        type: Number,
        default: 1
      },
      actionUrl: {
        type: String,
        required: true
      },
      functionDados: {
        type: String
      },
      baseEstudoSpeech: {
        type: String
      },
      dataSelecao: {
        type: [Array, Object]
      },
      icon: {
        type: String
      }
    },
    data: () => ({
      base: [],
      footerProps: {
        itemsPerPageText: 'Itens por página:',
        pageText: '{0}-{1} de {2}',
        perPageText: 'Itens por página:'
      }
    }),
    computed: {
      filtro() {
        return this.$store.getters.usuario.filtro.toLowerCase()
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      getHeaders() {
        let list = this.base[0]

        if (list) {
          let header = []

          Object.keys(list).forEach(item => {
            header.push({
              text: item,
              sortable: true,
              value: item,
              align: 'center',
              class: 'blue darken-1 white--text'
            })
          })
          return header
        }
        return []
      }
    },
    methods: {
      async loadBase() {
        let tipoPerfil = this.filtro == 'coordenador' ? 2 : this.filtro == 'supervisor' ? 3 : 1

        let urlData = `${config.baseUrl}${this.actionUrl}`
        var res = await this.$api.get(urlData, {
          params: {
            baseEstudo: this.baseEstudoSpeech,
            functionDados: this.functionDados,
            tipoPerfil: tipoPerfil,
            usuarioAlmope: this.usuarioAlmope,
            dataInicio: this.dataSelecao[0].dataInicio,
            dataFim: this.dataSelecao[0].dataFim
          }
        })
        this.base = res.data
      }
    },
    created() {
      this.loadBase()
    }
  }
</script>

<style></style>
