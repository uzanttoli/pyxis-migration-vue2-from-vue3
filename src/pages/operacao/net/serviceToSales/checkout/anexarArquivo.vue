<template>
  <v-bottom-sheet v-model="openSheet" persistent>
    <v-sheet>
      <v-list>
        <v-subheader>
          Necessário anexar evidência da aplicação da medida para seguir!
          <v-spacer></v-spacer>
          <v-btn icon @click="$emit('update:close')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-subheader>
        <input
          type="file"
          style="display: none"
          ref="fileInputEvidencia"
          @change="onFileChange"
          name="arquivo"
          accept=".png, .jpg, .jpeg, .docx, .pdf, .msg"
        />
        <div class="anexo" @click="openFileInputEvidencia">Anexar [PNG, JPG, DOCX, PDF, MSG]</div>
      </v-list>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
  import alerts from '@/mixins/alerts.mixins'
  export default {
    props: {
      openSheet: {
        type: Boolean,
        default: true
      }
    },
    mixins: [alerts],
    data: () => ({
      fileArquive: null,
      nameFileArquive: null
    }),
    methods: {
      openFileInputEvidencia() {
        this.$refs.fileInputEvidencia.click()
      },
      onFileChange(event) {
        let fileArquive = event.target.files[0]
        let tipoArquivo = fileArquive.name.split('.').pop()
        if (
          tipoArquivo == 'docx' ||
          tipoArquivo == 'pdf' ||
          tipoArquivo == 'png' ||
          tipoArquivo == 'jpg' ||
          tipoArquivo == 'jpeg' ||
          tipoArquivo == 'msg'
        ) {
          this.$emit('update:file-change', fileArquive)
          this.$emit('update:close')
        } else {
          this.toast('Formato de arquivo não permitido!', 'top-right', false, 4000, 'warning')
        }
      }
    }
  }
</script>

<style scoped>
  .anexo {
    display: flex;
    justify-content: center;
    padding: 10px;
    background-color: #e3e3e3d8;
    margin: 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.5s ease, box-shadow 0.5s ease;
  }

  .anexo:hover {
    background-color: #268e1bd8;
    color: white;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  }
</style>
