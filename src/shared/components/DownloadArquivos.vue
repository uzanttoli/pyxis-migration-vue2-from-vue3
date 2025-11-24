<template>
  <div style="padding: 10px">
    <a :href="urlProps" style="text-decoration: none; color: #fff; font-size: 25px">
      <p style="padding: 0; margin: 0; color: #0000ff" class="text-caption">
        Link para download arquivo.
      </p>
      <i class="fa-solid fa-file-arrow-down"></i>
    </a>
  </div>
</template>

<script>
  export default {
    props: {
      urlProps: {
        type: String
      },
      methods: {}
    }
  }
</script>

<style scoped>
  div > a.i {
    visibility: hidden;
    color: #0000ff;
    transition: 1s;
  }

  div > a.i:hover {
    visibility: visible;
    color: aquamarine;
  }
</style>
