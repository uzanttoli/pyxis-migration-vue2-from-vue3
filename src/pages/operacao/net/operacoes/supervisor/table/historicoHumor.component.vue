<template>
  <v-row>
    <v-flex>
      <v-col>
        <v-card>
          <title-negative-margin :title="title" icon="mdi-account-heart"></title-negative-margin>
          <v-data-table
            :headers="headers"
            :items="historyHumor"
            hide-default-footer
            :loading="loading"
            dense
            no-data-text="Não há dados no momento!"
          >
            <!-- Descricao da imagem não conseguir inserir, nem pegar imagem com parametro -->
            <template v-slot:header.ANIMADO="{}">
              <v-img width="45" :src="imgHumor('animado')" />
            </template>
            <template v-slot:header.BEM="{}">
              <v-img width="45" :src="imgHumor('bem')" />
            </template>
            <template v-slot:header.MUITO_BEM="{}">
              <v-img width="45" :src="imgHumor('muito-bem')" />
            </template>
            <template v-slot:header.CONFIANTE="{}">
              <v-img width="45" :src="imgHumor('confiante')" />
            </template>
            <template v-slot:header.CHATEADO="{}">
              <v-img width="45" :src="imgHumor('chateado')" />
            </template>
            <template v-slot:header.MUITO_CHATEADO="{}">
              <v-img width="45" :src="imgHumor('muito-chateado')" />
            </template>
            <template v-slot:header.NADA_BEM="{}">
              <v-img width="45" :src="imgHumor('nada-bem')" />
            </template>
            <template v-slot:header.NAO_MUITO_BEM="{}">
              <v-img width="45" :src="imgHumor('nao-muito-bem')" />
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-flex>
  </v-row>
</template>

<script>
  export default {
    name: 'table-historico-humor',
    props: {
      title: {
        type: String,
        default: 'Humor Diário'
      }
    },
    data: () => ({
      loading: false,
      interval: null,
      timeout: null,
      headers: [
        {
          text: 'Almope',
          value: 'ALMOPE',
          width: '10%',
          class: 'grey lighten-2',
          align: 'center',
          sortable: false
        },
        {
          text: 'Nome',
          value: 'NOME',
          align: 'center',
          width: '30%',
          class: 'grey lighten-3',
          sortable: false
        },
        {
          text: 'Animado',
          src: 'animado',
          value: 'ANIMADO',
          align: 'center',
          alt: 'animado',
          sortable: false
        },
        {
          text: 'Bem',
          src: 'bem',
          value: 'BEM',
          alt: 'bem',
          align: 'center',
          sortable: false
        },
        {
          text: 'Muito Bem',
          src: 'muito-bem',
          alt: 'Muito Bem',
          align: 'center',
          value: 'MUITO_BEM',
          sortable: false
        },
        {
          text: 'Confiante',
          src: 'confiante',
          align: 'center',
          alt: 'confiante',
          value: 'CONFIANTE',
          sortable: false
        },
        {
          text: 'Chateado',
          src: 'chateado',
          align: 'center',
          alt: 'chateado',
          value: 'CHATEADO',
          sortable: false
        },
        {
          text: 'Muito Chateado',
          src: 'muito-chateado',
          alt: 'Muito Chateado',
          align: 'center',
          value: 'MUITO_CHATEADO',
          sortable: false
        },
        {
          text: 'Nada Bem',
          src: 'nada-bem',
          align: 'center',
          value: 'NADA_BEM',
          alt: 'Nada Bem',
          sortable: false
        },
        {
          text: 'Não Muito Bem',
          src: 'nao-muito-bem',
          value: 'NAO_MUITO_BEM',
          align: 'center',
          alt: 'Não muito bem',
          sortable: false
        }
      ]
    }),
    computed: {
      usuarioPiloto() {
        let usuarioPiloto = this.$store.getters.usuarioPiloto[0]
        if (usuarioPiloto) {
          return usuarioPiloto
        }
        return []
      },
      usuarioNome() {
        return this.$store.getters.usuario.nome
      },
      historyHumor() {
        return this.$store.getters.historyHumor
      }
    },
    methods: {
      imgHumor(imgName) {
        if (imgName) return require(`@/assets/img/humor/${imgName}.png`)
        else return require(`@/assets/img/humor/sem-humor.png`)
      },
      loadHistoryHumor() {
        return this.$store.dispatch('loadHistoryHumor', this.usuarioNome)
      }
    },
    created() {
      this.loadHistoryHumor()
    }
  }
</script>

<style scoped></style>
