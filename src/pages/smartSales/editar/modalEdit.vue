<template>
  <!-- v-model="openEdit" -->
  <v-dialog
    persistent
    :model-value="openEdit"
    @update:modelValue="val => $emit('update:openEdit', val)"
  >
    <v-card>
      <v-card-title class="pa-4" style="display: flex; justify-content: space-between">
        Editar informações do ID: {{ dataFields.ID }}
        <v-btn icon @click="$emit('updated:close')">
          <v-icon>fas fa-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-col class="mt-5">
        <form ref="form">
          <v-row>
            <v-col cols="2" class="py-0" v-for="(item, i) in handleItemsFields" :key="i">
              <v-text-field
                :label="handleLabel(item.text)"
                :placeholder="handleLabel(item.text)"
                rounded
                outlined
                dense
                filled
                v-model="dataFields[item.text]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-col>
            <v-row justify="end">
              <v-btn
                @click="$emit('updated:close')"
                color="error"
                class="mr-2 rounded-r-xl rounded-bl-xl"
              >
                Descartar
              </v-btn>
              <v-btn @click="updateDataEdit" color="success" class="rounded-r-xl rounded-bl-xl">
                Salvar
              </v-btn>
            </v-row>
          </v-col>
        </form>
      </v-col>
      <loadhastag
        :activeMsg="true"
        msg="Atualizando... por favor aguarde!"
        :envioDados="loading"
      ></loadhastag>
    </v-card>
  </v-dialog>
</template>

<script>
  import config from '../../../core/config'
  import alerts from '../../../mixins/alerts.mixins'
  import Loadhastag from '../../../shared/components/load/loadHastag.vue'

  import registrarMudancaSmartsales from './registrarMudancaSmartsales'
  export default {
    props: {
      openEdit: {
        type: Boolean,
        default: false
      },
      itemsFields: {
        type: [Object, Array]
      },
      dataFields: {
        type: [Object, Array]
      }
    },
    components: { Loadhastag },
    mixins: [alerts],
    data: () => ({
      loading: false
    }),
    computed: {
      handleItemsFields() {
        let novosItems = this.itemsFields?.filter(item => {
          return (
            item.text != 'ID' &&
            item.text != 'DATA_ATUALIZACAO' &&
            item.text != 'ACOES' &&
            item.text != 'ALMOPE_ATUALIZACAO'
          )
        })
        return novosItems
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      ipMaquina() {
        return localStorage.getItem('ip')
      }
    },
    methods: {
      async updateDataEdit() {
        try {
          this.loading = true
          let urlData = `${config.baseUrl}api/shared/smartsales/configuracao/atualizar_dados_smartsales/`
          await this.$api.post(urlData, this.dataFields)
          registrarMudancaSmartsales('ALTERACAO_PONTUAL', this.ipMaquina, this.usuarioAlmope)
          this.loading = false
          this.toast('Dados atualizados com sucesso!', 'bottom-right', false, 2000, 'success')
          this.$emit('update:atualizar-dados')
        } catch (e) {
          this.loading = false
          this.toast(
            'Não foi possivel concluir está solicitação.',
            'bottom-right',
            false,
            2000,
            'error'
          )
        }
      },
      handleLabel(text) {
        let split = text.split('_').join(' ')
        return split
      }
    }
  }
</script>

<style></style>
