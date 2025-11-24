<template>
  <v-row>
    <v-col cols="12">
      <v-card elevation="1" class="rounded-xl">
        <title-negative-margin
          :title="title"
          icon="fa-solid fa-chart-simple"
          className="rounded-r-xl"
        >
          <div style="max-width: max-content">
            <v-text-field
              v-model="search"
              placeholder="Pesquisar"
              label="Pesquisar"
              outlined
              dense
            ></v-text-field>
          </div>
        </title-negative-margin>
        <v-data-table
          dense
          :headers="headers"
          :search="search"
          :items-per-page="10"
          :items="processedItems"
          class="text-no-wrap"
        >
          <template v-slot:item.HUMOR="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-img v-bind="attrs" v-on="on" :src="imgHumor(item.HUMOR)" width="30px" />
              </template>
              <span>{{ item.OBSERVACAO ? item.OBSERVACAO : 'Sem Observação' }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.ALMOPE="{ item }">
            <span @click="consultarAlmope(item.ALMOPE, item.NOME)">
              <v-btn class="mx-2" x-small depressed icon color="primary">
                <v-icon dark>mdi-open-in-new</v-icon>
              </v-btn>
              {{ item.ALMOPE }}
            </span>
          </template>
          <template v-slot:item.STATUS="{ item }">
            <v-chip
              v-if="item.STATUS == 'DESLOGADO'"
              color="red"
              label
              small
              class="ml-0 mr-2 white--text"
            >
              {{ item.STATUS }}
            </v-chip>
            <v-chip
              v-else-if="item.STATUS == null"
              color="white"
              label
              small
              class="ml-0 mr-2 back--text"
            >
              {{ item.STATUS }}
            </v-chip>
            <v-chip
              v-else-if="item.STATUS == 'NÃO LOGOU'"
              color="yellow lighten-1"
              label
              small
              class="ml-0 mr-2 back--text"
            >
              {{ item.STATUS }}
            </v-chip>
            <v-chip v-else color="primary" label small class="ml-0 mr-2 white--text">
              {{ item.STATUS }}
            </v-chip>
          </template>
        </v-data-table>
        <dados-demonstrativo-operador
          :abrirDialogDadosOperador="abrirDialogDadosOperador"
          :usuarioConsulta="usuarioConsulta"
          @updated:close-dialog="abrirDialogDadosOperador = !abrirDialogDadosOperador"
        ></dados-demonstrativo-operador>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import dadosDemonstrativoOperador from './dadosDemostrativoOperador.vue'
  export default {
    name: 'TableBaseResumoOperador',
    components: {
      dadosDemonstrativoOperador
    },
    props: {
      title: {
        type: String,
        default: 'Base Resumo Operador'
      },
      tipo: {
        type: Number,
        default: 1
      },
      headers: {
        type: [Array, Object],
        required: true
      }
    },

    data: () => ({
      usuarioConsulta: null,
      isUserName: null,
      dialog: false,
      abrirDialogDadosOperador: false,
      search: ''
    }),
    computed: {
      usuarioNome() {
        return this.$store.getters.usuario.nome
      },
      processedItems() {
        return this.resumoOperador.map(item => {
          const processedItem = { ...item }
          for (const key in processedItem) {
            if (processedItem[key] == null) {
              processedItem[key] = '-'
            }
          }
          return processedItem
        })
      },
      resumoOperador() {
        var resumoOperador = this.$store.getters.resumoOperador
        resumoOperador.map(item => {
          if (item.OBSERVACAO == null || item.OBSERVACAO == 'null') {
            item.OBSERVACAO = ''
          }
          if (item.STATUS == null) {
            item.STATUS = 'NÃO LOGOU'
          }
          if (item.HUMOR == null) {
            return '-'
          }
        })
        return resumoOperador
      }
    },
    methods: {
      consultarAlmope(almope, nome) {
        this.usuarioConsulta = almope
        this.isUserName = nome
        this.abrirDialogDadosOperador = true
      },
      imgHumor(imgName) {
        if (imgName != '-') return require(`@/assets/img/humor/${imgName}.png`)
        else return require(`@/assets/img/humor/sem-humor.png`)
      },
      loadResumoOperador() {
        return this.$store.dispatch('loadResumoOperador', {
          nome: this.usuarioNome,
          tipo: this.tipo
        })
      }
    },
    created() {
      return this.loadResumoOperador()
    }
  }
</script>

<style scoped>
  .cor-padrao {
    background: rgb(2, 0, 36);
    background: linear-gradient(
      90deg,
      rgba(2, 0, 36, 1) 0%,
      rgba(88, 9, 121, 1) 0%,
      rgba(0, 212, 255, 1) 100%
    );
  }
</style>
