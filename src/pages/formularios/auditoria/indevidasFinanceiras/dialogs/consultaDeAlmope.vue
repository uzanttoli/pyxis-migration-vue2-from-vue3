<template>
  <div class="text-center">
    <v-dialog v-model="dialogConsultaDeAlmopes" width="500" persistent>
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Consulta de Almope
          <v-spacer></v-spacer>
          <v-btn icon @click="$emit('closeDialogConsultaDeAlmopes')">
            <v-icon color="red">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Informe um Login"
                v-model="almopeConsulta"
                clearable
                @change="loadConsultaDeAlmope()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                disabled
                label="Almope"
                clearable
                :value="consultaDeAlmope.ALMOPE"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: 'ConsultaDeAlmopes',
    props: {
      dialogConsultaDeAlmopes: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      almopeConsulta: null
    }),
    computed: {
      consultaDeAlmope() {
        let consultaDeAlmope = this.$store.getters.consultaDeAlmope[0]
        return consultaDeAlmope ? consultaDeAlmope : []
      }
    },
    methods: {
      loadConsultaDeAlmope() {
        this.$store.dispatch('loadConsultaDeAlmope', this.almopeConsulta)
      }
    }
  }
</script>

<style></style>
