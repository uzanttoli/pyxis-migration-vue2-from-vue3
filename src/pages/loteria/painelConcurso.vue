<template>
  <div class="container-bilhete mt-4">
    <v-app-bar class="rounded-xl" color="white" elevation="0" dense>
      <v-spacer></v-spacer>
      <v-menu offset-y v-model="menuOpenMeusNumeros">
        <template v-slot:activator="{ attrs, on }">
          <v-btn text class="black--text" v-bind="attrs" v-on="on">
            Meus Números
            <v-icon small class="ml-1" v-if="!menuOpenMeusNumeros">fa-solid fa-chevron-down</v-icon>
            <v-icon small class="ml-1" v-else>fa-solid fa-chevron-up</v-icon>
          </v-btn>
        </template>
        <v-card width="500" max-height="500" elevation="0" tile class="overflow-y-auto">
          <v-col>
            <template v-if="meusNumeros != ''">
              <div v-for="(item, i) in meusNumeros" :key="i" style="margin-top: 10px">
                <span>🎫 Números resgatados dia: {{ formatedData(item.DATA_RESG) }}</span>
                <v-divider></v-divider>
                <div style="display: flex; flex-wrap: wrap; justify-content: start">
                  <div
                    class="numeros-escolhidos"
                    v-for="(item2, j) in item.ITEMS"
                    :key="'item2' + j"
                  >
                    {{ item2.NUMERO }}
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div>
                <h4 class="grey--text">Você não resgatou nada ainda!</h4>
              </div>
            </template>
          </v-col>
        </v-card>
      </v-menu>
      <v-btn text :to="{ name: 'ResultadoLoteria', params: { id: 'resultado-loteria' } }">
        Resultados
      </v-btn>
      <v-btn
        text
        :to="{ name: 'AderenciaLoteria', params: { id: 'aderencia-loteria' } }"
        v-if="filtro != 'OPERADOR'"
      >
        Aderência
      </v-btn>
      <v-btn
        text
        :to="{
          name: 'SorteioNumeroLoteria',
          params: { id: 'sortear-numeros' }
        }"
        v-if="filtro == 'ADMINISTRADOR'"
      >
        Sortear
      </v-btn>
      <v-btn
        text
        color="#C62828"
        :to="{ name: 'EditarPainelLoteria', params: { id: 'editar-loteria' } }"
        v-if="filtro == 'ADMINISTRADOR' || filtro == 'GERENTE'"
      >
        Gerenciar Página
      </v-btn>
      <v-divider vertical class="mx-3"></v-divider>
      <div class="container-bilhetes">
        <span>Bilhetes: {{ meuSaldo.BILHETES_RESTANTES }}</span>
      </div>
    </v-app-bar>

    <v-divider></v-divider>
    <v-col v-if="filtro != 'OPERADOR' && filtro != 'SUPERVISOR'">
      <concursos-em-andamento></concursos-em-andamento>
    </v-col>
    <v-col v-if="filtro == 'OPERADOR' || filtro == 'SUPERVISOR'">
      <concursos-participando></concursos-participando>
    </v-col>
    <div style="height: 98vh" class="overflow-y-auto" v-if="dadosConcurso != ''">
      <div class="container-divulgacao">
        <img loading="lazy" class="img" :src="bannerAtual(imagemBanner)" alt="" />
      </div>
      <div class="containter-cartela">
        <div class="cartela">
          <button
            v-for="(number, index) in numbers"
            :key="index"
            :class="number.reservado ? 'numero-reservado' : 'numero'"
            @click="pegarNumero(number)"
            :disabled="number.reservado || dataSorteioValida || isCargo"
          >
            <v-tooltip bottom v-if="number.nome">
              <template v-slot:activator="{ attrs, on }">
                <span v-bind="attrs" v-on="on">
                  {{ roundNumber(number.numero) }}
                </span>
              </template>
              <span>Resgatado por: {{ number.nome }}</span>
            </v-tooltip>
            <span v-else>
              {{ roundNumber(number.numero) }}
            </span>
          </button>
        </div>
        <div class="informacoes">
          <comunicado></comunicado>
        </div>
      </div>
    </div>
    <div v-else>
      <div style="display: flex; justify-content: center">
        <nao-ha-informacoes></nao-ha-informacoes>
      </div>
    </div>

    <confirmar-resgate
      :openDialogConfirm="openDialogConfirm"
      :dadosResgate="dadosResgate"
      @close-confirm="openDialogConfirm = !openDialogConfirm"
      @update:atualizarListaNumeros="atualizarLista"
    ></confirmar-resgate>
  </div>
