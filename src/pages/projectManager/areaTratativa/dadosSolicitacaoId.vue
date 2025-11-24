<template>
  <div>
    <div class="title-card">
      <p style="font-size: 18px; font-weight: 600; padding: 0; margin: 0">
        {{ dadosTratativa.TITULO_SOLICITACAO }}
      </p>
      <p class="text-caption ma-0 pa-0">
        Essa solicitação foi feita para o produto:
        <span class="font-weight-bold">{{ dadosTratativa.PRODUTO_SOLICITACAO }}</span>
        .
      </p>
      <div class="chips-agrupamento">
        <v-chip
          v-for="(chip, i) in agrupamentos"
          small
          :color="colors.cores[i].cor"
          class="white--text mr-2"
          :key="i"
        >
          {{ chip.text }}
        </v-chip>
      </div>
    </div>
    <div class="data-solicitacao">
      <v-icon size="13" color="green accent-4">fa-solid fa-calendar</v-icon>
      <span>Solicitado {{ formatarData(dadosTratativa.DATA_SOLICITACAO) }}</span>
    </div>
    <div class="chips mb-7">
      <v-chip small color="blue accent-4" pill class="white--text" outlined>
        <v-icon left>fa-solid fa-align-left</v-icon>
        Solicitação
      </v-chip>
      <v-chip small color="grey accent-4" pill class="white--text ml-2" outlined>
        <v-icon left>fa-solid fa-paperclip</v-icon>
        Anexos
      </v-chip>
    </div>
    <div class="dados-solicitacao">
      <p style="font-size: 16px; font-weight: 600; padding: 0; margin: 0">Dados Formulário</p>
      <span>Criado por Project Manager</span>
      <div class="dados-body">
        <div class="dados-form">
          <p style="font-size: 14px; font-weight: 600; padding: 0; margin: 0 0 8px 0">
            <i class="fa-solid fa-user" style="color: #939393cf; margin-right: 10px"></i>
            Nome do Solicitante
          </p>
          <p style="font-size: 12px; padding: 0; margin: 0 0 0 26px; color: #787878">
            {{ dadosTratativa.NOME }}
          </p>
        </div>
        <div class="dados-form">
          <p style="font-size: 14px; font-weight: 600; padding: 0; margin: 0 0 8px 0">
            <i class="fa-solid fa-envelope" style="color: #939393cf; margin-right: 10px"></i>
            Email do Solicitante
          </p>
          <p style="font-size: 12px; padding: 0; margin: 0 0 0 26px; color: #787878">
            <a
              :href="`mailto:${dadosTratativa.EMAIL}`"
              style="font-style: none; text-decoration: none; color: #2c2cd7"
            >
              {{ dadosTratativa.EMAIL }}
            </a>
          </p>
        </div>
        <div class="dados-form">
          <p style="font-size: 14px; font-weight: 600; padding: 0; margin: 0 0 8px 0">
            <i class="fa-regular fa-file-lines" style="color: #939393cf; margin-right: 10px"></i>
            Motivo da Solicitação
          </p>
          <p style="font-size: 12px; padding: 0; margin: 0 0 0 26px; color: #787878">
            {{ dadosTratativa.MOTIVO_SOLICITACAO }}
          </p>
        </div>
        <div class="dados-form">
          <p style="font-size: 14px; font-weight: 600; padding: 0; margin: 0 0 8px 0">
            <i class="fa-solid fa-circle-info" style="color: #939393cf; margin-right: 10px"></i>
            Detalhes da Solicitação
          </p>
          <v-textarea
            class="overflow-auto"
            hide-details
            style="font-size: 12px; color: #787878; outline: none"
            :value="dadosTratativa.DETALHE_SOLICITACAO"
            readonly
            outlined
            dense
            row-height="10"
            rows="6"
          ></v-textarea>
          <!-- <p style="font-size: 12px; padding: 0; margin: 0 0 0 26px; color: #787878;">
            {{ dadosTratativa.DETALHE_SOLICITACAO }}
          </p> -->
        </div>
        <div class="dados-form">
          <p style="font-size: 14px; font-weight: 600; padding: 0; margin: 0 0 8px 0">
            <i class="fa-solid fa-calendar-days" style="color: #939393cf; margin-right: 10px"></i>
            Prazo
          </p>
          <p style="font-size: 12px; padding: 0; margin: 0 0 0 26px; color: #787878">
            {{ moment(dadosTratativa.SLA_FINAL).fromNow() }}
          </p>
        </div>
        <div class="dados-form">
          <fieldset>
            <legend>
              <p style="font-size: 14px; font-weight: 600; padding: 0; margin: 0 0 8px 0">
                <i class="fa-solid fa-paperclip" style="color: #939393cf; margin-right: 10px"></i>
                Anexos
              </p>
            </legend>

            <p style="font-size: 12px; padding: 0; margin: 5px; color: #787878">
              <v-data-table
                hide-default-footer
                :headers="headers"
                no-data-text="Nada anexado ainda!"
                :items="items"
                dense
              >
                <template v-slot:item.NOME_ANEXO="{ item }">
                  <span style="color: #0000ff">{{ item.NOME_ANEXO }}.zip</span>
                </template>
                <template v-slot:item.ACOES="{ item }">
                  <v-btn
                    icon
                    color="success"
                    @click="
                      linkDownload(
                        'http://10.64.175.49:4300/receptivo/index.php/api/generics/download/project_manager/arquivos_zip/' +
                          item.NOME_ANEXO +
                          '.zip'
                      )
                    "
                    target="_blank"
                  >
                    <v-icon>fa-solid fa-cloud-arrow-down</v-icon>
                  </v-btn>
                </template>
                <template v-slot:item.DATA_CRIACAO="{ item }">
                  {{ formatarData(item.DATA_CRIACAO) }}
                </template>
                <template v-slot:item.USUARIO_UP="{ item }">
                  <span>
                    <v-chip
                      :color="usuarioAlmope == item.NOME_ANEXO.slice(0, 7) ? 'green' : 'orange'"
                      small
                      class="white--text"
                    >
                      {{ userAddFile(usuarioAlmope, item.NOME_ANEXO) }}
                    </v-chip>
                  </span>
                </template>
              </v-data-table>
            </p>
          </fieldset>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import config from '../../../core/config'
  import axios from 'axios'
  export default {
    props: {
      dadosTratativa: {
        type: [Array, Object]
      }
    },
    data: () => ({
      agrupamentos: [],
      headers: [
        { text: 'Usúario', value: 'USUARIO_UP', align: 'center' },
        { text: 'Nome do arquivo', value: 'NOME_ANEXO', align: 'start' },
        { text: 'Gravado em', value: 'DATA_CRIACAO', align: 'start' },
        { text: 'Ações', value: 'ACOES', align: 'start' }
      ],
      items: []
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      userAddFile(userLog, userFile) {
        let fileUser = userFile?.slice(0, 7) * 1
        let adm = [4602597, 4637725, 4172639]
        if (!fileUser) return
        if (adm.includes(fileUser)) {
          if (userLog == fileUser) {
            return 'Anexado por você'
          } else {
            return 'Anexo pelo Analista'
          }
        } else if (userLog == fileUser) {
          return `Anexado por você`
        }
        return `Anexado por ${fileUser}`
      },
      async linkDownload(arquivo) {
        const response = await axios.get(arquivo, {
          responseType: 'blob',
          onDownloadProgress: progressEvent => {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            this.uploadPercentage = percentage
          }
        })
        const blob = new Blob([response.data])
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = arquivo.split('/').pop()
        link.click()

        window.URL.revokeObjectURL(url)
      },
      formatarData(string) {
        this.moment.locale('pt-br')
        return this.moment(string).fromNow()
      },
      loadDadosAnexo() {
        let urlData = `${config.baseUrl}api/shared/project_manager/solicitacao/list_anexo_id/${this.$route.params.id}`
        this.$api.get(urlData).then(res => {
          this.items = res.data
        })
      }
    },
    created() {
      this.loadDadosAnexo()
    }
  }
</script>

<style scoped>
  .container-card {
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
    margin-top: 25px;
  }

  .container-formulario {
    /* width: 600px; */
  }
  .title-card {
    margin-bottom: 15px;
  }
  .data-solicitacao {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 10px;
  }
  .data-solicitacao span {
    font-size: 13px;
    color: #3a3a3ac7;
  }

  .circle-ico {
    text-align: center;
    border-radius: 50%;
    background-color: #b9f6ca;
    width: 20px;
  }

  .dados-solicitacao span {
    font-size: 13px;
    color: #3a3a3ac7;
  }

  .dados-body {
    margin-top: 20px;
  }

  .dados-form {
    margin-bottom: 25px;
  }

  /* FASES */
  .container-fase {
    /* width: 600px; */
  }

  .fase-title {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }

  .fase-body {
    margin-top: 24px;
  }

  .field-body {
    margin-bottom: 40px;
  }

  .status-fase {
  }

  .status-fase-title {
    margin-bottom: 15px;
  }

  .actions {
    gap: 10px;
  }

  fieldset {
    padding: 1px;
    border: 1px solid #e1e1e1;
    border-radius: 10px;
    /* max-width: 600px; */
  }

  legend {
    padding: 0 7px;
  }
</style>
