<template>
  <v-sheet>
    <div
      style="
        display: flex;
        flex-direction: row;
        justify-content: center;
        border-bottom: 1px solid black;
        margin: 10px;
      "
    >
      <h3>Responder</h3>
    </div>
    <v-row justify="center" align="center" class="mt-3">
      <div>
        <v-btn @click="responderAgora = true" class="mx-2" color="success">Agora</v-btn>
        <v-btn color="error" :disabled="responderAgora">Depois</v-btn>
      </div>
    </v-row>
  </v-sheet>
</template>

<script>
  export default {
      props:{
          responderAgora:{
              type:
          }
      }
  };
</script>

<style></style>
