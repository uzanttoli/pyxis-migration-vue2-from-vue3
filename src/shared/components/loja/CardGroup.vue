<template>
  <v-item-group mandatory class="mt-n4">
    <v-container>
      <v-row justify="center" class="space">
        <v-col cols="12" md="2" v-for="(card, i) in cardGerencialEstoque" :key="i">
          <v-item v-slot="{ active, toggle }">
            <v-card
              :color="active && (card.CLICK_ON == 1 ? true : false) ? 'primary' : 'white'"
              class="d-flex align-center rounded-xl"
              dark
              height="200"
              @click="toggle"
              :disabled="card.CLICK_ON == 1 ? false : true"
              :to="{
                name: 'ControleDeEntregas',
                params: { id: card.ROTA ? card.ROTA : new Date().getDate() }
              }"
            >
              <v-row>
                <v-col cols="12" sm="12">
                  <v-list-item three-line class="mt-10">
                    <v-list-item-content>
                      <div class="mb-4">
                        <v-icon
                          x-large
                          :color="
                            active && (card.CLICK_ON == 1 ? true : false) ? 'white' : 'primary'
                          "
                        >
                          {{ card.MDI_ICON }}
                        </v-icon>
                      </div>
                      <v-list-item-subtitle
                        :class="
                          active && (card.CLICK_ON == 1 ? true : false)
                            ? 'white--text'
                            : 'black--text'
                        "
                        class="text-capitalize"
                      >
                        {{ card.COLUNA }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle
                        :class="
                          active && (card.CLICK_ON == 1 ? true : false)
                            ? 'white--text'
                            : 'black--text'
                        "
                        class="text-caption grey--text"
                      >
                        {{ card.DESCRICAO }}
                      </v-list-item-subtitle>
                      <v-list-item-title
                        class="headline mb-1"
                        :class="
                          active && (card.CLICK_ON == 1 ? true : false)
                            ? 'white--text'
                            : 'black--text'
                        "
                      >
                        <strong>{{ card.VALOR }}</strong>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
              </v-row>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>
</template>

<script>
  export default {
    data: () => ({
      active: false,
      click: false
    }),
    computed: {
      cardGerencialEstoque() {
        let cardGerencialEstoque = this.$store.getters.cardGerencialEstoque
        // let newArray = [];
        // for (let i = 0; i < cardGerencialEstoque.length; i++) {
        //   newArray.push({
        //     MDI_ICON: cardGerencialEstoque[i].MDI_ICON,
        //     COLUNA: cardGerencialEstoque[i].COLUNA.replaceAll("_", " "),
        //     VALOR: cardGerencialEstoque[i].VALOR,
        //     CLICK_ON: cardGerencialEstoque[i].CLICK_ON,
        //   });
        // }
        return cardGerencialEstoque ? cardGerencialEstoque : []
      }
    },
    methods: {
      loadCardGerencialEstoque() {
        this.$store.dispatch('loadCardGerencialEstoque')
      }
    },
    created() {
      this.loadCardGerencialEstoque()
    }
  }
</script>

<style></style>
