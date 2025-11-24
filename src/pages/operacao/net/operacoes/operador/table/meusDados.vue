<template>
  <v-card min-height="100" outlined class="rounded-xl pa-2">
    <v-card-text>
      <div class="ma-0 pa-0" v-for="item in Object.entries(meusDados)" :key="item[0]">
        <span class="text-h7 font-weight-bold">
          <v-icon size="15" color="blue" class="mr-1">{{ icon[item[0]] }}</v-icon>
          {{ item[0].replaceAll('_', ' ') }}:
        </span>
        <span>{{ item[1] }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'table-meus-dados',
    props: {
      usuarioAlmope: {
        type: [String, Number],
        default: null
      }
    },
    data: () => ({
      icon: {
        ALMOPE: 'fa-solid fa-user',
        NOME: 'fa-solid fa-user',
        SUPERVISOR: 'fa-solid fa-user-tie',
        COORDENADOR: 'fa-solid fa-user-tie',
        GERENTE: 'fa-solid fa-user-tie',
        LOGIN_T: 'fa-solid fa-user-tag',
        LOGIN_CLARO: 'fa-solid fa-user-tag'
      }
    }),
    computed: {
      meusDados() {
        return this.$store.getters.meusDados[0]
          ? this.$store.getters.meusDados[0]
          : { coluna: '', valor: '' }
      }
    },
    methods: {
      loadMeusDados() {
        return this.$store.dispatch('loadMeusDados', this.usuarioAlmope)
      }
    },
    watch: {
      usuarioAlmope() {
        this.loadMeusDados()
      }
    },
    created() {
      this.loadMeusDados()
    }
  }
</script>

<style></style>
