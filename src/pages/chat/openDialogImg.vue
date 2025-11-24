<template>
  <!-- v-model="openImg" -->

  <v-dialog
    max-width="70vw"
    persistent
    :model-value="openImg"
    @update:modelValue="val => $emit('update:openImg', val)"
  >
    <div class="text-center">
      <v-card tile>
        <v-col>
          <div style="display: flex; justify-content: center">
            <span id="mouse">
              <div>
                <v-btn icon absolute fab x-small class="error" right @click="$emit('update-close')">
                  <v-icon color="white">fa-solid fa-xmark</v-icon>
                </v-btn>

                <v-btn
                  icon
                  v-if="dataMessage.is_base_64 != 1"
                  absolute
                  fab
                  x-small
                  @click="downloadFile"
                  class="green"
                  style="margin-top: 40px"
                  right
                >
                  <v-icon color="white">fa-solid fa-square-arrow-up-right</v-icon>
                </v-btn>

                <div class="image-container">
                  <img
                    v-if="dataMessage.is_base_64 == 1 && dataMessage.msg_visible == 1"
                    :src="dataMessage.foto_base_64"
                  />

                  <img
                    v-else-if="
                      (!dataMessage.foto_base_64 == '' || !dataMessage.foto_base_64 == null) &&
                      dataMessage.msg_visible == 1
                    "
                    :src="imageWs(dataMessage.foto_base_64)"
                  />
                </div>
              </div>
            </span>
          </div>
        </v-col>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      dataMessage: {
        type: [Object, Array],
        require: true
      },
      openImg: {
        type: Boolean,
        default: false
      },

      styleImg: {
        type: String,
        default: ''
      },
      styleComponentImg: {
        type: String,
        default: ''
      },
      maxWidth: {
        type: [String, Number],
        default: '50%'
      },
      title: {
        type: String,
        default: 'Title'
      },
      imgLength: {
        type: Number,
        default: 1
      }
    },
    computed: {},
    methods: {
      downloadFile() {
        const fileUrl = `${process.env.VUE_APP_PYXIS_API_CHAT}/arquivos/get_image/${this.dataMessage.foto_base_64}`
        window.open(fileUrl, '_blank')
      },

      imageWs(img) {
        if (!img) return
        return `${process.env.VUE_APP_PYXIS_API_CHAT}/arquivos/get_image/${img}`
      },
      _dialog() {
        this.openImg = false
      },
      formatadedName(name) {
        if (!name) return

        // Divide o nome em palavras separadas por espaços
        const words = name.toLowerCase().split(' ')

        // Capitaliza a primeira letra de cada palavra
        const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1))

        // Junta as palavras formatadas com espaços
        const formattedName = capitalizedWords.join(' ')

        return formattedName
      }
    }
  }
</script>

<style scoped>
  img.preview {
    width: 100%;
    background-color: white;
    border: 1px solid #ddd;
    padding: 5px;
  }

  .image-container {
    display: flex;
  }

  .image-container img {
    width: 100%;
    height: 100%;
  }
</style>
