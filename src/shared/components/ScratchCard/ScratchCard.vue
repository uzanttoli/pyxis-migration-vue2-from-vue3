<template>
  <div :class="`${lg ? 'size-lg glow-effect' : 'default-size'} scratch-card-container`">
    <div :class="`${lg ? 'size-lg' : 'default-size'} scratch-card-content no-select`">
      <div :class="`w-full h-full image-container ${item.IMAGE ? 'img-cover' : ''}`">
        <template v-if="item.STATUS === 'AWARDED'">
          <img
            v-if="imageLoaded"
            :src="imageSrc"
            :width="lg ? 300 : 100"
            :height="lg ? 188 : 50"
            class="img-contain"
            alt="Cartão Raspadinha"
            @error="imageError"
          />
        </template>
        <img
          v-else
          :src="require('@/assets/img/campanhas/s2s/2025/janeiro/caminhaoDePremios/nada1.png')"
          :width="lg ? 300 : 100"
          :height="lg ? 188 : 50"
          class="img-contain"
          alt="Cartão Raspadinha"
        />
      </div>
    </div>
    <canvas
      v-if="disableScratch"
      ref="canvas"
      :width="width"
      :height="height"
      class="canvas"
    ></canvas>
    <div v-else-if="lg">
      <canvas
        ref="canvas"
        width="300"
        height="188"
        class="canvas clickable big"
        @mousedown="startScratch"
        @mouseup="endScratch"
        @mousemove="scratch"
      ></canvas>
    </div>
    <canvas
      v-else
      ref="canvas"
      :width="width"
      :height="height"
      class="canvas clickable"
      @click="handleOnClick"
    ></canvas>
    <svg class="glow-container">
      <rect pathLength="100" stroke-linecap="round" class="glow-blur"></rect>
      <rect pathLength="100" stroke-linecap="round" class="glow-line"></rect>
    </svg>
  </div>
</template>

<script>
  import FileService from '@/data/services/file/fileService'

  export default {
    name: 'ScratchCard',
    props: {
      item: {
        type: Object,
        default: () => ({})
      },
      employee: {
        type: Object,
        default: () => ({})
      },
      disableScratch: {
        // Adicionado para desabilitar o evento de raspar
        type: Boolean,
        default: false
      },
      lg: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isScratching: false,
        confirmScratchModal: false,
        imageLoaded: true,
        ctx: null,
        lastX: 0,
        lastY: 0,
        initialImage: null,
        width: this.lg ? 300 : 135, // Necessário alterar também na tag Style no final do arquivo.
        height: this.lg ? 200 : 84, // Necessário alterar também na tag Style no final do arquivo.
        scratchCardElement: null
      }
    },
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      isAwarded() {
        return this.item.STATUS === 'AWARDED'
      },
      imageSrc() {
        return this.initialImage
          ? this.initialImage
          : require('@/assets/img/campanhas/raspadinha/ganhouDefault.png')
      }
    },
    methods: {
      imageError() {
        this.imageLoaded = false
      },
      handleOnClick() {
        if (this.item.STATUS === 'SCRATCHED' || this.item.STATUS === 'AWARDED') return
        this.$emit('update:item', this.item)
      },
      setupCanvas() {
        // Configurações iniciais do canvas
        this.ctx.fillStyle = '#DCDCDC'
        this.ctx.fillRect(0, 0, this.width, this.height)
      },
      async startScratch(event) {
        if (this.item.STATUS === 'SCRATCHED' && !this.lg) {
          return
        }
        this.isScratching = true
        this.lastX = event.offsetX
        this.lastY = event.offsetY
        this.scratchCardElement = event.currentTarget // Armazena o elemento que iniciou o evento
        this.$emit('update:item', this.item)
        document.addEventListener('mousemove', this.scratch)
        document.addEventListener('mouseup', this.endScratch)
      },
      endScratch(event) {
        if (!this.isScratching || event.currentTarget !== this.scratchCardElement) return
        this.isScratching = false
        document.removeEventListener('mousemove', this.scratch)
        document.removeEventListener('mouseup', this.endScratch)
        this.revealScratchCard()
      },
      scratch(event) {
        if (!this.isScratching || event.currentTarget !== this.scratchCardElement) return

        const rect = this.scratchCardElement.getBoundingClientRect()
        const isInBounds =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom

        if (!isInBounds) return

        this.ctx.globalCompositeOperation = 'destination-out'
        this.ctx.lineWidth = 30
        this.ctx.lineCap = 'round'
        this.ctx.beginPath()
        this.ctx.moveTo(this.lastX, this.lastY)
        this.ctx.lineTo(event.offsetX, event.offsetY)
        this.ctx.stroke()
        this.lastX = event.offsetX
        this.lastY = event.offsetY
      },
      revealScratchCard() {
        // Remove a camada de raspagem
        this.ctx.clearRect(0, 0, this.width, this.height)
      },
      resetScratch() {
        // Redesenha o estado inicial do canvas
        this.ctx.globalCompositeOperation = 'source-over'
        this.setupCanvas()
      }
    },
    async mounted() {
      const canvas = this.$refs.canvas
      this.ctx = canvas.getContext('2d')
      this.setupCanvas()
      if (this.item.STATUS === 'AWARDED') {
        try {
          const prizeImage = await FileService.getFileUrl('raspadinhaPremio', this.item.IMAGE)
          this.initialImage = prizeImage // Atribui diretamente o URL retornado
        } catch (error) {
          console.error('Erro ao carregar a imagem do prêmio:', error)
          this.initialImage = null // Garante que use a imagem padrão
        }
      }

      if ((this.item.STATUS === 'SCRATCHED' || this.item.STATUS === 'AWARDED') && !this.lg) {
        this.revealScratchCard()
      }
    }
  }
</script>

<style scoped>
  .scratch-card-container {
    position: relative;
  }
  .scratch-card-content {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    background-color: #e5e5f7;
    opacity: 0.8;
    /* background-image: linear-gradient(135deg, #aaaaaa 25%, transparent 25%),
    linear-gradient(225deg, #aaaaaa 25%, transparent 25%),
    linear-gradient(45deg, #aaaaaa 25%, transparent 25%),
    linear-gradient(315deg, #aaaaaa 25%, #e5e5f7 25%);
  background-position: 10px 0, 10px 0, 0 0, 0 0;
  background-size: 20px 20px;
  background-repeat: repeat; */
  }
  .default-size {
    width: 135px;
    height: 84px;
  }
  .size-lg {
    width: 300px;
    height: 188px;
  }
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    /* background-color: transparent; */
    opacity: 1;
  }
  .image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
</style>
