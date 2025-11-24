<template>
  <div class="text-center">
    <v-dialog v-model="_dialog" width="50%">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">Comunicado Importante</v-card-title>
        <v-col>
          <template>
            <v-card-text>
              <span id="mouse">
                <a href="/pyxis/gamification/spot_player">
                  <v-img src="../../../assets/img/operator/premiacoes.png"></v-img>
                </a>
              </span>
            </v-card-text>
          </template>
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
  export default {
    name: 'alert-operador',
    components: {},
    props: {
      dialog: {
        type: Boolean,
        default: true
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
  }
</script>
<style scoped>
  #mouse {
    cursor: pointer;
  }
</style>
