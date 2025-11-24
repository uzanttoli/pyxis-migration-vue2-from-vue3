<template>
  <div style="display: flex; align-items: center">
    <div v-if="buttons.length > 0">
      <v-card class="transparent" transparent elevation="0" width="100%">
        <v-btn-toggle v-model="toggleExclusive" active-class="blue darken-3" mandatory class="mr-2">
          <div style="display: flex; flex-direction: column; gap: 10px">
            <v-tooltip bottom v-for="(item, i) in buttons" :key="i">
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  rounded
                  fab
                  elevation="1"
                  small
                  :value="item.value"
                  v-bind="attrs"
                  v-on="on"
                  @click="$emit('click', item.component)"
                  v-if="item.perfil && item.perfil.includes($store.getters.usuario.filtro)"
                >
                  <v-icon size="16" :color="item.value == toggleExclusive ? 'white' : ''">
                    {{ item && item.icon }}
                  </v-icon>
                </v-btn>
              </template>
              <span>{{ item && item.placeholder }}</span>
            </v-tooltip>
          </div>
        </v-btn-toggle>
      </v-card>
    </div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      buttons: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        toggleExclusive: 1
      }
    },
    methods: {}
  }
</script>

<style></style>
