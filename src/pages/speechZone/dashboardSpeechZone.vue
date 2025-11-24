<template>
  <div>
    <v-container fluid>
      <component :is="componentView"></component>
    </v-container>
  </div>
</template>

<script>
  import operadorZone from './viewsComponents/operadorZone.vue'
  import coordenadorZone from './viewsComponents/coordenadorZone.vue'
  import supervisorZone from './viewsComponents/supervisorZone.vue'
  import gerencial from './viewsComponents/gerencialZone.vue'
  export default {
    components: {
      operador: operadorZone,
      coordenador: coordenadorZone,
      supervisor: supervisorZone,
      gerencial
    },
    data: () => ({}),
    computed: {
      componentView() {
        let cargo = this.$store.getters.usuario.filtro.toLowerCase()
        if (
          cargo != 'coordenador' &&
          cargo != 'supervisor' &&
          cargo != 'operador' &&
          cargo != 'gerente'
        ) {
          return 'gerencial'
        }
        return cargo
      }
    }
  }
</script>

<style></style>
