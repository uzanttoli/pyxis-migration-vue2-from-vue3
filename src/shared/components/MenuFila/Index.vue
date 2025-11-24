<template>
  <v-row justify="start" class="mt-2">
    <v-col cols="12" sm="12" md="4" xl="3" v-for="(item, i) in filaConfig" :key="i.FILA_GRUPO">
      <!--TODO filaConfig: props-->

      <v-menu
        bottom
        transition="scale-transition"
        offset-y
        class="elevation-0 red"
        v-model="activeMenu[item.FILA_GRUPO]"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-card
            class="rounded-xl"
            elevation="1"
            height="150"
            v-bind="attrs"
            v-on="on"
            style="display: flex; align-items: center; justify-content: center; position: relative"
          >
            <div
              v-if="item.ATIVO == 1"
              style="
                position: absolute;
                top: 5px;
                background-color: #d81b60;
                width: 100%;
                display: flex;
                justify-content: center;
                color: white;
                align-items: center;
                height: 28px;
              "
            >
              <p
                style="
                  padding: 0;
                  margin: 0;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
              >
                <i class="fa-solid fa-triangle-exclamation mr-2"></i>
                Fila em manutenção
              </p>
            </div>

            <div style="display: flex; align-items: center; justify-content: center">
              <v-icon size="30" class="mr-2" style="color: rgb(80, 117, 191)">
                {{
                  activeMenu[item.FILA_GRUPO] == true
                    ? 'fa-solid fa-folder-open'
                    : 'fa-solid fa-folder-closed'
                }}
              </v-icon>

              <span class="text-xl-h5 font-weight-bold grey--text text-capitalize">
                {{ item.FILA_GRUPO }}
              </span>
            </div>
          </v-card>
        </template>

        <v-list dense elevation="0">
          <template v-for="(itemFila, i) in item.FILA" :key="i.FILA">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-list-item
                  v-bind="attrs"
                  v-on="on"
                  :key="i.FILA"
                  :to="
                    itemFila.isGMud == 0
                      ? {
                          name: 'Tratativa Por Fila',
                          query: item && {
                            queueOf: item.FILA_GRUPO.split(' ')[0],
                            configId: item.ID_CONFIGURACAO.toLowerCase(),
                            idForm: item.FILA_FORM_ID.toLowerCase()
                          },
                          params: {
                            produto: item.ID_PRODUTO.toLowerCase(),
                            fila: itemFila.idFila.toLowerCase()
                          }
                        }
                      : ''
                  "
                >
                  <!--TODO utilizar para passar o `produto` quando for administrador-->

                  <v-list-item-icon>
                    <v-icon style="color: rgb(80, 117, 191)" v-if="itemFila.isGMud == 0">
                      fa-solid fa-file
                    </v-icon>

                    <v-icon color="error" v-else>fa-solid fa-file-circle-xmark</v-icon>
                  </v-list-item-icon>

                  <v-list-item-title
                    :class="
                      itemFila.isGMud == 1
                        ? 'text-caption text-capitalize grey--text'
                        : 'text-caption text-capitalize'
                    "
                  >
                    {{ itemFila.nome.toLowerCase() }}
                  </v-list-item-title>

                  <span>
                    <v-list-item-subtitle>
                      <span style="font-weight-medium">
                        {{ itemFila.quantidade }}
                        <v-icon v-if="itemFila.isGMud" size="20" color="red">
                          fa-solid fa-triangle-exclamation
                        </v-icon>
                      </span>
                    </v-list-item-subtitle>
                  </span>
                </v-list-item>
              </template>

              <div style="width: 300px">
                <p class="text-caption pa-0 ma-0">
                  {{ itemFila.isGMud ? itemFila.msgGmud : itemFila.nome }}
                </p>
              </div>
            </v-tooltip>

            <!-- <v-divider :key="i"></v-divider> -->
          </template>
        </v-list>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    props: {
      filaConfig: {
        type: Array,
        default: () => []
      },
      produto: {
        type: String
      }
    },
    data: () => ({
      activeMenu: {}
    })
  }
</script>

<style></style>
