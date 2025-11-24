<template>
  <!-- v-model="dialog" -->
  <v-dialog
    persistent
    :model-value="dialog"
    @update:modelValue="val => $emit('update:dialog', val)"
  >
    <v-card>
      <div style="display: flex; flex-direction: row; align-items: center">
        <v-card-title>Selecione os filtros</v-card-title>
        <v-spacer></v-spacer>
        <div v-if="clearAllIsValid()">
          <v-chip
            depressed
            class="mr-2 white--text"
            close
            @click:close="clearAllItems"
            color="#21AAF2"
          >
            Limpar todos os filtros
          </v-chip>
        </div>
        <v-btn icon @click="$emit('update:close')" class="mr-5 cor-padrao">
          <v-icon color="white">fa fa-close</v-icon>
        </v-btn>
      </div>
      <v-container fluid>
        <div
          style="display: flex; flex-wrap: wrap; justify-content: start"
          :style="
            $vuetify.breakpoint.sm
              ? 'display: flex; flex-wrap: wrap; justify-content: center'
              : $vuetify.breakpoint.md
              ? 'display: flex; flex-wrap: wrap; justify-content: center'
              : $vuetify.breakpoint.lg
              ? 'display: flex; flex-wrap: wrap; justify-content: center'
              : ''
          "
        >
          <div class="pa-2">
            <div style="display: flex; align-items: center; justify-content: space-between">
              <span>STATUS</span>
              <div v-if="selectedStatus != ''">
                <v-chip
                  small
                  color="#21AAF2"
                  class="white--text"
                  close
                  @click:close="clearItems('STATUS')"
                >
                  Filtrado
                </v-chip>
              </div>
            </div>
            <select id="list" multiple v-model="selectedStatus" @change="itemsSelected">
              <option v-for="(item, i) in status" :key="i" :id="item.STATUS" :value="item">
                {{ item.STATUS }} | ({{ countItems(item.STATUS, 'STATUS') }})
              </option>
            </select>
          </div>
          <div class="pa-2">
            <div style="display: flex; align-items: center; justify-content: space-between">
              <span>TIPO</span>
              <div v-if="selectedType != ''">
                <v-chip
                  small
                  color="#21AAF2"
                  class="white--text"
                  close
                  @click:close="clearItems('TIPO')"
                >
                  Filtrado
                </v-chip>
              </div>
            </div>
            <select id="list" multiple v-model="selectedType" @change="itemsSelected">
              <option v-for="(item, i) in tipo" :key="i" :id="item.TIPO" :value="item">
                {{ item.TIPO }} | ({{ countItems(item.TIPO, 'TIPO') }})
              </option>
            </select>
          </div>
          <div class="pa-2">
            <div style="display: flex; align-items: center; justify-content: space-between">
              <span>SLA</span>

              <div v-if="selectedSla != ''">
                <v-chip
                  small
                  color="#21AAF2"
                  class="white--text"
                  close
                  @click:close="clearItems('SLA')"
                >
                  Filtrado
                </v-chip>
              </div>
            </div>
            <select id="list" multiple v-model="selectedSla" @change="itemsSelected">
              <option v-for="(item, i) in sla" :key="i" :id="item.SLA" :value="item">
                {{ item.SLA }} | ({{ countItems(item.SLA, 'SLA') }})
              </option>
            </select>
          </div>
          <div class="pa-2">
            <div style="display: flex; align-items: center; justify-content: space-between">
              <span>DIA UTIL</span>

              <div v-if="selectedDayUtil != ''">
                <v-chip
                  small
                  color="#21AAF2"
                  class="white--text"
                  close
                  @click:close="clearItems('DIA_UTIL')"
                >
                  Filtrado
                </v-chip>
              </div>
            </div>
            <select id="list" multiple v-model="selectedDayUtil" @change="itemsSelected">
              <option v-for="(item, i) in diaUtil" :key="i" :id="item.DIA_UTIL" :value="item">
                {{ item.DIA_UTIL }} | ({{ countItems(item.DIA_UTIL, 'DIA_UTIL') }})
              </option>
            </select>
          </div>
          <div class="pa-2">
            <div style="display: flex; align-items: center; justify-content: space-between">
              <span>SUPERVISOR</span>
              <div v-if="selectedSupervisor != ''">
                <v-chip
                  small
                  color="#21AAF2"
                  class="white--text"
                  close
                  @click:close="clearItems('SUPERIOR1')"
                >
                  Filtrado
                </v-chip>
              </div>
            </div>
            <select id="list" multiple v-model="selectedSupervisor" @change="itemsSelected">
              <option v-for="(item, i) in supervisor" :key="i" :id="item.SUPERIOR1" :value="item">
                {{ item.SUPERIOR1 }} | ({{ countItems(item.SUPERIOR1, 'SUPERIOR1') }})
              </option>
            </select>
          </div>
        </div>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      dialog: {
        type: Boolean,
        default: false
      },
      baseItems: {
        type: Array
      },
      isFilterLoad: {
        type: Boolean
      }
    },
    data: () => ({
      selectedStatus: [],
      selectedType: [],
      selectedSla: [],
      selectedDayUtil: [],
      selectedSupervisor: [],
      select: false,
      baseFilter: []
    }),
    computed: {
      status() {
        let items = this.select ? this.baseFilter : this.baseItems
        let status = []
        items.map(item => {
          if (item !== null) {
            status.push({ STATUS: item.STATUS })
          }
        })
        return this.removeDuplicates(status, 'STATUS')
        // return this.statusCount();
      },
      tipo() {
        let items = this.select ? this.baseFilter : this.baseItems
        let tipo = []

        items.map(item => {
          if (item.TIPO !== null) {
            tipo.push({ TIPO: item.TIPO })
          }
        })

        return this.removeDuplicates(tipo, 'TIPO')
        // return this.tipoCount();
      },
      sla() {
        let items = this.select ? this.baseFilter : this.baseItems
        let sla = []

        items.map(item => {
          if (item.SLA !== null) {
            sla.push({ SLA: item.SLA })
          }
        })

        return this.removeDuplicates(sla, 'SLA')

        // return this.slaCount();
      },
      diaUtil() {
        let items = this.select ? this.baseFilter : this.baseItems
        let diaUtil = []

        items.map(item => {
          if (item.DIA_UTIL !== null) {
            diaUtil.push({ DIA_UTIL: item.DIA_UTIL })
          }
        })

        return this.removeDuplicates(diaUtil, 'DIA_UTIL')
        // return this.diaUtilCount();
      },
      supervisor() {
        let items = this.select ? this.baseFilter : this.baseItems
        let supervisor = []

        items.map(item => {
          if (item.SUPERIOR1 !== null) {
            supervisor.push({
              SUPERIOR1: item.SUPERIOR1
            })
          }
        })

        return this.removeDuplicates(supervisor, 'SUPERIOR1')
        // return this.supervisorCount();
      }
    },

    methods: {
      clearAllIsValid() {
        return (
          this.selectedStatus != '' ||
          this.selectedType != '' ||
          this.selectedSla != '' ||
          this.selectedDayUtil != '' ||
          this.selectedSupervisor != ''
        )
      },
      countItems(string, column) {
        let items = this.select ? this.baseFilter : this.baseItems
        const count = items.filter(obj => obj[column] === string).length
        return count
      },
      clearAllItems() {
        ;(this.selectedStatus = []),
          (this.selectedType = []),
          (this.selectedSla = []),
          (this.selectedDayUtil = []),
          (this.selectedSupervisor = [])
        this.itemsSelected()
      },
      clearItems(value) {
        switch (value) {
          case 'STATUS':
            this.selectedStatus = []
            this.itemsSelected()
            break
          case 'TIPO':
            this.selectedType = []
            this.itemsSelected()
            break
          case 'SLA':
            this.selectedSla = []
            this.itemsSelected()
            break
          case 'DIA_UTIL':
            this.selectedDayUtil = []
            this.itemsSelected()
            break
          case 'SUPERIOR1':
            this.selectedSupervisor = []
            this.itemsSelected()
            break
        }
      },
      itemsSelected() {
        this.select = true
        const arrayStatus = this.selectedStatus
        const arrayType = this.selectedType
        const arraySla = this.selectedSla
        const arrayDayUtil = this.selectedDayUtil
        const arraySupervisor = this.selectedSupervisor

        let isFilter =
          arrayStatus != '' ||
          arrayType != '' ||
          arraySla != '' ||
          arrayDayUtil != '' ||
          arraySupervisor != ''

        let filtroStatus = []
        let filtroTipo = []
        let filtroSla = []
        let filtroDiaUtil = []
        let filtroSupervisor = []

        for (let i = 0; i < arrayStatus.length; i++) {
          filtroStatus.push(arrayStatus[i].STATUS)
        }
        for (let i = 0; i < arrayType.length; i++) {
          filtroTipo.push(arrayType[i].TIPO)
        }
        for (let i = 0; i < arraySla.length; i++) {
          filtroSla.push(arraySla[i].SLA)
        }
        for (let i = 0; i < arrayDayUtil.length; i++) {
          filtroDiaUtil.push(arrayDayUtil[i].DIA_UTIL)
        }
        for (let i = 0; i < arraySupervisor.length; i++) {
          filtroSupervisor.push(arraySupervisor[i].SUPERIOR1)
        }

        var itemsFiltrados = this.baseItems.slice()

        if (filtroStatus.length > 0) {
          itemsFiltrados = itemsFiltrados.filter(item => {
            return filtroStatus.includes(item.STATUS)
          })
        }

        if (filtroTipo.length > 0) {
          itemsFiltrados = itemsFiltrados.filter(item => {
            return filtroTipo.includes(item.TIPO)
          })
        }

        if (filtroSla.length > 0) {
          itemsFiltrados = itemsFiltrados.filter(item => {
            return filtroSla.includes(item.SLA)
          })
        }

        if (filtroDiaUtil.length > 0) {
          itemsFiltrados = itemsFiltrados.filter(item => {
            return filtroDiaUtil.includes(item.DIA_UTIL)
          })
        }

        if (filtroSupervisor.length > 0) {
          itemsFiltrados = itemsFiltrados.filter(item => {
            return filtroSupervisor.includes(item.SUPERIOR1)
          })
        }

        this.$emit('update:items-selected', {
          itemsFiltrados,
          isFilter
        })
        return (this.baseFilter = itemsFiltrados)
      },
      contarItem(array, item) {
        let contador = 0
        for (let i = 0; i < array.length; i++) {
          if (array[i] === item) {
            contador++
          }
        }
        return contador
      },
      removeDuplicates(array, column) {
        let result = []
        let keys = new Set()
        for (let obj of array) {
          if (!keys.has(obj[column])) {
            keys.add(obj[column])
            result.push(obj)
          }
        }
        return result
      }
    },
    watch: {
      isFilterLoad: function (newValue) {
        if (newValue === false) {
          this.itemsSelected()
        }
      }
    }
  }
</script>

<style scoped>
  select[multiple] {
    background: none;
    width: 600px;
    height: 240px;
    padding: 0;
    margin: 0;
    border: 2px solid grey;
    /* border-width: 2px solid grey; */
    /* border-style: inset; */
    font-family: inherit;
    font-size: inherit;
    cursor: inherit;
    line-height: inherit;
    appearance: none;
  }

  select:focus {
    box-shadow: 0 0 0 0;
    /* border: 0 none; */
    color: grey;
    outline: 0;
  }

  select::-webkit-scrollbar {
    width: 10px; /* width of the entire scrollbar */
  }

  select::-webkit-scrollbar-track {
    background: rgb(255, 255, 254); /* color of the tracking area */
  }

  select::-webkit-scrollbar-thumb {
    background-color: rgb(143, 14, 143); /* color of the scroll thumb */
    border-radius: 25px; /* roundness of the scroll thumb */
    border: 3px solid rgb(245, 245, 245); /* creates padding around scroll thumb */
  }

  #list option {
    color: #333;
    padding: 5px;
  }

  .cor-padrao {
    background-image: linear-gradient(220deg, rgb(0, 236, 255), rgb(143, 14, 143));
  }
</style>
