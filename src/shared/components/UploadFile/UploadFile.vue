<template>
  <div>
    <div
      :class="`${elevate && 'shadow-1'} ${nospacing && 'pa-8'}`"
      class="radius-3 d-flex flex-column justify-space-between gap-4 clickable"
    >
      <div
        class="d-flex flex-column gap-3 align-center justify-center w-full border-dashed h-72 radius-2 border-primary"
        @click="triggerFileInput"
      >
        <i class="fa-solid fa-cloud-arrow-up fa-4xl text-primary"></i>
        <div class="font-medium">Procurar arquivo para upload</div>
      </div>
      <input
        ref="fileInput"
        type="file"
        class="radius-1 w-full"
        :accept="acceptedTypes"
        @change="handleFileChange"
        style="display: none"
      />

      <div class="file-info-container w-full text-right pa-4 file-actions">
        <div class="d-flex w-full justify-between align-center" @click="handleFileActionsClick">
          <v-icon color="#3E87C2">mdi-file</v-icon>
          <v-spacer />
          <div class="clickable">
            {{ fileName ? fileName : 'Nenhum arquivo selecionado - ' }}
          </div>
          <div @click.stop="clearFile">
            <v-icon>mdi-delete</v-icon>
          </div>
        </div>
      </div>
    </div>
    <v-footer v-if="showFooter" class="text-caption">
      Tamanho máximo: {{ maxSize }} MB. Tipos permitidos:
      {{ acceptedTypes === 'image/*' ? 'Imagens' : acceptedTypes }}.
    </v-footer>
  </div>
</template>

<script>
  export default {
    name: 'UploadFile',
    props: {
      nospacing: {
        type: Boolean,
        default: false
      },
      elevate: {
        type: Boolean,
        default: false
      },
      acceptedTypes: {
        type: String,
        default: '*/*'
      },
      maxSize: {
        type: Number,
        default: 5
      },
      showFooter: {
        type: Boolean,
        default: true
      },
      value: {
        type: File,
        default: null
      }
    },
    watch: {
      value(newValue) {
        if (!newValue) {
          this.fileName = ''
          this.$refs.fileInput.value = ''
        }
      }
    },
    data() {
      return {
        fileName: ''
      }
    },
    methods: {
      triggerFileInput() {
        this.$refs.fileInput.click()
      },
      handleFileChange(event) {
        const file = event.target.files[0]
        if (file) {
          this.fileName = file.name
          this.$emit('input', file)
        }
      },
      handleFileActionsClick() {
        this.triggerFileInput()
      },
      clearFile() {
        this.fileName = ''
        this.$refs.fileInput.value = ''
        this.$emit('input', null)
      }
    }
  }
</script>
<style scoped>
  .file-info-container {
    background-color: #e8f0fd;
    padding: 8px;
    border-radius: 4px;
  }
  .fa-4xl {
    font-size: 4rem;
  }
</style>
