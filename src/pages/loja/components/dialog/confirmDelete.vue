<template>
  <v-dialog v-model="confirmDelete" width="300" persistent>
    <v-card class="pa-3">
      <div>Confirmar exclusão?</div>
      <v-divider></v-divider>
      <v-card-actions>
        <v-row class="ma-2 justify-space-between" align="center">
          <v-btn color="red white--text" @click="atualizarVisibilidadeDoProdutoActions()">
            Sim
          </v-btn>
          <v-btn color="green white--text" @click="$emit('closeConfirmDelete')">Não</v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
    <v-overlay :value="deletando">
      <div class="d-flex flex-column justify-center">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
        <span class="ml-n9 mt-2">Por favor, Aguarde!</span>
      </div>
    </v-overlay>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      confirmDelete: {
        type: Boolean,
        default: false
      },
      idDelete: {
        type: [Number, String, Array],
        default: ''
      }
    },
    data: () => ({
      deletando: false
    }),
    computed: {},
    methods: {
      async atualizarVisibilidadeDoProdutoActions() {
        try {
          this.deletando = true
          let v = this.idDelete[0].idProduto
          let data = {
            idProduto: v,
            visivel: 0
          }
          await this.$store.dispatch('atualizarVisibilidadeDoProdutoActions', data)
          this.$emit('updated:atualizar')
          this.$emit('closeConfirmDelete')
          this.deletando = false
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
</script>

<style></style>
