<template>
  <v-card
    elevation="3"
    class="pa-2 rounded-xl"
    style="
      background: linear-gradient(
        128deg,
        rgba(2, 0, 36, 1) 0%,
        rgba(9, 9, 121, 1) 11%,
        rgba(0, 212, 255, 1) 100%
      );
      color: #f5f5f5;
      position: relative;
      display: flex;
      justify-content: space-between;
    "
    height="250"
    width="550"
    min-width="550"
  >
    <div style="display: flex; flex-direction: column">
      <p class="text-h4 ma-2" style="z-index: 1">
        Bem vindo ao
        <br />
        Speech Zone!
      </p>
      <v-autocomplete
        color="white"
        style="position: absolute; width: 250px; bottom: 35px; z-index: 1"
        class="ma-2 dark-placeholder"
        dense
        outlined
        hide-no-data
        no-data-text="Não há estudos ainda!"
        :items="dadosEstudos"
        item-text="SEGMENTO"
        :placeholder="segmento == null ? 'Selecionar um segmento' : ''"
        item-value="SEGMENTO"
        v-model="segmento"
        @change="filterEstudoPorSegmento"
      >
        <template v-slot:selection="data">
          <span class="white--text">{{ data.item.SEGMENTO }}</span>
        </template>
      </v-autocomplete>
      <v-select
        color="white"
        v-model="estudoSelecionado"
        :items="filterComputed"
        style="position: absolute; width: 250px; bottom: -15px; z-index: 1"
        class="ma-2 dark-placeholder"
        dense
        outlined
        :placeholder="estudoSelecionado == null ? 'Selecione um estudo' : ''"
        hide-no-data
        no-data-text="Não há estudos ainda!"
        item-text="ESTUDO"
        @change="changeEstudoSelecionado"
      >
        <template v-slot:selection="data">
          <span class="white--text col-12 text-truncate pa-0 ma-0">{{ data.item.ESTUDO }}</span>
        </template>
      </v-select>
    </div>
    <img
      style="
        position: absolute;
        background-size: cover;
        width: 200px;
        right: -5px;
        bottom: 0;
        z-index: 1;
      "
      src="../../assets/img/Avatar/avatar-phone.png"
      alt="avatar-pranchana"
    />
    <img
      src="../../assets/img/icons/radarZone.png"
      alt="radar zone"
      style="
        max-width: 100%;
        max-height: 100%;
        width: 350px;
        height: 350px;
        object-fit: cover;
        top: 0px;
        left: 40px;
        position: absolute;
        opacity: 0.25;
      "
    />
  </v-card>
</template>

<script>
  export default {
    props: {
      dadosEstudos: {
        type: [Object, Array]
      }
    },
    data: () => ({
      estudoSelecionado: null,
      items: [],
      segmento: null
    }),
    computed: {
      filterComputed() {
        return this.filterEstudoPorSegmento()
      }
    },
    methods: {
      filterEstudoPorSegmento() {
        let listEstudos = this.dadosEstudos.filter(item => {
          return item.SEGMENTO == this.segmento
        })
        return listEstudos
      },
      changeEstudoSelecionado() {
        let estudos = this.dadosEstudos.filter(item => {
          return item.ESTUDO == this.estudoSelecionado
        })
        this.$emit('update-estudo-selecionado', estudos)
      }
    },
    watch: {
      segmento: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.estudoSelecionado = null
        }
      }
    }
  }
</script>

<style scoped>
  .dark-placeholder ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #fff !important;
  }

  .v-select__selection,
  .v-select__selection--comma,
  .v-select.v-text-field input {
    color: blue !important;
  }
</style>
