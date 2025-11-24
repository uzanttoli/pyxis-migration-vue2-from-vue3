<template>
  <v-app-bar app color="cor-padrao" dark dense>
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
  </v-app-bar>
</template>
<script>
  import config from '../config'

  export default {
    components: {},
    data() {
      return {
        comprou: false,
        user: {
          email: 'Email indisponivel'
        },
        acessos: [],
        sendSuccess: false,
        langData: [],
        languages: [
          { text: 'Português', value: 'Português' },
          { text: 'Italiano', value: 'Italiano' },
          { text: 'Inglês', value: 'Inglês' }
        ],
        dialogExpurgo: false,
        dialogCadastroDeImprodutivo: false,
        dialogAvatar: false,
        dialogExibirHumor: false,
        dadosUsuarioLogado: {
          almope: this.$store.getters.almope,
          log: 0
        }
      }
    },
    computed: {
      occupation() {
        return this.$store.getters.usuario.filtro
      },
      salutation() {
        let date = new Date()
        let hours = date.getHours().toString()
        let hoursFormat = hours.length == 1 ? '0' + hours : hours
        let minutes = date.getMinutes().toString()
        let minutesFormat = minutes.length == 1 ? '0' + minutes : minutes

        let hoursMinutes = hoursFormat + ':' + minutesFormat
        //
        if (hoursMinutes >= '00:00' && hoursFormat <= '11:59') {
          return 'Bom dia'
        } else if (hoursMinutes >= '12:00' && hoursMinutes <= '17:59') {
          return 'Boa tarde'
        } else {
          return 'Boa noite'
        }
        // return hoursMinutes;
      },
      usuarioPiloto() {
        let usuarioPiloto = this.$store.getters.usuarioPiloto[0]
        if (usuarioPiloto) {
          return usuarioPiloto
        }
        return []
      },

      userName() {
        let nome = this.$store.getters.usuario.nome || ''
        let oneName = nome.split(' ')
        let nameExhibition = oneName[0]
        return nameExhibition.toLowerCase()
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      imgSelecionado() {
        if (this.$store.getters.myHumor) {
          return this.$store.getters.myHumor.HUMOR
        }
        return localStorage.getItem('humor')
      },
      // getAvatarUrl() {
      //   let myAvatar = this.$store.getters.myAvatar;
      //   if (myAvatar) {
      //     var avatar = require.context(
      //       "../../assets/img/Avatar/",
      //       false,
      //       /\.png$/
      //     );
      //     return avatar("./" + myAvatar + ".png");
      //   } else {
      //     return false;
      //   }
      // },
      saveAvatarData() {
        return this.$store.getters.saveAvatarData
      }
      // language() {
      //   let language = this.$store.getters.language;
      //   return language ? language : [];
      // },
    },

    methods: {
      // loadLanguages() {
      //   this.$store.dispatch("loadLanguage", this.usuarioAlmope);
      // },
      // loadLanguageSelected() {
      //   let urlData = `${config.baseUrl}api/shared/languages/languages_selected/${this.usuarioAlmope}`;
      //   this.$api.get(urlData).then((res) => {
      //     this.langData = res.data;
      //   });
      // },

      sendOptionsLanguages() {
        if (this.langData == '') {
          let urlData = `${config.baseUrl}api/shared/languages/insert`
          let getFormData = object =>
            Object.keys(object).reduce((FormData, key) => {
              FormData.append(key, object[key])
              return FormData
            }, new FormData())
          const data = {
            almope: this.$store.getters.usuario.almope,
            idioma: this.$i18n.locale
          }

          this.$api
            .post(urlData, getFormData(data))
            .then(() => {
              this.sendSuccess = true
              setTimeout(() => {
                this.sendSuccess = false
              }, 1000)
            })
            .catch(e => {
              console.error(e)
            })
        } else {
          let urlData = `${config.baseUrl}api/shared/languages/update`
          let getFormData = object =>
            Object.keys(object).reduce((FormData, key) => {
              FormData.append(key, object[key])
              return FormData
            }, new FormData())

          const data = {
            almope: this.$store.getters.usuario.almope,
            idioma: this.$i18n.locale
          }

          this.$api
            .post(urlData, getFormData(data))
            .then(() => {
              this.sendSuccess = true
              setTimeout(() => {
                this.sendSuccess = false
              }, 1000)
            })
            .catch(() => {})
        }
      },
      loadAcessPyxis() {
        let urlData = `${config.baseUrl}api/shared/registro_log_pyxis/acessos_pyxis`
        this.$api.get(urlData).then(res => {
          this.acessos = res.data[0].CONTAGEM
        })
      },
      loadMyAvatar() {
        return this.$store.dispatch('loadMyAvatar', this.usuarioAlmope)
      },

      getImgUrl(imgSelecionado) {
        var images = require.context('../../assets/img/humor/', false, /\.png$/)
        return images('./' + imgSelecionado + '.png')
      },
      exibirReset() {
        this.$emit('showForm')
      },
      loadMyHumor() {
        return this.$store.dispatch('loadMyHumor', this.usuarioAlmope)
      },

      deslogar() {
        localStorage.clear()
        this.$store.dispatch('deslogar')
        // this.$router.push('Login')
      }
    },
    mounted() {
      this.loadMyHumor()
      this.loadMyAvatar()
      // this.loadLanguageSelected();
    },
    watch: {
      // sendSuccess() {
      //   if (this.sendSuccess == true) {
      //     this.loadLanguageSelected();
      //   }
      // },
      saveAvatarData() {
        if (this.saveAvatarData == true) {
          this.loadMyAvatar()
        }
      }
    },
    created() {
      this.loadAcessPyxis()
    }
  }
</script>
<style scoped>
  .mouse {
    cursor: pointer;
  }
  #select {
    position: absolute;
    right: 165px;
    width: 150px;
    top: 12px;
  }
</style>
