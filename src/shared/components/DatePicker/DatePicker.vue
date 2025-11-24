<template>
  <fieldset style="border: 1px solid #939393de; padding: 0 5px; border-radius: 3px; height: 49px">
    <legend style="font-size: 11.5px; height: 20px; line-height: 20px; letter-spacing: normal">
      {{ label }}
    </legend>
    <v-menu
      ref="menu1"
      v-model="menu1"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <div class="d-flex justify-space-between">
          <span
            v-bind="attrs"
            v-on="on"
            class="mx-2"
            :class="
              computedDateFormatted == 'Selecione a segunda data!' ? 'red--text font-italic' : ''
            "
          >
            {{ computedDateFormatted }}
          </span>
          <v-btn v-bind="attrs" v-on="on" icon class="mt-n2">
            <v-icon :class="menu1 ? 'blue--text' : ''">fa-solid fa-calendar-day</v-icon>
          </v-btn>
        </div>
      </template>
      <v-date-picker
        v-model="date"
        @input="updateDate"
        @change="updateChangeDate"
        no-title
        :range="isRange"
        color="blue"
        :max="dateMaxProps ? dateMax : undefined"
        :min="dateMinWhenAddDay"
        locale="pt-br"
      ></v-date-picker>
    </v-menu>
  </fieldset>
</template>
<script>
  export default {
    props: {
      label: {
        type: String,
        default: 'Data atual'
      },
      dateMaxProps: {
        type: Boolean,
        default: true
      },
      dateMinProps: {
        type: Boolean,
        default: false
      },
      addDay: {
        type: Number,
        default: 0
      },
      isRange: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      date: null,
      menu1: false,
      menu2: false
    }),

    computed: {
      computedDateFormatted() {
        return this.formatDate(this.date)
      },
      dateMax() {
        const iso = new Date(Date.now() + this.addDay * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10)
        return iso
      },
      dateMinWhenAddDay() {
        if (!this.dateMinProps) return undefined
        return new Date(Date.now() + 0 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      }
    },
    mounted() {
      // this.date = this.dateMax

      this.$nextTick(() => {
        setTimeout(() => {
          if (!this.date) {
            this.date = this.dateMax
          }
          this.$emit('input', this.date)
        }, 1000)
      })
    },
    methods: {
      updateDate(newDate) {
        this.$emit('input', newDate)
        if (this.isRange) return
        this.menu1 = false
      },
      updateChangeDate(newDate) {
        this.$emit('change', newDate)
        if (this.isRange) return
        this.menu1 = false
      },
      formatDate(date) {
        if (!date) return null

        if (this.isRange) {
          if (Array.isArray(date) && date.length > 1) {
            const [start, end] = date
            if (start && end) {
              const fmt = d => d.split('-').reverse().join('/')
              return `${fmt(start)} até ${fmt(end)}`
            }
          }
          let data = this.dateMax.split('-').reverse().join('/')
          return `${data} até ${data}`
        } else {
          const [year, month, day] = date && date.split('-')
          return `${day}/${month}/${year}`
        }
      }
    },
    created() {
      if (this.isRange) {
        this.date = [this.dateMax, this.dateMax]
      } else {
        this.date = this.dateMax
      }
      // this.$nextTick(() => {
      //   this.$emit('input', this.dateMax)
      // })
    }
  }
</script>
<style scoped></style>
