<template>
  <v-menu bottom origin="center center" transition="scale-transition">
    <template v-slot:activator="{ attrs, on }">
      <v-btn depressed icon small color="#00838F" v-bind="attrs" v-on="on" :disabled="!dataIsValid">
        <v-icon>fa-duotone fa-bars</v-icon>
      </v-btn>
    </template>
    <v-card>
      <table-dinamics :data="dataReturn" title="Resultado do processamento -"></table-dinamics>
    </v-card>
  </v-menu>
</template>

<script>
  import tableDinamics from '../../shared/components/table/tableDinamics.vue'
  export default {
    components: { tableDinamics },
    props: {
      data: {
        type: [Array, Object],
        require: true
      }
    },
    computed: {
      dataIsValid() {
        return this.data?.length > 0 ? true : false
      },
      dataReturn() {
        return this.data
      }
    },
    methods: {}
  }
</script>

<style></style>
