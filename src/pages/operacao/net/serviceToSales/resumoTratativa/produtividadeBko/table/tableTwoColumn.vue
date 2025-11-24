<template>
  <v-col :cols="cols" v-if="data.length > 0">
    <div style="display: flex">
      <h3>{{ title }}</h3>
      <template v-if="title != '🔎 Preview Dos Dados'">
        <download-excel :data="data" :name="namePlan" :worksheet="namePlan">
          <v-btn tile depressed small class="ml-2" color="success">
            <v-icon small class="mr-2">fa-solid fa-file-excel</v-icon>
            Baixar Dados
          </v-btn>
        </download-excel>
      </template>
    </div>
    <v-simple-table fixed-header height="300px" dense>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-center" v-for="(item, i) in header" :key="i">
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody :id="idTable"></tbody>
      </template>
    </v-simple-table>
  </v-col>
</template>

<script>
  export default {
    props: {
      data: {
        type: [Array, Object],
        require: true
      },
      title: {
        type: String,
        default: ''
      },
      cols: {
        type: Number,
        default: 12
      },
      namePlan: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      header: []
    }),
    computed: {
      idTable() {
        return this.generateHashTable()
      }
    },
    methods: {
      generateHashTable() {
        const date = new Date()
        return `tabela-${date.getTime().toString()}`
      },
      createTable() {
        const tbodyElemento = document.getElementById(this.idTable)
        this.data.forEach(item => {
          const tr = document.createElement('tr')
          tr.className = 'text-center'

          Object.values(item).forEach(value => {
            const td = document.createElement('td')
            if (value === 0) {
              const redIcon = document.createElement('i')
              redIcon.className = 'fas fa-circle'
              redIcon.style.color = 'red'
              td.appendChild(redIcon)
            } else if (value === 1) {
              const greenIcon = document.createElement('i')
              greenIcon.className = 'fas fa-circle'
              greenIcon.style.color = 'green'
              td.appendChild(greenIcon)
            } else {
              td.textContent = value
            }
            tr.appendChild(td)
          })

          tbodyElemento.appendChild(tr)
        })
      },
      getHeaders() {
        let data = this.data
        if (data) {
          let header = []
          for (let i = 0; i < 10; i++) {
            const primeiroObjeto = data[0]
            const chave = Object.keys(primeiroObjeto)[i]
            if (chave == undefined) {
              break
            } else {
              header.push(chave)
            }
          }
          this.header = header
        }
      }
    },
    watch: {
      data() {
        if (this.data.length > 0 && this.idTable) {
          this.generateHashTable()
          this.getHeaders()
          setTimeout(() => {
            this.createTable()
          }, 1000)
        }
      }
    },
    created() {}
  }
</script>

<style></style>
