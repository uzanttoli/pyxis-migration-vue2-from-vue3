<template>
  <!-- v-model="dialogAuthorization" -->
  <v-dialog
    :model-value="dialogAuthorization"
    @update:modelValue="val => $emit('update:dialogAuthorization', val)"
    persistent
    width="600"
  >
    <v-card>
      <title-negative-margin title="Baixar Autorização">
        <v-btn icon @click="$emit('closeDialogAuthorization')">
          <!-- <v-icon>mdi-close</v-icon> -->
          <v-icon>fa-solid fa-xmark</v-icon>
        </v-btn>
      </title-negative-margin>
      <v-col>
        <v-text-field
          prepend-inner-icon="mdi-badge-account-alert"
          v-model="matricula"
          v-on:keyup.enter="loadBase()"
          label="Informe uma Matricula"
          :loading="loading"
          messages="Precione 'Enter' para carregar os dados!"
        ></v-text-field>
        <v-card>
          <v-list v-for="(item, i) in base" :key="i">
            <v-tooltip right color="primary">
              <template v-slot:activator="{ attrs, on }">
                <a
                  :href="item.LINK_DOWNLOAD"
                  v-bind="attrs"
                  v-on="on"
                  style="text-decoration: none"
                >
                  <v-list-item-content>
                    <v-row>
                      <v-col>
                        <v-list-item-title class="text-h7 mb-1 ml-2">
                          <v-icon color="blue">mdi-email</v-icon>
                          RH: {{ item.RH }}
                        </v-list-item-title>
                        <v-list-item-subtitle class="ml-2">
                          {{ item.NOME_ARQUIVO_COMPLETO }}
                        </v-list-item-subtitle>
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </a>
              </template>
              <span>
                Baixar autorização:
                <br />
                {{ item.NOME_ARQUIVO_COMPLETO }}
              </span>
            </v-tooltip>
            <v-divider></v-divider>
          </v-list>
        </v-card>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
  import config from '../../../../../core/config'
  export default {
    props: {
      dialogAuthorization: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      loading: false,
      base: [],
      matricula: null
    }),
    computed: {},
    methods: {
      loadBase() {
        this.loading = true
        let urlData = `${config.baseUrl}api/shared/formularios/tabulador_erro_pagamento/listar_download_deacordo/${this.matricula}`
        this.$api.get(urlData).then(res => {
          this.base = res.data
          this.loading = false
        })
      }
    },
    watch: {
      matricula() {
        if (this.matricula === '') {
          this.loadBase()
        }
      }
    }
  }
</script>

<style></style>
