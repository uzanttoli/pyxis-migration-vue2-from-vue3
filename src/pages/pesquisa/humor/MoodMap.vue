<template>
  <v-card class="rounded-xl">
    <v-card-title class="text-h5 font-weight-bold">
      Mood Map
      <SummarioHumor />
    </v-card-title>
    <v-card-actions>
      <v-btn color="deep-purple lighten-2" text>Reserve</v-btn>
    </v-card-actions>
    <v-card-text>
      <div class="mood-map-container">
        <div class="mood-map-row" v-for="(item, i) in listItems()" :key="i">
          <div
            :style="`display: flex; flex-direction: column; width: 350px; border-left: 4.5px solid ${biggerHumor(
              item
            )}`"
          >
            <div class="mood-map-cell">
              <span style="color: black; font-size: 17px; font-weight: bold">Equipe:</span>
              {{ item.nome }}
            </div>
            <div class="mood-map-cell">
              <span style="color: black; font-size: 17px; font-weight: bold">Média:</span>
              {{ item.media }}
            </div>
          </div>

          <div
            class="mood-map-segment"
            v-for="(subItem, j) in item.minhasAvaliacoes"
            :key="j"
            :style="`background-color: ${COLOR[subItem.humor]}; width: ${proportionHumor(
              item,
              subItem.qtd
            )}%`"
            v-show="subItem.qtd > 0"
          >
            <img :src="imgHumor(subItem.humor)" />
            <span class="mood-score">{{ subItem.qtd }}</span>
          </div>
          <v-divider :key="i + item"></v-divider>
        </div>
        <div class="text-center">
          <v-pagination
            v-model="pagination.page"
            :length="totalVisiblePage"
            :total-visible="pagination.totalVisible"
          ></v-pagination>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
  import SummarioHumor from './SummarioHumor.vue'
  export default {
    components: { SummarioHumor },
    props: {
      abrirRanking: {
        type: Boolean,
        default: true
      }
    },
    data: () => ({
      pagination: {
        page: 1,
        totalPage: 10,
        totalVisible: 7
      },
      COLOR: {
        feliz: '#00C853',
        animado: '#90EE90',
        cansado: '#FFFF00',
        chateado: '#FFA07A',
        triste: '#FF0000'
      },
      resultList: [],
      list: [
        {
          nome: 'Diego Passos Rodrigues',
          media: 12,
          minhasAvaliacoes: [
            { humor: 'feliz', qtd: 10 },
            { humor: 'animado', qtd: 5 },
            { humor: 'cansado', qtd: 8 },
            { humor: 'chateado', qtd: 9 },
            { humor: 'triste', qtd: 6 }
          ]
        },
        {
          nome: 'Diego Passos Rodrigues',
          media: 12,
          minhasAvaliacoes: [
            { humor: 'feliz', qtd: 2 },
            { humor: 'animado', qtd: 10 },
            { humor: 'cansado', qtd: 8 },
            { humor: 'chateado', qtd: 9 },
            { humor: 'triste', qtd: 6 }
          ]
        },
        {
          nome: 'Diego Passos Rodrigues',
          media: 12,
          minhasAvaliacoes: [
            { humor: 'feliz', qtd: 3 },
            { humor: 'animado', qtd: 6 },
            { humor: 'cansado', qtd: 5 },
            { humor: 'chateado', qtd: 15 },
            { humor: 'triste', qtd: 2 }
          ]
        },
        {
          nome: 'Diego Passos Rodrigues',
          media: 12,
          minhasAvaliacoes: [
            { humor: 'feliz', qtd: 3 },
            { humor: 'animado', qtd: 6 },
            { humor: 'cansado', qtd: 5 },
            { humor: 'chateado', qtd: 7 },
            { humor: 'triste', qtd: 15 }
          ]
        },
        {
          nome: 'Diego Passos Rodrigues',
          media: 12,
          minhasAvaliacoes: [
            { humor: 'feliz', qtd: 3 },
            { humor: 'animado', qtd: 6 },
            { humor: 'cansado', qtd: 10 },
            { humor: 'chateado', qtd: 7 },
            { humor: 'triste', qtd: 8 }
          ]
        }
      ]
    }),
    computed: {
      totalVisiblePage() {
        return Math.ceil(this.list.length / this.pagination.totalPage)
      }
    },
    methods: {
      listItems() {
        let result = []
        let count = this.pagination.page * this.pagination.totalPage - this.pagination.totalPage
        // let itemsPerPages = 15
        let delimiter = count == 0 ? this.pagination.totalPage : count + this.pagination.totalPage

        if (count <= delimiter) {
          for (let i = count; i < delimiter; i++) {
            if (this.list[i] != undefined) {
              result.push(this.list[i])
            }
          }
        }
        return (this.resultList = result)
      },
      imgHumor(humor) {
        let imgHumor = require.context('@/assets/img/humor/img-humor-2.0/', false, /\.png$/)
        return imgHumor('./' + humor + '.png')
      },
      proportionHumor(avaliacoes, qtdHumor) {
        if (!avaliacoes) return
        let qtdTotal = avaliacoes.minhasAvaliacoes.reduce((acc, current) => {
          return acc + current.qtd
        }, 0)
        return (100 * qtdHumor) / qtdTotal
      },
      biggerHumor(avaliacoes) {
        if (!avaliacoes) return
        let keyBig = null
        for (let key of avaliacoes.minhasAvaliacoes) {
          if (!keyBig || key.qtd > keyBig.qtd) {
            keyBig = key
          }
        }
        return this.COLOR[keyBig.humor]
      }
    }
  }
</script>

<style scoped>
  img {
    height: 50px;
  }

  .mood-map-container {
    width: 100%;
    overflow-x: auto;
  }

  .mood-map-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  .mood-map-cell {
    padding: 3px 16px;
    /* max-width: 200px; */
    text-align: left;
  }

  .equipe {
    font-weight: bold;
    display: flex;
    flex-direction: row;
  }

  .media {
    font-weight: bold;
    text-align: center;
    display: flex;
    flex-direction: row;
  }

  .mood-map-segment {
    /* flex: 0; */
    min-width: 80px;
    height: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    margin: 0 2px;
    border-radius: 4px;
  }

  .mood-score {
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 4px;
  }

  .v-icon {
    font-size: 24px;
  }
</style>
