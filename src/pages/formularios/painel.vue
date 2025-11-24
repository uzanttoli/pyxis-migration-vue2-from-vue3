<template>
  <div style="margin-top: 2rem">
    <div v-for="(list, i) in filterItems(utilitarios)" :key="i" class="mb-5">
      <div style="display: flex; justify-content: space-between">
        <h1>
          <span>#</span>
          {{ list.TITULO }}
        </h1>
        <div style="width: 300px; margin-bottom: -10px; display: flex; justify-content: center">
          <v-text-field
            class="mr-2"
            outlined
            :placeholder="'Pesquisar ' + list.TITULO"
            :label="'Pesquisar ' + list.TITULO"
            dense
            v-model="formSearch[list.TITULO]"
          ></v-text-field>
          <v-btn icon @click="dialogConfig = true" v-if="filtro === 'ADMINISTRADOR' && i === 0">
            <v-icon>fa-solid fa-gear</v-icon>
          </v-btn>
        </div>
      </div>
      <v-divider></v-divider>
      <v-row align="center" justify="center" class="mt-7">
        <template v-if="list.ITEMS != ''">
          <v-dialog
            color="transparent"
            v-for="tag in list.ITEMS"
            max-width="900"
            transition="dialog-bottom-transition"
            :retain-focus="false"
            :key="tag.ID"
            v-model="tagDialogs[tag.ID]"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-card
                @click="registrarAcesso(tag.ID, tag.TITLE)"
                :class="tagDialogs[tag.ID] == true ? 'cor-padrao' : ''"
                class="rounded-lg ma-3"
                outlined
                height="250"
                min-height="160"
                width="220"
                v-bind="attrs"
                v-on="on"
                hover
                v-if="
                  (restricaoTipoAcesso(tag.TIPO_ACESSO_LIBERACAO, tipoAcesso) &&
                    restricaoRegional(tag.REGIONAL_ACESSO_LIBERACAO, regional) &&
                    almopeRestricao(tag.ALMOPE_RESTRICAO, usuarioAlmope)) ||
                  almopeLiberacao(tag.ALMOPE_LIBERACAO, usuarioAlmope)
                "
              >
                <div class="mt-1 mr-1 d-flex flex-row-reverse">
                  <v-chip
                    label
                    small
                    color="green"
                    class="white--text"
                    v-if="newCard(tag.CRIADO_EM)"
                  >
                    NOVO
                  </v-chip>
                </div>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-avatar tile size="100">
                      <v-img :src="getImgUrl(tag.IMAGEM)"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-title
                      class="subtitle-1 mb-1 font-weight-medium text-center text-wrap"
                      :class="tagDialogs[tag.ID] == true ? 'white--text' : ''"
                    >
                      {{ tag.TITLE }}
                      <v-icon></v-icon>
                    </v-list-item-title>
                    <v-list-item-subtitle
                      class="text-wrap justify-center text-center"
                      :class="tagDialogs[tag.ID] == true ? 'white--text' : ''"
                    >
                      {{ tag.DESCRICAO }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <div style="display: flex; justify-content: center">
                  <v-chip small color="orange" class="white--text" v-if="attCard(tag.ALTERADO_EM)">
                    Atualizado
                  </v-chip>
                </div>
              </v-card>
            </template>
            <v-card width="1000">
              <component
                :is="tag.COMPONENT"
                :permission="tag.ALMOPE_LIBERACAO"
                :title="tag.TITLE"
                :almopesExcessoes="tag.ALMOPE_EXCESSAO"
              ></component>
            </v-card>
          </v-dialog>
        </template>
        <template v-else>
          <div class="text-h4 grey--text mb-8">
            Nada encontrado em {{ list.TITULO.toLowerCase() }} com o filtro realizado!
          </div>
        </template>
      </v-row>
    </div>
    <Configuracao :dialog="dialogConfig" @updated:close="dialogConfig = !dialogConfig" />
  </div>
</template>

<script>
  import adicionarDemandas from '../../shared/components/utilities/adicionarDemandas/adicionarDemandas.vue'
  import alteracaoVinculoComponent from './tabuladores/alteracaoVinculo/alteracaoVinculo.component.vue'
  import beedoo from './tabuladores/resetSenha/Beedoo.vue'
  import blindagem from './tabuladores/televendasBlindagem/blindagem.vue'
  import cadastroErroSistemico from './tabuladores/almawave/solicitacoesOperador/cadastroErroSistemico.vue'
  import calculadoraPorcentagem from '../../shared/components/utilities/calculadoras/calculadoraPorcentagem.vue'
  import calculadoraProRata from '../../shared/components/utilities/calculadoras/calculadoraProRata.vue'
  import calculadoraVoltagem from './tabuladores/calculadoraVoltagem/calculadoraVoltagem.vue'
  import celulaAtiva from './tabuladores/celulaAtiva/celulaAtiva.vue'
  import checkoutReclamacoes from './tabuladores/reclamacaoContigencia/checkoutReclamacoes.vue'
  import desconexao from './tabuladores/desconexao/desconexao.vue'
  import desconexaoRetencao from './tabuladores/desconexao/desconexaoRetencao.vue'
  import enelX from './tabuladores/enelX/enelX.vue'
  import erroSistemico from './tabuladores/erroSistemico/erroSistemico.vue'
  import expurgoScore from './tabuladores/expurgo/expurgoScoreboard/expurgo.vue'
  import faturaDigitalOption from './tabuladores/faturaDigital/FaturaDigital.vue'
  import firstCallResolution from './tabuladores/firstCallResolution/firstCallResolution.vue'
  import formulariosVendas from './tabuladores/televendas/painel.vue'
  import hotLine from './tabuladores/hotLine/hotLine.vue'
  import impactosPerformance from './tabuladores/reportsErrosOperacionais/retencao/impactosPerformance.vue'
  import indevida from './tabuladores/transferencias/indevida.vue'
  import indicacaoComboMulti from './tabuladores/indicacaoComboMulti/indicacaoComboMulti.vue'
  import indicacaoNaoCliente from './tabuladores/indicacaoNaoCliente/indicacaoNaoCliente.vue'
  import instalacao from './tabuladores/instalacao/instalacao.vue'
  import linksRapidoComponent from '../../shared/components/utilities/linksRapido/linksRapido.component.vue'
  import motivosCancelamento from './tabuladores/motivosCancelamento/motivosCancelamento.vue'
  import PalitagemAtendimento from '../../shared/components/utilities/palitagem/PalitagemAtendimento.vue'
  import pilotoFinanceiro from './tabuladores/pilotoFinanceiro/pilotoFinanceiro.vue'
  import reclamacaoContigencia from './tabuladores/reclamacaoContigencia/reclamacaoContigencia.vue'
  import reclamacaoLojistaHotline from './tabuladores/hotLine/reclamacao.vue'
  import reportErroSolar from './tabuladores/reportErrosSolar/reportErrosSolar.vue'
  import solicitacaoAcessos from './tabuladores/solicitacaoAcessos/solicitacaoAcessos.vue'
  import tabuladorAtivacao from './tabuladores/ativacaoS2S/ativacao.vue'
  import tabuladorPropenso from './tabuladores/propenso/propenso.vue'
  import tabulatePaymentErrorComponent from './tabuladores/erroDePagamento/tabulatePaymentError.component.vue'
  import tokenComponent from './tabuladores/tabToken/token.vue'
  import validacaoDeImprodutivo from './tabuladores/expurgo/validacaoDeImprodutivo/cadastro.vue'
  import visitaTecnica from './tabuladores/visitaTecnica/visitaTecnica.vue'
  import gestaoBloqueados from './tabuladores/gestaoBloqueados/GestaoBloqueados.vue'
  import enderecoDesatualizado from './tabuladores/EnderecoDesatualizado/enderecoDesatualizado.vue'
  import RetencaoMovelChurn from './tabuladores/retencaoMovel/RetencaoMovelChurn.vue'
  import AcaoJornadaPlena from './tabuladores/jornadaPlena/AcaoJornadaPlena.vue'
  // import formulariosVendas from "../net/operacoes/operador/televendas/formularios/formularios.component.vue";
  // import formulariosVendas from "./tabuladores/televendas/formularios/formularios.component.vue";

  import config from '../../core/config'
  import validacaoAcesso from '../../mixins/validacao'
  import Configuracao from './gerenciarUtilitarios/Configuracao.vue'
  export default {
    components: {
      adicionarDemandas,
      alteracaoVinculoComponent,
      beedoo,
      calculadoraPorcentagem,
      calculadoraProRata,
      calculadoraVoltagem,
      celulaAtiva,
      checkoutReclamacoes,
      desconexao,
      desconexaoRetencao,
      erroSistemico,
      expurgoScore,
      faturaDigitalOption,
      firstCallResolution,
      formulariosVendas,
      hotLine,
      impactosPerformance,
      indicacaoComboMulti,
      indicacaoNaoCliente,
      instalacao,
      linksRapidoComponent,
      motivosCancelamento,
      PalitagemAtendimento,
      pilotoFinanceiro,
      reclamacaoContigencia,
      reclamacaoLojistaHotline,
      reportErroSolar,
      solicitacaoAcessos,
      tabuladorAtivacao,
      tabuladorBlindagem: blindagem,
      tabuladorEnelx: enelX,
      tabuladorPropenso,
      tabulatePaymentErrorComponent,
      tokenComponent,
      transferenciaIndevida: indevida,
      validacaoDeImprodutivo,
      vdiSolicitacoes: cadastroErroSistemico,
      visitaTecnica,
      gestaoBloqueados,
      Configuracao,
      enderecoDesatualizado,
      RetencaoMovelChurn,
      AcaoJornadaPlena
    },
    mixins: [validacaoAcesso],
    data() {
      return {
        tagDialogs: {},
        utilitarios: [],
        formSearch: {},
        dialogConfig: false
      }
    },
    computed: {
      produto() {
        return this.$store.getters.usuario.produto
      },
      tipoAcesso() {
        let tipo = this.$store.getters.usuario.filtro
        return tipo.toLowerCase()
      },
      regional() {
        let tipo = this.$store.getters.usuario.regional
        return tipo.toLowerCase()
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      filtro() {
        return this.$store.getters.usuario.filtro
      },
      ipMaquina() {
        return localStorage.getItem('ip')
      },
      itemsDados() {
        let dadosUtilitarios = this.utilitarios
        let arrDados = []

        for (let i = 0; i <= dadosUtilitarios.length; i++) {
          let objects = dadosUtilitarios[i]
          for (let j = 0; j <= objects?.ITEMS.length; j++) {
            if (objects?.ITEMS[j] != undefined) {
              arrDados.push(objects?.ITEMS[j])
            }
          }
        }
        return arrDados
      }
    },
    methods: {
      filterItems(items) {
        let obj = this.formSearch
        if (Object.keys(obj).length === 0) {
          return items
        }

        return items.map(item => {
          if (this.formSearch[item.TITULO] && this.formSearch[item.TITULO].trim() !== '') {
            return {
              ...item,
              ITEMS: item.ITEMS.filter(itemFilter =>
                itemFilter.TITLE.toLowerCase().includes(this.formSearch[item.TITULO].toLowerCase())
              )
            }
          }
          return item
        })
      },
      async registrarAcesso(id, title) {
        let data = {
          ALMOPE_ACESSO: this.usuarioAlmope,
          NOME_UTILITARIO: title,
          ID_UTILITARIO: id,
          IP_MAQUINA_ACESSO: this.ipMaquina
        }
        this.$router.push({ query: { ...this.$route.query, id } })
        let urlData = `${config.baseUrl}api/shared/formularios/config/registro_acesso/`
        await this.$api.post(urlData, data)
      },
      newCard(value) {
        let dataEspecifica = this.moment(value)
        let dataAtual = this.moment(new Date())

        const diferencaEmDias = dataAtual.diff(dataEspecifica, 'days')
        return diferencaEmDias < 30 ? true : false
      },
      attCard(value) {
        let dataEspecifica = this.moment(value)
        let dataAtual = this.moment(new Date())

        const diferencaEmDias = dataAtual.diff(dataEspecifica, 'days')
        return diferencaEmDias < 30 ? true : false
      },
      listarUtilitarios() {
        let urlData = `${config.baseUrl}api/shared/formularios/config/list_utilitarios/${this.produto}`
        this.$api.get(urlData).then(res => {
          this.utilitarios = res.data
        })
      },
      getImgUrl(imgSelecionada) {
        var img = require.context('../../assets/img/imgCards/utilitarios/', false, /\.png$/)
        return img('./' + imgSelecionada + '.png')
      }
    },
    created() {
      this.listarUtilitarios()

      const params = new URLSearchParams(window.location.search)
      const id = parseInt(params.get('id'))
      this.tagDialogs[id] = true
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Prosto+One&display=swap"); */

  h1 {
    font-family: 'Prosto One', cursive;
  }

  span {
    font-style: italic;
    color: green;
  }

  .cor-padrao {
    background-image: linear-gradient(220deg, rgb(143, 14, 143), rgb(0, 236, 255));
  }
</style>