</template>

<script>
  import confirmarResgate from './confirmarResgate.vue'
  import config from '../../core/config'
  import Comunicado from './comunicado.vue'
  import ConcursosEmAndamento from './concursosEmAndamento.vue'
  import NaoHaInformacoes from './naoHaInformacoes.vue'
  import ConcursosParticipando from './concursosParticipando.vue'
  export default {
    components: {
      confirmarResgate,
      Comunicado,
      ConcursosEmAndamento,
      NaoHaInformacoes,
      ConcursosParticipando
    },
    data() {
      return {
        numbers: [],
        dadosResgate: [],
        dadosConcurso: [],
        reservedNumbers: [],
        meusNumeros: [],
        meuSaldo: [],
        cargoResgate: ['OPERADOR', 'SUPERVISOR'],
        dataSorteio: null,
        menuOpenMeusNumeros: false,
        menuOpenSorteios: false,
        openDialogConfirm: false
      }
    },
    computed: {
      isCargo() {
        let cargos = this.cargoResgate
        let filtro = this.filtro

        let result = cargos
          .map(e => {
            return e != filtro
          })
          .find(item => item != true)

        return result
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      filtro() {
        return this.$store.getters.usuario.filtro
      },
      regional() {
        return this.$store.getters.usuario.regional
      },
      coordenador() {
        return this.$store.getters.usuario.coordenador
      },
      concursosAtuais() {
        let dado = this.dadosConcurso['BILHETE']
        if (dado) {
          let bilhete = dado[0]['ITEMS']
          let concursoPremiado = bilhete.map(item => item.CONCURSO)
          return concursoPremiado
        }
        return []
      },
      imagemBanner() {
        let dado = this.dadosConcurso['BILHETE']
        if (dado) {
          return dado[0]['ITEMS'][0]['IMAGEM_BANNER']
        }
        return null
      },
      bilheteAtual() {
        let dado = this.dadosConcurso['BILHETE']
        if (dado) {
          return dado[0]['NUMERO']
        }
        return null
      },
      bolinhasBilhetes() {
        let dados = this.dadosConcurso['BILHETE']
        if (dados) {
          return dados[0]['BOLINHAS']
        }
        return 999
      },
      tituloConcurso() {
        let dado = this.dadosConcurso['BILHETE']
        if (dado) {
          let bilhete = dado[0]['ITEMS']
          let concursoPremiado = bilhete.map(item => item.CONCURSO)
          if (concursoPremiado.lenght == 1) {
            return 'BILHETE DE NÚMERO: ' + concursoPremiado
          } else {
            return 'BILHETE DE NÚMERO: ' + concursoPremiado.join(' - ')
          }
        }
        return ''
      },
      dataSorteioValida() {
        let dataSorteio = this.dataSorteio
        let dataAtual = new Date().toISOString().split('T')[0]
        if (dataSorteio <= dataAtual) {
          return true
          // return false;
        } else {
          return false
          // return true;
        }
      },
      queryId() {
        return this.$route.query.id ? this.$route.query.id : 0
      }
    },
    mounted() {
      // this.generateNumbers();
    },
    methods: {
      bannerAtual(img) {
        if (img) {
          return `http://172.16.252.214:4200/index.php/api/shared/arquivos/imagem_loteria/${img}`
        }
      },
      loadDataSorteio() {
        let urlData = `${config.baseUrl}api/shared/loteria/concurso/data_sorteio_bilhete/${this.bilheteAtual}/${this.regional}/${this.coordenador}`
        this.$api.get(urlData).then(res => {
          this.dataSorteio = res.data
        })
      },
      loadSaldo() {
        if (this.filtro == 'OPERADOR' || this.filtro == 'SUPERVISOR') {
          let urlData = `${config.baseUrl}api/shared/loteria/concurso/meu_saldo/${this.usuarioAlmope}/${this.queryId}`
          this.$api.get(urlData).then(res => {
            if (res.data.length > 0) {
              this.meuSaldo = res?.data[0]
            } else {
              this.meuSaldo = {
                QTD_VENDAS: 0,
                BILHETES_RESTANTES: 0
              }
            }
          })
        } else {
          this.meuSaldo = {
            QTD_VENDAS: 0,
            BILHETES_RESTANTES: 0
          }
        }
      },
      formatedData(value) {
        if (!value) return
        const [ano, mes, dia] = value.split('-')

        return `${dia}/${mes}/${ano}`
      },
      atualizarLista() {
        this.loadNumerosEscolhidos()
        this.loadMeusNumeros()
        this.loadSaldo()
      },
      loadNumerosEscolhidos() {
        let urlData = `${config.baseUrl}api/shared/loteria/concurso/numeros_resgatados/${this.bilheteAtual}`
        this.$api.get(urlData).then(res => {
          this.reservedNumbers = res.data
          this.generateNumbers()
          this.loadMeusNumeros()
        })
      },
      loadDadosConcurso() {
        if (this.filtro == 'OPERADOR' || this.filtro == 'SUPERVISOR') {
          let urlData = `${config.baseUrl}api/shared/loteria/concurso/disponiveis/${this.regional}`
          this.$api.get(urlData).then(res => {
            if (res.data['BILHETE'] != '') {
              this.dadosConcurso = res.data
              this.loadNumerosEscolhidos()
              this.loadDataSorteio()
            }
          })
        }
      },
      loadQueryDadosConcurso() {
        let urlData = `${config.baseUrl}api/shared/loteria/concurso/disponiveis_consulta/${this.queryId}`
        this.$api.get(urlData).then(res => {
          this.dadosConcurso = res.data
          this.loadNumerosEscolhidos()
          this.loadDataSorteio()
        })
      },
      loadMeusNumeros() {
        if (this.filtro == 'OPERADOR' || this.filtro == 'SUPERVISOR') {
          let urlData = `${config.baseUrl}api/shared/loteria/concurso/meus_numeros/${this.usuarioAlmope}/${this.bilheteAtual}`
          this.$api.get(urlData).then(res => {
            this.meusNumeros = res.data
          })
        }
      },
      pegarNumero(value) {
        let arrayBilhetes = this.concursosAtuais
        let dados = arrayBilhetes.map(e => {
          return {
            concurso: e,
            bilhete: this.bilheteAtual,
            numero: value.numero,
            usuario: this.usuarioAlmope,
            regional: this.regional,
            coordenador: this.coordenador
          }
        })
        this.dadosResgate = dados
        this.openDialogConfirm = true
      },
      generateNumbers() {
        this.numbers = []
        const reservedNumbers = this.reservedNumbers

        for (let i = 1; i <= this.bolinhasBilhetes; i++) {
          const reservedNumber = reservedNumbers.find(item => item.numero === i)
          const reservado = Boolean(reservedNumber)
          this.numbers.push({
            numero: i,
            reservado,
            nome: reservado ? reservedNumber.nome : null
          })
        }
      },
      roundNumber(number) {
        // Arredonda o número
        return Math.round(number)
      }
    },
    created() {
      // this.loadDadosConcurso();
      this.loadSaldo()
      if (this.queryId) {
        this.loadQueryDadosConcurso()
        this.loadSaldo()
      }
    },
    watch: {
      queryId: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.loadQueryDadosConcurso()
          this.loadSaldo()
          this.loadMeusNumeros()
        }
      }
    }
  }
