<template>
  <v-card
    :disabled="disabled"
    class="rounded-lg ma-3"
    elevation="3"
    outlined
    height="290"
    min-height="160"
    width="220"
  >
    <v-list-item>
      <v-list-item-content>
        <div class="mb-1">
          <v-chip small :color="tipoGrupo == 'Tabuladores' ? 'green' : 'orange'" text-color="white">
            <strong># {{ tipoGrupo }}</strong>
          </v-chip>
          <v-chip v-if="disabled == true" class="ml-1" small color="red" text-color="white">
            <strong>Disabled</strong>
          </v-chip>
          <br />
        </div>
        <v-list-item-avatar tile size="100">
          <v-img :src="getImgUrl(imgCard)"></v-img>
        </v-list-item-avatar>
        <v-list-item-title class="subtitle-1 mb-1 font-weight-medium text-center text-wrap">
          {{ title }}
          <v-icon></v-icon>
        </v-list-item-title>
        <v-list-item-subtitle class="text-wrap justify-center text-center">
          {{ description }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-card-actions class="pt-0 mt-1">
      <v-btn
        block
        style="position: absolute; left: 0px; bottom: 5px"
        text
        color="teal accent-4"
        @click="$emit('dialogForm')"
      >
        Abrir
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    props: {
      imgCard: {
        type: [String],
        default: 'semImagem'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      btnModal: {
        type: [String, Array],
        default: ''
      },
      tipoGrupo: {
        type: String,
        default: 'Titulo'
      },
      title: {
        type: String,
        default: 'Titulo'
      },
      description: {
        type: String,
        default: 'SubTitulo'
      }
    },
    methods: {
      getImgUrl(imgSelecionada) {
        var img = require.context('../../../assets/img/imgCards/utilitarios/', false, /\.png$/)
        return img('./' + imgSelecionada + '.png')
      }
    }
  }
</script>

<style></style>
