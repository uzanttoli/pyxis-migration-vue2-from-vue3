<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    v-model:return-value="date"
    transition="scale-transition"
    offset-x
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <validation-provider v-slot="{ errors }" rules="required" :name="label">
        <v-text-field
          v-model="computedDateFormatted"
          outlined
          dense
          :class="className"
          :error-messages="errors"
          :placeholder="label"
          :label="label"
          readonly
          required
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </validation-provider>
    </template>
    <v-date-picker v-model="date" no-title scrollable locale="pt-br" :min="dateNow">
      <div style="margin-top: 0px; z-index: 1; width: 100%">
        <v-divider></v-divider>
        <div style="display: flex; flex-direction: column; margin: 10px 0">
          <label for="standard">Horário (Obrigatório)</label>
          <validation-provider v-slot="{ errors }" rules="required" name="horário para contato">
            <div style="display: flex; flex-direction: column">
              <input
                :style="errors.length > 0 ? 'border: 1px solid red;' : 'border: 1px solid #9d9d9d;'"
                type="time"
                class="input-time"
                id="standard"
                required
                v-model="time"
              />
              <span style="font-size: 11px; color: red">{{ errors[0] }}</span>
            </div>
          </validation-provider>
        </div>
        <v-spacer></v-spacer>
        <div style="display: flex; justify-content: end">
          <v-btn text color="error" @click="menu = false">Cancelar</v-btn>
          <v-btn text color="success" @click="$refs.menu.save(date)">OK</v-btn>
        </div>
      </div>
    </v-date-picker>
  </v-menu>
</template>

<script>
  import { ValidationProvider } from 'vee-validate'
  export default {
    props: {
      className: {
        type: String,
        default: ''
      },
      label: {
        type: String,
        default: ''
      }
    },
    components: { ValidationProvider },
    data: () => ({
      date: null,
      menu: false,
      time: null
    }),
    computed: {
      computedDateFormatted() {
        return this.formatDate(this.date)
      },
      dateNow() {
        this.moment.locale('pt-br')
        return this.moment().format('YYYY-MM-DD hh:mm:ss')
      }
    },
    methods: {
      formatDate(date) {
        if (!date) return null
        let dateMinutes = new Date()
        let hours = dateMinutes.getHours().toString()
        let hoursF = hours.length == 1 ? '0' + hours : hours

        let minutes = dateMinutes.getMinutes().toString()
        let minutesF = minutes.length == 1 ? '0' + minutes : minutes

        let timeF = `${hoursF}:${minutesF}`

        const [year, month, day] = date.split('-')
        let dateFormat = `${day}/${month}/${year} ${this.time ? this.time : timeF}`
        this.$emit('update:date', dateFormat)
        return dateFormat
      }
    }
  }
</script>

<style scoped>
  label {
    display: block;
    font-size: 0.8em;
    font-weight: bold;
  }

  .input-time {
    padding: 8px;
    border: 1px solid #9d9d9d;
    border-radius: 4px;
  }

  .input-time {
    font-size: 17px;
    color: #616161;
    cursor: pointer;
    line-height: normal;
  }

  .input-time:focus {
    outline: none;
  }
</style>
