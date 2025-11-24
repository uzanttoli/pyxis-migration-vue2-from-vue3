<template>
  <div class="card-border">
    <div class="painel-title">
      <img src="../../../assets/img/core/ranking-player.png" />
      <p style="font-size: 2.3em; text-align: center">Painel de Vendas</p>
      <div class="actions">
        <div style="display: flex; flex-direction: column; width: 33.33%">
          <label>Coordenador:</label>
          <v-autocomplete
            outlined
            dense
            solo
            label="Coordenador"
            no-data-text="Não há items"
            placeholder="Coordenador"
            hide-no-data
            :items="coordenadores"
            v-model="form.coordenadorSelecionado"
            item-text="COORDENADOR"
            item-value="COORDENADOR"
            @change="alterValue"
            class="rounded-r-xl rounded-bl-xl"
          ></v-autocomplete>
        </div>
        <div style="display: flex; flex-direction: column; width: 33.33%">
          <label>Tipo Venda:</label>
          <v-autocomplete
            outlined
            dense
            solo
            label="Tipo Venda"
            v-model="form.tipoVendaSelecionado"
            no-data-text="Não há items"
            placeholder="Tipo Venda"
            hide-no-data
            :items="['GERAL', 'GROSS']"
            @change="alterValue"
            class="rounded-r-xl rounded-bl-xl"
          ></v-autocomplete>
        </div>
        <div style="display: flex; flex-direction: column; width: 33.33%">
          <label>Agrupamento:</label>
          <v-autocomplete
            outlined
            dense
            solo
            label="Agrupamento"
            v-model="form.agrupamento"
            no-data-text="Não há items"
            placeholder="Agrupamento"
            hide-no-data
            :items="[
              { text: 'N1 S2S', value: 'NET - N1 TOTAL + SUL 2 + SP 3' },
              { text: 'RET S2S', value: 'NET - RETENCAO + SUL 2 + SP 3' }
            ]"
            item-text="text"
            item-value="value"
            @change="alterValue"
            class="rounded-r-xl rounded-bl-xl"
          ></v-autocomplete>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import config from '../../../core/config'
  export default {
    data: () => ({
      coordenadores: [],
      form: {
        tipoVendaSelecionado: 'GERAL',
        coordenadorSelecionado: 'CONSOLIDADO',
        agrupamento: 'NET - N1 TOTAL + SUL 2 + SP 3'
      }
    }),
    methods: {
      alterValue() {
        this.$emit('update:dados-ranking', this.form)
      },
      loadCoordenadoresS2S() {
        let urlData = `${config.baseUrl}api/shared/televendas/coordenadores_s2s`
        this.$api
          .get(urlData, {
            params: {
              agrupamento: this.form.agrupamento
            }
          })
          .then(res => {
            let items = res.data
            items.unshift({ COORDENADOR: 'CONSOLIDADO' })
            this.coordenadores = items
          })
      }
    },
    created() {
      this.loadCoordenadoresS2S()
    },
    watch: {
      'form.agrupamento': function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.loadCoordenadoresS2S()
        }
      }
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Orbitron&display=swap"); */
  .painel-title {
    padding: 9px;
    background: linear-gradient(45deg, #ffbc00, #ff0058);
    /* border-radius: 10px; */
    position: relative;
    color: #fff;
    font-family: 'Orbitron', sans-serif;
  }

  .card-border {
    z-index: 0;
    /* top: 50px; */
    position: relative;
    padding: 1rem;
    box-sizing: border-box;
    background: transparent;
    backdrop-filter: blur(40px);
    border-radius: 2rem 2rem;
    background-image: radial-gradient(#2121218a, #212121cc),
      linear-gradient(50deg, #ffbc00 0%, #ff0058 100%);
    background-origin: border-box;
    background-clip: content-box, border-box;
    box-shadow: 1px 1px 0.5rem #ffbc00;
    transition: all 0.5s;
    animation: pulse_3011 4s infinite;
  }

  .actions {
    display: flex;
    gap: 10px;
  }

  img {
    width: 240px;
    top: -120px;
    right: -95px;
    position: absolute;
  }
</style>
