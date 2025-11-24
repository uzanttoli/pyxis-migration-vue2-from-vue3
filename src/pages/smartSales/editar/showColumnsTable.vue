<template>
  <div class="text-center">
    <v-menu bottom :close-on-content-click="false">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" icon>
          <v-icon>fa-solid fa-sliders</v-icon>
        </v-btn>
      </template>
      <v-card class="mx-auto" width="600">
        <v-toolbar flat color="deep-purple accent-4" dark>
          <v-toolbar-title>Remover Colunas</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                @click="resetColumns"
                icon
                v-bind="attrs"
                v-on="on"
                :disabled="columnsSelected == ''"
              >
                <v-icon>fa-solid fa-rotate-left</v-icon>
              </v-btn>
            </template>
            <span>Restaurar colunas</span>
          </v-tooltip>
        </v-toolbar>
        <v-col>
          <v-chip-group
            multiple
            v-model="columnsSelected"
            column
            active-class="red--text"
            @change="removeColumn"
          >
            <v-chip
              v-for="(column, index) in columns"
              v-show="column.value != 'ID' && column.value != 'ACOES'"
              :key="index"
              filter
              filter-icon="mdi-close"
              outlined
              @change="restoreColumn(column.value)"
              :value="column.value"
            >
              {{ column.value }}
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
  export default {
    props: {
      columns: {
        type: Array
      }
    },
    data: () => ({
      columnsSelected: [],
      columnsCopy: [],
      tableIsEdition: false,
      columnsRemove: []
    }),
    computed: {
      columnsConsider() {
        return this.tableIsEdition ? this.columnsCopy : this.columns
      }
    },
    methods: {
      resetColumns() {
        this.tableIsEdition = false
        this.columnsSelected = ''
        this.$emit('update:columns', { edition: false, array: [] })
      },
      restoreColumn(item) {
        let include = this.columnsRemove.filter(x => {
          return x.text == item
        })
        if (include == '') {
          let columnsTrue = this.columns
          let filterCopy = columnsTrue.filter(el => {
            return el.text == item
          })
          this.columnsRemove.push(filterCopy[0])
        } else {
          let filterColumnsRemove = this.columnsRemove.filter(x => {
            return x.text == item
          })
          this.columnsCopy.splice(filterColumnsRemove[0].index, 0, filterColumnsRemove[0])
        }
      },
      removeColumn() {
        let ultItem = this.columnsSelected[this.columnsSelected.length - 1]
        const index = this.columnsSelected.indexOf(ultItem)
        if (index !== -1) {
          let copyColumns = this.columns

          let dataConsider = this.tableIsEdition ? this.columnsCopy : copyColumns
          let items = dataConsider.filter(item => {
            return item.text != ultItem
          })

          this.columnsCopy = items
          this.tableIsEdition = true
          this.$emit('update:columns', { edition: true, array: items })
        }
      }
    }
  }
</script>

<style></style>
