<template>
  <v-card elevation="0" class="transparent">
    <v-col class="px-0">
      <div style="display: flex; justify-content: center; align-items: center; flex-wrap: wrap">
        <v-col v-for="(item, i) in visitas" :key="i">
          <v-card elevation="2" class="mx-auto pa-2 rounded-lg">
            <p>{{ item.SEMANA }}</p>
            <div>
              <div id="info">
                <p>Qtde. Visitas: {{ item.QTDE_VOL_VISITAS }}</p>
                <p>Qtde. Improdutivas: {{ item.QTDE_IMPRODUTIVAS }}</p>
                <p>(%) Improdutivas: {{ item.PERC_IMPRODUTIVA || '0%' }}</p>
              </div>
            </div>
          </v-card>
        </v-col>
      </div>
      <div v-if="usuario.filtro == 'OPERADOR'">
        <v-col>
          <TableMinhasImprodutivas />
        </v-col>
      </div>
    </v-col>
  </v-card>
</template>
<script>
  import { DadosOnlineOperadorVisitaTecnicaService } from '@/data/services/operacoes/dadosOnline/index'
  import TableMinhasImprodutivas from '../visitaTecnica/TableMinhasImprodutivas.vue'

  export default {
    components: { TableMinhasImprodutivas },
    data: () => ({
      visitas: []
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      tipoPerfil() {
        const perfilMap = {
          OPERADOR: '1',
          SUPERVISOR: '2',
          COORDENADOR: '3'
        }
        return perfilMap[this.usuario.filtro] || ''
      }
    },
    methods: {
      async loadMinhasVisitas() {
        let res = await DadosOnlineOperadorVisitaTecnicaService.getVisitaTecnica(
          this.usuario.almope,
          this.tipoPerfil
        )
        this.visitas = res
      }
    },
    async created() {
      await this.loadMinhasVisitas()
    }
  }
</script>
<style scoped>
  p {
    margin: 0;
    padding: 0;
  }

  #info p {
    font-size: 12px;
    color: gray;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
