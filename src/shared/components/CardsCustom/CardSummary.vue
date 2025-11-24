<template>
  <div v-if="loading" class="mb-8">
    <v-skeleton-loader class="rounded-xl" width="380" type="card"></v-skeleton-loader>
  </div>
  <v-card
    v-else
    class="rounded-xl mb-8"
    outlined
    style="position: relative"
    min-width="550"
    min-height="250"
  >
    <v-list-item>
      <v-list-item-content>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-bottom: 1px solid #ccc;
            padding: 5px;
            gap: 4px;
          "
        >
          <strong class="font-bold">{{ title }}</strong>
          <span style="font-size: 0.75rem" v-if="dateAtt">
            Atualizado: {{ dateAtt | dataFormatada }}
          </span>
        </div>
        <v-divider></v-divider>
        <div style="margin: 5px 0">
          <template v-if="data && data.length">
            <div>
              <v-list-item-title class="headline mb-1" v-if="title">
                <div style="display: flex; align-items: center">
                  <p style="padding: 0; margin: 0; font-size: 19px">
                    {{ resumo }}
                  </p>
                </div>
              </v-list-item-title>
              <v-list-item-subtitle
                v-for="(item, i) in data"
                :key="i"
                :class="item.destacar == 0 ? 'ml-8' : ''"
              >
                <div style="display: flex; justify-content: space-around">
                  <div style="display: flex; width: 7rem">
                    <v-icon size="17" :color="item.iconColor" class="mr-1 py-1 pt-0">
                      {{ item.destacar == 0 ? 'fa-solid fa-code-merge' : item.icon }}
                    </v-icon>
                    <span class="text-capitalize mr-2" :class="item.font">
                      {{ item.text.toLowerCase() }}:
                    </span>
                  </div>
                  <v-divider
                    vertical
                    :style="item.destacar == 0 ? 'margin-left: -33px' : ''"
                  ></v-divider>
                  <div style="width: 6rem">
                    <span>{{ item.value }}</span>
                  </div>
                </div>
              </v-list-item-subtitle>
            </div>
          </template>
          <div class="my-4 text-center" v-else>Nenhuma informação encontrada.</div>
        </div>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
  export default {
    name: 'cardSummary',
    props: {
      title: {
        type: String,
        default: ''
      },
      resumo: {
        type: String,
        default: ''
      },
      headers: {
        type: Array,
        default: () => []
      },
      dateAtt: {
        type: String
      },
      destacar: {
        type: Array,
        default: () => []
      },
      data: {
        type: Array,
        default: () => []
      },
      loading: {
        type: Boolean,
        default: false
      },
      icons: {
        type: Object,
        default: () => ({})
      },
      colorIcons: {
        type: Object,
        default: () => ({})
      }
    },
    data: () => ({}),
    filters: {
      dataFormatada(value) {
        if (!value) return ''
        const options = {
          hour: '2-digit',
          minute: '2-digit'
        }
        return new Date(value).toLocaleDateString('pt-BR', options) + 'h'
      }
    }
  }
</script>

<style scoped>
  .d-grid {
    display: grid;
    gap: 20px;
  }

  .grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    justify-items: center;
    gap: 20px;
  }
</style>
