<template>
  <v-card-actions>
    <v-spacer></v-spacer>
    <v-btn @click="$emit('duplicate')" title="Copiar" icon><i class="fas fa-copy fa-xl"></i></v-btn>
    <v-btn @click="$emit('delete')" class="mr-4" icon>
      <i class="fas fa-trash-can fa-xl" title="Remover"></i>
    </v-btn>
    <v-switch v-model="localIsRequired" inset label="Obrigatório"></v-switch>
  </v-card-actions>
</template>

<script>
  export default {
    name: 'CardFooter',
    props: {
      isRequired: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        localIsRequired: this.isRequired
      }
    },
    watch: {
      isRequired(newVal) {
        this.localIsRequired = newVal
      },
      localIsRequired(newVal) {
        this.$emit('update:isRequired', newVal)
      }
    }
  }
</script>
