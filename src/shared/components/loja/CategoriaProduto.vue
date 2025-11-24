<template>
  <v-item-group mandatory class="mt-n1">
    <v-container>
      <v-row justify="center" class="space">
        <v-col
          cols="12"
          xs="12"
          sm="4"
          md="2"
          v-for="(cetegory, i) in categories"
          :key="i"
          @click="passarCategoria(cetegory.ID_CATEGORIAS)"
        >
          <v-item v-slot="{ active, toggle }">
            <v-card
              :color="active ? '#D5F0DB' : 'white'"
              :class="active ? 'borderme' : 'borderout'"
              class="d-flex align-center rounded-lg mx-2"
              dark
              height="150"
              @click="toggle"
              flat
            >
              <v-row>
                <v-col cols="12" sm="12">
                  <v-list-item three-line class="text-center">
                    <v-list-item-content>
                      <div align="center" justify="center">
                        <v-img
                          :src="link(cetegory.NOME_ARQUIVO_IMAGEM)"
                          max-height="60"
                          max-width="60"
                          contain
                        ></v-img>
                      </div>
                      <v-list-item-subtitle
                        :class="active ? 'green--text' : 'black--text'"
                        class="caption mt-4"
                      >
                        {{ cetegory.NOME_CATEGORIAS }}
                      </v-list-item-subtitle>
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
    props: {
      categories: {
        type: [Array],
        require: true
      }
    },
    data: () => ({
      // categories: [
      //   { img: "01", title: "Meat & Fish" },
      //   { img: "02", title: "Vegetables" },
      //   { img: "3", title: "Medicine" },
      //   { img: "4", title: "Baby" },
      //   { img: "5", title: "Office" },
      //   { img: "6", title: "Beauty" },
      // ],
    }),

    methods: {
      link(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/imagem_categories/${img}`
      },
      prepareImg(value) {
        let img = require.context('./', false, /\png$/)
        return img('./' + value + '.png')
      },
      passarCategoria(value) {
        this.$emit('updated:categories', value)
      }
    }
  }
</script>

<style></style>
