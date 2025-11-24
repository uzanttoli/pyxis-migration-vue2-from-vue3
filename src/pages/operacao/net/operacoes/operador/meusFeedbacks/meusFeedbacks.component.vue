<template>
  <v-container fluid>
    <!-- <v-row> -->
    <div v-for="(item, i) in feedbacks" :key="i" class="mt-2">
      <fieldset>
        <legend>
          <div style="display: flex; align-items: center">
            <i class="fa-solid fa-circle-nodes mr-1 red--text"></i>
            <p class="ma-0 pa-0 text-h6 text-capitalize">
              {{ item.STATUS_TABULACAO.toLowerCase() }}
            </p>
          </div>
        </legend>
        <div class="grid-container">
          <div v-for="(item2, j) in item.ITEMS" :key="j" class="grid-item">
            <v-card
              elevation="1"
              class="rounded-xl"
              min-height="100"
              width="300"
              :to="{
                name: 'FeedbackId',
                query: { id: item2.ID, form: item2.ID_FORM }
              }"
            >
              <v-card-title class="text-h6">
                <v-icon size="18" color="orange" class="mr-2">fa-solid fa-list</v-icon>
                {{ item2.NOME }}
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ attrs, on }">
                    <v-icon size="18" color="green" class="mr-2" v-bind="attrs" v-on="on">
                      fa-solid fa-eye
                    </v-icon>
                  </template>
                  <span>Visualizar feedback</span>
                </v-tooltip>
              </v-card-title>
              <v-divider class="mt-n2"></v-divider>
              <v-col>
                <p>Data monitoria: {{ item2.DATA_MONITORIA }}</p>
                <p>Possui gravação? {{ item2.POSSUI_ANEXO == 1 ? 'Sim' : 'Não' }}</p>
              </v-col>
              <v-divider></v-divider>
              <v-col>
                <v-tooltip bottom>
                  <template v-slot:activator="{ attrs, on }">
                    <p class="ma-0 pa-0 text-sm-subtitle-3 grey--text" v-bind="attrs" v-on="on">
                      {{ item2.DESCRICAO }}
                    </p>
                  </template>
                  <span>{{ item2.DESCRICAO }}</span>
                </v-tooltip>
              </v-col>
            </v-card>
          </div>
        </div>
      </fieldset>
    </div>
    <!-- </v-row> -->
  </v-container>
</template>

<script>
  import config from '../../../../../../core/config'
  export default {
    data() {
      return {
        feedbacks: []
      }
    },
    computed: {
      usuario() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      loadMeusFeedbacks() {
        let urlData = `${config.baseUrl}api/shared/feedback/formulario/meus_feedbacks`
        this.$api
          .get(urlData, {
            params: {
              almope: this.usuario.almope
            }
          })
          .then(res => {
            this.feedbacks = res.data
          })
      }
    },
    created() {
      this.loadMeusFeedbacks()
    }
  }
</script>

<style scoped>
  p {
    margin: 0;
    padding: 0;
    font-size: 12.5px;
    color: #333;
  }

  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 10px;
    /* padding: 10px; */
  }

  /* .grid-container>* {
  background-color: green;
  height: 100px;
} */

  .grid-items {
    border: 1px solid rgba(0, 0, 0, 0.8);
    padding: 20px;
    font-size: 30px;
    text-align: center;
  }

  fieldset {
    padding: 15px;
    border: 1px solid #3333;
    margin-bottom: 15px;
    border-radius: 10px;
  }
  legend {
    padding: 0 10px;
    font-size: 15px;
  }

  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
