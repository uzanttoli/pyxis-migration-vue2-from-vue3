<template>
  <section>
    <v-btn
      class="ma-3"
      depressed
      rounded
      color="primary"
      x-small
      @click=";(responder = true), idComentario(id)"
      v-if="responderComentario == 1"
    >
      Responder
    </v-btn>
    <v-btn
      depressed
      rounded
      color="error"
      x-small
      @click="responder = false"
      v-if="responder == true"
    >
      Fechar
    </v-btn>
    <v-row v-if="responder" align="center" justify="center">
      <v-col>
        <v-container fluid>
          <v-textarea
            outlined
            append-icon="mdi-send"
            auto-grow
            rows="2"
            v-model="resposta"
            @click:append="respondeComentario"
            @keyup.enter="resposta == '' ? '' : respondeComentario"
            messages="A resposta é para o comentario e não para outras respostas!"
            :counter="255"
            :error-messages="resposta.length > 255 ? 'Não é permitido mais de 255 caracteres' : ''"
          ></v-textarea>
        </v-container>
      </v-col>
    </v-row>
  </section>
</template>

<script>
  import config from '../../../../../core/config.js'
  export default {
    props: {
      id: {
        type: Number
      }
    },
    data: () => ({
      responder: false,
      idResComentario: '',
      resposta: ''
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      responderComentario() {
        return this.$store.getters.usuario.res_comen_feed
      }
    },
    methods: {
      idComentario(value) {
        return (this.idResComentario = value)
      },
      async respondeComentario() {
        try {
          if (this.resposta == '') {
            const Toast = this.$swal.mixin({
              toast: true,
              position: 'bottom-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: toast => {
                toast.addEventListener('mouseenter', this.$swal.stopTimer)
                toast.addEventListener('mouseleave', this.$swal.resumeTimer)
              }
            })
            Toast.fire({
              icon: 'info',
              title: 'Necessário digitar antes de enviar.'
            })
          } else {
            if (this.resposta.length > 255) {
              const Toast = this.$swal.mixin({
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: toast => {
                  toast.addEventListener('mouseenter', this.$swal.stopTimer)
                  toast.addEventListener('mouseleave', this.$swal.resumeTimer)
                }
              })
              Toast.fire({
                icon: 'info',
                title: 'Não é permitido enviar mais de 255 caracteres.'
              })
            } else {
              let data = {
                id: this.idResComentario,
                resposta: this.resposta,
                usuarioAlmope: this.usuarioAlmope
              }
              let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/inserir_resposta`
              let getFormData = object =>
                Object.keys(object).reduce((FormData, key) => {
                  FormData.append(key, object[key])
                  return FormData
                }, new FormData())
              var res = await this.$api.post(urlData, getFormData(data))
              await this.$emit('updated:respondeu', true)
              const Toast = this.$swal.mixin({
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: toast => {
                  toast.addEventListener('mouseenter', this.$swal.stopTimer)
                  toast.addEventListener('mouseleave', this.$swal.resumeTimer)
                }
              })
              Toast.fire({
                icon: 'success',
                title: res.data
              })
              this.responder = false
              this.resposta = ''
              setTimeout(() => {
                this.$emit('updated:respondeu', false)
              }, 2000)
            }
          }
        } catch (error) {
          if (error.response.status) {
            const Toast = this.$swal.mixin({
              toast: true,
              position: 'bottom-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: toast => {
                toast.addEventListener('mouseenter', this.$swal.stopTimer)
                toast.addEventListener('mouseleave', this.$swal.resumeTimer)
              }
            })
            Toast.fire({
              icon: 'warning',
              title: error.response.data
            })
          }
        }
      }
    }
  }
</script>

<style></style>
