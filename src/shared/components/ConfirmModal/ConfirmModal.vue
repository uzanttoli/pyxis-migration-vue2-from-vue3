<template>
  <!-- v-model="dialog" -->
  <v-dialog
    :model-value="dialog"
    @update:modelValue="val => $emit('update:dialog', val)"
    :max-width="maxWidth"
  >
    <v-card>
      <v-card-title class="text-h5" v-if="title">
        {{ title }}
      </v-card-title>

      <v-card-text>
        <slot>{{ text }}</slot>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <slot name="actions"></slot>
        <div v-if="confirmModal">
          <v-btn color="darken-1" text @click="$emit('update:dialog', false)">Cancelar</v-btn>

          <v-btn color="green darken-1" text @click="action()">Confirmar</v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
  export default {
    name: 'ConfirmModal',
    props: {
      dialog: {
        type: Boolean,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      confirmModal: {
        type: Boolean,
        required: true
      },
      maxWidth: {
        type: String,
        default: '290'
      }
    },
    methods: {
      action() {
        this.$emit('action')
      }
    }
  }
</script>
