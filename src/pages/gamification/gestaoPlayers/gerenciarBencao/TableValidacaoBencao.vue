<template>
  <v-card elevation="0" class="rounded-tl-xl mt-7">
    <title-rounded-tl-rb class="mb-4">
      <template v-slot:title>
        <v-icon color="white" class="mr-2">mdi-hands-pray</v-icon>
        <h2 class="white--text">Validação Benção</h2>
      </template>
    </title-rounded-tl-rb>
    <v-data-table
      v-model:page="page"
      :items-per-page="15"
      hide-default-footer
      @page-count="pageCount = $event"
      :headers="headers"
      :items="dados"
      class="text-no-wrap"
      dense
      no-data-text="Não há solicitações pendentes"
    >
      <template v-slot:item.NOME_AVATAR="{ item }">
        <v-avatar v-if="item.NOME_AVATAR != null">
          <img :src="imagemPerfil(item.NOME_AVATAR)" />
        </v-avatar>
        <v-avatar v-else>
          <img src="../../../../assets/img/Avatar/padrao.png" />
        </v-avatar>
      </template>
      <template v-slot:item.ACOES="{ item }">
        <v-btn
          class="btn-validar white--text"
          rounded
          :to="{
            name: 'ValidacaoBencaoID',
            params: { id: item.ID }
          }"
        >
          VALIDAR
        </v-btn>
      </template>
      <template v-slot:item.DATA_HORA_BENCAO="{ item }">
        {{ item.DATA_HORA_BENCAO | tratarDatas }}
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount" @input="changePage"></v-pagination>
    </div>
    <dialog-evidencia-bencao
      :imgEvidencia="imgEvidenciaSelecionada"
      :dialogEvidenciaBencao="dialogEvidenciaBencao"
    ></dialog-evidencia-bencao>
  </v-card>
</template>

<script>
  import config from '../../../../core/config'
  import DialogEvidenciaBencao from './DialogEvidenciaBencao.vue'
  export default {
    components: { DialogEvidenciaBencao },
    data: () => ({
      page: 1,
      pageCount: 0,
      dados: [],
      imgEvidenciaSelecionada: '',
      dialogEvidenciaBencao: false,
      headers: [
        {
          text: 'ID',
          align: 'center',
          value: 'ID'
        },
        {
          text: 'Imagem Perfil',
          align: 'center',
          value: 'NOME_AVATAR'
        },
        {
          text: 'Almope',
          align: 'center',
          value: 'ALMOPE_PLAYER'
        },
        {
          text: 'Nome',
          align: 'center',
          value: 'NOME_PLAYER'
        },
        {
          text: 'Supervisor',
          align: 'center',
          value: 'NOME_GESTOR'
        },
        {
          text: 'Regional',
          align: 'center',
          value: 'REGIONAL'
        },
        {
          text: 'Solicitado Dia',
          align: 'center',
          value: 'DATA_HORA_BENCAO'
        },
        // {
        //   text: "Evidência",
        //   align: "center",
        //   value: "EVIDENCIA_BENCAO",
        // },
        {
          text: 'Ações',
          align: 'center',
          value: 'ACOES'
        }
      ]
    }),
    filters: {
      tratarDatas(value) {
        let dataConvertida = value.substring(0, 10).split('-').reverse().join('/')
        return dataConvertida
      }
    },
    methods: {
      changePage(page) {
        this.$router.push({ query: { ...this.$route.query, page } })
      },
      verificarEvidencia(e) {
        this.imgEvidenciaSelecionada = e
        this.dialogEvidenciaBencao = !this.dialogEvidenciaBencao
      },
      imagemPerfil(img) {
        // http://172.16.252.214:4200/index.php/
        return `${config.baseUrl}api/shared/arquivos/minha_imagem/${img}`
      },
      imagemEvidenciaBencao(img) {
        return `${config.baseUrl}api/shared/arquivos/imagem_evidencia_bencao/${img}`
      },
      listarPendentesBencao() {
        let urlData = `${config.baseUrl}api/shared/gamification/gestao_player/listar_validacao_bencao/`
        this.$api.get(urlData).then(res => {
          if (res.data == '' || res.data == [] || res.data == null) {
            return ''
          } else {
            this.dados = res.data
          }
        })
      }
    },
    created() {
      this.listarPendentesBencao()

      const params = new URLSearchParams(window.location.search)
      const page = parseInt(params.get('page')) || 1
      this.page = page
    }
  }
</script>

<style scoped>
  .img-evidencia {
    width: 10px;
    cursor: pointer;
  }

  img {
    width: 150px;
  }

  .btn-validar {
    background-image: linear-gradient(220deg, rgb(0, 236, 255), rgb(143, 14, 143));
  }
</style>
