<template>
  <div class="text-center" v-if="isValid">
    <v-dialog v-model="_dialog" width="50%">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">Comunicado Importante</v-card-title>
        <v-col>
          <template>
            <v-card-text>
              <span id="mouse">
                <!-- @click="dialogTableErrorSystem = !dialogTableErrorSystem" -->
                <a href="/pyxis/gamification/spot_player">
                  <v-img width="100%" src="../../../assets/img/operator/lider 2 semana.jpg"></v-img>
                </a>
              </span>
            </v-card-text>
          </template>
          <!-- <template>
            <v-card-text>
              <span id="mouse">
                <v-img src="../../../assets/img/operator/mega.png"></v-img>
              </span>
            </v-card-text>
          </template> -->
        </v-col>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  // import tableErrorSystem from "../../formularios/tabuladores/erroSistemico/erroSistemico.vue";
  export default {
    name: 'alert-operador',
    components: {
      // tableErrorSystem,
    },
    props: {
      dialog: {
        type: Boolean,
        default: true
      },
      isValid: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      dialogTableErrorSystem: false
    }),
    methods: {
      _dialog() {
        this.dialog = false
      }
    }
    // watch: {
    //   dialogTableErrorSystem() {
    //     let d = this._dialog();
    //     if (d == true) {
    //       return (d = false);
    //     }
    //   },
    // },
  }
</script>
<style scoped>
  #mouse {
    cursor: pointer;
  }
</style>
