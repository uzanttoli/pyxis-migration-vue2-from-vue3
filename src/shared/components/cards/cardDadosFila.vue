<template>
  <v-card class="mx-auto rounded-xl" elevation="0" outlined>
    <v-list-item>
      <v-list-item-content>
        <div class="mb-1">
          <strong>{{ title }}</strong>
          <br />
          <small class="pa-0 ma-0">{{ subTitle }}</small>
        </div>

        <v-list-item-title class="headline mb-1">
          Fila: {{ fila }}
          <v-icon v-if="fila > 0" size="17" color="red darken-2">
            fa-solid fa-circle-exclamation
          </v-icon>
        </v-list-item-title>
        <v-list-item-subtitle>Disponíveis: {{ disponiveis }}</v-list-item-subtitle>
        <v-list-item-subtitle>Falando: {{ falando }}</v-list-item-subtitle>
        <!-- <v-list-item-subtitle
              >Pausa: {{ pausa }}
              <i
                >({{ convertToDecimalBR(percentPausa) }})</i
              ></v-list-item-subtitle
            > -->
      </v-list-item-content>

      <v-list-item-icon>
        <v-icon color="iconPrimary">{{ icon }}</v-icon>
      </v-list-item-icon>
    </v-list-item>
  </v-card>
</template>
<script>
  export default {
    props: {
      title: {
        type: String,
        default: 'Titulo'
      },
      subTitle: {
        type: String,
        default: 'SubTitulo'
      },
      fila: {
        type: Number,
        default: 0
      },
      disponiveis: {
        type: Number,
        default: 0
      },
      falando: {
        type: Number,
        default: 0
      },
      pausa: {
        type: Number,
        default: 0
      },
      percentPausa: {
        type: String,
        default: '0%'
      },
      icon: {
        type: String,
        default: 'mdi-view-dashboard-variant'
      },
      apiUrl: {
        type: String,
        required: true
      }
    },
    data: () => ({
      dados: []
    }),
    methods: {
      convertToDecimalBR(valor) {
        return (valor / 100).toLocaleString(undefined, {
          style: 'percent',
          minimumFractionDigits: 2
        })
      }
    },
    created() {}
  }
</script>
