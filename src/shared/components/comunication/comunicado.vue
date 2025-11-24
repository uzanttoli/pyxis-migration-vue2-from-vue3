<template>
  <div class="text-center">
    <v-dialog v-model="_dialog" :max-width="maxWidth">
      <v-card height="100vh" class="overflow-hidden">
        <v-card-title class="text-h5 grey lighten-2">
          {{ title }}
        </v-card-title>
        <v-col>
          <template>
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
                height: calc(120vh - 64px);
              "
            >
              <span id="mouse" style="width: 100%; height: 100%">
                <a :href="href" target="_blank" style="width: 100%; height: 100%">
                  <v-img
                    :src="srcImg"
                    @click="$emit('clicked')"
                    style="max-height: 100%; max-width: 100%; object-fit: contain"
                    :style="styleComponentImg"
                  ></v-img>
                  <v-img
                    :src="srcImg2"
                    @click="$emit('clicked')"
                    style="max-height: 100%; max-width: 100%; object-fit: contain"
                  ></v-img>
                </a>
              </span>
            </div>
          </template>
        </v-col>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  export default {
    name: 'comunicado-operador',
    components: {},
    props: {
      dialog: {
        type: Boolean,
        default: true
      },
      srcImg: {
        type: String,
        require: true
      },
      arrayImgs: {
        type: Array,
        require: true
      },
      srcImg2: {
        type: String,
        require: true
      },
      styleImg: {
        type: String,
        default: ''
      },
      styleComponentImg: {
        type: String,
        default: ''
      },
      maxWidth: {
        type: [String, Number],
        default: '500px'
      },
      title: {
        type: String,
        default: 'Title'
      },
      imgLength: {
        type: Number,
        default: 1
      },
      href: {
        type: String,
        default: ''
      }
    },
    data: () => ({}),
    methods: {
      _dialog() {
        this.dialog = false
      }
    }
  }
</script>
<style scoped>
  #mouse {
    cursor: pointer;
  }
</style>
