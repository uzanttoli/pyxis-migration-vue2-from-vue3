<template>
  <v-sheet v-if="chamadasAtendidasSupervisorExtratoNet.CHAMADAS_ATENDIDAS">
    <title-background>
      <template v-slot:title>
        <v-icon color="white" class="mr-2">mdi-weather-cloudy-clock</v-icon>
        Meu Resultado Online
      </template>
      <template v-slot:subtitle>Dados atualizados a cada 30 minutos.</template>
    </title-background>
    <!---->
    <v-col style="margin-top: -50px">
      <v-row>
        <card-css
          minWidthCard="300"
          title="Chamadas"
          :dadosCampo1="chamadasAtendidasSupervisorExtratoNet.CHAMADAS_ATENDIDAS"
          :dadosCampo2="chamadasAtendidasSupervisorExtratoNet.CHAMADAS_IDENTIFICADAS"
        ></card-css>
        <card-css
          minWidthCard="300"
          title="Rechamada 60min"
          :dadosCampo1="rechamadaSupervisorExtratoNet.PERC_RECH_1H | percentage"
          :dadosCampo2="rechamadaSupervisorExtratoNet.RECHAMADA"
        ></card-css>
        <card-css
          minWidthCard="300"
          title="Rechamada Dia"
          :dadosCampo1="rechamadaDiaSupervisorExtratoNet.PERC_RECH_DIA | percentage"
          :dadosCampo2="rechamadaDiaSupervisorExtratoNet.RECHAMADA_DIA"
        ></card-css>
        <card-css
          minWidthCard="300"
          title="Desconexão"
          :dadosCampo1="desconexaoSupervisorExtratoNet.PERC_DESCONEXAO | percentage"
          :dadosCampo2="desconexaoSupervisorExtratoNet.DESCONECTADA"
        ></card-css>
        <!-- <card-css
          minWidthCard="300"
          title="Shortcall 30s"
          :dadosCampo1="
            shortcall30SupervisorExtratoNet.PERC_SHORTCALL30 | percentage
          "
          :dadosCampo2="shortcall30SupervisorExtratoNet.SHORTCALL30"
        >
        </card-css> -->
        <card-css
          minWidthCard="300"
          title="ShortCall até 60s"
          :dadosCampo1="shortcallSupervisorExtratoNet.PERC_SHORT_ATE_60s | percentage"
          :dadosCampo2="shortcallSupervisorExtratoNet.SHORTCALLS_ATE_60s"
        ></card-css>
        <card-css
          minWidthCard="300"
          title="Transferências Totais"
          :dadosCampo1="transferenciaTotalSupervisorExtratoNet.PERC_TRASNF_TOTAL | percentage"
          :dadosCampo2="transferenciaTotalSupervisorExtratoNet.TRANSF_TOTAL"
        ></card-css>
        <card-css
          minWidthCard="300"
          title="Transferências Supervisor"
          :dadosCampo1="transferenciaSupervisor.PERC_TRANSF_SUPERVISOR | percentage"
          :dadosCampo2="transferenciaSupervisor.TRANSF_SUPERVISOR"
        ></card-css>
        <!---->
        <card-css
          minWidthCard="300"
          title="Transferência Retenção"
          :dadosCampo1="transferenciaRetencaoSupervisorExtratoNet.PERC_TRASNF_RET | percentage"
          :dadosCampo2="transferenciaRetencaoSupervisorExtratoNet.TRANSF_RET"
        ></card-css>
        <card-css
          minWidthCard="300"
          title="Transferência Indevida"
          :dadosCampo1="
            transferenciaIndevidaSupervisorExtratoNet.PERC_TRASNF_RET_INDEVIDA | percentage
          "
          :dadosCampo2="transferenciaIndevidaSupervisorExtratoNet.TRANSF_RET_INDEVIDA"
        ></card-css>
        <card-css
          minWidthCard="300"
          title="Transferência Linha Muda"
          :dadosCampo1="transferenciaMudaSupervisorExtratoNet.PERC_TRASNF_MUDA | percentage"
          :dadosCampo2="transferenciaMudaSupervisorExtratoNet.TRANSF_MUDA"
        ></card-css>
        <card-css
          minWidthCard="300"
          title="Transf. Linha Muda Indevida"
          :dadosCampo1="
            transferenciaMudaIndevidaSupervisorExtratoNet.PERC_TRASNF_MUDA_INDEVIDA | percentage
          "
          :dadosCampo2="transferenciaMudaIndevidaSupervisorExtratoNet.TRANSF_MUDA_INDEVIDA"
        ></card-css>
        <card-css
          minWidthCard="300"
          title="Transf. Downgrade"
          :dadosCampo1="
            transferenciaDowngradeSupervisorExtratoNet.PERC_TRASNF_DOWNGRADE | percentage
          "
          :dadosCampo2="transferenciaDowngradeSupervisorExtratoNet.TRANSF_DOWNGRADE"
        ></card-css>
        <card-css
          minWidthCard="300"
          title="Transf. Downgrade Indevida"
          :dadosCampo1="
            transferenciaDowngradeIndevidaSupervisorExtratoNet.PERC_TRANSF_DOWNGRADE_INDEVIDA
              | percentage
          "
          :dadosCampo2="
            transferenciaDowngradeIndevidaSupervisorExtratoNet.TRANSF_DOWNGRADE_INDEVIDA
          "
        ></card-css>
        <card-css
          minWidthCard="300"
          title="Transf. Mudança de Endereço"
          :dadosCampo1="
            transferenciaMudancaEnderecoSupervisorExtratoNet.PERC_TRANSF_ENDERECO | percentage
          "
          :dadosCampo2="transferenciaMudancaEnderecoSupervisorExtratoNet.TRANSF_ENDERECO"
        ></card-css>
        <card-css
          minWidthCard="300"
          title="Transf. Endereço Indevido"
          :dadosCampo1="
            transferenciaMudancaEnderecoIndevidaSupervisorExtratoNet.PERC_TRANSF_ENDERECO_INDEVIDA
              | percentage
          "
          :dadosCampo2="
            transferenciaMudancaEnderecoIndevidaSupervisorExtratoNet.TRANSF_ENDERECO_INDEVIDA
          "
        ></card-css>
      </v-row>
    </v-col>
  </v-sheet>
