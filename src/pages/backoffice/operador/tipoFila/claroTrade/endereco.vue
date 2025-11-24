<template>
  <div
    style="
      display: flex;
      flex-wrap: wrap;
      border: 1px solid #3333;
      border-radius: 5px;
      background: #fbfcfc;
    "
  >
    <v-col cols="3">
      <label style="color: grey; font-size: 14px">CEP</label>
      <p>{{ dados.CEP }}</p>
    </v-col>
    <v-col cols="3">
      <label style="color: grey; font-size: 14px">Logradouro</label>
      <p>{{ dados.LOGRADOURO }}</p>
    </v-col>
    <v-col cols="3">
      <label style="color: grey; font-size: 14px">Número</label>
      <p>{{ dados.NUMERO }}</p>
    </v-col>
    <v-col cols="3">
      <label style="color: grey; font-size: 14px">Complemento</label>
      <p>{{ dados.COMPLEMENTO }}</p>
    </v-col>
    <v-col cols="3">
      <label style="color: grey; font-size: 14px">Bairro</label>
      <p>{{ dados.BAIRRO }}</p>
    </v-col>
    <v-col cols="3">
      <label style="color: grey; font-size: 14px">Estado</label>
      <p>{{ dados.ESTADO }}</p>
    </v-col>
    <v-col cols="3">
      <label style="color: grey; font-size: 14px">Cidade</label>
      <p>{{ dados.DESC_MUNICIPIO }}</p>
    </v-col>
  </div>
</template>

<script>
  export default {
    props: {
      dados: {
        type: [Array, Object]
      }
    }
  }
</script>

<style></style>
