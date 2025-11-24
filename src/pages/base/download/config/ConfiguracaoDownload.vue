<template>
  <v-card class="rounded-xl">
    <title-negative-margin title="Bases para download" className="rounded-r-xl">
      <v-spacer></v-spacer>
      <v-btn small color="success" @click="criarBase()">Nova base</v-btn>
    </title-negative-margin>
    <v-col cols="3">
      <v-text-field
        outlined
        dense
        v-model="search"
        placeholder="Pesquisar"
        label="Pesquisar"
      ></v-text-field>
    </v-col>
    <v-data-table
      :headers="getHeaders"
      :items="dadosBase"
      dense
      :search="search"
      class="text-no-wrap"
    >
      <template v-slot:item.EDITAR="{ item }">
        <v-btn icon @click="editarDados(item)">
          <v-icon size="19" color="orange">fa-solid fa-pen-to-square</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.CONSULTA="{ item }">
        <div style="width: 400px">
          <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
            {{ item.CONSULTA }}
          </p>
        </div>
      </template>
    </v-data-table>
    <ModalEditBase
      :modalEdit="modalEdit"
      :dadosEdit="dadosEditObject"
      @update:closeEdit="modalEdit = !modalEdit"
      @updated:reload-base="reloadBase"
    />
    <ModalCriarBase
      :modalCriar="modalCriar"
      @update:closeEdit="modalCriar = !modalCriar"
      @updated:reload-base="reloadBase"
    />
  </v-card>
</template>

<script>
  import config from '../../../../core/config'
  import ModalCriarBase from './ModalCriarBase.vue'
  import ModalEditBase from './ModalEditBase.vue'
  export default {
    components: { ModalEditBase, ModalCriarBase },
    data: () => ({
      dadosBase: [],
      modalEdit: false,
      modalCriar: false,
      search: null,
      dadosEditObject: []
    }),
    computed: {
      getHeaders() {
        let data = this.dadosBase[0]
        if (!data) return []
        let newData = Object.keys(data).map(item => {
          return {
            text: item,
            value: item,
            align: 'center'
          }
        })
        newData.unshift({
          text: 'EDITAR',
          value: 'EDITAR',
          align: 'center'
        })
        return newData
      }
    },
    methods: {
      criarBase() {
        this.modalCriar = true
      },
      reloadBase() {
        this.modalEdit = false
        this.modalCriar = false
        this.loadDadosBaseDownload()
      },
      loadDadosBaseDownload() {
        let urlData = `${config.baseUrl}api/shared/bases/bases_downloads`
        this.$api.get(urlData).then(res => {
          this.dadosBase = res.data
        })
      },
      editarDados(item) {
        this.dadosEditObject = item
        this.modalEdit = true
      }
    },
    created() {
      this.loadDadosBaseDownload()
    }
  }
</script>

<style></style>
