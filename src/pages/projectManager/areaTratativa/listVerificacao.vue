<template>
  <div class="lista-verificacao">
    <v-expansion-panels flat multiple>
      <v-expansion-panel class="no-box-shadow rounded-t-lg" style="background-color: #f0f0f0">
        <v-expansion-panel-header class="font-weight-bold" style="color: #333">
          <div style="display: flex; align-items: center">
            <span v-if="!isTextFieldTitle">
              #{{ index + 1 }} - {{ textCapitalize(listArrayData.TITULO_LIST) }}
            </span>
            <v-col v-else class="ma-0 pa-0" cols="4">
              <v-text-field
                :placeholder="title"
                dense
                v-model="title"
                @change="changeTitle()"
                success-messages="Pressione 'Enter' para salvar as alterações!"
              >
                <template v-slot:append>
                  <v-btn icon small @click="cancelAlterText">
                    <v-icon small>fa-solid fa-xmark</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="2" class="ml-2">
              <div style="display: flex; align-items: center; gap: 10px">
                <v-progress-linear
                  :value="valueProgress"
                  color="blue lighten-1"
                  rounded
                  height="6"
                ></v-progress-linear>
              </div>
            </v-col>
            <span class="grey--text" style="font-size: 13px">
              concluído: {{ countCheck }}/{{ listArrayData.ITEMS_LIST.length }}
            </span>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="list-tasks">
            <v-col v-for="(item, i) in listArrayData.ITEMS_LIST" :key="i" class="pa-0">
              <div style="display: flex; align-items: center; justify-content: space-between">
                <div style="display: flex; align-items: center">
                  <v-checkbox
                    class="mt-n3 mb-n2 rounded-xl"
                    v-model="item.CHECK_ITEM"
                    @change="checkItemList(item)"
                    color="blue lighten-1"
                    :value="1"
                    hide-details
                  ></v-checkbox>
                  <label for="concluir-tarefa" :class="{ 'label-checked': item.CHECK_ITEM }">
                    {{ item.TEXTO_ITEM }}
                  </label>
                </div>
                <v-btn icon small @click="removeTaks(item)" :disabled="item.CHECK_ITEM == 1">
                  <v-icon small color="red lighten-1">fa-solid fa-trash</v-icon>
                </v-btn>
              </div>
              <v-divider class="ma-4"></v-divider>
            </v-col>
          </div>
          <div class="add-task">
            <v-text-field
              v-if="isTextField"
              placeholder="Texto do item"
              label="Texto do item"
              outlined
              dense
              v-model="textItem"
              @keydown.enter="addTaks(listArrayData)"
            ></v-text-field>
          </div>
          <div class="action-list">
            <div>
              <a class="tasks-checklist-item-add-btn mr-4" @click="addItem">+ Adicionar item</a>
              <a class="tasks-checklist-item-add-btn" @click="mudarTitle">Mudar titulo</a>
            </div>
            <div>
              <a
                class="tasks-checklist-item-add-btn"
                @click="removeListVerification(listArrayData)"
              >
                Excluir lista de verificação
              </a>
            </div>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
  import config from '../../../core/config'
  import alerts from '../../../mixins/alerts.mixins'
  export default {
    props: {
      index: {
        type: Number
      },
      data: {
        type: [Array, Object]
      }
    },
    data: () => ({
      listTasks: [],
      listArrayData: [],
      isTextField: false,
      textItem: null,
      title: 'Lista de verificação',
      isTextFieldTitle: false
    }),
    mixins: [alerts],
    computed: {
      countCheck() {
        let count = this.listArrayData.ITEMS_LIST.filter(item => {
          return item.CHECK_ITEM == 1
        })

        return count.length
      },
      valueProgress() {
        if (this.countCheck == 0) return 0

        return (100 / this.listArrayData.ITEMS_LIST.length) * this.countCheck
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      token() {
        return this.generateHashName()
      },
      list() {
        return this.listArrayData
      }
    },
    methods: {
      async removeTaks(item) {
        try {
          await this.swalConfirmation(async () => {
            let urlData = `${config.baseUrl}api/shared/project_manager/gestao/delete_task/${item.NUM_SOLICITACAO}/${item.ID_LISTA}/${item.ID_ITEM}`
            await this.$api.delete(urlData).then(() => {
              this.$emit('delete-task', item)
            })
          })
        } catch (e) {
          console.error(e)
        }
      },
      async removeListVerification(array) {
        try {
          await this.swalConfirmation(async () => {
            let urlData = `${config.baseUrl}api/shared/project_manager/gestao/delete_list/${array.ID_LIST}`
            await this.$api.delete(urlData).then(() => {
              this.$emit('update:reload')
            })
          })
        } catch (e) {
          console.error(e)
        }
      },
      async checkItemList(item) {
        let urlData = `${config.baseUrl}api/shared/project_manager/gestao/check_task_list/`
        await this.$api.post(urlData, item)
      },
      textCapitalize(string) {
        if (!string) return

        let letters = string.split(' ')
        return letters
          .map(item => {
            if (item[0] != undefined) {
              let text = item[0] + item.toLowerCase().slice(1, string.length)
              return text
            }
          })
          .join(' ')
      },
      generateHashName() {
        const date = new Date()
        return date.getTime().toString()
      },
      cancelAlterText() {
        this.isTextFieldTitle = false
        this.title = 'Lista de verificação'
      },
      mudarTitle() {
        this.isTextFieldTitle = true
      },
      async changeTitle() {
        const data = {
          TITULO_LISTA: this.title.toUpperCase(),
          ID_LISTA: this.listArrayData.ID_LIST
        }

        let urlData = `${config.baseUrl}api/shared/project_manager/gestao/alter_title_list_verificacao`
        await this.$api.post(urlData, data)
        this.listArrayData.TITULO_LIST = this.title.toUpperCase()
        this.toast('Titulo alterado com sucesso!', 'bottom-right', false, 2000, 'success')
      },
      async addTaks(list) {
        if (!this.textItem) return
        const { ID_LIST } = list
        let data = {
          NUM_SOLICITACAO: this.$route.params.id,
          ID_LISTA: ID_LIST,
          CHECK_ITEM: 0,
          TEXTO_ITEM: this.textItem,
          ID_ITEM: this.listArrayData.ITEMS_LIST.length + 1,
          USUARIO_CRIACAO: this.usuarioAlmope,
          TITULO_LISTA: this.listArrayData.TITULO_LIST
        }

        this.listArrayData.ITEMS_LIST.push(data)
        let urlData = `${config.baseUrl}api/shared/project_manager/gestao/list_verificacao/`
        await this.$api.post(urlData, data)
        this.$emit('add-tasks', data)
        this.textItem = null
      },
      addItem() {
        this.isTextField = true
      }
    },
    created() {
      this.listArrayData = this.data
    },
    watch: {}
  }
</script>

<style scoped>
  a {
    text-decoration: none;
    border-bottom: 1px dashed;
    font-size: 12.5px;
  }

  .action-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .label-checked {
    text-decoration: line-through;
    font-style: italic;
    color: #5555;
  }
</style>
