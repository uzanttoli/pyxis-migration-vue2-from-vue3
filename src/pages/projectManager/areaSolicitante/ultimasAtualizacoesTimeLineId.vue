<template>
  <v-card class="rounded-lg pa-3 mt-5" elevation="1">
    <v-card-title>
      <i class="fa-solid fa-timeline" style="color: #262626ba; margin-right: 10px"></i>
      Últimas atualizações
    </v-card-title>
    <v-divider></v-divider>
    <v-container style="max-width: 100%" class="mt-n3">
      <v-timeline clipped dense>
        <v-timeline-item
          v-for="(item, i) in items"
          :key="i"
          :icon="item.FA_ICON"
          :color="item.COLOR"
          fill-dot
        >
          <v-card :color="item.COLOR" dark>
            <div style="height: 35px; display: flex; align-items: center; padding-left: 8px">
              <p
                class="pa-0 ma-0"
                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
              >
                {{ stringCapitalize(item.STATUS_SOLICITACAO) }} -
                {{ item.DATA_ATUALIZACAO | dateFormated }}
              </p>
            </div>
            <v-card-text class="white text--primary">
              <p>
                {{ item.DESCRICAO_SOLICITACAO }}
              </p>
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </v-container>
  </v-card>
</template>

<script>
  import config from '../../../core/config'
  export default {
    props: {
      validado: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      items: []
    }),
    filters: {
      dateFormated: function (value) {
        if (!value) return
        return value.split(' ')[0]
      }
    },
    methods: {
      stringCapitalize(string) {
        if (!string) return
        return this.retirarS(string[0] + string.slice(1, string.length).toLowerCase())
      },
      retirarS(string) {
        if (!string) return
        let s = string[string.length - 1]
        if (s == 's') return string.slice(0, string.length - 1)
        else return string
      },
      loadUltimasAtualizacoes() {
        let urlData = `${config.baseUrl}api/shared/project_manager/solicitacao/ultimas_atualizacoes/${this.$route.params.id}`
        this.$api.get(urlData).then(res => {
          let dados = res.data

          const arrayUnique = []
          const countMap = {}
          dados.forEach(element => {
            const { STATUS_SOLICITACAO } = element
            if (!countMap[STATUS_SOLICITACAO]) {
              countMap[STATUS_SOLICITACAO] = 1
              arrayUnique.push({ ...element })
            } else {
              countMap[STATUS_SOLICITACAO]++
            }
          })
          this.items = arrayUnique
        })
      }
    },
    created() {
      this.loadUltimasAtualizacoes()
    },
    watch: {
      validado() {
        if (this.validado == true) {
          this.loadUltimasAtualizacoes()
        }
      }
    }
  }
</script>

<style></style>
