<template>
  <v-card elevation="0" class="mt-3">
    <v-card-title>
      <h3>💻 Movimentações</h3>
      <v-spacer></v-spacer>
      <v-col class="py-0" cols="3">
        <v-text-field
          dense
          placeholder="Pesquise aqui!"
          solo
          class="rounded-bl-xl rounded-r-xl"
          v-model="search"
        ></v-text-field>
      </v-col>
    </v-card-title>
    <v-data-table
      :search="search"
      :loading="loading"
      loading-text="Carregando..."
      :headers="headers"
      :items="data"
      no-data-text="Nada aqui"
      :footer-props="footerProps"
      dense
    >
      <template v-slot:item.ID_IMPORTACAO="{ item }">
        <a
          @click="emitirEventoComID(item.ID_IMPORTACAO)"
          v-if="idSelecionado == item.ID_IMPORTACAO"
        >
          <mark>{{ item.ID_IMPORTACAO }}</mark>
        </a>
        <a v-else @click="emitirEventoComID(item.ID_IMPORTACAO)">{{ item.ID_IMPORTACAO }}</a>
      </template>
      <template v-slot:item.DATA_RETORNO="{ item }">
        {{ formatData(item.DATA_RETORNO) }}
      </template>
      <template v-slot:item.DATA_ATUALIZACAO="{ item }">
        {{ formatData(item.DATA_ATUALIZACAO) }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import config from '@/core/config'
  export default {
    props: {
      atualizarHistorico: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      headers: [
        {
          text: 'ID Importação',
          value: 'ID_IMPORTACAO',
          align: 'center'
        },
        {
          text: 'Quantidade',
          value: 'QTD_IMPORTACAO',
          align: 'center'
        },
        {
          text: 'Usuario Atualização',
          value: 'USUARIO_ATUALIZACAO',
          align: 'center'
        },
        {
          text: 'Nome',
          value: 'NOME',
          align: 'center'
        },
        {
          text: 'Data Do Retorno',
          value: 'DATA_RETORNO',
          align: 'center'
        },
        {
          text: 'Flag Validação',
          value: 'FLAG_VALIDACAO',
          align: 'center'
        },
        {
          text: 'Data Da Atualização',
          value: 'DATA_ATUALIZACAO',
          align: 'center'
        }
      ],
      data: [],
      loading: false,
      search: null,
      idSelecionado: null,
      footerProps: {
        itemsPerPageText: 'Itens por página:',
        pageText: '{0}-{1} de {2}',
        perPageText: 'Itens por página:'
      }
    }),
    methods: {
      formatData(date) {
        if (!date) return

        let dateSplit = date.split('-')
        const [ano, mes, dia] = dateSplit
        return dia + '/' + mes + '/' + ano
      },
      emitirEventoComID(item) {
        this.idSelecionado = item
        this.$emit('update:emitirID', item)
      },
      loadListDataMovements() {
        this.loading = true
        let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/list_movements_mailing/`
        this.$api.get(urlData).then(res => {
          this.data = res.data
          this.loading = false
        })
      }
    },
    watch: {
      atualizarHistorico() {
        if (this.atualizarHistorico) {
          this.loadListDataMovements()
        }
      }
    },
    created() {
      this.loadListDataMovements()
    }
  }
</script>

<style scoped>
  a {
    color: blue;
  }
</style>
