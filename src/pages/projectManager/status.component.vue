<template>
  <div style="width: 100%; padding-top: 10px; margin-top: 40px">
    <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 50px">
      <div v-for="list in lists" :key="list.COLUNA">
        <v-card
          align="center"
          color="#F9FAFC"
          class="rounded-circle border pt-10"
          width="200"
          :style="`border: 2px solid ${list.COLOR} !important;`"
          height="200"
          flat
        >
          <v-icon size="60" :color="list.COLOR">{{ list.FA_ICON }}</v-icon>
          <v-card-text class="grey--text text-lg-h6 text-capitalize">
            {{ formatedText(list.COLUNA) }}
          </v-card-text>
          <v-btn absolute :color="list.COLOR" class="white--text" fab left top>
            <h2>{{ list.VALOR }}</h2>
          </v-btn>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'status-component',
    props: {
      lists: {
        type: [Array, Object]
      }
    },
    methods: {
      formatedText(string) {
        if (!string) return
        let pri = string[0]
        return pri + string.slice(1, string.length).toLowerCase()
      }
    }
  }
</script>

<style scoped>
  .border {
    border: 2px solid #0a0a94 !important;
  }
  .v-btn--fab.v-size--default.v-btn--absolute.v-btn--top {
    top: 65px !important;
  }
  .v-btn--absolute.v-btn--left,
  .v-btn--fixed.v-btn--left {
    left: -26px !important;
  }
</style>
