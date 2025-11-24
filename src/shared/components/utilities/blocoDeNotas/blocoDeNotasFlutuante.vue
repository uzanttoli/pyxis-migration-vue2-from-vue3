<template>
  <div class="_container" v-if="dialogModal">
    <div
      class="floating-window"
      :style="{
        top: top + 'px',
        left: left + 'px',
        width: width + 'px',
        minheight: height + 'px'
      }"
    >
      <div class="window-header" @mousedown="startDrag">
        <span class="close-button" @click="closeWindow">&times;</span>
        Bloco de Notas
      </div>
      <div class="resize-handle left" @mousedown="startResize('left')"></div>
      <div class="window-content">
        <v-card ref="form" elevation="0">
          <div class="pa-2">
            <v-textarea
              outlined
              counter="10001"
              maxlength="10001"
              placeholder="Comece digitando..."
              max-height="450"
              v-model="_textoBlocoDeNotas"
            ></v-textarea>
            <v-row class="ma-1 mt-n1" justify="end">
              <v-btn
                color="success"
                @click="salvarBlocoDeNotas()"
                class="rounded-r-xl rounded-bl-xl"
              >
                Salvar
              </v-btn>
            </v-row>
          </div>
        </v-card>
      </div>
    </div>
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
      textoBlocoDeNotas: '',
      dragging: false,
      top: 100,
      left: 300,
      startX: 0,
      startY: 0,
      resizing: false,
      width: 650,
      height: 200,
      startWidth: 0,
      startHeight: 0
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
      startDrag(e) {
        this.dragging = true
        this.startX = e.clientX - this.left
        this.startY = e.clientY - this.top
        window.addEventListener('mousemove', this.dragWindow)
        window.addEventListener('mouseup', this.stopDrag)
      },
      dragWindow(e) {
        if (this.dragging) {
          this.top = e.clientY - this.startY
          this.left = e.clientX - this.startX
        }
      },
      stopDrag() {
        this.dragging = false
        window.removeEventListener('mousemove', this.dragWindow)
        window.removeEventListener('mouseup', this.stopDrag)
      },
      closeWindow() {
        this.$emit('update:closeNotasFlutuante')
      },
      startResize(direction) {
        this.resizing = direction
        this.startX = this.left
        this.startY = this.top
        this.startWidth = this.width
        this.startHeight = this.height
        window.addEventListener('mousemove', this.resizeWindow)
        window.addEventListener('mouseup', this.stopResize)
      },
      resizeWindow(e) {
        if (this.resizing === 'top') {
          this.top = this.startY + (e.clientY - this.startY)
          this.height = this.startHeight - (e.clientY - this.startY)
        } else if (this.resizing === 'bottom') {
          this.height = this.startHeight + (e.clientY - this.startY)
        } else if (this.resizing === 'left') {
          this.left = this.startX + (e.clientX - this.startX)
          this.width = this.startWidth - (e.clientX - this.startX)
        } else if (this.resizing === 'right') {
          this.width = this.startWidth + (e.clientX - this.startX)
        }
      },
      stopResize() {
        this.resizing = false
        window.removeEventListener('mousemove', this.resizeWindow)
        window.removeEventListener('mouseup', this.stopResize)
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
  .floating-window {
    position: absolute;
    background-color: #fff;
    border: 1px solid #000;
  }

  .window-header {
    background-color: #333;
    color: #fff;
    padding: 10px;
    cursor: move;
  }

  .close-button {
    float: right;
    cursor: pointer;
  }

  .resize-handle {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #333;
  }

  .top {
    top: 0;
    left: 0;
    right: 0;
    cursor: n-resize;
  }

  .bottom {
    bottom: 0;
    left: 0;
    right: 0;
    cursor: s-resize;
  }

  .left {
    top: 0;
    bottom: 0;
    left: 0;
    width: 10px;
    cursor: w-resize;
  }

  .right {
    top: 0;
    bottom: 0;
    right: 0;
    width: 10px;
    cursor: e-resize;
  }

  .window-content {
    padding: 10px;
  }
  .zindexTop {
    z-index: 999;
  }

  ._container {
    padding: 20px;
  }
</style>
