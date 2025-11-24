<template>
  <v-container fluid class="mt-5">
    <componentes-painel
      :nomeUsuario="usuarioNome"
      :perfilUsuario="perfilUsuarioConsiderar"
      :usuarioAlmope="usuarioAlmopeConsiderar"
      @update:retorno="dadosTabela"
    ></componentes-painel>
    <dialog-detalhe
      v-model="dialog"
      :usuarioAlmope="usuarioAlmopeConsiderar"
      :perfilUsuario="perfilUsuarioConsiderar"
      @update:retorno="dadosTabela"
    ></dialog-detalhe>
  </v-container>
</template>

<script>
  import ComponentesPainel from './componentesPainel.vue'
  import DialogDetalhe from './dialogDetalhe.vue'
  export default {
    name: 'painel',
    components: {
      ComponentesPainel,
      DialogDetalhe
    },
    data: () => ({
      dialog: false,
      perfil: [{ OPERADOR: 1 }, { SUPERVISOR: 2 }, { COORDENADOR: 3 }, { ADMINISTRADOR: 4 }],
      dadosConsultaTable: []
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      usuarioAlmopeConsiderar() {
        return this.dadosConsultaTable.ALMOPE && this.dialog == true
          ? this.dadosConsultaTable.ALMOPE
          : this.usuario.almope
      },
      // usuario nome
      usuarioNome() {
        let usuario = this.$store.getters.usuario.usuario
        let oneUsuario = usuario.split(' ')
        let nameExhibition = oneUsuario[0]
        let name = nameExhibition[0].toUpperCase() + nameExhibition.toLowerCase().slice(1)
        return name
      },
      // perfil usuario
      perfilUsuario() {
        return this.perfil.map(item => item[this.usuario.filtro]).filter(item2 => item2 != null)[0]
      },
      perfilUsuarioConsiderar() {
        return this.dadosConsultaTable.COLUNA && this.dialog == true
          ? this.dadosConsultaTable.COLUNA
          : this.perfilUsuario
      }
    },
    methods: {
      dadosTabela(item) {
        this.dadosConsultaTable = item
        this.dialog = true
      }
    },
    created() {}
  }
</script>

<style scoped>
  .cor-padrao {
    background-image: linear-gradient(260deg, rgb(0, 236, 255), #8f0e8f);
  }
  .v-card {
    border-radius: 16px;
  }

  .v-icon {
    margin-right: 8px;
  }

  .headline {
    font-size: 20px;
  }
</style>
