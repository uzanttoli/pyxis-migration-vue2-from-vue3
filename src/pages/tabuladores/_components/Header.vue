<template>
  <div style="display: flex; justify-content: space-between">
    <div>
      <v-card-title>
        <v-icon color="orange" class="mr-2">fa-solid fa-grip</v-icon>
        {{ title }}
      </v-card-title>
      <v-card-subtitle>{{ subtitle }}</v-card-subtitle>
    </div>
    <div class="pa-8">
      <slot name="action"></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'tab-header',
    props: {
      title: {
        type: String,
        default: 'Título'
      },
      subtitle: {
        type: String,
        default: 'Subtitulo'
      }
    }
  }
</script>
