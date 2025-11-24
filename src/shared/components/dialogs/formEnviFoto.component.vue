<template>
  <div class="container">
    <div class="large-12 medium-12 small-12 cell">
      <label>
        Insira uma foto
        <input type="file" id="file" ref="file" v-on:change="onChangeFileUpload()" />
      </label>
      <button v-on:click="submitForm()">Enviar</button>
    </div>
  </div>
</template>

<script>
  import config from '../../../core/config'
  export default {
    data() {
      return {
        file: ''
      }
    },

    methods: {
      submitForm() {
        let formData = new FormData()
        formData.append('file', this.file)
        let urlData = `${config.baseUrl}`

        this.$api.post(urlData + '/api/upload/recebe_upload/uploadPhoto', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      },

      onChangeFileUpload() {
        this.file = this.$refs.file.files[0]
      }
    }
  }
</script>
