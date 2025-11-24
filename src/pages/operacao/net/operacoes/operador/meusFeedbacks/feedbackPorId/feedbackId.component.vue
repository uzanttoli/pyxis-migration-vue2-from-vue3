<template>
  <v-container class="mt-5">
    <v-card class="rounded-xl" min-height="200">
      <v-row>
        <v-col xl="9" md="8" lg="8" sm="12">
          <v-card-title>
            Feedback
            <v-chip
              :color="
                detalheFeedback[0].STATUS_TABULACAO == 'AVALIAÇÃO CONCLUÍDA' ? 'success' : 'warning'
              "
              label
              small
              class="ml-2"
              v-if="detalheFeedback.length > 0"
            >
              {{ detalheFeedback[0].STATUS_TABULACAO }}
            </v-chip>
            <v-chip color="info" label small class="ml-2" v-if="dataAceitou">
              {{ dataAceitou }}
            </v-chip>
            <v-spacer></v-spacer>
            <v-btn
              icon
              :to="
                usuario.filtro.toLowerCase() == 'operador'
                  ? '/pyxis/operacoes/operador/dados-online'
                  : '/pyxis/operacoes/supervisor/dados-online'
              "
            >
              <v-icon>fas fa-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-col>
            <p class="pa-0 ma-0" style="font-size: 18px">
              Olá Colaborador. Esse é um feedback sobre seu atendimento.
            </p>
          </v-col>
          <v-col>
            <div v-show="loadingAudio">
              <v-alert text dense color="teal" border="left">
                <i class="fa-solid fa-spinner audio-loading"></i>
                Buscando audio... por favor aguarde!
              </v-alert>
            </div>
            <div v-show="!loadingAudio">
              <audio controls id="audio-player" controlsList="nodownload" style="width: 100%">
                <source src="" type="audio/ogg" />
                <source src="horse.mp3" type="audio/mpeg" />
                Your browser does not support the audio tag.
              </audio>
              <!-- <AVWaveform src="" /> -->
              <!-- <button @click="protegerAudio()">Proteger Áudio</button> -->
            </div>
          </v-col>
          <v-col>
            <v-row>
              <v-col
                v-for="(item, i) in detalheFeedback"
                :key="i"
                :cols="item.TIPO == 'v-text-area' ? 12 : 3"
                class="mb-n6"
              >
                <template v-if="item.TIPO != 'v-text-area'">
                  <v-text-field
                    outlined
                    dense
                    filled
                    readonly
                    :label="item.PERGUNTA"
                    :placeholder="item.PERGUNTA"
                    :value="item.RESPOSTA"
                  ></v-text-field>
                </template>
                <template v-else>
                  <v-textarea
                    outlined
                    filled
                    readonly
                    :label="item.PERGUNTA"
                    :placeholder="item.PERGUNTA"
                    :value="item.RESPOSTA"
                  ></v-textarea>
                </template>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="usuario.filtro.toLowerCase() == 'operador'">
            <div>
              <div style="display: flex; align-items: center; gap: 5px">
                <input
                  type="checkbox"
                  name=""
                  id="checkbox"
                  @change="handleFeedback"
                  :disabled="aceiteFeedback"
                />
                <label for="checkbox">Aceitar feedback do meu gestor</label>
              </div>
              <div
                style="border-top: 1px solid #333; width: 300px; margin-top: 10px"
                v-if="aceiteFeedback"
              >
                <p class="mt-1">Aceite Virtualmente</p>
                <p>{{ usuario.nome }} - {{ usuario.almope }}</p>
                <p>
                  Data Hora Aceite:
                  {{ dataAceite ? dataAceite : new Date().toLocaleString().substring(0, 17) }}
                </p>
              </div>
            </div>
          </v-col>
          <!-- <pre>{{(contestacao.length >= 0 && usuario.filtro.toLowerCase() == 'operador') && !aceiteFeedback }}</pre> -->
          <template
            v-if="
              (contestacao.length >= 0 &&
                usuario.filtro.toLowerCase() == 'operador' &&
                !aceiteFeedback) ||
              (usuario.filtro.toLowerCase() == 'supervisor' &&
                contestacao.length > 0 &&
                !aceiteFeedback)
            "
          >
            <v-col>
              <!-- <v-btn color="success" class="mr-2">Aceitar</v-btn> -->
              <v-btn color="warning" @click="contestarMonitoria">
                {{ usuario.filtro.toLowerCase() == 'operador' ? 'Contestar' : 'Responder' }}
                feedback
              </v-btn>
            </v-col>
            <v-col v-if="contestar">
              <v-textarea
                outlined
                label="Justifique o porque você gostaria de contestar o feedback"
                placeholder="Explique o porque você não concorda com o feedback. Seu gestor verá essa descrição"
                persistent-placeholder
                v-model="descricaoContestacao"
              ></v-textarea>
              <v-btn
                @click="contestarFeedback"
                color="success"
                class="mt-n3"
                :disabled="descricaoContestacao == ''"
              >
                Salvar {{ usuario.filtro.toLowerCase() == 'operador' ? 'Contestação' : 'Resposta' }}
              </v-btn>
            </v-col>
          </template>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col xl="3" md="4" lg="4" sm="12">
          <v-card-title>
            Contestações
            <v-chip color="success" label small class="ml-2">{{ contestacao.length }}</v-chip>
          </v-card-title>
          <v-divider></v-divider>
          <v-col cols="12">
            <Contestacoes :contestacao="contestacao" />
          </v-col>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
  import config from '../../../../../../../core/config'
  import axios from 'axios'
  // import { AVWaveform } from "vue-audio-visual";
  import Contestacoes from './Contestacoes.vue'
  import alerts from '../../../../../../../mixins/alerts.mixins'
  export default {
    components: { Contestacoes },
    data: () => ({
      contestar: false,
      aceiteFeedback: false,
      detalheFeedback: [],
      contestacao: [],
      dataAceitou: null,
      descricaoContestacao: null,
      loadingAudio: true
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      dataAceite() {
        let data = this.detalheFeedback[0]
        if (data.length > 0) {
          // let dataSplit = data.DATA_ACEITE.split("-");
          if (data.DATA_ACEITE) {
            const [ano, mes, dia] = data.DATA_ACEITE.substring(0, 10).split('-')
            return `${dia}/${mes}/${ano} ${data.DATA_ACEITE.substring(11, 16)}`
          }
          // let aceite = data?.ACEITE.split('-').reverse().join("/");
          // return aceite
        }
        return null
      }
    },
    mixins: [alerts],
    methods: {
      loadContestacao() {
        let urlData = `${config.baseUrl}api/shared/feedback/formulario/contestacao`
        this.$api
          .get(urlData, {
            params: {
              id: this.$route.query.id
            }
          })
          .then(res => {
            let response
            response = res.data.map(item => {
              return {
                send: item.ALMOPE,
                nome: item.NOME,
                msgContestacao: item.TEXTO,
                acao: item.ACAO,
                data: item.DATA_CONTESTACAO
              }
            })
            this.contestacao = response
          })
      },
      async contestarFeedback() {
        let urlData = `${config.baseUrl}api/shared/feedback/formulario/contestacao`

        var res = await this.$api.post(urlData, {
          almope: this.usuario.almope,
          perfil: this.usuario.filtro.toLowerCase(),
          idContestacao: this.$route.query.id,
          textContestacao: this.descricaoContestacao
          // acao: "NOTIFICACAO_INICIAL",
        })
        if (res.data.cod != 400) {
          this.contestacao.push({
            send: this.usuario.almope,
            nome: this.usuario.nome,
            msgContestacao: this.descricaoContestacao,
            // acao: "CONTESTAÇÃO",
            data: new Date().toLocaleString()
          })
          this.descricaoContestacao = null
        }
        if (res.data.cod == 400) {
          this.toast(res.data.msg, 'top-right', false, 2000, 'warning')
        } else {
          this.toast('Contestação enviada com sucesso!', 'top-right', false, 2000, 'success')
        }
      },
      async protegerAudio(idAudio) {
        try {
          // this.loadingAudio = true;
          const audioPlayer = document.getElementById('audio-player')

          const activeSource = audioPlayer.querySelector('source')
          if (!activeSource || !activeSource.src) {
            console.error('Fonte de áudio não encontrada ou sem URL!')
            return
          }
          // c3c84e0b-cf3e-4e97-a67a-b6a444cae74a.wav
          let contentSrc = `http://10.64.175.49:4300/receptivo/index.php/api/arquivos/get_arquivo_2/feedback/${idAudio}`
          const response = await axios.get(contentSrc, {
            responseType: 'blob'
          })

          const blobUrl = URL.createObjectURL(new Blob([response.data]))

          activeSource.src = blobUrl

          audioPlayer.load()
          this.loadingAudio = false
        } catch (error) {
          console.error('Erro ao proteger o áudio:', error)
          this.loadingAudio = false
        }
      },

      contestarMonitoria() {
        this.contestar = !this.contestar
      },
      async handleFeedback() {
        try {
          let urlData = `${config.baseUrl}api/shared/feedback/formulario/atualizar_feedback`
          await this.$api.post(urlData, {
            id: this.$route.query.id
          })
          this.aceiteFeedback = true
          this.toast('Feedback aceito com sucesso!', 'top-right', false, 2000, 'success')
        } catch (e) {
          this.toast(
            'Não foi possível realizar o aceite do seu feedback, tente novamente!',
            'top-right',
            false,
            2000,
            'error'
          )
        }
      },
      async loadDetalheFeedback() {
        let urlData = `${config.baseUrl}api/shared/feedback/formulario/detalhe_feedback`
        var res = await this.$api.get(urlData, {
          params: {
            id: this.$route.query.id,
            idForm: this.$route.query.form
          }
        })
        this.detalheFeedback = res.data

        let data = res.data[0]
        if (data.DATA_ACEITE) {
          this.aceiteFeedback = data?.STATUS_TABULACAO == 'AVALIAÇÃO CONCLUÍDA' ? true : false
          const [ano, mes, dia] = data?.DATA_ACEITE?.substring(0, 10).split('-') ?? null

          this.dataAceitou = `${dia}/${mes}/${ano} ${data?.DATA_ACEITE?.substring(11, 16)}` ?? null
        }

        if (res.data && res.data[0]?.POSSUI_ANEXO) {
          await this.protegerAudio(`${res.data[0]?.ID}.${res.data[0]?.EXTENSAO}`)
        } else {
          this.loadingAudio = false
        }
      }
    },
    created() {
      this.loadDetalheFeedback()
      this.loadContestacao()
    }
  }
</script>

<style scoped>
  p {
    padding: 0;
    margin: 0;
    font-size: 12px;
  }

  label {
    font-size: 12px;
  }

  .audio-loading {
    animation: transition 2s infinite;
  }

  @keyframes transition {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(340deg);
    }
  }
</style>
