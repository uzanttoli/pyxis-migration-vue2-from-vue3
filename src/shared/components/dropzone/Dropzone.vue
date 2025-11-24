<template>
  <div>
    <v-card width="350">
      <v-card-text>
        <div class="pa-2">
          <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import vue2Dropzone from 'vue2-dropzone'
  import 'vue2-dropzone/dist/vue2Dropzone.min.css'
  export default {
    name: 'dropzone',
    data() {
      return {
        dropzoneOptions: {
          url: 'https://httpbin.org/post',
          thumbnailWidth: 100,
          maxFilesize: 0.5,
          headers: { 'My-Awesome-Header': 'header value' }
        }
      }
    },
    components: {
      vueDropzone: vue2Dropzone
    }
  }
</script>

<style></style>