</script>
<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Caprasimo&display=swap"); */

  .bilhetes-indisponiveis {
    font-weight: 200;
    color: #656565;
    font-size: 30px;
    font-family: 'Caprasimo', cursive;
  }

  .container-bilhete {
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;
  }

  .container-divulgacao {
    height: 260px;
    margin: 10px;
  }

  img {
    height: 300px;
    width: 100%;
  }

  .containter-cartela {
    display: flex;
    justify-content: space-around;
    /* flex-wrap: wrap; */
    margin-top: 4rem;
  }

  .cartela {
    width: 70vw;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    background-color: #e3f2fd;
    padding: 10px;
    margin-right: 10px;
    border-radius: 25px;
    margin-bottom: 5px;
  }

  .numero {
    background-color: #1b8a1b;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    padding: 5px;
    margin: 5px;
    cursor: pointer;
  }

  .numero-reservado {
    background-color: #656565;
    color: white;
    display: flex;
    font-weight: bold;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    padding: 5px;
    margin: 5px;
    cursor: pointer;
  }

  .numero-indisponivel {
    background-color: #ddb70d;
    color: white;
    display: flex;
    font-weight: bold;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    padding: 5px;
    margin: 5px;
  }

  .informacoes {
    width: 20vw;
    display: flex;
    justify-content: center;
  }

  .informacoes div {
    width: 100%;
    background-color: #e3f2fd;
    padding: 10px;
    border-radius: 25px;
  }

  .numeros-escolhidos {
    background-color: #1b8a1b;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    border-radius: 50%;
    font-size: 12px;
    width: 30px;
    height: 30px;
    padding: 5px;
    margin: 5px;
  }

  .container-bilhetes {
    /* border: 1px solid black; */
    padding: 10px;
  }

  .container-bilhetes span {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 17px;
  }
</style>
