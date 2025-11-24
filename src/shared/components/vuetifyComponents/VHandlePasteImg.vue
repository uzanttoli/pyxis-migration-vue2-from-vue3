<template>
  <v-card width="100%" elevation="0" class="pa-1 mb-2 mr-2" outlined style="position: relative">
    <div style="position: absolute">
      <i class="fa-solid fa-circle-check" v-if="imageData != null" style="color: green"></i>
      <i v-else class="fa-solid fa-circle-exclamation" style="color: orange"></i>
      <span style="font-weight: 600; padding: 5px">{{ title }}</span>
    </div>
    <div style="display: flex; align-items: center; padding: 4px">
      <v-text-field
        @paste="handlePaste"
        dense
        outlined
        prepend-icon="fa-solid fa-paperclip"
        class="rounded-xl mb-n6"
        :placeholder="nameField"
      ></v-text-field>
      <div class="_container">
        <img v-if="imageData" :src="imageData" alt="" />
        <span
          v-if="!imageData"
          style="
            position: absolute;
            top: 35px;
            left: 18px;
            transform: rotate(-30deg);
            color: #b3b3b3;
          "
        >
          Sem anexo
        </span>
      </div>
    </div>
  </v-card>
</template>

<script>
  export default {
    props: {
      nameField: {
        type: String,
        default: 'Cole a imagem aqui'
      },
      title: {
        type: String,
        default: ''
      },
      clearImg: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      imageData: null
    }),
    computed: {},
    methods: {
      dataURLtoFile(dataURL, filename) {
        const arr = dataURL.split(',')
        const mime = arr[0].match(/:(.*?);/)[1]
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], filename, { type: mime })
      },
      handlePaste(event) {
        const items = event.clipboardData.items
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          if (item.type.indexOf('image') === 0) {
            const reader = new FileReader()
            reader.onload = e => {
              const dataURL = e.target.result
              const name = this.title.split(' ').join('_')

              const file = this.dataURLtoFile(dataURL, `${name}.png`)

              this.imageData = e.target.result
              this.$emit('update:file-img', file)
              this.nameFileImg = file.name
            }
            reader.readAsDataURL(item.getAsFile())
          }
        }
      }
    },
    watch: {
      clearImg() {
        if (this.clearImg == true) {
          this.imageData = null
        }
      }
    }
  }
</script>

<style scoped>
  ._container {
    width: 120px;
    height: 100px;
    padding: 10px;
    border: 1px dashed grey;
    margin: 6px;
    position: relative;
  }

  img {
    width: 100%;
    height: 80px;
  }
</style>
