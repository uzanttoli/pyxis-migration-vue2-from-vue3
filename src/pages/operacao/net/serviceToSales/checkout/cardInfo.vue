<template>
  <div style="display: flex; justify-content: center; flex-wrap: wrap">
    <div v-for="(list, i) in listDados" :key="i" style="margin: 8px">
      <v-card class="mx-auto rounded-lg" elevation="0" outlined width="300">
        <v-list-item>
          <v-list-item-content>
            <div class="pa-1 mb-1" style="display: flex; justify-content: center; width: 100px">
              <p class="pa-0 pb-1 ma-0" style="border-bottom: 1px solid #3333">
                <strong>{{ list.COLUNA }}</strong>
              </p>
            </div>
            <v-divider></v-divider>
            <div>
              <v-list-item-title class="headline mb-1">
                <div style="display: flex; align-items: center">
                  <v-icon color="info" class="mr-2">fa-solid fa-square-poll-horizontal</v-icon>
                  <p style="padding: 0; margin: 0; font-size: 19px" class="body-1">
                    {{
                      list.COLUNA == 'CONSOLIDADO' ||
                      list.COLUNA == 'MAILING PENDENTE' ||
                      list.COLUNA == '(%) MAILING PENDENTE'
                        ? 'Total:'
                        : 'Realizado:'
                    }}
                    {{ milhar(list.VALOR) }}
                  </p>
                </div>
              </v-list-item-title>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      listDados: {
        type: Array,
        require: true
      }
    },
    methods: {
      milhar(value) {
        if (!value) return '0'
        let num = value * 1
        if (!isNaN(value)) {
          return num.toLocaleString()
        } else {
          return value
        }
      }
    }
  }
</script>

<style scoped>
  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
