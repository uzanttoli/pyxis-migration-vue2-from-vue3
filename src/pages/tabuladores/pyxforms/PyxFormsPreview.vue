<template>
  <div style="position: relative">
    <card-app-bar
      customClass="rounded-xl mb-8"
      :minHeight="135"
      style="margin-top: 10px"
      styleCustom="display: flex; height: 135px; padding: 25px; align-items:center; color: #fafafa;"
    >
      <template v-slot:title>
        <h3>
          <v-icon color="white" x-large class="mr-3">fa-solid fa-list-check</v-icon>
          Prévia
        </h3>
      </template>
    </card-app-bar>

    <v-card class="pa-8 mb-4" v-if="formData && formData.formName" elevation="1">
      <div class="mb-8">
        <h2 class="mb-4">{{ formData.formName }}</h2>
        <h5 class="font-weight-light">{{ formData.formDescription }}</h5>
      </div>
      <div v-for="block in formData.blocks" :key="block.id">
        <Fieldset :title="block.title">
          <v-container fluid>
            <v-row>
              <template v-for="field in block.questions">
                <AlmopeField
                  v-if="field.type === 'dadosAlmope'"
                  :key="field.id"
                  hasSearch
                  :almope="field.value"
                />
                <Column
                  v-else
                  :key="field.id"
                  :cols="field.columns"
                  :sm="field.columns"
                  :md="field.columns"
                  :lg="field.columns"
                >
                  <DynamicFormField
                    :type="field.type"
                    :min="field.min"
                    :max="field.max"
                    :prependIcon="field.prependIcon"
                    :prependText="field.prependText"
                    :required="field.required"
                    :label="field.required ? '* ' + field.question : field.question"
                    v-model:placeholder="field.placeholder"
                    :value="checkboxOptions ? checkboxOptions : field.value"
                    @update:items="checkboxOptions = $event"
                  />
                </Column>
              </template>
            </v-row>
          </v-container>
        </Fieldset>
      </div>
    </v-card>
    <v-card class="pa-8 text-center" v-else elevation="1">Nenhum formulário para exibir</v-card>
  </div>
</template>

<script>
  import { useDevPre } from '../../../utils/useDevPre.js'
  import DynamicFormField from '../../../shared/components/DynamicFormField/DynamicFormField.vue'
  import cardAppBar from '../../../shared/components/cards/modern/cardAppBar.vue'
  import Fieldset from '../../../shared/components/Fieldset/Fieldset.vue'
  import Column from '../../../shared/components/Column/Column.vue'
  import AlmopeField from '../../../shared/components/AlmopeField/AlmopeField.vue'

  export default {
    name: 'PyxFormsPreview',
    components: {
      DynamicFormField,
      cardAppBar,
      Fieldset,
      AlmopeField,
      Column
    },
    props: {
      formData: Object
    },
    data() {
      return {
        checkboxOptions: ''
      }
    },
    methods: {
      useDev(data) {
        useDevPre(data)
      }
    }
  }
</script>
