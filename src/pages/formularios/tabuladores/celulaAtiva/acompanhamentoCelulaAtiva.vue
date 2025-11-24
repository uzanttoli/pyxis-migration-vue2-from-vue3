<template>
  <v-container class="mt-4">
    <v-card elevation="1" class="rounded-xl" height="500">
      <v-card-title>
        <div style="display: flex; justify-content: space-between; width: 100%">
          Acompanhamento e atualização de mailing
          <div style="display: flex; gap: 10px">
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  icon
                  color="warning"
                  v-bind="attrs"
                  v-on="on"
                  href="http://10.64.175.49:4300/receptivo/index.php/api/arquivos/get_arquivos/BULK_MAILING_TABULADORES/BULK_CELULA_ATIVA/MODELO_DOWNLOAD.csv"
                >
                  <v-icon>fa-solid fa-cloud-arrow-down</v-icon>
                </v-btn>
              </template>
              <span>Baixar modelo</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn icon @click="openUploadBase = true" color="green" v-bind="attrs" v-on="on">
                  <v-icon>fa-solid fa-cloud-arrow-up</v-icon>
                </v-btn>
              </template>
              <span>Atualizar mailing</span>
            </v-tooltip>
            <v-divider vertical></v-divider>
            <v-tooltip>
              <template v-slot:activator="{ attrs, on }">
                <v-btn icon to="/pyxis/utilitarios?id=75" color="red" v-on="on" v-bind="attrs">
                  <v-icon>fas fa-close</v-icon>
                </v-btn>
              </template>
              <span>Fechar</span>
            </v-tooltip>
          </div>
        </div>
      </v-card-title>
      <v-divider></v-divider>
      <v-col>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: 40dvh;
            font-size: 20px;
            color: #bdbdbd;
          "
        >
          Não há dados ainda...
        </div>
      </v-col>
    </v-card>
    <upload-base-celula-ativa
      :openUploadBase="openUploadBase"
      @updated-close="openUploadBase = !openUploadBase"
    ></upload-base-celula-ativa>
  </v-container>
</template>

<script>
  import uploadBaseCelulaAtiva from './uploadBaseCelulaAtiva.vue'
  export default {
    components: { uploadBaseCelulaAtiva },
    data: () => ({
      openUploadBase: false
    })
  }
</script>

<style scoped>
  .container-input {
    width: 500px;
    height: 200px;
    border: 1px solid #7676dd;
    border-radius: 20px;
    padding: 10px;
    cursor: pointer;
  }

  .input-file {
    display: flex;
    border: 1px dotted #7676dd;
    border-radius: 20px;
    height: 100%;
    align-items: center;
    justify-content: center;
    transition: 0.5s;
  }

  .input-file:hover {
    background-color: #ebebeb33;
  }

  .file-csv {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
