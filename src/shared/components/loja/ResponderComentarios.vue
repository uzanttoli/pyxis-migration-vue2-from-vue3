<template>
  <section class="py-2 mt-n5">
    <v-btn
      @click=";(responder = true), idComentario(id)"
      depressed
      color="primary"
      x-small
      class="ml-8"
    >
      Responder
    </v-btn>
    <v-row v-if="responder" align="center" justify="center">
      <v-col cols="9">
        <v-container fluid>
          <v-textarea
            v-model="descricao"
            outlined
            append-icon="mdi-send"
            auto-grow
            rows="2"
            @click:append="saveResponderComentario"
            @keyup.enter="descricao == '' ? '' : saveResponderComentario"
          ></v-textarea>
        </v-container>
      </v-col>
    </v-row>
  </section>
</template>

<script>
  export default {
    props: {
      id: {
        type: Number
      }
    },
    data: () => ({
      count: 0,
      descricao: '',
      responder: false,
      idResComentario: ''
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      idComentario(value) {
        return (this.idResComentario = value)
      },
      async saveResponderComentario() {
        if (this.descricao == '') {
          return
        } else {
          let data = {
            id: this.idResComentario,
            resposta: this.descricao,
            usuarioComentario: this.usuarioAlmope
          }
          await this.$store.dispatch('saveResponderComentario', data)
          await this.$emit('updated:respondeu', true)
          this.responder = false
          this.descricao = ''
          setTimeout(() => {
            this.$emit('updated:respondeu', false)
          }, 2000)
        }
      }
    }
  }
</script>

<style></style>
