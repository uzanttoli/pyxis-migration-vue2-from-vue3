<template>
  <form @submit.prevent="submitForm">
    <v-row class="mt-5 px-5">
      <v-col cols="12" sm="6" md="3">
        <v-combobox
          v-model="form.data.campanha"
          :items="listaCampanhas"
          outlined
          dense
          hide-details
          color="blue-grey lighten-2"
          label="Nome da Campanha"
          item-value="id"
          item-text="campanha"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-combobox
          v-model="form.data.tipoCampanha"
          :items="tiposCampanha"
          outlined
          dense
          hide-details
          color="blue-grey lighten-2"
          label="Tipo Campanha"
          item-value="id"
          item-text="label"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-combobox
          v-model="form.data.produtoOrg"
          :items="produtos"
          outlined
          dense
          hide-details
          color="blue-grey lighten-2"
          label="Produto Org"
          item-value="id"
          item-text="label"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-combobox
          v-model="form.data.produtoPortal"
          :items="produtosPortal"
          outlined
          dense
          hide-details
          color="blue-grey lighten-2"
          label="Produto Portal"
          item-value="id"
          item-text="label"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-combobox
          v-model="form.data.produtoMis"
          :items="produtosMis"
          outlined
          dense
          hide-details
          color="blue-grey lighten-2"
          label="Produto Mis"
          item-value="id"
          item-text="label"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-combobox
          v-model="form.data.operacao"
          :items="operacoes"
          outlined
          dense
          hide-details
          color="blue-grey lighten-2"
          label="Operação"
          item-value="id"
          item-text="label"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-combobox
          v-model="form.data.agrupamento"
          :items="agrupamentos"
          outlined
          dense
          hide-details
          color="blue-grey lighten-2"
          label="Agrupamento"
          item-value="id"
          item-text="label"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-combobox
          v-model="form.data.segmento"
          :items="segmentos"
          outlined
          dense
          hide-details
          color="blue-grey lighten-2"
          label="Segmento"
          item-value="id"
          item-text="label"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-combobox
          v-model="selectedSkill"
          :items="skills"
          outlined
          dense
          hide-details
          color="blue-grey lighten-2"
          label="Skill"
          item-value="idPerfil"
          item-text="tipoPerfil"
        />
      </v-col>
      <template v-if="!isEditMode">
        <v-col cols="12" sm="6" md="3">
          <v-switch v-model="form.config.lbImp" label="LB IMP" inset class="ml-8" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-switch v-model="form.config.trOp" label="TR OP" inset class="ml-8" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-switch v-model="form.config.trRe" label="TR RE" inset class="ml-8" />
        </v-col>
      </template>
    </v-row>

    <v-row>
      <v-divider />
    </v-row>

    <v-row class="mt-5 px-5">
      <v-col>
        <v-row dense class="flex align-center m-0 p-0">
          <v-col cols="3">Habilitado Campanha</v-col>
          <v-col cols="2">
            <v-switch v-model="form.data.habilitadoCampanha" inset class="ml-8" />
          </v-col>
        </v-row>

        <v-row dense class="flex align-center m-0 p-0">
          <v-col cols="3">Habilitado Portal</v-col>
          <v-col cols="2">
            <v-switch v-model="form.data.habilitadoPortal" inset class="ml-8" />
          </v-col>
        </v-row>

        <v-row dense class="flex align-center m-0 p-0">
          <v-col cols="3">Habilitado Mapeamento</v-col>
          <v-col cols="2">
            <v-switch v-model="form.data.habilitadoMapeamento" inset class="ml-8" />
          </v-col>
        </v-row>

        <v-row dense class="flex align-center m-0 p-0">
          <v-col cols="3">Habilitado Workflow</v-col>
          <v-col cols="2">
            <v-switch v-model="form.data.habilitadoWorkflow" inset class="ml-8" />
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <v-row dense class="flex align-center m-0 p-0">
          <v-col cols="3">Habilitado Segmento</v-col>
          <v-col cols="2">
            <v-switch v-model="form.data.habilitadoSegmento" inset class="ml-8" />
          </v-col>
        </v-row>

        <v-row dense class="flex align-center m-0 p-0">
          <v-col cols="3">Habilitado Pesquisa Satisfação</v-col>
          <v-col cols="2">
            <v-switch v-model="form.data.habilitadoPesqSatisfacao" inset class="ml-8" />
          </v-col>
        </v-row>

        <v-row dense class="flex align-center m-0 p-0">
          <v-col cols="3">Habilitado Workflow BKO</v-col>
          <v-col cols="2">
            <v-switch v-model="form.data.habilitadoWorkflowBko" inset class="ml-8" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row class="justify-end my-4 pr-5">
      <v-btn color="blue darken-1" text type="submit">
        {{ isEditMode ? 'Atualizar' : 'Salvar' }}
      </v-btn>
    </v-row>
  </form>
