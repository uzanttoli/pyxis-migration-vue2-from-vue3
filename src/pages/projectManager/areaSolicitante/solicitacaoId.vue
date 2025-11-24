<template>
  <v-container fluid class="mt-5">
    <v-row v-if="listInfo != ''">
      <v-col cols="9">
        <dados-demanda-id
          :listInfo="listInfo"
          @update-demanda-cancelada="atualizacaoDemanda"
          @update-demanda-validada="atualizacaoDemanda"
        ></dados-demanda-id>
        <v-row>
          <v-col cols="6">
            <documentos-anexados-id
              :isAttachment="isStatusValid"
              :idHash="listInfo.NUM_SOLIC_HASH"
            ></documentos-anexados-id>
          </v-col>
          <v-col cols="6">
            <mensagens-demanda-id :infoList="listInfo"></mensagens-demanda-id>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3">
        <responsavel-tratativa-id :listInfo="listInfo"></responsavel-tratativa-id>
        <ultimas-atualizacoes-time-line-id :items="items"></ultimas-atualizacoes-time-line-id>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import config from '../../../core/config'
  import DadosDemandaId from './dadosDemandaId.vue'
  import DocumentosAnexadosId from './documentosAnexadosId.vue'
  import MensagensDemandaId from './mensagensDemandaId.vue'
  import responsavelTratativaId from './responsavelTratativaId.vue'
  import UltimasAtualizacoesTimeLineId from './ultimasAtualizacoesTimeLineId.vue'
  export default {
    components: {
      responsavelTratativaId,
      UltimasAtualizacoesTimeLineId,
      DadosDemandaId,
      DocumentosAnexadosId,
      MensagensDemandaId
    },
    data: () => ({
      listInfo: [],
      items: [
        {
          color: 'red lighten-2',
          icon: 'mdi-star'
        },
        {
          color: 'purple darken-1',
          icon: 'mdi-book-variant'
        },
        {
          color: 'green lighten-1',
          icon: 'mdi-airballoon'
        },
        {
          color: 'indigo',
          icon: 'mdi-gate-buffer'
        }
      ]
    }),
    computed: {
      isStatusValid() {
        return this.listInfo.STATUS_SOLICITACAO == 'CANCELADOS' ||
          this.listInfo.STATUS_SOLICITACAO == 'FINALIZADOS'
          ? false
          : true
      },
      nome() {
        let nome = this.$store.getters.usuario.nome
        let nomeSplit = nome.split(' ')[0]
        return nomeSplit[0] + nomeSplit.slice(1, nomeSplit.length).toLowerCase()
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      async atualizacaoDemanda() {
        await this.loadInfoSolicitacao()
      },
      async loadInfoSolicitacao() {
        let urlData = `${config.baseUrl}api/shared/project_manager/solicitacao/info_solicitacao/${this.usuarioAlmope}/${this.$route.params.id}`
        let res = await this.$api.get(urlData)
        let result = res.data
        if (result.length > 0) {
          this.listInfo = res.data[0]
        } else {
          this.$swal.fire({
            icon: 'error',
            title: 'Oops...',
            showConfirmButton: false,
            text: `Solicitação informada não é valida!`
          })
          this.$router.push('/pyxis/project-manager/area-do-solicitante/')
        }
      },
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      }
    },
    created() {
      this.loadInfoSolicitacao()
    }
  }
</script>
<style scoped></style>
