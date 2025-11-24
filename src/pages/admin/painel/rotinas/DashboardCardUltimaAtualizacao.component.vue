<template>
  <v-card class="mt-2" elevation="1">
    <v-card-title class="align-start">
      <span>Ultimas atualizações</span>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-list class="pb-0">
        <v-list-item
          v-for="(data, index) in rotinas"
          :key="index"
          :class="`d-flex align-center px-0 ${index > 0} ? 'mt-4' : ''`"
        >
          <v-avatar
            :color="data.color"
            size="40"
            :class="`${data.color} white--text font-weight-medium me-3`"
          >
            <span class="text-base">{{ data.abbr }}</span>
          </v-avatar>
          <div class="d-flex align-center flex-grow-1 flex-wrap">
            <div class="me-2">
              <div class="font-weight-semibold">
                <span class="text--primary text-base me-1">{{ data.amount }}</span>
              </div>
              <v-list-item-subtitle class="text-xs">
                {{ data.country }}
              </v-list-item-subtitle>
            </div>
            <v-spacer></v-spacer>

            <div>
              <h4 class="font-weight-semibold">{{ data.sales }}</h4>
              <span class="text-xs">Rotina Executada</span>
            </div>
            <div>
              <v-btn icon small class="mt-n4"><v-icon>mdi-database-search</v-icon></v-btn>
            </div>
          </div>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    data: () => ({
      rotinas: [
        {
          abbr: 'US',
          amount: 'Nome da rotina',
          country: 'Responsavel',
          sales: 'Horario da ultima atualizacao',
          color: 'success'
        },
        {
          abbr: 'UK',
          amount: 'Nome da rotina',
          country: 'Responsavel',
          sales: 'Horario da ultima atualizacao',
          color: 'error'
        },
        {
          abbr: 'IN',
          amount: 'Nome da rotina',
          country: 'Responsavel',
          sales: 'Horario da ultima atualizacao',
          color: 'warning'
        },
        {
          abbr: 'JA',
          amount: 'Nome da rotina',
          country: 'Responsavel',
          sales: 'Horario da ultima atualizacao',
          color: 'secondary'
        },
        {
          abbr: 'KO',
          amount: 'Nome da rotina',
          country: 'Responsavel',
          sales: 'Horario da ultima atualizacao',
          color: 'error'
        }
      ]
    })
  }
</script>

<style></style>
