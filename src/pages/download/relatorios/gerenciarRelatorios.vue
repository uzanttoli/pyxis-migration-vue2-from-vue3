<template>
  <div>
    <card-app-bar
      customClass="rounded-xl"
      :minHeight="135"
      style="margin-top: 35px"
      styleCustom="display: flex; flex-direction: column; height: 135px; padding: 25px; color: #fafafa;"
      @update:click="alterRouter"
      :isButtonReturn="true"
    >
      <template v-slot:title>
        <div style="display: flex; align-items: center">
          <h2>Olá, {{ usuario }}!</h2>
        </div>
      </template>
      <template v-slot:subtitle>
        <p style="font-size: 12px">Relatórios disponiveis para você!</p>
      </template>
    </card-app-bar>
    <div class="gerenciar">
      <div class="container-gerenciar">
        <criar-relatorios
          v-if="isPermissionCriar"
          @update-create-report="createdReport"
        ></criar-relatorios>
        <atualizar-relatorios
          v-if="isPermissionEditar"
          :reportCreated="isCreateReport"
        ></atualizar-relatorios>
      </div>
    </div>
    <gerenciar-permissoes v-if="isPermissionCriar"></gerenciar-permissoes>
  </div>
</template>

<script>
  import AtualizarRelatorios from './atualizarRelatorios.vue'
  import criarRelatorios from './criarRelatorios.vue'
  import GerenciarPermissoes from './gerenciarPermissoes.vue'
  import CardAppBar from '@/shared/components/cards/modern/cardAppBar.vue'
  export default {
    components: { criarRelatorios, AtualizarRelatorios, CardAppBar, GerenciarPermissoes },
    data: () => ({
      isCreateReport: false
    }),
    computed: {
      usuario() {
        let usuario = this.$store.getters.usuario.usuario
        let oneUsuario = usuario.split(' ')
        let nameExhibition = oneUsuario[0]
        let name = nameExhibition[0].toUpperCase() + nameExhibition.toLowerCase().slice(1)
        return name
      },
      tipoPerfil() {
        return this.$store.getters.usuario.filtro
      },
      isPermissionCriar() {
        let criarRelatorio = this.$store.getters.usuario.criar_relatorio
        if (this.tipoPerfil == 'ADMINISTRADOR') return true
        if (criarRelatorio == 1) return true
        return false
      },
      isPermissionEditar() {
        let editarRelatorio = this.$store.getters.usuario.editar_relatorio

        if (this.tipoPerfil == 'ADMINISTRADOR') return true
        if (editarRelatorio == 1) return true
        return false
        // return editarRelatorio == 1 ? true : false;
      }
    },
    methods: {
      alterRouter() {
        this.$router.push({ name: 'Downloads Relatorios' })
      },
      createdReport() {
        this.isCreateReport = true
        setTimeout(() => {
          this.isCreateReport = false
        }, 2000)
      }
    }
  }
</script>

<style scoped>
  .gerenciar {
    display: flex;
    justify-content: center;
    margin-top: 35px;
  }
  .container-gerenciar {
    /* height: 100vh; */
    display: flex;
    justify-content: center;
    align-items: start;
    flex-wrap: wrap;
    gap: 13px;
    /* height: 390px; */
  }

  h2 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 35px;
    color: white;
  }

  .img-card {
    position: absolute;
    height: 200px;
    bottom: 3px;
    right: 15px;
  }

  .text-class-h2 {
    border-left: 3px solid rgb(240, 240, 240);
    padding: 8px; /* opcional para espaçar o texto da linha */
    font-size: 20px;
  }

  .cor-padrao {
    background-image: linear-gradient(260deg, rgb(0, 236, 255), #8f0e8f);
  }
</style>
