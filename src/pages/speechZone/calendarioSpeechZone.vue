<template>
  <v-card class="calendario rounded-xl" style="width: 450px" elevation="1">
    <v-date-picker
      locale="pt"
      v-model="dates"
      range
      width="100%"
      color="rgba(9,9,121,1)"
      :events="functionEvents"
      :max="maxDate"
    ></v-date-picker>
  </v-card>
</template>

<script>
  export default {
    props: {
      diasInteracoes: {
        type: [Array, Object]
      },
      estudoSelecianado: {
        type: Boolean,
        default: true
      }
    },
    data: () => ({
      dates: []
    }),
    computed: {
      dateRangeText() {
        return this.dates.join(' ~ ')
      },
      maxDate() {
        let date = new Date()
        let day = date.getDate().toString()
        let dayF = day.length == 1 ? '0' + day : day
        let month = (date.getMonth() + 1).toString()
        let monthF = month.length == 1 ? '0' + month : month
        let year = date.getFullYear().toString()
        return `${year}-${monthF}-${dayF}`
      }
    },
    methods: {
      functionEvents(date) {
        if (this.dates.length == 2) {
          const [, , day] = date.split('-')
          if ([1, 3, 5, 6].includes(parseInt(day, 10))) false
          // if (this.diasInteracoes.includes(parseInt(day, 10))) return ["orange"];
          return false
        }
      }
    },
    mounted() {
      // dados online --- quando app é recarregado
      let date = new Date()
      let day = date.getDate().toString()
      let dayF = day.length == 1 ? '0' + day : day
      let month = (date.getMonth() + 1).toString()
      let monthF = month.length == 1 ? '0' + month : month
      let year = date.getFullYear().toString()
      this.dates.push(`${year}-${monthF}-${dayF}`)
      this.$emit('update-date-default', {
        dataInicio: `${year}-${monthF}-${dayF}`,
        dataFim: `${year}-${monthF}-${dayF}`
      })
    },
    watch: {
      dates() {
        if (this.dates.length == 2) {
          this.$emit('update-date-default', {
            dataInicio: `${this.dates[0] > this.dates[1] ? this.dates[1] : this.dates[0]}`,
            dataFim: `${this.dates[0] > this.dates[1] ? this.dates[0] : this.dates[1]}`
          })
        } else {
          this.$emit('update-date-default', {
            dataInicio: `${this.dates[0]}`,
            dataFim: `${this.dates[0]}`
          })
        }
      }
    }
  }
</script>

<style></style>
