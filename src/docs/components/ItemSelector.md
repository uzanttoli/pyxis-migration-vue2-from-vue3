# ItemSelector.vue

Componente genérico para seleção de itens utilizando `v-btn-toggle` do Vuetify. Ideal para escolher uma opção entre várias com visual amigável e integração com `v-model`.

---

## ✅ Exemplo de uso

```vue
<template>
  <ItemSelector v-model="itemSelecionado" :items="listaDeOpcoes" title="Selecione um item" />
</template>

<script>
  export default {
    data() {
      return {
        itemSelecionado: null,
        listaDeOpcoes: [
          { value: 'A', text: 'Opção A' },
          { value: 'B', text: 'Opção B' },
          { value: 'C', text: 'Opção C' }
        ]
      }
    },
    methods: {}
  }
</script>
```
