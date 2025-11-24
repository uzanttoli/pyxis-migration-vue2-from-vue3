<template>
  <v-dialog v-model="dialogAbsJustified" persistent width="75%">
    <v-card>
      <title-negative-margin title="Abs Jusitificados Hoje">
        <v-btn icon @click="$emit('closeDialogAbsJustified')"><v-icon>mdi-close</v-icon></v-btn>
      </title-negative-margin>
      <v-data-table :loading="loading" loading-text="Carregando..." dense>
        <template v-slot:header>
          <thead>
            <tr>
              <th>Almope</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>4602597</td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      dialogAbsJustified: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      loading: true
    })
  }
</script>

<style></style>
