<template>
  <section class="comparativo-intervalo" v-if="mplayComparativoIntervalo != ''">
    <v-card>
      <title-negative-margin
        title="Performance Comparativo Intervalo"
        :progressVisible="true"
        :countIntervalProgress="countInterval"
        corProgress="cyan accent-3"
      ></title-negative-margin>
      <v-data-table
        dense
        class="text-no-wrap"
        loading-text="Carregando..."
        :headers="getHeaders(this.cargoColaboradorLogado)"
        :item-key="colunaChave"
        :items="mplayComparativoIntervalo"
        no-data-text="Não há informações no momento"
        :loading="loading"
        :search="search"
        :footer-props="{
          'items-per-page-text': 'Itens por página'
        }"
      >
        <template v-slot:header>
          <thead class="text-center">
            <tr>
              <th class="text-center">Performance Hora</th>
              <th class="text-center grey lighten-3" colspan="2">11:00</th>
              <th class="text-center" colspan="2">12:00</th>
              <th class="text-center grey lighten-3" colspan="2">13:00</th>
              <th class="text-center" colspan="2">14:00</th>
              <th class="text-center grey lighten-3" colspan="2">15:00</th>
              <th class="text-center" colspan="2">16:00</th>
              <th class="text-center grey lighten-3" colspan="2">17:00</th>
              <th class="text-center" colspan="2">18:00</th>
              <th class="text-center grey lighten-3" colspan="2">19:00</th>
              <th class="text-center" colspan="2">20:00</th>
              <th class="text-center grey lighten-3" colspan="2">21:00</th>
              <th class="text-center" colspan="2">22:00</th>
              <!-- <th
              class="text-center"
              :class="[i % 2 ? '' : 'grey lighten-3']"
              colspan="2"
              v-for="(item, i) in intervaloMplay"
              :key="i"
            >
              {{ item.hora_atualizacao ? item.hora_atualizacao + ":00" : "-" }}
            </th> -->
              <!-- <th class="text-center grey lighten-3" rowspan="2">
              Total
            </th> -->
            </tr>
          </thead>
        </template>
        <template v-slot:item.onze="{ item }">{{ item.onze | percentage }}</template>
        <template v-slot:item.doze="{ item }">{{ item.doze | percentage }}</template>
        <template v-slot:item.treze="{ item }">{{ item.treze | percentage }}</template>
        <template v-slot:item.quatorze="{ item }">{{ item.quatorze | percentage }}</template>
        <template v-slot:item.quinze="{ item }">{{ item.quinze | percentage }}</template>
        <template v-slot:item.dezesseis="{ item }">{{ item.dezesseis | percentage }}</template>
        <template v-slot:item.dezessete="{ item }">{{ item.dezessete | percentage }}</template>
        <template v-slot:item.dezoito="{ item }">{{ item.dezoito | percentage }}</template>
        <template v-slot:item.dezenove="{ item }">{{ item.dezenove | percentage }}</template>
        <template v-slot:item.vinte="{ item }">{{ item.vinte | percentage }}</template>
        <template v-slot:item.vinte_um="{ item }">{{ item.vinte_um | percentage }}</template>
        <template v-slot:item.vinte_dois="{ item }">{{ item.vinte_dois | percentage }}</template>
      </v-data-table>
    </v-card>
  </section>
</template>

