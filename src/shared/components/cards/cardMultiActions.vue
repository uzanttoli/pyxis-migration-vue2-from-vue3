<template>
  <v-card elevation="1" class="rounded-xl" :color="status == 0 ? 'grey lighten-2' : ''">
    <v-card-title>
      <div style="width: 95%">
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <div
              v-bind="attrs"
              v-on="on"
              style="display: flex; justify-content: space-between; position: relative"
            >
              <p class="pa-0 ma-0 text-capitalize">
                {{ title.toLowerCase() }}
              </p>
              <v-tooltip right>
                <template v-slot:activator="{ attrs, on }">
                  <v-icon
                    style="position: absolute; right: -15px"
                    size="45"
                    v-if="status == 0"
                    color="grey"
                    v-bind="attrs"
                    v-on="on"
                  >
                    fa-solid fa-ban
                  </v-icon>
                </template>
                <span>
                  Essa pesquisa está inativa, para utiliza-la novamente clique em
                  <v-icon size="16" color="green" class="ml-2">fa-solid fa-rotate</v-icon>
                </span>
              </v-tooltip>
            </div>
          </template>
          <span>{{ title }}</span>
        </v-tooltip>
      </div>
    </v-card-title>
    <v-card-subtitle>
      <div style="width: 95%">
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <p
              class="pa-0 ma-0 text-capitalize"
              v-bind="attrs"
              v-on="on"
              style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
            >
              {{ objetivo.toLowerCase() }}
            </p>
          </template>
          <div style="width: 350px">
            <span>{{ objetivo }}</span>
          </div>
        </v-tooltip>
      </div>
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-card-actions :class="status == 0 ? 'grey lighten-2' : 'grey lighten-5'">
      <slot name="button"></slot>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      objetivo: {
        type: String,
        default: ''
      },
      status: {
        type: Number,
        default: 1
      }
    }
  }
</script>

<style></style>
