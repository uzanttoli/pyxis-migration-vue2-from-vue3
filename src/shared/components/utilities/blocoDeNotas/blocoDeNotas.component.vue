<template>
  <v-dialog
    max-width="1000"
    persistent
    :model-value="dialogModal"
    @update:modelValue="val => $emit('update:dialogModal', val)"
  >
    <v-card ref="form">
      <title-negative-margin title="Bloco de Notas">
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn icon v-bind="attrs" v-on="on" @click="abrirNotasFlutuante">
              <v-icon color="orange lighten-1">fa-solid fa-square-caret-up</v-icon>
            </v-btn>
          </template>

          <span>Notas Flutuantes</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn icon v-bind="attrs" v-on="on" to="/pyxis/bloco-notas" target="_blank">
              <v-icon color="orange accent-3">fa-solid fa-arrow-up-right-from-square</v-icon>
            </v-btn>
          </template>

          <span>Abrir em outra guia</span>
        </v-tooltip>

        <v-divider vertical class="ma-2"></v-divider>

        <v-btn icon @click.stop="$emit('closeModal')">
          <v-icon>fas fa-xmark</v-icon>
        </v-btn>
      </title-negative-margin>

      <v-card class="overflow-auto" max-height="350" elevation="0">
        <v-card-text>
          <v-textarea
            outlined
            counter="10001"
            placeholder="Comece digitando..."
            auto-grow
            max-height="450"
            maxlength="10001"
            v-model="textoBlocoDeNotas"
          ></v-textarea>
        </v-card-text>
      </v-card>

      <v-divider></v-divider>

      <v-btn class="ma-3" color="success" @click="salvarBlocoDeNotas()" rounded>Salvar</v-btn>
    </v-card>
  </v-dialog>
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
    emits: ['update:dialogModal'],
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
      abrirNotasFlutuante() {
        this.$emit('update:notasFlutuantes')
        this.$emit('closeModal')
      },
      toggleDialog() {
        this.$emit('update:dialogCalcPercent', false)
      },
      initializeData() {
        if (this.usuarioAlmope) this.$store.dispatch('loadTextoBlocoDeNotas', this.usuarioAlmope)
      },
      insertDatablocoDeNotas() {
        this.$store.dispatch('saveDataBlocoDeNotas', {
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
      },
      updateDataBlocoDeNotas() {
        this.$store.dispatch('updateDataBlocoDeNotas', {
          ALMOPE: this.usuarioAlmope,
          ANOTACOES: this.textoBlocoDeNotas
        })
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

  .cor-padrao {
    background: linear-gradient(220deg, rgb(0, 236, 255), rgb(143, 14, 143));
  }
</style>
