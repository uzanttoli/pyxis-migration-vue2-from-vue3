<template>
  <div class="transition-swing mt-n5">
    <div style="display: flex; align-items: center; justify-content: space-between">
      <div>
        <p style="padding: 0; margin: 0" class="text-h6 gray--text">
          <i class="fa-solid fa-circle-nodes mr-1 red--text"></i>
          Bem vindo,
          <span style="text-transform: capitalize">{{ nameUser }}!</span>
        </p>

        <span style="font-size: 12px">* Selecione uma fila para iniciar as tratativas</span>
      </div>
    </div>

    <v-divider></v-divider>

    <v-row justify="start" class="mt-2">
      <v-col cols="12" sm="12" md="4" xl="3" v-for="(item, i) in filaConfig" :key="i">
        <v-menu
          bottom
          transition="scale-transition"
          offset-y
          class="elevation-0"
          v-model="activeMenu[item.FILA_GRUPO]"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-card
              class="rounded-xl"
              elevation="1"
              height="150"
              v-bind="attrs"
              v-on="on"
              style="
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
              "
            >
              <div
                v-if="item.ATIVO == 0"
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
                <v-icon x-large class="mr-2" style="color: rgb(80, 117, 191)">
                  {{
                    activeMenu[item.FILA_GRUPO] == true
                      ? 'fa-solid fa-folder-open'
                      : 'fa-solid fa-folder-closed'
                  }}
                </v-icon>

                <span class="text-xl-h5 font-weight-medium grey--text text-capitalize">
                  {{ item.FILA_GRUPO.toLowerCase() }}
                </span>
              </div>
            </v-card>
          </template>

          <v-list dense elevation="0">
            <template v-for="(itemSubmenu, i) in item.SUBMENU" :key="i.SUBMENU">
              <v-list-item
                :to="{
                  name: 'BackofficeOperadorTratativa',
                  params: { id: itemSubmenu.idFila },
                  query: { grupo: item.FILA_GRUPO }
                }"
              >
                <v-list-item-icon>
                  <v-icon style="color: rgb(80, 117, 191)">fa-solid fa-file</v-icon>
                </v-list-item-icon>

                <v-list-item-title class="text-caption text-capitalize">
                  {{ itemSubmenu.nome.toLowerCase() }}
                </v-list-item-title>

                <span>
                  <v-list-item-subtitle>
                    <span style="font-weight-medium">{{ itemSubmenu.quantidade }}</span>
                  </v-list-item-subtitle>
                </span>
              </v-list-item>

              <v-divider></v-divider>
            </template>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import config from '../../../core/config.js'
  import { Tratamento } from '../../../js/Tratamento'
  export default {
    data: () => ({
      lista: [],
      activeMenu: {},
      filaConfig: []
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      nameUser() {
        let nome = new Tratamento(this.$store.getters.usuario.nome)
        return nome.myPrimaryName
      }
    },
    methods: {
      loadFilaConfig() {
        let urlData = `${config.baseUrl}api/shared/backoffice/direcionamento/fila_distribuicao_backoffice`
        this.$api
          .get(urlData, {
            params: {
              produto: this.usuario.produto,
              perfil: this.usuario.filtro
            }
          })
          .then(res => {
            this.filaConfig = res.data
            this.$emit('update:dados-carregados', false)
          })
      }
    },
    created() {
      this.loadFilaConfig()
    }
  }
</script>

<style></style>
