<template>
  <v-card class="info-card" outlined>
    <title-negative-margin class="mt-n4" :title="title"></title-negative-margin>
    <div :class="title != 'Abs' ? 'container-title' : 'container-title-abs'">
      <div class="result">
        <h1>
          {{ consolidado ? (percentTitle ? convertPercent(consolidado) : consolidado) : 0 }}
        </h1>
      </div>
      <v-divider v-if="title === 'Abs'" vertical></v-divider>
      <div>
        <v-btn v-if="title === 'Abs'" @click="$emit('update:justificar-abs')" color="success">
          Justificar
        </v-btn>
      </div>
    </div>
    <v-divider></v-divider>
    <v-card-actions>
      <v-expansion-panels flat multiple>
        <v-expansion-panel>
          <v-expansion-panel-header disable-icon-rotate>
            <template v-slot:actions>
              <v-icon class="mx-4" color="orange" small>fa-solid fa-circle-exclamation</v-icon>
            </template>
            <p class="detalhes" style="padding: 0; margin: 0">Detalhes do indicador</p>
          </v-expansion-panel-header>
          <v-expansion-panel-content style="padding: 0 0 16px">
            <div style="background-color: #eaeaea; padding: 10px; border-radius: 10px">
              <ul v-if="infoList">
                <li v-for="(item, index) in infoList" :key="index">
                  {{ item.SUBTITLE }}: {{ item.VALOR }}
                </li>
              </ul>
              <div class="sem-inf" v-else>
                <p>Nada por aqui!</p>
              </div>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    props: {
      infoList: {
        type: [Array, Object]
      },
      title: {
        type: String,
        default: 'Sem Titulo'
      },
      consolidado: {
        type: [String, Number],
        default: 0
      },
      percentTitle: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({}),
    computed: {
      cargo() {
        return this.$store.getters.usuario.filtro
      }
    },
    methods: {
      convertPercent(number) {
        if (!number) return
        if (number == 0.0) return '0,00%'
        return number.replace('.', ',').concat('%')
      }
    }
  }
</script>

<style scoped>
  /* @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Nag+Mundari&display=swap'); */
  .info-card {
    max-width: 380px;
    width: 380px;
    margin: 10px;
    border-radius: 25px;
  }

  .container-title {
    display: flex;
    /* flex-direction: column; */
    align-items: center;
    justify-content: center;
  }

  .container-title-abs {
    display: flex;
    /* flex-direction: column; */
    align-items: center;
    justify-content: space-evenly;
  }
  .title-back {
    background-image: linear-gradient(220deg, rgb(143, 14, 143), rgb(0, 236, 255));
    width: 100%;
    text-align: center;
    border-radius: 30px;
  }

  .container-title h2 {
    font-size: 18px;
    color: #ffffff;
    padding: 5px;
  }

  .result {
    padding: 12px;
  }
  .result h1 {
    font-size: 2em;
  }
  .info-list {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  .info-item {
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .separator {
    margin: 5px;
  }

  .sem-inf {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ul li {
    font-size: 13px;
  }

  a {
    background: #02aa08;
    padding: 10px;
    color: #ffffff;
    border-radius: 5px;
  }

  .detalhes {
    font-family: 'Noto Sans Nag Mundari', sans-serif;
    font-size: 14px;
  }
</style>
