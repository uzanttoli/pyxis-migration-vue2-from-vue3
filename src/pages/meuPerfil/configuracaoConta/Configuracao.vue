<template>
  <!-- v-model="dialogAccount" -->
  <v-dialog
    :model-value="dialogAccount"
    @update:modelValue="val => $emit('update:dialogAccount', val)"
    width="650"
    persistent
  >
    <v-btn tile class="rounded-t-xl btn-close" @click="$emit('updated:close')">
      <v-icon color="white">mdi-close-circle-outline</v-icon>
    </v-btn>
    <v-card tile id="account-setting-card" class="rounded-b-xl">
      <v-tabs v-model="tab" show-arrows grow>
        <v-tab v-for="tab in tabs" :key="tab.icon">
          <v-icon size="20" class="me-3">
            {{ tab.icon }}
          </v-icon>
          <span>{{ tab.title }}</span>
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <ConfiguracaoConta />
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-dialog>
</template>

<script>
  import ConfiguracaoConta from './ConfiguracaoConta.vue'
  export default {
    components: { ConfiguracaoConta },
    props: {
      dialogAccount: {
        type: Boolean,
        default: false
      },
      desativarDialoghumor: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      tab: null,
      tabs: [{ title: 'Meu Perfil', icon: 'mdi-account-outline' }]
    }),
    methods: {
      recebeEvento() {
        return this.$emit('update:fecharDialog')
      },
      _dialogAccount() {
        return (this.dialogAccount = true)
      }
    }
  }
</script>

<style scoped>
  .btn-close {
    background-image: linear-gradient(220deg, rgb(0, 236, 255), rgb(143, 14, 143));
  }
</style>
