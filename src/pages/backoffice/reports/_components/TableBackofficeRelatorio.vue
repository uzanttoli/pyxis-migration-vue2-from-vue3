<template>
  <v-card elevation="1">
    <title-negative-margin :title="title" className="rounded-r-xl"></title-negative-margin>
    <v-col class="py-0">
      <v-row>
        <v-col>
          <v-select
            placeholder="Pesquisar por"
            outlined
            dense
            :items="[{ text: '', value: 'all' }, ...headers]"
            item-text="text"
            v-model="fieldSearch"
          ></v-select>
        </v-col>
        <v-col>
          <v-text-field v-model="search" outlined dense placeholder="Pesquisar"></v-text-field>
        </v-col>
      </v-row>
    </v-col>
    <v-data-table
      :headers="headers"
      :items="filterSearch"
      :footer-props="footerProps"
      dense
      :search="search"
      :no-data-text="search ? 'Existe um filtro aplicado!' : 'Não há dados no momento!'"
      loading-text="Carregando..."
    ></v-data-table>
  </v-card>
</template>

<script>
  export default {
    props: {
      data: {
        type: Array,
        default: () => []
      },
      title: {
        type: String,
        default: 'Tabela'
      }
    },
    data: () => ({
      footerProps: {
        itemsPerPageText: 'Itens por página:',
        pageText: '{0}-{1} de {2}',
        perPageText: 'Itens por página:'
      },
      search: null,
      fieldSearch: null
    }),
    computed: {
      headers() {
        let data = this.data[0] || []
        if (data) {
          let headers = Object.keys(data).map(key => {
            return {
              text: key,
              value: key,
              align: 'center',
              class: ''
            }
          })
          return headers
        }
        return []
      },
      filterSearch() {
        return this.data.filter(item => {
          return Object.keys(item).some(key => {
            if (this.fieldSearch == 'all') return this.data
            if (this.fieldSearch && this.search) {
              if (this.fieldSearch == key) {
                return String(item[key])
                  .toLowerCase()
                  .includes(this.search && this.search.toLowerCase())
              }
            } else {
              return this.data
            }
            return false
          })
        })
      }
    },
    created() {}
  }
</script>

<style></style>
