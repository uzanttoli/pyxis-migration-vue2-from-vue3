<template>
  <section class="table-cadastros">
    <v-data-table dense class="text-no-wrap" v-if="cadastros != ''" hide-default-footer>
      <template v-slot:header>
        <thead>
          <tr>
            <th class="text-center" v-for="(item, i) in headers" :key="i">
              {{ item.text }}
            </th>
          </tr>
        </thead>
      </template>
      <template v-slot:body>
        <tbody>
          <tr v-for="(item, i) in cadastros" :key="i">
            <td>
              <v-chip :class="colorStatus(item.STATUS_CADASTRO)" x-small text-color="white">
                {{ item.STATUS_CADASTRO }}
              </v-chip>
            </td>
            <td>{{ item.RH }}</td>
            <td>{{ item.ALMOPE }}</td>
            <td>{{ item.NOME }}</td>
            <td>{{ item.SUPERVISOR }}</td>
            <td>{{ item.GERENTE }}</td>
            <td>{{ item.CLIENTE }}</td>
            <td>{{ item.DATA_LIBERACAO }}</td>
            <td>{{ item.VINCULO }}</td>
            <td>{{ item.TIPO_ATUALIZACAO }}</td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
    <span v-else>
      <h4 class="text-center pa-4">Não há cadastros ainda!</h4>
    </span>
  </section>
</template>

<script>
  import config from '../../../../../core/config'
  export default {
    data: () => ({
      cadastros: [],
      loading: false,
      headers: [
        { text: 'Status' },
        { text: 'Matricula' },
        { text: 'Almope' },
        { text: 'Nome' },
        { text: 'Supervisor' },
        { text: 'Gerente' },
        { text: 'Cliente' },
        { text: 'Data' },
        { text: 'Vinculo' },
        { text: 'Tipo Atualização' }
      ]
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      colorStatus(value) {
        if (value == 'PENDENTE') {
          return 'orange'
        } else {
          return 'green'
        }
      },
      loadCadastros() {
        this.loading = true
        let urlData = `${config.baseUrl}api/shared/formularios/alteracao_vinculo/cadastros/${this.usuarioAlmope}`
        this.$api.get(urlData).then(res => {
          this.cadastros = res.data
          this.loading = true
        })
      }
    },
    created() {
      this.loadCadastros()
    }
  }
</script>

<style></style>
