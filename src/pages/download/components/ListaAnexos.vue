<template>
  <v-container fluid>
    <v-card class="rounded-xl" color="grey lighten-5">
      <v-card-title>
        <v-icon class="mr-2" color="orange">fa-solid fa-bars-progress</v-icon>
        Download de arquivos
      </v-card-title>
      <v-card-subtitle>
        Aqui você poderá baixar os arquivos disponibilizados pela equipe do CCO. Para liberação ou
        solicitação, favor abrir demanda.
      </v-card-subtitle>
      <v-divider></v-divider>
      <v-col>
        <v-row>
          <v-col>
            <v-autocomplete
              outlined
              dense
              placeholder="Produto"
              label="Produto"
              :items="produtoRelatorio"
              v-model="produtoSelecionado"
              no-data-text="Não há produto disponível"
              @change="loadListaArquivosDownload"
            ></v-autocomplete>
          </v-col>
          <v-col>
            <v-autocomplete
              placeholder="Selecione o relatório"
              label="Selecione o relatório"
              outlined
              dense
              no-data-text="Relatório não localizado."
              return-object
              :items="listaDeArquios"
              v-model="formularioSelecionado"
              item-text="NOME_FANTASIA"
              item-value="ID_BASE"
              @change="
                loadListaDeArquivosDownloadTabela(
                  formularioSelecionado.ID_BASE,
                  formularioSelecionado.NOME_FANTASIA
                )
              "
            ></v-autocomplete>
          </v-col>
          <v-col>
            <v-text-field
              placeholder="Pesquisar"
              label="Pesquisar"
              outlined
              dense
              v-model="search"
            ></v-text-field>
          </v-col>
        </v-row>
        <div class="">
          <v-card class="rounded-xl" elevation="1">
            <v-card-title>Lista</v-card-title>
            <v-data-table
              :headers="arrHeaders"
              :items="listaTabelaDownload"
              :loading="loading"
              :search="search"
              dense
              loading-text="Carregando..."
              no-data-text="Nenhum arquivo carregado..."
              no-results-text="Arquivo não encontrado!"
            >
              <template v-slot:item.IMAGE_ARQUIVO="{ item }">
                <img
                  height="45"
                  src="@/assets/img/geral/pasta-de-arquivo-zip.png"
                  :alt="item.NOME_ARQUIVO"
                />
              </template>
              <template v-slot:item.DATA_CRIACAO="{ item }">
                {{ item.DATA_CRIACAO.split('-').reverse().join('/') }}
              </template>
              <template v-slot:item.HREF="{ item }">
                <v-btn icon small color="success" :href="item.HREF">
                  <v-icon small>fa-solid fa-download</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </div>
      </v-col>
    </v-card>
  </v-container>
</template>

<script>
  import Utils from '@/data/services/common/Utils'
  import { mapGetters } from 'vuex'
  import DownloadService from '../services/DownloadService'

  export default {
    data: () => ({
      produtoRelatorio: [],
      listaDeArquios: [],
      produtoSelecionado: null,
      formularioSelecionado: null,
      listaTabelaDownload: [],
      search: null,
      loading: false,
      arrHeaders: [
        {
          text: '',
          value: 'IMAGE_ARQUIVO',
          align: 'center',
          sortable: false
        },
        {
          text: 'ID Registro',
          value: 'ID',
          align: 'start'
        },
        {
          text: 'ID Usuario Cadastro',
          value: 'ID_USUARIO',
          align: 'start'
        },
        {
          text: 'Nome Cadastro',
          value: 'NOME_CADASTRO',
          align: 'start'
        },
        {
          text: 'Nome Arquivo',
          value: 'NOME_ARQUIVO',
          align: 'start'
        },
        {
          text: 'Data Upload',
          value: 'DATA_CRIACAO',
          align: 'center'
        },
        {
          text: 'Baixar',
          value: 'HREF',
          align: 'center'
        }
      ]
    }),
    computed: {
      ...mapGetters({
        usuario: 'usuario'
      })
    },
    methods: {
      async getLinkDownload(id) {
        await DownloadService.getLinkDownload(id)
      },
      async loadDataService() {
        this.produtoRelatorio = await Utils.getProductAvailable(
          'ANEXO',
          this.usuario.filtro,
          this.usuario.almope
        )
      },
      async loadListaArquivosDownload() {
        this.listaDeArquios = await DownloadService.getListarAnexo(
          this.produtoSelecionado,
          this.usuario.filtro,
          this.usuario.almope
        )
      },
      async loadListaDeArquivosDownloadTabela(idForm, nomeForm) {
        this.loading = true
        this.listaTabelaDownload = await DownloadService.getArquivosParaDownload(idForm, nomeForm)
        this.loading = false
      }
    },
    async created() {
      await this.loadDataService()
      // this.loadListaArquivosDownload()
    }
  }
</script>

<style scoped></style>
