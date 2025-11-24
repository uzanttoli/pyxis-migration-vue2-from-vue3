<template>
  <!-- v-model="dialogConfig" -->

  <v-dialog
    width="800"
    persistent
    :model-value="dialogConfig"
    @update="val => $emit('update:dialogConfig', val)"
  >
    <v-card class="rounded-xl" outlined>
      <v-card-title>
        <v-icon class="mr-2">fa-solid fa-file-invoice</v-icon>
        Configuração
        <v-spacer></v-spacer>

        <v-btn icon @click="$emit('update:close-dialog')">
          <v-icon>fas fa-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-col>
        <v-alert outlined type="warning" prominent border="left" dense>
          Os dados de liberação apresentados abaixo não incluem a liberação por perfil (Operador e
          Bko s2s), pois são consideradas liberações padronizadas. Caso seja necessário remover a
          liberação por perfil, entre em contato com o administrador
        </v-alert>

        <v-tabs v-model="tab" color="red">
          <template v-for="(item, i) in itemsFilaCard" :key="i">
            <v-tab>{{ item.text }}</v-tab>
          </template>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <template v-for="(item, j) in itemsFilaCard" :key="j.component">
            <v-tab-item>
              <v-card flat>
                <v-col class="px-0">
                  <component :is="item.component"></component>
                </v-col>
              </v-card>
            </v-tab-item>
          </template>
        </v-tabs-items>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
  import controleFila from './controleFila.vue'
  export default {
    components: { controleFila },
    props: {
      dialogConfig: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      tab: null,
      itemsCard: [],
      itemsFilaCard: [
        { text: 'Controle Fila', component: 'controle-fila' }
        // { text: "Liberamento", component: "teste" },
      ]
    })
  }
</script>

<style></style>
