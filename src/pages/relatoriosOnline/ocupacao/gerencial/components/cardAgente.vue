<template>
  <v-row class="mt-2 mb-3">
    <v-col v-for="(item, i) in resumoAtendimento" :key="i">
      <card-agentes :data="item"></card-agentes>
    </v-col>
  </v-row>
</template>

<script>
  import config from '../../../../../core/config'
  import cardAgentes from '../../../../../shared/components/cards/cardAgentes.vue'
  export default {
    components: { cardAgentes },
    data: () => ({
      resumoAtendimento: []
    }),
    methods: {
      loadResumoAtendimento() {
        this.resumoAtendimento = ''
        let urlData = `${config.baseUrl}api/shared/ocupacao/resumo_atd_online/`
        this.$api.get(urlData).then(res => {
          this.resumoAtendimento = res.data
          this.$emit('update:loading', false)
        })
      }
    },
    created() {
      this.loadResumoAtendimento()
    }
  }
</script>

<style></style>
