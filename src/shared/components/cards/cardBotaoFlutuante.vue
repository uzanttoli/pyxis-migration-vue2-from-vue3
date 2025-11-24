<template>
  <div id="create" v-if="isBirthday && visualized">
    <v-speed-dial>
      <template v-slot:activator>
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn v-bind="attrs" v-on="on" color="primary" dark fab @click="$emit('updated:open')">
              <div>
                <v-img
                  width="45"
                  src="../../../assets/img/icons/mdi-icons/icons8-cute-cake-50.png"
                ></v-img>
              </div>
            </v-btn>
          </template>
          <span>Clique aqui!</span>
        </v-tooltip>
      </template>
      <DialogCake :dialogCake="fab" />
    </v-speed-dial>
  </div>
</template>
<script>
  import DialogCake from '../dialogs/CakeMessage.component.vue'
  import config from '../../../core/config.js'

  import moment from 'moment'
  export default {
    components: {
      // formTlv,
      DialogCake
    },
    data: () => ({
      fab: true,
      visualized: false
    }),
    computed: {
      isBirthday() {
        //Data de Nascimento + Ano atual
        let date = new Date()
        let day = date.getDate().toString()
        let dayF = day.length == 1 ? '0' + day : day
        let month = (date.getMonth() + 1).toString()
        let monthF = month.length == 1 ? '0' + month : month
        let year = date.getFullYear()

        //Info da data dia
        let dataNascimento = this.$store.getters.usuario.nascimento
        let nascimento = dataNascimento.split('-')
        let MonthNas = nascimento[1]
        let dayNas = nascimento[2]
        let yearNas = year

        // Diferenca entre nas e data dia
        let nascimentoF = moment(yearNas + '-' + MonthNas + '-' + dayNas)
        let dayMonth = year + '-' + monthF + '-' + dayF
        let Mday = moment(dayMonth)
        let duration = moment.duration(Mday.diff(nascimentoF))
        let days = duration.asDays()

        return days >= 0 ? true : false
      }
    },
    methods: {
      loadMessagesUser() {
        let urlData = `${config.baseUrl}api/shared/meus_dados/perfil/get_message_user/${this.$store.getters.usuario.almope}`
        this.$api.get(urlData).then(res => {
          if (res.data.length > 0) {
            this.visualized = false
          } else {
            this.visualized = true
          }
        })
      }
    },
    created() {
      this.loadMessagesUser()
    }
  }
</script>
<style scoped>
  #create .v-speed-dial {
    position: fixed;
    bottom: 45px;
    right: 10px;
  }

  #create .v-btn--floating {
    position: relative;
  }
</style>
