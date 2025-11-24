<template>
  <v-card class="mt-7" elevation="1">
    <v-card-title class="text-h6">
      Dados Para Tratativa
      <div class="box cor-padrao">
        <div class="box-tempo-tratativa">
          <span class="box-span">
            Tempo {{ novoCasoAtivacao.NUM_CONTRATO ? 'de tratativa' : 'disponivel' }}
          </span>
          <p class="box-time">
            {{ tempo == 'NaN:NaN:NaN' ? '00:00:00' : tempo }}
          </p>
        </div>
        <v-divider class="pa-2"></v-divider>
        <div class="box-consolidado-mes">
          <span class="box-mes">Consolidado Mês</span>
          <p class="box-quantidade-mes">
            {{ consolidadoMes ? consolidadoMes.CONSOLIDADO_MES : '0' }}
          </p>
        </div>
        <v-divider class="pa-2"></v-divider>
        <div class="box-consolidado-dia">
          <span class="box-dia">Consolidado Dia</span>
          <p class="box-quantidade-dia">
            {{ consoliadoDia ? consoliadoDia.CONSOLIDADO_DIA : '0' }}
          </p>
        </div>
        <v-divider class="pa-2"></v-divider>
        <div class="box-quantidade-ativados">
          <span class="box-ativados">Qtd. Ativação</span>
          <p class="box-quantidade-ativo-mes">
            {{ minhasAtivacoes ? minhasAtivacoes.CASOS_ATIVOS : '0' }}
          </p>
        </div>
      </div>
    </v-card-title>
  </v-card>
</template>

<script>
  export default {
    props: {
      novoCasoAtivacao: {
        type: [String, Number],
        default: '0'
      },
      consolidadoMes: {
        type: [String, Number],
        default: '0'
      },
      consoliadoDia: {
        type: [String, Number],
        default: '0'
      },
      minhasAtivacoes: {
        type: [String, Number],
        default: '0'
      }
    },
    methods: {}
  }
</script>

<style></style>
