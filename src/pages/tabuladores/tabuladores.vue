<template>
  <v-container :key="componentKey">
    <v-card class="rounded-xl" :loading="loadingForm">
      <Header title="[PyTab] Pyxis Tabuladores" subtitle="Tabuladores em um único lugar" />
      <v-divider></v-divider>
      <v-col>
        <v-row>
          <v-col v-for="(item, i) in formularios" :key="i" xl="3" lg="6">
            <TabuladoresContent :item="item" v-if="formularios.length > 0" />
          </v-col>
          <v-col v-if="formularios == '' && loadingForm == false">
            <div style="display: flex; justify-content: center; padding: 10px">
              <p class="pa-0 ma-0 text-h6 grey--text">
                <i class="fa-solid fa-quote-left"></i>
                Não há tabuladores disponíveis para você
                <i class="fa-solid fa-quote-right"></i>
              </p>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-card>

    <v-divider class="my-8"></v-divider>

    <v-card class="rounded-xl" :loading="loadingForm">
      <Header title="[PyxForms] Formulários Dinâmicos" subtitle="Crie formulários dinâmicos">
        <template v-slot:action>
          <div class="d-flex flex-column align-end">
            <v-btn
              depressed
              rounded
              color="warning"
              small
              to="/pyxis/pyxforms"
              v-if="liberacaoPerfilCriacao"
            >
              Criar Formulário
            </v-btn>

            <v-switch
              v-if="hasPermission"
              v-model="showDeleted"
              inset
              label="Exibir excluídos"
              class="ml-8"
              @change="handleShowDeleted()"
            />
          </div>
        </template>
      </Header>
      <v-divider></v-divider>
      <v-col class="pa-8">
        <v-row>
          <v-col v-for="(item, i) in pyxforms" :key="i" xl="3" lg="6">
            <PyxFormsContent
              :item="item"
              :hasPermission="hasPermission"
              v-if="pyxforms.length > 0"
              @refreshData="fetchData()"
              @publish="publishForm($event)"
            />
          </v-col>
          <v-col v-if="pyxforms == '' && loadingForm == false">
            <div style="display: flex; justify-content: center; padding: 10px">
              <p class="pa-0 ma-0 text-h6 grey--text">
                <i class="fa-solid fa-quote-left"></i>
                Não há tabuladores disponíveis para você
                <i class="fa-solid fa-quote-right"></i>
              </p>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-card>
  </v-container>
</template>

<script>
  import Header from './_components/Header.vue'
  import config from '../../core/config'
  import TabuladoresContent from './_components/TabuladoresContent.vue'
  import PyxFormsContent from './_components/PyxFormsContent.vue'
  import alerts from '../../mixins/alerts.mixins'
  import { FormGeneratorSchemaService } from '../../data/services/formGenerator'
  import Vue from 'vue'
  export default {
    name: 'tabuladores-page',
    components: { Header, TabuladoresContent, PyxFormsContent },
    data: () => ({
      formularios: [],
      pyxforms: Vue.observable([]),
      loadingForm: false,
      isDev: process.env.NODE_ENV === 'development',
      showDeleted: false,
      componentKey: 0
    }),
    mixins: [alerts],
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      hasPermission() {
        return this.usuario.filtro != 'OPERADOR'
      },
      liberacaoPerfilCriacao() {
        return this.usuario.filtro != 'OPERADOR' && this.usuario.filtro != 'SUPERVISOR'
      }
    },
    methods: {
      reloadComponent() {
        this.componentKey += 1
      },
      async loadConfigtabuladores() {
        this.loadingForm = true
        let urlData = `${config.baseUrl}api/shared/py_tabuladores/configuracao/tabulador`
        const response = await this.$api.get(urlData, {
          params: {
            almope: this.usuario.almope,
            regional: this.usuario.regional,
            perfil: this.usuario.filtro
          }
        })
        this.formularios = response.data
        this.loadingForm = false
      },
      async handleShowDeleted() {
        await this.fetchData()
      },
      async fetchPyxForms() {
        try {
          this.loadingForm = true
          const schemasResponse = await FormGeneratorSchemaService.getAll(this.showDeleted)
          this.pyxforms = schemasResponse
          this.loadingForm = false
        } catch (error) {
          this.loadingForm = false
          this.toast(error, 'top-right', false, 3500, 'error')
        }
      },
      async fetchByRolePermission() {
        try {
          this.loadingForm = true
          const schemasResponse = await FormGeneratorSchemaService.getAllByRole(
            this.usuario.almope,
            this.usuario.regional,
            this.showDeleted
          )
          this.pyxforms = schemasResponse
          this.loadingForm = false
        } catch (error) {
          this.loadingForm = false
          this.toast(error, 'top-right', false, 3500, 'error')
        }
      },
      async fetchData() {
        // await this.fetchPyxForms(this.showDeleted);
        if (this.hasPermission) {
          await this.fetchPyxForms(this.showDeleted)
        } else {
          await this.fetchByRolePermission(this.showDeleted)
        }
      },
      async publishForm(id) {
        try {
          const currentForm = this.pyxforms.find(form => form.ID === id)
          const formData = {
            id: currentForm.ID,
            formName: currentForm.TITULO,
            formDescription: currentForm.DESCRICAO,
            published: currentForm.PUBLISHED ? 0 : 1
          }

          const updated = await FormGeneratorSchemaService.update(id, formData)
          if (updated) {
            this.toast('Formulário publicado com sucesso', 'top-right', false, 3000, 'success')
            this.fetchData()
          }
        } catch (error) {
          this.toast(error, 'top-right', false, 3500, 'error')
        }
      }
    },
    async created() {
      await this.loadConfigtabuladores()
      await this.fetchData()
    }
  }
</script>

<style></style>
