<template>
  <v-navigation-drawer app right v-model="abrirModal" width="300">
    <v-col>
      <v-text-field
        outlined
        dense
        placeholder="Pesquisar"
        label="Pesquisar"
        v-model="search"
        :loading="loadingMinhasTratativas"
      ></v-text-field>
      <v-divider></v-divider>
      <v-list two-line>
        <template v-if="!search">
          <v-list-group :value="false" v-for="(item, i) in acompanharTratativas" :key="i">
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title class="text-capitalize">
                  {{ item && item.SITUACAO.toLowerCase().split('_').join(' ') }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <span style="font-size: 13px; color: orange">
                    Quant. pendente: {{ item.QTD }}
                  </span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </template>

            <v-list-item
              sub-group
              v-for="(subItem, j) in item.CASOS"
              :key="j"
              @click="selectItem(subItem.NUM_CASO)"
              two-line
            >
              <v-list-item-content>
                <v-list-item-subtitle>Núm. caso: {{ subItem.NUM_CASO }}</v-list-item-subtitle>
                <v-list-item-subtitle>Cidade: {{ subItem.DESC_MUNICIPIO }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <template v-else>
          <v-list-item v-for="(item, i) in filterCasos" :key="i" @click="selectItem(item.NUM_CASO)">
            <v-list-item-content>
              <v-list-item-subtitle>Núm. caso: {{ item.NUM_CASO }}</v-list-item-subtitle>
              <v-list-item-subtitle>Cidade: {{ item.CIDADE }}</v-list-item-subtitle>
              <v-list-item-subtitle>Situação: {{ item.SITUACAO }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-col>
  </v-navigation-drawer>
</template>

<script>
  export default {
    props: {
      loadingMinhasTratativas: {
        type: Boolean,
        default: false
      },
      abrirModal: {
        type: Boolean,
        default: false
      },
      search: {
        type: String,
        default: ''
      },
      acompanharTratativas: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      filterCasos() {
        const dados = this.acompanharTratativas
        if (!dados) return

        // Extrair todos os casos
        const todosCasos = dados.flatMap(item =>
          item.CASOS.map(caso => ({
            NUM_CASO: caso.NUM_CASO,
            CIDADE: caso.DESC_MUNICIPIO,
            SITUACAO: item.SITUACAO
          }))
        )

        const search = this.search.split('>').map(s => s.toLowerCase())

        // Função para verificar se um item contém a busca
        const containsSearch = (item, searchTerm) =>
          item.NUM_CASO.toString().includes(searchTerm) ||
          item.CIDADE.toLowerCase().includes(searchTerm) ||
          item.SITUACAO.toLowerCase().includes(searchTerm)

        // Filtrando os dados com base na busca
        let resultados = todosCasos.filter(item => containsSearch(item, search[0]))

        for (let i = 1; i < search.length; i++) {
          if (search[i]) {
            resultados = resultados.filter(item => containsSearch(item, search[i]))
          }
        }

        return resultados
      }
    }
  }
</script>

<style></style>
