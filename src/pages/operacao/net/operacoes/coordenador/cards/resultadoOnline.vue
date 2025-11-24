<template>
  <v-sheet elevation="2">
    <title-background :minHeight="215">
      <template v-slot:title>
        <v-icon color="white" class="mr-2">mdi-weather-cloudy-clock</v-icon>
        Meu Resultado Online
      </template>
      <template v-slot:subtitle>Dados atualizados a cada 30 minutos.</template>
    </title-background>
    <v-col style="margin-top: -50px">
      <v-row>
        <card-css
          title="Chamadas"
          subTitle2="Identificadas"
          subTitle="Atendidas"
          :dadosCampo1="chamadasCoordenador.CHAMADAS_ATENDIDAS"
          :dadosCampo2="chamadasCoordenador.CHAMADAS_IDENTIFICADAS"
        ></card-css>
        <card-css
          title="Rechamada 60min"
          :dadosCampo1="rechamada60minCoordenador.PERC_RECH_1H | percentage"
          :dadosCampo2="rechamada60minCoordenador.RECHAMADA"
        ></card-css>
        <card-css
          title="Rechamada Dia"
          :dadosCampo1="rechamadaDiaCoordenador.PERC_RECH_DIA | percentage"
          :dadosCampo2="rechamadaDiaCoordenador.RECHAMADA_DIA"
        ></card-css>
        <card-css
          title="Desconexão"
          :dadosCampo1="desconexaoPorCoordenador.PERC_DESCONEXAO | percentage"
          :dadosCampo2="desconexaoPorCoordenador.DESCONECTADA"
        ></card-css>
        <card-css
          title="Shortcall até 60s"
          :dadosCampo1="shortcall60PorCoordenador.PERC_SHORTCALL_ATE_60s | percentage"
          :dadosCampo2="shortcall60PorCoordenador.SHORTCALL_ATE_60s"
        ></card-css>
        <!-- <card-css
            title="Shortcall 30s"
            :dadosCampo1="
              shortcall30PorCoordenador.PERC_SHORTCALL30 | percentage
            "
            :dadosCampo2="shortcall30PorCoordenador.SHORTCALL30"
          ></card-css> -->
        <card-css
          title="Transferências Totais"
          :dadosCampo1="transferenciasTotaisCoordenador.PERC_TRASNF_TOTAL | percentage"
          :dadosCampo2="transferenciasTotaisCoordenador.TRANSF_TOTAL"
        ></card-css>
        <card-css
          title="Transferências para Supervisor"
          :dadosCampo1="
            transferenciaParaSupervisorPorCoordenador.PERC_TRANSF_SUPERVISOR | percentage
          "
          :dadosCampo2="transferenciaParaSupervisorPorCoordenador.TRANSF_SUPERVISOR"
        ></card-css>
        <card-css
          title="Transferência Retenção"
          :dadosCampo1="transferenciaRetencaoPorCoordenador.PERC_TRASNF_RET | percentage"
          :dadosCampo2="transferenciaRetencaoPorCoordenador.TRANSF_RET"
        ></card-css>
        <card-css
          title="Transferência Indevida"
          :dadosCampo1="
            transferenciaRetencaoIndevidaPorCoordenador.PERC_TRASNF_RET_INDEVIDA | percentage
          "
          :dadosCampo2="transferenciaRetencaoIndevidaPorCoordenador.TRANSF_RET_INDEVIDA"
        ></card-css>
        <card-css
          title="Transferência Linha Muda"
          :dadosCampo1="transferenciaLinhaMudaPorCoordenador.PERC_TRASNF_MUDA | percentage"
          :dadosCampo2="transferenciaLinhaMudaPorCoordenador.TRANSF_MUDA"
        ></card-css>
        <card-css
          title="Transf. Linha Muda Indevida"
          :dadosCampo1="
            transferenciaLinhaMudaIndevidaPorCoordenador.PERC_TRASNF_MUDA_INDEVIDA | percentage
          "
          :dadosCampo2="transferenciaLinhaMudaIndevidaPorCoordenador.TRANSF_MUDA_INDEVIDA"
        ></card-css>
        <card-css
          title="Transf. Mud. De Endereço"
          :dadosCampo1="
            transferenciaMudancaDeEnderecoPorCoordenador.PERC_TRANSF_ENDERECO | percentage
          "
          :dadosCampo2="transferenciaMudancaDeEnderecoPorCoordenador.TRANSF_ENDERECO"
        ></card-css>
        <card-css
          title="Transf. Endereço Indevido"
          :dadosCampo1="
            transferenciaMudancaDeEnderecoIndevidaPorCoordenador.PERC_TRANSF_ENDERECO_INDEVIDA
              | percentage
          "
          :dadosCampo2="
            transferenciaMudancaDeEnderecoIndevidaPorCoordenador.TRANSF_ENDERECO_INDEVIDA
          "
        ></card-css>
        <card-css
          title="Transf. Downgrade "
          :dadosCampo1="transferenciaDowngradePorCoordenador.PERC_TRASNF_DOWNGRADE | percentage"
          :dadosCampo2="transferenciaDowngradePorCoordenador.TRANSF_DOWNGRADE"
        ></card-css>
        <card-css
          title="Transf. Downgrade Indevida"
          :dadosCampo1="
            transferenciaDowngradeIndevidasPorCoordenador.PERC_TRANSF_DOWNGRADE_INDEVIDA
              | percentage
          "
          :dadosCampo2="transferenciaDowngradeIndevidasPorCoordenador.TRANSF_DOWNGRADE_INDEVIDA"
        ></card-css>
      </v-row>
    </v-col>
  </v-sheet>
