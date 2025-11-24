<template>
  <div class="d-flex align-stretch">
    <v-card
      class="mx-auto d-flex flex-column align-center justify-start pa-4"
      outlined
      shaped
      style="width: 250px; height: 230px"
      @click="$emit('update:dadosFolder', $event)"
    >
      <v-img :src="getImg(imgSrc)" class="mb-3" contain width="100" height="100"></v-img>

      <h3
        class="text-center font-weight mb-2 text-capitalize"
        style="
          font-size: 16px;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        "
      >
        {{ formattedTitle }}
      </h3>

      <v-divider class="my-2" style="width: 100%"></v-divider>

      <div class="text-center mt-auto">
        <small class="grey--text">
          <i
            v-if="atualizadoEm == hoje"
            class="fa-solid fa-circle-check"
            :style="atualizadoEm == hoje ? 'color:green' : ''"
          ></i>
          <i v-else class="fa-solid fa-circle-check" style="color: orange"></i>
          Atualizado em:
          <strong>{{ formattedDate }}</strong>
        </small>
      </div>
    </v-card>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: 'Título'
      },
      atualizadoEm: {
        type: String,
        default: ''
      },
      imgSrc: {
        type: String,
        default: ''
      },
      isFavorite: {
        type: Number,
        default: 0
      }
    },
    computed: {
      hoje() {
        const date = new Date()
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${year}-${month}-${day}`
      },
      formattedTitle() {
        if (!this.title) return ''
        return this.title.split('_').join(' ').toLowerCase()
      },
      formattedDate() {
        if (!this.atualizadoEm) return ''
        return this.atualizadoEm.split('-').reverse().join('/')
      }
    },
    methods: {
      getImg(img) {
        if (!img) return ''
        const image = require.context('../../../assets/img/geral/', false, /\.png$/)
        return image(`./${img}.png`)
      }
    }
  }
</script>

<style scoped>
  .container-folder {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }

  .relatorios {
    padding: 20px;
  }

  .icon {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .icon i {
    font-size: 12px;
    padding: 5px;
  }

  .folder {
    background-color: #f0f0f0;
    border-radius: 10px;
    padding: 10px;
    width: 200px;
    max-width: 260px;

    line-height: 2 !important;
  }

  .info-folder {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
  }

  .info-folder img {
    width: 80px;
  }

  .info-folder h4 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 170px;
    text-transform: capitalize;
  }

  .att {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .att p {
    font-size: 10px;
    margin: 0;
    margin-top: 10px;
    padding: 0;

    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
