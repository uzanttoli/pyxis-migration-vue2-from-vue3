<template>
  <v-col cols="12" class="mt-n3">
    <v-row>
      <v-col cols="12" sm="3" v-for="i in 15" :key="i">
        <v-hover v-slot:default="{ hover }">
          <v-card height="300" align="center" flat outlined tile>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="black" small dark>{{ 'clothe.sold' }}</v-btn>
            </v-card-actions>
            <v-img :src="prepareImg('BOTONS BOLA')" width="200" height="200" contain></v-img>
            <v-card-text class="mt-n4">
              <strong :class="hover ? 'red--text' : 'black--text'">{{ 'clothe.title' }}</strong>
            </v-card-text>
            <v-expand-transition>
              <div
                v-if="hover"
                class="d-flex transition-fast-in-fast-out blue v-card--reveal display-3 white--text"
                style="height: 100%"
              >
                <v-btn rounded color="white">
                  <v-icon>mdi-cart-outlined</v-icon>
                  Comprar
                </v-btn>

                <v-btn fab small color="white" class="ml-2">
                  <v-icon color="black">mdi-heart-outline</v-icon>
                </v-btn>
              </div>
            </v-expand-transition>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
  export default {
    methods: {
      prepareImg(value) {
        let img = require.context('./', false, /\.png$/)
        return img('./' + value + '.png')
      }
    }
  }
</script>

<style scoped>
  .container {
    padding: 0px !important;
  }
  .v-btn.withoutupercase {
    text-decoration: none;
  }
  .v-chip.v-size--default {
    border-radius: 50px !important;
    font-size: 14px !important;
    height: 40px !important;
    width: 40px !important;
  }
  .v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: 0.5;
    position: absolute;
    width: 100%;
  }
  .card1 {
    z-index: 10;
  }
  .card2 {
    z-index: 1;
  }
</style>
