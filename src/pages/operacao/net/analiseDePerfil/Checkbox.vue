<template>
  <section>
    <v-row v-for="(item, i) in questionario" :key="i">
      <v-col>
        <h4>{{ item.pergunta }}</h4>
        <v-list v-for="(item, i) in item.resposta" :key="'a' + i" class="mb-n9">
          <v-checkbox
            dense
            v-model="selected"
            :label="item.itemResposta"
            :value="item.itemResposta"
          ></v-checkbox>
        </v-list>
      </v-col>
    </v-row>
  </section>
</template>

<script>
  import { questionario } from './questionario'
  export default {
    data: () => ({
      selected: null
    }),
    computed: {
      questionario() {
        return questionario
      }
    },
    methods: {}
  }
</script>

<style></style>
