<template>
  <v-row justify="center">
    <!-- v-model="viewDetalhesOperador" -->
    <v-dialog
      :model-update="viewDetalhesOperador"
      @update:modelValue="val => $emit('update:viewDetalhesOperador', val)"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card tile>
        <v-toolbar dark class="card" color="#0c125c">
          <h2>Campanha de {{ nome }}</h2>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                @click="$emit('update:viewDetalhesOperador')"
                icon
                color="white"
              >
                <v-icon color="white">fas fa-close</v-icon>
              </v-btn>
            </template>
            <span>Fechar</span>
          </v-tooltip>
        </v-toolbar>
        <detalhes
          :almopeConsulta="almopeConsulta"
          :agrupamentoConsulta="agrupamento"
          :cargoConsulta="cargo"
          :produtoConsulta="produto"
          :turnoConsulta="turno"
          :openViewDetalhes="viewDetalhesOperador"
        ></detalhes>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  import detalhes from '../../detalhes/Detalhe.vue'
  import config from '../../../../core/config.js'
  export default {
    components: { detalhes },
    props: {
      viewDetalhesOperador: {
        type: Boolean,
        default: false
      },
      nome: {
        type: String,
        default: 'Indisponivel'
      },
      almope: {
        type: String,
        require: true
      }
    },
    data() {
      return {
        //   viewDetalhesOperador: true,
        turno: null,
        agrupamento: null,
        produto: null,
        cargo: null,
        almopeConsulta: null
      }
    },
    computed: {},
    methods: {
      async getUserData() {
        let urlData = `${config.baseUrl}api/shared/user/user_data/${this.almope}`
        var res = await this.$api.get(urlData)
        this.agrupamento = res.data.agrupamento
        this.turno = res.data.turno
        this.produto = res.data.produto
        this.cargo = res.data.filtro
        this.almopeConsulta = res.data.almope
        // this.dadosOperadorConsulta = res.data;
      }
    },
    watch: {
      viewDetalhesOperador() {
        this.getUserData()
      },
      almope() {
        this.getUserData()
      }
    }
  }
</script>

<style scoped>
  .card {
    background: #0c125c;
  }
</style>
