<template>
  <v-col cols="12">
    <v-card>
      <title-negative-margin title="Banners Cadastrados">
        <span class="d-flex justify-start">
          <v-switch inset class="ml-3" label="Ativo" v-model="ativo"></v-switch>
        </span>
      </title-negative-margin>
      <v-card class="mx-auto mt-5 overflow-auto" max-height="400">
        <v-container fluid>
          <v-row v-if="listarBannerCadastrados != ''">
            <v-col cols="4" v-for="(banner, i) in listarBannerCadastrados" :key="i">
              <div align="center">
                <v-img width="600" :src="imagemBanner(banner.NOME_ARQUIVO_IMAGEM)">
                  <v-row justify="end">
                    <v-btn
                      rounded
                      v-if="banner.FIX_BANNER != 1"
                      fab
                      x-small
                      color="blue"
                      :disabled="banner.DEFAULT_BANNER === 1"
                      class="mt-5 mr-2"
                      @click="atualizarFixarBanner(banner.ID_BANNER, 1)"
                    >
                      <v-icon color="white">fas fa-thumbtack</v-icon>
                    </v-btn>
                    <v-btn
                      rounded
                      fab
                      x-small
                      color="blue"
                      @click="atualizarFixarBanner(banner.ID_BANNER, 0)"
                      :disabled="banner.DEFAULT_BANNER === 1"
                      class="mt-5 mr-2"
                      v-else
                    >
                      <v-icon color="white">mdi-pin-off</v-icon>
                    </v-btn>
                    <v-btn
                      v-if="banner.VISIVEL == 1"
                      rounded
                      fab
                      :disabled="banner.DEFAULT_BANNER === 1"
                      x-small
                      color="red"
                      class="mt-5 mr-6"
                      @click="atualizarStatusBanner(banner.ID_BANNER, 0)"
                    >
                      <v-icon color="white">mdi-delete</v-icon>
                    </v-btn>
                    <v-btn
                      v-else
                      rounded
                      fab
                      x-small
                      :disabled="banner.DEFAULT_BANNER === 1"
                      color="orange"
                      class="mt-5 mr-6"
                      @click="atualizarStatusBanner(banner.ID_BANNER, 1)"
                    >
                      <v-icon color="white">mdi-restart</v-icon>
                    </v-btn>
                  </v-row>
                </v-img>
              </div>
            </v-col>
          </v-row>
          <v-row v-else align="center" justify="center" class="pa-5">
            Não há banner cadastrados!
          </v-row>
        </v-container>
      </v-card>
    </v-card>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-col>
</template>

<script>
  export default {
    data: () => ({
      overlay: false,
      ativo: 1
    }),
    computed: {
      listarBannerCadastrados() {
        let listarBannerCadastrados = this.$store.getters.listarBannerCadastrados
        return listarBannerCadastrados ? listarBannerCadastrados : []
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      dataAtual() {
        const hoje = new Date()
        const dia = hoje.getDate().toString().padStart(2, '0')
        const mes = String(hoje.getMonth() + 1).padStart(2, '0')
        const ano = hoje.getFullYear()
        return `${dia} / ${mes} / ${ano}`
      }
    },
    methods: {
      atualizarFixarBanner(value, status) {
        this.overlay = true
        this.$store
          .dispatch('atualizarFixarBanner', {
            fixBanner: status,
            editadoPor: this.usuarioAlmope,
            editadoEm: this.dataAtual,
            idBanner: value
          })
          .then(() => {
            this.loadListarBannerCadastrados()
            this.overlay = false
          })
      },
      atualizarStatusBanner(value, status) {
        this.overlay = true
        this.$store
          .dispatch('atualizarStatusBanner', {
            visivel: status,
            editadoPor: this.usuarioAlmope,
            editadoEm: this.dataAtual,
            idBanner: value
          })
          .then(() => {
            this.loadListarBannerCadastrados()
            this.overlay = false
          })
      },
      imagemBanner(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/imagem_banner/${img}`
      },
      loadListarBannerCadastrados() {
        let status = this.ativo == true ? 1 : 0
        this.$store.dispatch('loadListarBannerCadastrados', status)
      }
    },
    watch: {
      ativo() {
        this.loadListarBannerCadastrados()
      }
    },
    created() {
      this.loadListarBannerCadastrados()
    }
  }
</script>

<style></style>