<script>
  // import config from "../../../../core/config";
  export default {
    props: {
      urlAction: {
        type: String,
        require: true
      },
      usuarioNome: {
        type: String,
        default: null
      },
      cargo: {
        type: [String],
        default: 'GERENTE'
      }
    },
    data() {
      return {
        iconDesenvolvimento: 'mdi-sync-alert',
        semDados: '-',
        countInterval: 0,
        loading: false,
        search: '',
        interval: null,
        base: [],
        colunaChave: 'Coordenador'
      }
    },
    computed: {
      mplayComparativoIntervalo() {
        let mplayComparativoIntervalo = this.$store.getters.mplayComparativoIntervalo
        return mplayComparativoIntervalo ? mplayComparativoIntervalo : []
      },
      cargoColaboradorLogado() {
        let cargoColaboradorLogado = this.$store.getters.usuario.filtro
        return cargoColaboradorLogado ? cargoColaboradorLogado : '-'
      }
    },
    methods: {
      loadMplayComparativoIntervalo() {
        this.$store.dispatch('loadMplayComparativoIntervalo', this.urlAction)
      },
      // loadBase() {
      //   this.loading = true;
      //   let urlData = `${config.baseUrl}${this.urlAction}`;
      //   urlData = this.replaceUrlMultiParamSeparator(urlData);
      //   this.$api.get(urlData).then((res) => {
      //     this.base = res.data;
      //     this.loading = false;
      //   });
      // },
      getHeaders(cargoColaborador = this.cargoColaboradorLogado) {
        let headerCoord = {
          text: 'Supervisor',
          align: 'center',
          sortable: false,
          value: 'superior1',
          class: ''
        }

        let headerSup = {
          text: 'Operador',
          align: 'center',
          sortable: false,
          value: 'nome',
          class: ''
        }

        let headerOper = {
          text: 'Nome',
          align: 'center',
          sortable: false,
          value: 'nome',
          class: ''
        }

        let arrHeaders = [
          {
            text: '%Retido',
            value: 'onze',
            sortable: false,
            align: 'center',
            class: 'grey lighten-3'
          },
          {
            text: 'Oc Aberta',
            value: 'ANDAMENTO',
            sortable: false,
            align: 'center',
            class: 'grey lighten-3'
          },
          { text: '%Retido', value: 'doze', sortable: false, align: 'center' },
          {
            text: 'Oc Aberta',
            value: 'ANDAMENTO',
            align: 'center',
            sortable: false
          },
          {
            text: '%Retido',
            sortable: false,
            value: 'treze',
            align: 'center',
            class: 'grey lighten-3'
          },
          {
            text: 'Oc Aberta',
            value: 'ANDAMENTO',
            sortable: false,
            align: 'center',
            class: 'grey lighten-3'
          },
          {
            text: '%Retido',
            value: 'quatorze',
            align: 'center',
            sortable: false
          },
          {
            text: 'Oc Aberta',
            value: 'ANDAMENTO',
            sortable: false,
            align: 'center'
          },
          {
            text: '%Retido',
            sortable: false,
            value: 'quinze',
            align: 'center',
            class: 'grey lighten-3'
          },
          {
            text: 'Oc Aberta',
            sortable: false,
            value: 'ANDAMENTO',
            align: 'center',
            class: 'grey lighten-3'
          },
          {
            text: '%Retido',
            value: 'dezesseis',
            align: 'center',
            sortable: false
          },
          {
            text: 'Oc Aberta',
            value: 'ANDAMENTO',
            sortable: false,
            align: 'center'
          },
          {
            text: '%Retido',
            sortable: false,
            value: 'dezessete',
            align: 'center',
            class: 'grey lighten-3'
          },
          {
            text: 'Oc Aberta',
            sortable: false,
            value: 'ANDAMENTO',
            align: 'center',
            class: 'grey lighten-3'
          },
          { text: '%Retido', value: 'dezoito', align: 'center', sortable: false },
          {
            text: 'Oc Aberta',
            value: 'ANDAMENTO',
            sortable: false,
            align: 'center'
          },
          {
            text: '%Retido',
            value: 'dezenove',
            sortable: false,
            align: 'center',
            class: 'grey lighten-3'
          },
          {
            text: 'Oc Aberta',
            sortable: false,
            align: 'center',
            value: 'ANDAMENTO',
            class: 'grey lighten-3'
          },
          { text: '%Retido', value: 'vinte', align: 'center', sortable: false },
          {
            text: 'Oc Aberta',
            value: 'ANDAMENTO',
            sortable: false,
            align: 'center'
          },
          {
            text: '%Retido',
            sortable: false,
            value: 'vinte_um',
            align: 'center',
            class: 'grey lighten-3'
          },
          {
            text: 'Oc Aberta',
            sortable: false,
            align: 'center',
            value: 'ANDAMENTO',
            class: 'grey lighten-3'
          },
          {
            text: '%Retido',
            sortable: false,
            value: 'vinte_dois',
            align: 'center'
          },
          {
            text: 'Oc Aberta',
            sortable: false,
            value: 'ANDAMENTO',
            align: 'center'
          }
          // {
          //   text: "Total",
          //   sortable: false,
          //   value: "TOTAL_COLABORADOR",
          //   class: "grey lighten-3",
          //   align: "center",
          // },
        ]
        if (cargoColaborador == 'GERENTE') {
          this.colunaChave = 'Coordenador'
          arrHeaders.unshift(headerCoord)
        } else if (cargoColaborador == 'SUPERVISOR') {
          this.colunaChave = 'Supervisor'
          arrHeaders.unshift(headerSup)
        } else if (cargoColaborador == 'OPERADOR') {
          this.colunaChave = 'Operador'
          arrHeaders.unshift(headerOper)
        } else {
          this.colunaChave = 'NOME'
        }
        return arrHeaders
      }
    },
    created() {
      this.loadMplayComparativoIntervalo()
      this.interval = setInterval(() => {
        this.countInterval += 6.66
        if (this.countInterval >= 99.6) {
          this.loadMplayComparativoIntervalo()
          this.countInterval = 0
        }
      }, 60000)
    },
    beforeUnmount: function () {
      clearInterval(this.interval)
    }
  }
</script>

<style></style>