</template>

<script>
  import cardCss from '@/shared/components/cards/cardSubTitle.component.vue'
  import titleBackground from '@/shared/components/cards/cardTituloPaginaComFundo.vue'
  export default {
    name: 'card-resultado-online',
    components: {
      cardCss,
      titleBackground
    },
    data: () => ({
      // interval: null,
    }),
    computed: {
      transferenciaSupervisor() {
        let transferenciaSupervisor = this.$store.getters.transferenciaSupervisor[0]
        if (transferenciaSupervisor) {
          return transferenciaSupervisor
        }
        return []
      },
      transferenciaTotalSupervisorExtratoNet() {
        let transferenciaTotalSupervisorExtratoNet =
          this.$store.getters.transferenciaTotalSupervisorExtratoNet[0]
        if (transferenciaTotalSupervisorExtratoNet) {
          return transferenciaTotalSupervisorExtratoNet
        }
        return []
      },
      // shortcall30SupervisorExtratoNet() {
      //   let shortcall30SupervisorExtratoNet = this.$store.getters
      //     .shortcall30SupervisorExtratoNet[0];
      //   if (shortcall30SupervisorExtratoNet) {
      //     return shortcall30SupervisorExtratoNet;
      //   }
      //   return [];
      // },
      desconexaoSupervisorExtratoNet() {
        let desconexaoSupervisorExtratoNet = this.$store.getters.desconexaoSupervisorExtratoNet[0]
        if (desconexaoSupervisorExtratoNet) {
          return desconexaoSupervisorExtratoNet
        }
        return []
      },
      usuarioNome() {
        return this.$store.getters.usuario.nome
      },
      chamadasAtendidasSupervisorExtratoNet() {
        let chamadasAtendidasSupervisorExtratoNet =
          this.$store.getters.chamadasAtendidasSupervisorExtratoNet[0]
        if (chamadasAtendidasSupervisorExtratoNet) {
          return chamadasAtendidasSupervisorExtratoNet
        }
        return []
      },
      rechamadaSupervisorExtratoNet() {
        let rechamadaSupervisorExtratoNet = this.$store.getters.rechamadaSupervisorExtratoNet[0]
        if (rechamadaSupervisorExtratoNet) {
          return rechamadaSupervisorExtratoNet
        }
        return []
      },
      rechamadaDiaSupervisorExtratoNet() {
        let rechamadaDiaSupervisorExtratoNet =
          this.$store.getters.rechamadaDiaSupervisorExtratoNet[0]
        if (rechamadaDiaSupervisorExtratoNet) {
          return rechamadaDiaSupervisorExtratoNet
        }
        return []
      },
      shortcallSupervisorExtratoNet() {
        let shortcallSupervisorExtratoNet = this.$store.getters.shortcallSupervisorExtratoNet[0]
        if (shortcallSupervisorExtratoNet) {
          return shortcallSupervisorExtratoNet
        }
        return []
      },
      transferenciaRetencaoSupervisorExtratoNet() {
        let transferenciaRetencaoSupervisorExtratoNet =
          this.$store.getters.transferenciaRetencaoSupervisorExtratoNet[0]
        if (transferenciaRetencaoSupervisorExtratoNet) {
          return transferenciaRetencaoSupervisorExtratoNet
        }
        return []
      },
      transferenciaIndevidaSupervisorExtratoNet() {
        let transferenciaIndevidaSupervisorExtratoNet =
          this.$store.getters.transferenciaIndevidaSupervisorExtratoNet[0]
        if (transferenciaIndevidaSupervisorExtratoNet) {
          return transferenciaIndevidaSupervisorExtratoNet
        }
        return []
      },
      transferenciaMudaSupervisorExtratoNet() {
        let transferenciaMudaSupervisorExtratoNet =
          this.$store.getters.transferenciaMudaSupervisorExtratoNet[0]
        if (transferenciaMudaSupervisorExtratoNet) {
          return transferenciaMudaSupervisorExtratoNet
        }
        return []
      },
      transferenciaMudaIndevidaSupervisorExtratoNet() {
        let transferenciaMudaIndevidaSupervisorExtratoNet =
          this.$store.getters.transferenciaMudaIndevidaSupervisorExtratoNet[0]
        if (transferenciaMudaIndevidaSupervisorExtratoNet) {
          return transferenciaMudaIndevidaSupervisorExtratoNet
        }
        return []
      },
      transferenciaDowngradeSupervisorExtratoNet() {
        let transferenciaDowngradeSupervisorExtratoNet =
          this.$store.getters.transferenciaDowngradeSupervisorExtratoNet[0]
        if (transferenciaDowngradeSupervisorExtratoNet) {
          return transferenciaDowngradeSupervisorExtratoNet
        }
        return []
      },
      transferenciaDowngradeIndevidaSupervisorExtratoNet() {
        let transferenciaDowngradeIndevidaSupervisorExtratoNet =
          this.$store.getters.transferenciaDowngradeIndevidaSupervisorExtratoNet[0]
        if (transferenciaDowngradeIndevidaSupervisorExtratoNet) {
          return transferenciaDowngradeIndevidaSupervisorExtratoNet
        }
        return []
      },
      transferenciaMudancaEnderecoSupervisorExtratoNet() {
        let transferenciaMudancaEnderecoSupervisorExtratoNet =
          this.$store.getters.transferenciaMudancaEnderecoSupervisorExtratoNet[0]
        if (transferenciaMudancaEnderecoSupervisorExtratoNet) {
          return transferenciaMudancaEnderecoSupervisorExtratoNet
        }
        return []
      },
      transferenciaMudancaEnderecoIndevidaSupervisorExtratoNet() {
        let transferenciaMudancaEnderecoIndevidaSupervisorExtratoNet =
          this.$store.getters.transferenciaMudancaEnderecoIndevidaSupervisorExtratoNet[0]
        if (transferenciaMudancaEnderecoIndevidaSupervisorExtratoNet) {
          return transferenciaMudancaEnderecoIndevidaSupervisorExtratoNet
        }
        return []
      }
    },
    methods: {
      loadTransferenciaSupervisor() {
        return this.$store.dispatch('loadTransferenciaSupervisor', this.usuarioNome)
      },
      loadTransferenciaTotalSupervisorExtratoNet() {
        return this.$store.dispatch('loadTransferenciaTotalSupervisorExtratoNet', this.usuarioNome)
      },
      // loadShortcall30SupervisorExtratoNet() {
      //   return this.$store.dispatch(
      //     "loadShortcall30SupervisorExtratoNet",
      //     this.usuarioNome
      //   );
      // },
      loadDesconexaoSupervisorExtratoNet() {
        return this.$store.dispatch('loadDesconexaoSupervisorExtratoNet', this.usuarioNome)
      },
      loadChamadasAtendidasSupervisorExtratoNet() {
        return this.$store.dispatch('loadChamadasAtendidasSupervisorExtratoNet', this.usuarioNome)
      },
      loadRechamadaSupervisorExtratoNet() {
        return this.$store.dispatch('loadRechamadaSupervisorExtratoNet', this.usuarioNome)
      },
      loadRechamadaDiaSupervisorExtratoNet() {
        return this.$store.dispatch('loadRechamadaDiaSupervisorExtratoNet', this.usuarioNome)
      },
      loadShortcallSupervisorExtratoNet() {
        return this.$store.dispatch('loadShortcallSupervisorExtratoNet', this.usuarioNome)
      },
      loadTransferenciaRetencaoSupervisorExtratoNet() {
        return this.$store.dispatch(
          'loadTransferenciaRetencaoSupervisorExtratoNet',
          this.usuarioNome
        )
      },
      loadTransferenciaIndevidaSupervisorExtratoNet() {
        return this.$store.dispatch(
          'loadTransferenciaIndevidaSupervisorExtratoNet',
          this.usuarioNome
        )
      },
      loadTransferenciaMudaSupervisorExtratoNet() {
        return this.$store.dispatch('loadTransferenciaMudaSupervisorExtratoNet', this.usuarioNome)
      },
      loadTransferenciaMudaIndevidaSupervisorExtratoNet() {
        return this.$store.dispatch(
          'loadTransferenciaMudaIndevidaSupervisorExtratoNet',
          this.usuarioNome
        )
      },
      loadTransferenciaDowngradeSupervisorExtratoNet() {
        return this.$store.dispatch(
          'loadTransferenciaDowngradeSupervisorExtratoNet',
          this.usuarioNome
        )
      },
      loadTransferenciaDowngradeIndevidaSupervisorExtratoNet() {
        return this.$store.dispatch(
          'loadTransferenciaDowngradeIndevidaSupervisorExtratoNet',
          this.usuarioNome
        )
      },
      loadTransferenciaMudancaEnderecoSupervisorExtratoNet() {
        return this.$store.dispatch(
          'loadTransferenciaMudancaEnderecoSupervisorExtratoNet',
          this.usuarioNome
        )
      },
      loadTransferenciaMudancaEnderecoIndevidaSupervisorExtratoNet() {
        return this.$store.dispatch(
          'loadTransferenciaMudancaEnderecoIndevidaSupervisorExtratoNet',
          this.usuarioNome
        )
      }
    },
    created() {
      this.loadChamadasAtendidasSupervisorExtratoNet()
      this.loadRechamadaSupervisorExtratoNet()
      this.loadRechamadaDiaSupervisorExtratoNet()
      this.loadShortcallSupervisorExtratoNet()
      this.loadTransferenciaRetencaoSupervisorExtratoNet()
      this.loadTransferenciaIndevidaSupervisorExtratoNet()
      this.loadTransferenciaMudaSupervisorExtratoNet()
      this.loadTransferenciaMudaIndevidaSupervisorExtratoNet()
      this.loadTransferenciaDowngradeSupervisorExtratoNet()
      this.loadTransferenciaDowngradeIndevidaSupervisorExtratoNet()
      this.loadTransferenciaMudancaEnderecoSupervisorExtratoNet()
      this.loadTransferenciaMudancaEnderecoIndevidaSupervisorExtratoNet()
      this.loadDesconexaoSupervisorExtratoNet()
      // this.loadShortcall30SupervisorExtratoNet();
      this.loadTransferenciaTotalSupervisorExtratoNet()
      this.loadTransferenciaSupervisor()
      // this.interval = setInterval(() => {}, 15 * 60 * 1000);
    }
    // beforeDestroy() {
    //   clearInterval(this.interval);
    // },
  }
</script>

<style></style>
