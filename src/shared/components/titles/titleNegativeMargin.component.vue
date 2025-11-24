<template>
  <v-card-title class="ml-1 pl-1">
    <v-card
      :min-width="minWidth"
      :max-width="maxWidth"
      :class="className"
      class="pa-1 ml-n3 white--text text-capitalize text-no-wrap cor-padrao text-center"
    >
      <v-icon color="white" class="mr-2 ml-n2" :size="sizeIcon">{{ icon }}</v-icon>
      {{ title }}
      <span id="button">
        <slot name="button"></slot>
      </span>

      <template v-if="progressVisible == true">
        <v-progress-circular
          style="position: absolute; right: 15px; top: 12px"
          :size="sizeProgress"
          :value="countIntervalProgress"
          :color="corProgress"
        ></v-progress-circular>
      </template>
      <template v-if="downloadExcel === true">
        <v-col class="ma-0 pa-0">
          <download-excel :data="base" :name="namePlan" :worksheet="worksheet">
            <v-btn class="rounded-bl-xl rounded-br-xl" tile depressed small block>
              <v-icon small class="mr-2">fa-solid fa-file-excel</v-icon>
              Baixar Dados
            </v-btn>
          </download-excel>
        </v-col>
      </template>
    </v-card>
    <v-spacer></v-spacer>
    <slot></slot>
  </v-card-title>
</template>
<script>
  export default {
    props: {
      sizeProgress: {
        type: Number,
        default: 25
      },
      sizeIcon: {
        type: Number,
        default: 22
      },
      progressVisible: {
        type: [String, Boolean],
        default: 'false'
      },
      corProgress: {
        type: String,
        default: 'deep-orange lighten-2'
      },
      countIntervalProgress: {
        type: Number,
        default: 0
      },
      title: {
        type: String,
        default: 'Título'
      },
      icon: {
        type: String,
        default: ''
      },
      minWidth: {
        type: Number,
        default: 300
      },
      maxWidth: {
        type: Number,
        default: 350
      },
      namePlan: {
        type: String
      },
      worksheet: {
        type: String
      },
      base: {
        type: Array,
        require: true
      },
      downloadExcel: {
        type: Boolean,
        default: false
      },
      className: {
        type: String,
        default: 'rounded-bl-xl rounded-r-xl'
      }
    }
  }
</script>
<style scoped>
  #button {
    right: 1px;
    position: absolute;
  }

  .cor-padrao {
    background-image: linear-gradient(220deg, rgb(0, 236, 255), rgb(143, 14, 143));
  }
</style>
