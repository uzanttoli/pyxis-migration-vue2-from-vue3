<template>
  <div>
    <v-col cols="6">
      <h4>Minhas Tratativas</h4>
      <div
        style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 10px;
        "
      >
        <ol v-for="(item, i) in minhasTratativas" :key="i">
          <li>
            <div style="display: flex; align-items: center; margin: 10px 0">
              <p class="text-h6">
                <v-icon size="16" color="white">fa-solid fa-receipt</v-icon>
                Num. Solicitação: {{ item.NUM_SOLICITACAO }}
              </p>
            </div>
            <div>
              <h5>
                <v-icon size="16" color="white">fa-solid fa-align-right</v-icon>
                Detalhes da Tratativas:
              </h5>
              <div>
                <p>Tipo de Solicitação: {{ item.TIPO_SOLICITACAO }}</p>
                <p>Motivo da Solicitação: {{ item.MOTIVO_SOLICITACAO }}</p>
                <p>
                  Solicitado para: {{ item.AGRUPAMENTO_SOLICITACAO }} | Produto:
                  {{ item.PRODUTO_SOLICITACAO }}
                </p>
              </div>
              <div style="margin: 10px 0">
                <v-btn
                  class="mr-3"
                  small
                  :to="{
                    name: 'TratativaProjectManager',
                    params: { id: item.NUM_SOLICITACAO }
                  }"
                >
                  Acessar
                </v-btn>
              </div>
            </div>
          </li>
          <!-- <a >
      </a> -->
        </ol>
      </div>
      <!-- <v-data-table
      :headers="headersMinhasTratativas"
      no-results-text="Não há tratativas"
      :items="minhasTratativas"
      dense
    ></v-data-table> -->
    </v-col>
  </div>
</template>

<script>
  import config from '../../../../core/config'
  export default {
    data: () => ({
      headers: [{ text: '123' }],
      minhasTratativas: []
    }),
    computed: {
      headersMinhasTratativas() {
        let dados = this.minhasTratativas[0]
        return Object.keys({ ...dados }).map(el => {
          return {
            text: el,
            value: el,
            align: 'center'
          }
        })
      }
    },
    methods: {
      loadMinhasTratativas() {
        let urlData = `${config.baseUrl}api/shared/project_manager/gestao/minhas_tratativas/${this.$store.getters.usuario.nome}`
        this.$api.get(urlData).then(res => {
          this.minhasTratativas = res.data
        })
      }
    },
    created() {
      this.loadMinhasTratativas()
    }
  }
</script>

<style scoped>
  ol {
    background-image: linear-gradient(290deg, #56d7e0, #902790);
    margin: 10px;
    border-radius: 10px;
    list-style: none;
    min-width: 350px;
    color: #fff;
  }

  li {
    padding: 5px;
    margin: 0 0 0 0;
  }

  h5 {
    margin-bottom: 5px;
  }

  p {
    padding: 0;
    margin: 2px 0;
    font-size: 0.7em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  a {
    color: #fff;
    text-decoration: none;
  }
</style>
