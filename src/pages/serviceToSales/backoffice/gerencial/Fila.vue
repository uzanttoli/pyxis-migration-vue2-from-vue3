<template>
  <v-container fluid>
    <CardAppBar
      isButtonReturn
      customClass="rounded-xl mb-8"
      :minHeight="135"
      style="margin-top: 10px"
      styleCustom="display: flex; height: 135px; padding: 25px; align-items:center; color: #fafafa;"
      @update:click="goBack"
    >
      <template v-slot:title>
        <h3>
          <v-icon color="white" x-large class="mr-3">fa-solid fa-cash-register</v-icon>
          Gerencial Backoffice S2S
        </h3>
      </template>
    </CardAppBar>
    <div class="d-flex justify-center align-center">
      <v-col cols="3" class="py-0">
        <v-autocomplete
          dense
          deletable-chips
          :disabled="loading"
          outlined
          placeholder="Selecione uma fila"
          label="Selecione uma fila"
          :items="dadosConfig"
          v-model="filaSelecionada"
          item-text="NomeRelatorio"
          :item-value="item => item"
        ></v-autocomplete>
      </v-col>
      <v-col class="py-0 mt-n9">
        <div style="width: 290px">
          <DatePicker
            v-model="dataFiltrada"
            :dateMaxProps="true"
            :dateMinProps="false"
            :isRange="true"
          />
        </div>
      </v-col>
    </div>
    <ResumoComponent
      :title="filaSelecionada && filaSelecionada.NomeRelatorio"
      :dadosComponent="filaSelecionada"
      @update:loading="loadingDados"
      :dataFiltrada="dataFiltrada"
    />
  </v-container>
</template>

<script>
  import ResumoComponent from './Resumo.component.vue'
  import DatePicker from '@/shared/components/DatePicker/DatePicker.vue'
  import CardAppBar from '@/shared/components/cards/modern/cardAppBar.vue'
  import DadosTratativaService from '@/data/services/bko/serviceToSales/gerencial/DadosTratativa'
  export default {
    components: { CardAppBar, ResumoComponent, DatePicker },
    data: () => ({
      filaSelecionada: null,
      dadosConfig: [],
      loading: false,
      dataFiltrada: null
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      async loadConfig() {
        const result = await DadosTratativaService.getDadosFila(
          this.usuario.filtro,
          this.usuario.almope
        )
        this.dadosConfig = result
      },
      goBack() {
        this.$router.go(-1)
      },
      loadingDados(e) {
        this.loading = e
      }
    },
    created() {
      this.loadConfig()

      // this.dataFiltrada = ['2025-08-27', '2025-08-27']
    }
  }
</script>

<style></style>
