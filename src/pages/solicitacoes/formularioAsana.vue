<template>
  <v-container fluid>
    <div style="height: 100vh; display: flex; justify-content: center">
      <div class="asana-embed-container">
        <link rel="stylesheet" href="https://form.asana.com/static/asana-form-embed-style.css" />
        <iframe
          class="asana-embed-iframe"
          src="https://form.asana.com/?k=Nc19toBF_iJrkzQNdNj0SQ&d=24136009444665&embed=true"
        ></iframe>
        <div class="asana-embed-footer"></div>
      </div>
    </div>
  </v-container>
</template>

<script>
  export default {}
</script>

<style scoped>
  .asana-embed-iframe {
    height: 95vh;
    width: 800px;
  }
</style>