</template>

<script>
  import titleBackground from '@/shared/components/cards/cardTituloPaginaComFundo.vue'
  import cardCss from '@/shared/components/cards/cardSubTitle.component.vue'
  export default {
    name: 'CardResultadoOnline',
    components: {
      titleBackground,
      cardCss
    },
    props: {
      usuarioNome: {
        type: [String],
        default: null
      }
    },
    data: () => ({}),
    computed: {
      transferenciaDowngradeIndevidasPorCoordenador() {
        let transferenciaDowngradeIndevidasPorCoordenador =
          this.$store.getters.transferenciaDowngradeIndevidasPorCoordenador[0]
        return transferenciaDowngradeIndevidasPorCoordenador
          ? transferenciaDowngradeIndevidasPorCoordenador
          : []
      },
      transferenciaDowngradePorCoordenador() {
        let transferenciaDowngradePorCoordenador =
          this.$store.getters.transferenciaDowngradePorCoordenador[0]
        return transferenciaDowngradePorCoordenador ? transferenciaDowngradePorCoordenador : []
      },
      transferenciaMudancaDeEnderecoIndevidaPorCoordenador() {
        let transferenciaMudancaDeEnderecoIndevidaPorCoordenador =
          this.$store.getters.transferenciaMudancaDeEnderecoIndevidaPorCoordenador[0]
        if (transferenciaMudancaDeEnderecoIndevidaPorCoordenador) {
          return transferenciaMudancaDeEnderecoIndevidaPorCoordenador
        } else {
          return []
        }
      },
      transferenciaMudancaDeEnderecoPorCoordenador() {
        let transferenciaMudancaDeEnderecoPorCoordenador =
          this.$store.getters.transferenciaMudancaDeEnderecoPorCoordenador[0]
        if (transferenciaMudancaDeEnderecoPorCoordenador) {
          return transferenciaMudancaDeEnderecoPorCoordenador
        } else {
          return []
        }
      },
      transferenciaLinhaMudaIndevidaPorCoordenador() {
        let transferenciaLinhaMudaIndevidaPorCoordenador =
          this.$store.getters.transferenciaLinhaMudaIndevidaPorCoordenador[0]
        if (transferenciaLinhaMudaIndevidaPorCoordenador) {
          return transferenciaLinhaMudaIndevidaPorCoordenador
        } else {
          return []
        }
      },
      transferenciaLinhaMudaPorCoordenador() {
        let transferenciaLinhaMudaPorCoordenador =
          this.$store.getters.transferenciaLinhaMudaPorCoordenador[0]
        if (transferenciaLinhaMudaPorCoordenador) {
          return transferenciaLinhaMudaPorCoordenador
        } else {
          return []
        }
      },
      transferenciaRetencaoIndevidaPorCoordenador() {
        let transferenciaRetencaoIndevidaPorCoordenador =
          this.$store.getters.transferenciaRetencaoIndevidaPorCoordenador[0]
        if (transferenciaRetencaoIndevidaPorCoordenador) {
          return transferenciaRetencaoIndevidaPorCoordenador
        } else {
          return []
        }
      },
      transferenciaRetencaoPorCoordenador() {
        let transferenciaRetencaoPorCoordenador =
          this.$store.getters.transferenciaRetencaoPorCoordenador[0]
        if (transferenciaRetencaoPorCoordenador) {
          return transferenciaRetencaoPorCoordenador
        } else {
          return []
        }
      },
      transferenciaParaSupervisorPorCoordenador() {
        let transferenciaParaSupervisorPorCoordenador =
          this.$store.getters.transferenciaParaSupervisorPorCoordenador[0]
        if (transferenciaParaSupervisorPorCoordenador) {
          return transferenciaParaSupervisorPorCoordenador
        } else {
          return []
        }
      },
      transferenciasTotaisCoordenador() {
        let transferenciasTotaisCoordenador = this.$store.getters.transferenciasTotaisCoordenador[0]
        if (transferenciasTotaisCoordenador) {
          return transferenciasTotaisCoordenador
        } else {
          return []
        }
      },
      // shortcall30PorCoordenador() {
      //   let shortcall30PorCoordenador = this.$store.getters
      //     .shortcall30PorCoordenador[0];
      //   if (shortcall30PorCoordenador) {
      //     return shortcall30PorCoordenador;
      //   } else {
      //     return [];
      //   }
      // },
      shortcall60PorCoordenador() {
        let shortcall60PorCoordenador = this.$store.getters.shortcall60PorCoordenador[0]
        if (shortcall60PorCoordenador) {
          return shortcall60PorCoordenador
        } else {
          return []
        }
      },
      desconexaoPorCoordenador() {
        let desconexaoPorCoordenador = this.$store.getters.desconexaoPorCoordenador[0]
        if (desconexaoPorCoordenador) {
          return desconexaoPorCoordenador
        } else {
          return []
        }
      },
      rechamadaDiaCoordenador() {
        let rechamadaDiaCoordenador = this.$store.getters.rechamadaDiaCoordenador[0]
        if (rechamadaDiaCoordenador) {
          return rechamadaDiaCoordenador
        } else {
          return []
        }
      },
      chamadasCoordenador() {
        let chamadasCoordenador = this.$store.getters.chamadasCoordenador[0]
        if (chamadasCoordenador) {
          return chamadasCoordenador
        } else {
          return []
        }
      },
      rechamada60minCoordenador() {
        let rechamada60minCoordenador = this.$store.getters.rechamada60minCoordenador[0]
        if (rechamada60minCoordenador) {
          return rechamada60minCoordenador
        } else {
          return []
        }
      }
    },
    methods: {
      loadTransferenciaDowngradeIndevidasPorCoordenador() {
        this.$store.dispatch('loadTransferenciaDowngradeIndevidasPorCoordenador', this.usuarioNome)
      },
      loadTransferenciaDowngradePorCoordenador() {
        this.$store.dispatch('loadTransferenciaDowngradePorCoordenador', this.usuarioNome)
      },
      loadTransferenciaMudancaDeEnderecoIndevidaPorCoordenador() {
        this.$store.dispatch(
          'loadTransferenciaMudancaDeEnderecoIndevidaPorCoordenador',
          this.usuarioNome
        )
      },
      loadTransferenciaMudancaDeEnderecoPorCoordenador() {
        this.$store.dispatch('loadTransferenciaMudancaDeEnderecoPorCoordenador', this.usuarioNome)
      },
      loadTransferenciaLinhaMudaIndevidaPorCoordenador() {
        this.$store.dispatch('loadTransferenciaLinhaMudaIndevidaPorCoordenador', this.usuarioNome)
      },
      loadTransferenciaLinhaMudaPorCoordenador() {
        this.$store.dispatch('loadTransferenciaLinhaMudaPorCoordenador', this.usuarioNome)
      },
      loadTransferenciaRetencaoIndevidaPorCoordenador() {
        this.$store.dispatch('loadTransferenciaRetencaoIndevidaPorCoordenador', this.usuarioNome)
      },
      loadTransferenciaRetencaoPorCoordenador() {
        this.$store.dispatch('loadTransferenciaRetencaoPorCoordenador', this.usuarioNome)
      },
      loadTransferenciaParaSupervisorPorCoordenador() {
        this.$store.dispatch('loadTransferenciaParaSupervisorPorCoordenador', this.usuarioNome)
      },
      loadTransferenciasTotaisCoordenador() {
        this.$store.dispatch('loadTransferenciasTotaisCoordenador', this.usuarioNome)
      },
      // loadShortcall30PorCoordenador() {
      //   this.$store.dispatch("loadShortcall30PorCoordenador", this.usuarioNome);
      // },
      loadShortcall60PorCoordenador() {
        this.$store.dispatch('loadShortcall60PorCoordenador', this.usuarioNome)
      },
      loadDesconexaoPorCoordenador() {
        this.$store.dispatch('loadDesconexaoPorCoordenador', this.usuarioNome)
      },
      loadRechamadaDiaCoordenador() {
        this.$store.dispatch('loadRechamadaDiaCoordenador', this.usuarioNome)
      },
      loadRechamada60minCoordenador() {
        this.$store.dispatch('loadRechamada60minCoordenador', this.usuarioNome)
      },
      loadChamadasCoordenador() {
        this.$store.dispatch('loadChamadasCoordenador', this.usuarioNome)
      }
    },
    created() {
      this.loadTransferenciaDowngradeIndevidasPorCoordenador()
      this.loadTransferenciaDowngradePorCoordenador()
      this.loadTransferenciaMudancaDeEnderecoIndevidaPorCoordenador()
      this.loadTransferenciaMudancaDeEnderecoPorCoordenador()
      this.loadTransferenciaLinhaMudaIndevidaPorCoordenador()
      this.loadTransferenciaLinhaMudaPorCoordenador()
      this.loadTransferenciaRetencaoIndevidaPorCoordenador()
      this.loadTransferenciaRetencaoPorCoordenador()
      this.loadTransferenciaParaSupervisorPorCoordenador()
      this.loadTransferenciasTotaisCoordenador()
      this.loadDesconexaoPorCoordenador()
      this.loadRechamadaDiaCoordenador()
      this.loadRechamada60minCoordenador()
      this.loadChamadasCoordenador()
      this.loadShortcall60PorCoordenador()
      // this.loadShortcall30PorCoordenador();
    }
  }
</script>

<style></style>
