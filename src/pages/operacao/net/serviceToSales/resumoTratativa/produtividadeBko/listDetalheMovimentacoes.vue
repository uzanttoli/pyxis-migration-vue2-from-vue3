<template>
  <v-card elevation="0" class="mt-3">
    <v-card-title>
      <h3>📑 Detalhes da Movimentação</h3>
      <span class="ml-2" v-if="idImport">
        (
        <mark>{{ idImport }}</mark>
        )
      </span>
      <v-col class="py-0">
        <download-excel
          :data="data"
          name="MOVIMENTACOES_PYXIS_BKO_ATIV_S2S"
          worksheet="MOVIMENTACOES_PYXIS_BKO_ATIV_S2S"
        >
          <v-btn tile depressed small block>
            <v-icon small class="mr-2">fa-solid fa-file-excel</v-icon>
            Baixar Dados
          </v-btn>
        </download-excel>
      </v-col>
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
      transition="fade-transition"
      :search="search"
      :headers="headers"
      :loading="loading"
      loading-text="Carregando..."
      :items="data"
      :footer-props="footerProps"
      no-data-text="Nada aqui"
      dense
    >
      <template v-slot:item.ID_IMPORTACAO="{ item }">
        <a href="#">{{ item.ID_IMPORTACAO }}</a>
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
      idImport: {
        type: String,
        require: true
      }
    },
    data: () => ({
      headers: [
        {
          text: 'ID Mailing',
          value: 'ID_MAILING',
          align: 'center'
        },
        {
          text: 'Usuario Atualização',
          value: 'USUARIO_ATUALIZACAO',
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
      loadListDataMovements() {
        this.loading = true
        let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/list_movements_id_import/${this.idImport}`
        this.$api.get(urlData).then(res => {
          let idMailing = res.data[0].ID_MAILING.split(',')
          let array = idMailing.map(e => {
            return {
              ID_MAILING: e,
              USUARIO_ATUALIZACAO: res.data[0].USUARIO_ATUALIZACAO,
              DATA_RETORNO: res.data[0].DATA_RETORNO,
              FLAG_VALIDACAO: res.data[0].FLAG_VALIDACAO,
              DATA_ATUALIZACAO: res.data[0].DATA_ATUALIZACAO
            }
          })

          this.data = array
          this.loading = false
        })
      }
    },
    watch: {
      idImport() {
        this.loadListDataMovements()
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

  .fade-transition {
    transition: opacity 0.3s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
