<template>
  <v-row class="mt-2">
    <v-col v-for="(item, i) in config" :key="i" :cols="config.length / 12">
      <card-administrativo
        :routerCard="item.ROUTE_PARAMS"
        :tipoGrupo="item.TYPE_GROUP"
        :title="item.TITLE"
        :description="item.DESCRIPTION"
      ></card-administrativo>
      <v-spacer></v-spacer>
    </v-col>
  </v-row>
</template>

<script>
  import config from '../../core/config'
  import cardAdministrativo from '../../shared/components/cards/cardAdministrativo.vue'
  export default {
    components: {
      cardAdministrativo
    },
    data: () => ({
      config: []
    }),
    methods: {
      loadConfig() {
        let urlData = `${config.baseUrl}api/shared/painel_administrativo/painel/config`
        this.$api.get(urlData).then(res => {
          this.config = res.data
        })
      }
    },
    created() {
      // this.loadConfig();
    }
  }
</script>

<style></style>
