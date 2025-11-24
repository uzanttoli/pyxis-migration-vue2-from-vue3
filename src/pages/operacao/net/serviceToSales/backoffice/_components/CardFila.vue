<template>
  <router-link v-bind="$attrs" class="card">
    <v-card
      outlined
      height="150"
      min-width="360"
      class="rounded-xl"
      style="
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: start;
        padding: 10px;
        margin: 30px 20px 0 0;
        cursor: pointer;
        position: relative;
      "
    >
      <v-icon size="65" style="position: absolute; right: 5px; color: #c0c0c07c">
        fab fa-buffer
      </v-icon>
      <p style="margin: 0; padding: 0" class="text-caption">Backoffice</p>
      <div style="width: 90%">
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <p
              v-bind="attrs"
              v-on="on"
              class="text-h4 font-weight-bold"
              style="color: #283593; white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
            >
              {{ title }}
            </p>
          </template>
          <span>{{ title }}</span>
        </v-tooltip>
        <p
          style="padding: 0; margin: 0; margin-top: -19px; font-size: 13px; color: red"
          v-show="qtd != null"
        >
          <v-icon size="14" color="error" class="mr-1">fa-solid fa-triangle-exclamation</v-icon>
          {{ qtd }} casos pendentes
        </p>
      </div>
      <div style="border-radius: 0px; position: absolute; bottom: 10px">
        <span style="font-size: 10px">{{ description }}</span>
      </div>
    </v-card>
  </router-link>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        required: true
      },
      qtd: {
        type: [Number, String],
        default: null
      },
      description: {
        type: String,
        default: ''
      }
    },
    inheritAttrs: false
  }
</script>

<style scoped>
  a {
    text-decoration: none !important;
  }
</style>
