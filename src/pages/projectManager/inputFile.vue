<template>
  <v-card elevation="0">
    <input type="file" multiple hidden ref="inputFile" @change="handleFile" />
    <div style="display: flex; flex-direction: column">
      <v-btn
        class="mb-2"
        color="info"
        @click="handleInput"
        width="200"
        depressed
        small
        v-if="isAttachment"
      >
        <i class="fa-solid fa-plus"></i>
        Anexar
      </v-btn>
      <span style="margin-top: 5px" v-if="isTextBottom">
        Selecione
        <strong>um ou mais arquivos.</strong>
      </span>
    </div>
    <v-col class="pa-0 ma-0">
      <v-card
        v-for="(item, i) in files"
        :key="i"
        class="pa-2 mb-2"
        elevation="0"
        outlined
        style="display: flex; justify-content: space-between; align-items: center"
      >
        {{ i + 1 + ' - ' + item.name }}
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn icon color="red" @click="removeFile(item)" v-bind="attrs" v-on="on">
              <i class="fa-solid fa-trash"></i>
            </v-btn>
          </template>
          <span>Deletar</span>
        </v-tooltip>
      </v-card>
    </v-col>
  </v-card>
</template>

<script>
  export default {
    props: {
      isSendFile: {
        type: Boolean,
        default: false
      },
      isTextBottom: {
        type: Boolean,
        default: true
      },
      isAttachment: {
        type: Boolean,
        default: true
      }
    },
    data: () => ({
      files: []
    }),
    methods: {
      handleInput() {
        let anexo = this.$refs.inputFile.click()
        return anexo
      },
      handleFile(e) {
        let files = e.target.files
        for (const file of files) {
          this.files.push(file)
        }
        this.$emit('update-files', this.files)
      },
      removeFile(fileToRemove) {
        for (let i = 0; i < this.files.length; i++) {
          if (this.files[i] === fileToRemove) {
            this.files.splice(i, 1)
            break
          }
        }
        this.$emit('update-files', this.files)
      }
    },
    watch: {
      isSendFile() {
        if (this.isSendFile == true)
          for (let i = 0; i < this.files.length; i++) {
            this.files = []
            break
          }
        this.$refs.inputFile.value = null
      }
    }
  }
</script>

<style scoped>
  li {
    border: 1px solid #d2d2d2;
    padding: 10px;
    list-style: none;
    margin: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
