<template>
  <v-card class="mx-auto" elevation="2">
    <v-list-item>
      <v-list-item-content>
        <!-- <div class="mb-1"></div> -->
        <div
          class="mt-3"
          style="
            flex-direction: row;
            display: flex;
            align-items: center;
            text-align: center;
            justify-content: space-around;
          "
        >
          <h4>
            Escalados:
            <small class="grey--text text-h6">{{ escalados }}</small>
          </h4>
          <v-divider vertical class="mx-3"></v-divider>
          <h4>
            Abs:
            <small class="grey--text text-h6">{{ abs }}</small>
          </h4>
          <v-divider vertical class="mx-3"></v-divider>
          <h4>
            (%) Abs:
            <small class="grey--text text-h6">{{ percAbs }}</small>
          </h4>
          <v-divider vertical class="mx-3"></v-divider>
          <h4>
            Inaderencia:
            <small class="grey--text text-h6">{{ inaderencia }}</small>
          </h4>
          <v-divider vertical class="mx-3"></v-divider>
          <h4>
            (%) Inaderencia:
            <small class="grey--text text-h6">{{ percInaderencia }}</small>
          </h4>
          <v-divider vertical class="mx-3"></v-divider>
          <h4>
            Antes:
            <small class="grey--text text-h6">{{ antes }}</small>
          </h4>
          <v-divider vertical class="mx-3"></v-divider>
          <h4>
            (%) Antes:
            <small class="grey--text text-h6">{{ percAntes }}</small>
          </h4>
          <v-divider vertical class="mx-3"></v-divider>
          <h4>
            Depois:
            <small class="grey--text text-h6">{{ depois }}</small>
          </h4>
          <v-divider vertical class="mx-3"></v-divider>
          <h4>
            (%) Depois:
            <small class="grey--text text-h6">{{ percDepois }}</small>
          </h4>
          <v-divider vertical class="mx-3"></v-divider>
          <h4>
            Tempo Inaderencia:
            <small class="grey--text text-h6">{{ tempoInaderencia }}</small>
          </h4>
        </div>
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
        default: 'mdi-account-group'
      },
      escalados: {
        type: [String, Number],
        default: '0'
      },
      abs: {
        type: [String, Number],
        default: '0'
      },
      percAbs: {
        type: [String, Number],
        default: '0,00%'
      },
      inaderencia: {
        type: [String, Number],
        default: '0'
      },
      percInaderencia: {
        type: [String, Number],
        default: '0,00%'
      },
      antes: {
        type: [String, Number],
        default: '0'
      },
      percAntes: {
        type: [String, Number],
        default: '0,00%'
      },
      depois: {
        type: [String, Number],
        default: '0'
      },
      percDepois: {
        type: [String, Number],
        default: '0,00%'
      },
      tempoInaderencia: {
        type: [String, Number],
        default: '00:00:00'
      }
    },
    data: () => ({}),
    methods: {
      convertToDecimalBR(valor) {
        return (valor / 100).toLocaleString(undefined, {
          style: 'percent',
          minimumFractionDigits: 2
        })
      }
    }
  }
</script>
