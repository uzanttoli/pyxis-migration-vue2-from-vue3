<template>
  <v-card elevation="1" :class="className">
    <slot name="title"></slot>
    <v-col class="py-0">
      <v-row>
        <v-col>
          <v-autocomplete
            placeholder="Pesquisar por"
            outlined
            dense
            :items="[{ text: '', value: 'all' }, ...headers]"
            item-text="text"
            v-model="fieldSearch"
          ></v-autocomplete>
        </v-col>
        <v-col>
          <v-text-field v-model="search" outlined dense placeholder="Pesquisar"></v-text-field>
        </v-col>
      </v-row>
    </v-col>
    <v-card-text
      v-if="propsPerson"
      class="mt-n8 ml-n1"
      style="display: flex; gap: 5px; justify-content: end"
    >
      <v-btn @click="openAll()" depressed color="info" small>Abrir todos</v-btn>
      <v-btn @click="closeAll()" depressed color="error" small>Fechar todos</v-btn>
    </v-card-text>
    <v-data-table
      :headers="headers"
      :items="filterSearch"
      :footer-props="footerProps"
      :loading="loading"
      dense
      class="text-no-wrap"
      :item-class="getClass"
      :search="search"
      :no-data-text="search ? 'Existe um filtro aplicado!' : 'Não há dados no momento!'"
      loading-text="Carregando..."
      v-bind="propsPerson"
    >
      <template v-slot:group.header="{ group, headers, toggle, isOpen }">
        <td :colspan="headers.length">
          <v-btn @click="toggle" small icon :ref="group" :data-open="isOpen">
            <v-icon v-if="isOpen">mdi-chevron-up</v-icon>
            <v-icon v-else>mdi-chevron-down</v-icon>
          </v-btn>
          {{ group }}
        </td>
      </template>
    </v-data-table>
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
        default: ''
      },
      className: {
        type: String,
        default: ''
      },
      loading: {
        type: Boolean,
        default: false
      },
      propsPerson: {
        type: [Object, Array]
      },
      getClass: {
        type: Function,
        default: () => ''
      }
    },
    data: () => ({
      footerProps: {
        itemsPerPageText: 'Itens por página:',
        pageText: '{0}-{1} de {2}',
        perPageText: 'Itens por página:'
      },
      search: null,
      fieldSearch: null,
      expandedGroups: []
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
              class: 'blue-grey lighten-5'
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
    mounted() {
      this.$nextTick(() => {
        this.closeAll()
      })
    },
    methods: {
      toggleAll() {
        Object.keys(this.$refs).forEach(k => {
          this.$refs[k].$el.click()
        })
      },
      closeAll() {
        Object.keys(this.$refs).forEach(k => {
          if (this.$refs[k] && this.$refs[k].$attrs['data-open']) {
            this.$refs[k].$el.click()
          }
        })
      },
      openAll() {
        Object.keys(this.$refs).forEach(k => {
          if (this.$refs[k] && !this.$refs[k].$attrs['data-open']) {
            this.$refs[k].$el.click()
          }
        })
      }
    },
    created() {}
  }
</script>

<style></style>
