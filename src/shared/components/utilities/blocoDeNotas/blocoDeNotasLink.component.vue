<template>
  <div class="_container">
    <v-card ref="form" elevation="1">
      <v-card-title class="mb-n3">Bloco de Notas</v-card-title>
      <div class="pa-2">
        <v-textarea
          outlined
          counter="10001"
          placeholder="Comece digitando..."
          max-height="450"
          maxlength="10001"
          v-model="_textoBlocoDeNotas"
        ></v-textarea>
        <v-row class="ma-1 mt-n1" justify="end">
          <v-btn color="success" @click="salvarBlocoDeNotas()" class="rounded-r-xl rounded-bl-xl">
            Salvar
          </v-btn>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script>
  import alerts from '../../../../mixins/alerts.mixins'
  export default {
    props: {
      dialogModal: {
        type: Boolean,
        default: false
      }
    },
    mixins: [alerts],
    data: () => ({
      textoBlocoDeNotas: ''
    }),
    computed: {
      _textoBlocoDeNotas: {
        get() {
          return this.$store.getters.textoBlocoDeNotas
        },
        set(newVal) {
          this.textoBlocoDeNotas = newVal
        }
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      isNotePad() {
        return this.$store.getters.isNotePad
      }
    },
    methods: {
      initializeData() {
        if (this.usuarioAlmope) this.$store.dispatch('loadTextoBlocoDeNotas', this.usuarioAlmope)
      },
      insertDatablocoDeNotas() {
        this.$store.dispatch('saveDataBlocoDeNotas', {
          ALMOPE: this.usuarioAlmope,
          ANOTACOES: this.textoBlocoDeNotas
        })
      },
      updateDataBlocoDeNotas() {
        this.$store.dispatch('updateDataBlocoDeNotas', {
          ALMOPE: this.usuarioAlmope,
          ANOTACOES: this.textoBlocoDeNotas
        })
      },
      salvarBlocoDeNotas() {
        if (this.isNotePad) {
          this.updateDataBlocoDeNotas()
        } else {
          this.insertDatablocoDeNotas()
        }
        this.toast('Notas atualizadas com sucesso!', 'top-right', false, 2000, 'success')
      }
    },
    watch: {
      dialogModal() {
        if (this.dialogModal) this.initializeData()
      },
      _textoBlocoDeNotas() {
        this.textoBlocoDeNotas = this._textoBlocoDeNotas
      }
    },
    mounted() {
      this.initializeData()
    }
  }
</script>
<style scoped>
  .zindexTop {
    z-index: 999;
  }

  ._container {
    padding: 20px;
  }
</style>
