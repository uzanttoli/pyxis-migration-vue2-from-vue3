<template>
  <v-container fluid>
    <configuracao-component
      title="Cadastrar nova solicitação"
      to="/pyxis/project-manager/area-do-solicitante/"
    >
      <v-col>
        <formulario-solicitacao></formulario-solicitacao>
      </v-col>
    </configuracao-component>
  </v-container>
</template>

<script>
  import ConfiguracaoComponent from '../../../shared/components/configuracao/Configuracao.component.vue'
  import FormularioSolicitacao from './formularioSolicitacao.vue'
  export default {
    components: { ConfiguracaoComponent, FormularioSolicitacao }
  }
</script>

<style></style>
