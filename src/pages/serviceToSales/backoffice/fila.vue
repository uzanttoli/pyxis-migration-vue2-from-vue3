<template>
  <v-container fluid>
    <div>
      <div style="display: flex; align-items: center; justify-content: space-between">
        <div
          style="display: flex; align-items: center; justify-content: space-between; width: 100%"
        >
          <div>
            <p style="padding: 0; margin: 0" class="text-h6 gray--text">
              <i class="fa-solid fa-circle-nodes mr-1 red--text"></i>
              Bem vindo,
              <span style="text-transform: capitalize">{{ nameUser }}!</span>
            </p>
            <span style="font-size: 12px">* Selecione uma fila para iniciar as tratativas</span>
          </div>
          <div v-if="usuario.filtro === 'ADMINISTRADOR'">
            <v-btn icon disabled>
              <v-icon>fa-solid fa-gear</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      <MenuFilaComponent :filaConfig="dadosFila" :produto="$route.params.produto" />
      <RightSideBarTratativa />
    </div>
  </v-container>
</template>

<script>
  import MenuFilaComponent from '@/shared/components/MenuFila/Index.vue'
  import { FilaService } from '@/data/services/bko/serviceToSales/index.js'
  import RightSideBarTratativa from '@/pages/backoffice/RightSideBarTratativa.vue'
  export default {
    components: { MenuFilaComponent, RightSideBarTratativa },
    data: () => ({
      dadosFila: []
    }),
    computed: {
      myProduct() {
        return this.$store.getters.usuario.produto
      },
      nameUser() {
        let usuario = this.$store.getters.usuario.usuario
        let oneUsuario = usuario.split(' ')
        let nameExhibition = oneUsuario[0]
        return nameExhibition.toLowerCase()
      },
      usuario() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      async loadGetFila() {
        const result = await FilaService.getFila(
          this.$store.getters.usuario.id_produto,
          this.$store.getters.usuario.filtro
        )
        this.dadosFila = result.data
      }
    },
    created() {
      this.loadGetFila()
    }
  }
</script>

<style></style>
