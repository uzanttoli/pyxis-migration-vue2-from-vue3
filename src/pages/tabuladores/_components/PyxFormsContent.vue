<template>
  <div>
    <card-multi-actions
      :title="item.TITULO"
      :objetivo="item.DESCRICAO"
      :status="isActive(item) ? 1 : 0"
    >
      <template v-slot:button>
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              icon
              small
              v-bind="attrs"
              v-on="on"
              :to="{
                name: 'View Tabuladores',
                query: {
                  id: item.ID,
                  dynamic: 1
                }
              }"
            >
              <v-icon size="16">fa-solid fa-square-up-right</v-icon>
            </v-btn>
          </template>
          <span>Abrir</span>
        </v-tooltip>
        <template v-if="hasPermission">
          <v-tooltip bottom>
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                :disabled="!isActive(item)"
                icon
                small
                v-bind="attrs"
                v-on="on"
                :to="{
                  name: 'Pyxis Forms',
                  query: {
                    id: item.ID,
                    dynamic: 1,
                    isEdit: true
                  }
                }"
                color="orange darken-1"
              >
                <v-icon size="16">fa-solid fa-pen-to-square</v-icon>
              </v-btn>
            </template>
            <span>Editar formulário</span>
          </v-tooltip>

          <v-menu absolute offset-y :close-on-content-click="false">
            <template v-slot:activator="{ attrs, on }">
              <v-btn icon small v-bind="attrs" v-on="on">
                <v-icon size="16">fa-solid fa-download</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item>
                <v-list-item-title>
                  <h5 class="mb-2">Selecione um periodo:</h5>
                  <DatePickerRange
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                    persistent
                    v-model:dates="dates"
                    v-model:showDatePicker="showDatePicker"
                  >
                    <template v-slot:action>
                      <v-btn
                        block
                        color="success"
                        class="mt-n7"
                        @click="loadBase(item.ID)"
                        :loading="loadingBase"
                      >
                        Carregar dados
                      </v-btn>
                    </template>
                  </DatePickerRange>

                  <download-excel
                    :data="baseDownload"
                    :name="`TABULADOR_${moment().format(
                      'DDMMYYYY'
                    )}_${item.TITULO.toUpperCase()}_PYXIS`"
                    :worksheet="item.TITULO"
                  >
                    <v-btn block color="success" :disabled="baseDownload == ''">Baixar Dados</v-btn>
                  </download-excel>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-tooltip bottom>
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                :disabled="!isActive(item)"
                icon
                small
                v-bind="attrs"
                v-on="on"
                color="error"
                @click="dialogDeleteForm(item.ID)"
              >
                <v-icon size="16">fa-solid fa-trash</v-icon>
              </v-btn>
            </template>
            <span>Inativar formulário</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                icon
                small
                v-bind="attrs"
                v-on="on"
                color="green"
                :disabled="isActive(item)"
                @click="dialogRestoreForm(item.ID)"
              >
                <v-icon size="16">fa-solid fa-rotate</v-icon>
              </v-btn>
            </template>
            <span>Restaurar formulário</span>
          </v-tooltip>
          <v-spacer />
          <v-tooltip bottom>
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                small
                rounded
                v-bind="attrs"
                v-on="on"
                :disabled="!isActive(item)"
                @click="$emit('publish', item.ID)"
              >
                {{ item.PUBLISHED ? 'Remover do ar' : 'Publicar' }}
                <v-icon size="16" :color="item.PUBLISHED ? 'red' : 'green'" class="pl-2">
                  fa-solid fa-power-off
                </v-icon>
              </v-btn>
            </template>
            <span>
              Publicar permite ao colaborador preencher o formulário,
              <br />
              você pode criar livremente sem publicar, quando estiver
              <br />
              com tudo pronto você pode publicar e tornar acessível
            </span>
          </v-tooltip>
        </template>
      </template>
    </card-multi-actions>

    <ConfirmModal
      :dialog="confirmDeleteModal"
      :title="`CONFIRMAR AÇÃO?`"
      :text="`DESATIVAR este formulário`"
      confirmModal
      @update:dialog="confirmDeleteModal = false"
      @action="deleteForm"
    />
    <ConfirmModal
      :dialog="confirmRestoreModal"
      :title="`CONFIRMAR AÇÃO?`"
      :text="`RESTAURAR este formulário`"
      confirmModal
      @update:dialog="confirmRestoreModal = false"
      @action="restoreForm"
    />
  </div>
</template>
<script>
  import cardMultiActions from '../../../shared/components/cards/cardMultiActions.vue'
  import ConfirmModal from '../../../shared/components/ConfirmModal/ConfirmModal.vue'
  import {
    FormGeneratorSchemaService,
    FormGeneratorBaseService
  } from '../../../data/services/formGenerator'
  import DatePickerRange from '@/shared/components/DatePicker/DatePickerRange.vue'
  import alerts from '@/mixins/alerts.mixins'
  export default {
    name: 'PyxFormsContent',
    components: { cardMultiActions, ConfirmModal, DatePickerRange },
    data() {
      return {
        confirmDeleteModal: false,
        confirmRestoreModal: false,
        currentFormId: null,
        dates: [],
        baseDownload: [],
        showDatePicker: false,
        loadingBase: false
      }
    },
    props: {
      item: {
        type: Object,
        required: true
      },
      hasPermission: {
        type: Boolean,
        default: false
      }
    },
    mixins: [alerts],
    computed: {
      user() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      isActive(item) {
        return item.DELETED_AT ? false : true
      },
      dialogDeleteForm(id) {
        this.currentFormId = id
        this.confirmDeleteModal = true
      },
      dialogRestoreForm(id) {
        this.currentFormId = id
        this.confirmRestoreModal = true
      },
      async deleteForm() {
        this.confirmDeleteModal = false
        await FormGeneratorSchemaService.delete(this.currentFormId, this.user.almope)
        this.currentFormId = null
        this.refreshData()
      },
      async restoreForm() {
        this.confirmRestoreModal = false
        await FormGeneratorSchemaService.restore(this.currentFormId)
        this.currentFormId = null
        this.refreshData()
      },
      async loadBase(id) {
        try {
          this.loadingBase = true
          const result = await FormGeneratorBaseService.downloadBase(
            id,
            this.dates[0],
            this.dates[1],
            null
          )

          if (result == '') {
            this.toast(
              'Nenhum dado encontrado para o periodo selecionado',
              'top-right',
              false,
              2500,
              'info'
            )
          }

          this.baseDownload = result
          this.loadingBase = false
          this.showDatePicker = false
        } catch (e) {
          console.error(e)
        }
      },
      refreshData() {
        this.$emit('refreshData')
      }
    }
  }
</script>