</template>

<script>
  import { ControlePerfilService } from '@/data/services/controlePerfil/ControlePerfilService'
  import { CampanhaOperacaoMasterService } from '@/data/services/CampanhaOperacaoMaster/CampanhaOperacaoMasterService'
  import { CampanhaInativaService } from '@/data/services/campanhaInativa/CampanhaInativaService'
  import configuracaoCampanha from '@/data/services/configuracaoCampanha/ConfiguracaoCampanhaService'

  const formDefault = () => {
    return {
      data: {
        id: null,
        campanha: '',
        tipoCampanha: '',
        produtoOrg: '',
        produtoPortal: '',
        produtoMis: null,
        operacao: '',
        agrupamento: '',
        segmento: '',
        skill: '',
        habilitadoCampanha: false,
        habilitadoPortal: false,
        habilitadoMapeamento: false,
        habilitadoWorkflow: false,
        habilitadoSegmento: false,
        habilitadoPesqSatisfacao: false,
        habilitadoWorkflowBko: false
      },
      config: {
        trOp: true,
        trRe: true,
        lbImp: true
      }
    }
  }

  export default {
    props: {
      editItem: {
        type: Object,
        default: null
      },
      isEditMode: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isLoading: false,
        form: formDefault(),
        listaCampanhas: [],
        skills: [],
        selectedSkill: null,
        selectedCampaign: null,
        produtos: [],
        produtosPortal: [],
        produtosMis: [],
        operacoes: [],
        agrupamentos: [],
        segmentos: [],
        tiposCampanha: ['BKO', 'GERENTE', 'RECEPTIVO', 'STAFF', 'SUPERVISOR']
      }
    },
    watch: {
      editItem: {
        immediate: true,
        handler(val) {
          if (val) {
            this.form.data = { ...val }
            this.selectedSkill = this.skills.find(s => s.idPerfil === val.skill)
          } else {
            this.form = formDefault()
            this.selectedSkill = null
          }
        }
      }
    },
    methods: {
      async submitForm() {
        this.form.data.skill = this.selectedSkill?.idPerfil || ''
        if (this.isEditMode && this.form.data.id) {
          await configuracaoCampanha.update(this.form.data.id, this.form.data)
        } else {
          await configuracaoCampanha.create(this.form)
        }
        this.$emit('saved')
        this.resetForm()
      },
      resetForm() {
        this.form = formDefault()
        this.fetchCampanhasInativas()
        this.selectedSkill = null
      },
      async fetchCampanhasInativas() {
        const responseCampanhas = await CampanhaInativaService.getAll()
        this.listaCampanhas = responseCampanhas.map(campanha => campanha.campanha)
      }
    },
    async mounted() {
      this.formData = formDefault()
      this.skills = await ControlePerfilService.getAll()
      this.fetchCampanhasInativas()
      const listaColunas = await CampanhaOperacaoMasterService.getDistinct()
      this.tiposCampanha = listaColunas.tiposCampanha
      this.agrupamentos = listaColunas.agrupamentos
      this.segmentos = listaColunas.segmentos
      this.produtos = listaColunas.produtosOrg
      this.produtosPortal = listaColunas.produtosPortal
      this.produtosMis = listaColunas.produtosMis
      this.operacoes = listaColunas.operacoes
    }
  }
</script>

<style></style>
