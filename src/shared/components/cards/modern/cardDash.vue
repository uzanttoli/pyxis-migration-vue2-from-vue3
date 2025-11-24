<template>
  <v-card
    elevation="1"
    :id="id"
    v-if="valor != null"
    class="card"
    outlined
    :draggable="draggable"
    @dragstart="handleDragStart"
    @dragenter="handleDragEnter"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <div class="card__header">
      <v-icon
        class="icon"
        :color="iconHeader && Array.isArray(iconHeader) ? iconHeader[0].color : 'orange'"
        size="18"
      >
        {{ iconHeader && Array.isArray(iconHeader) ? iconHeader[0].icon : iconHeader }}
      </v-icon>
      <h4 class="title-card" :title="title">{{ title }}</h4>
      <v-spacer></v-spacer>
      <template v-if="buttonIsVisible === 1">
        <v-btn icon small @click="validateVisible">
          <v-icon small>mdi-eye-off</v-icon>
        </v-btn>
      </template>
    </div>
    <v-divider></v-divider>
    <v-card-text>
      <div class="card__body">
        <div class="subtitle-container">
          <h2 class="subtitle-card">{{ valor }}</h2>
          <v-icon class="icon icon-trend-up"></v-icon>
        </div>
      </div>
    </v-card-text>
  </v-card>
  <v-card v-else>
    <v-skeleton-loader class="mx-auto" max-width="300" type="card"></v-skeleton-loader>
  </v-card>
</template>

<script>
  import alerts from '../../../../mixins/alerts.mixins'
  export default {
    props: {
      // dadosCard: {
      //   type: Array,
      //   required: true,
      // },
      iconHeader: {
        type: [String, Array],
        default: 'fa-solid fa-square-poll-vertical'
      },
      title: {
        type: String,
        required: true
      },
      valor: {
        type: [String, Number],
        required: true
      },
      iconFa: {
        type: String,
        default: 'fa-solid fa-square-poll-vertical'
      },
      textCaption: {
        type: String,
        default: 'Número realizado'
      },
      id: {
        type: [String, Number]
      },
      cardIndex: {
        type: Number
      },
      buttonIsVisible: {
        type: Number,
        default: 0
      },
      draggable: {
        type: Boolean,
        default: false
      }
    },
    mixins: [alerts],
    data: () => ({
      isVisible: true
    }),
    methods: {
      includeTitle(text, textConsideration) {
        if (!text) return
        if (text.includes(textConsideration)) {
          return 'green'
        } else {
          return 'orange'
        }
      },
      validateVisible() {
        this.isVisible = !this.isVisible
        this.$emit('update:validateVisible', {
          title: this.title,
          visible: this.isVisible
        })
        this.toast('A lista de card será redefinida em 60s', 'bottom-end', false, 60000, 'warning')
        setTimeout(() => {
          this.isVisible = !this.isVisible
          this.$emit('update:validateVisible', {
            title: this.title,
            visible: this.isVisible
          })
        }, 60000)
      },
      handleDragStart(event) {
        // Define o ID do cartão sendo arrastado
        event.dataTransfer.setData('cardId', event.target.id)
      },
      handleDragEnter(event) {
        // Adicione uma classe CSS para indicar que o cartão está sendo arrastado
        event.target.classList.add('drag-over')
      },
      handleDragOver(event) {
        // Impedir o comportamento padrão do navegador de não permitir arrastar
        event.preventDefault()
      },
      handleDragLeave(event) {
        // Remover a classe CSS adicionada em handleDragEnter
        event.target.classList.remove('drag-over')
      },
      handleDrop(event) {
        // Impedir o comportamento padrão do navegador de soltar
        event.preventDefault()
        // Obter o ID do cartão sendo arrastado
        const cardId = event.dataTransfer.getData('cardId')
        // Obter o índice do cartão de origem
        const sourceIndex = parseInt(cardId.replace('card', ''))
        // Obter o índice do cartão de destino
        const targetIndex = this.cardIndex
        // Emitir evento personalizado para o componente pai atualizar a posição do card
        this.$emit('move-card', sourceIndex, targetIndex)
        // Remover a classe CSS adicionada em handleDragEnter
        event.target.classList.remove('drag-over')
      }
    }
  }
</script>

<style scoped>
  .card {
    margin: 0 auto;
    border-radius: 8px;
    transition: all 0.2s ease-in-out;
    min-width: 200px;
  }

  .card:hover {
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
    transform: translateY(-4px);
  }

  .card__header {
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 8px 8px 0 0;
  }

  .icon {
    font-size: 24px;
    margin-right: 8px;
    color: #3e3d3d;
  }

  .title-card {
    display: inline;
    font-size: 15px;
    font-weight: bold;
    margin: 0;
    color: #3e3d3d;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card__body {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 6px;
  }

  .subtitle-container {
    display: flex;
    align-items: baseline;
    flex-wrap: nowrap;
  }

  .subtitle-card {
    font-size: 25px;
    margin: 0;
    color: #333;
    flex-wrap: nowrap;
  }

  .icon-trend-up {
    font-size: 18px;
    color: green;
    margin-left: 8px;
  }

  .caption-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .caption {
    font-size: 14px;
    color: #999;
    margin-top: 8px;
  }

  .caption--subtle {
    font-size: 12px;
    color: #333;
    margin-top: 4px;
  }

  .cor-padrao {
    background-image: linear-gradient(260deg, rgb(0, 236, 255), #8f0e8f);
  }

  .drag-over {
    border: dashed 2px blue;
  }
</style>
