<template>
  <div>
    <v-col>
      <v-card elevation="1">
        <title-negative-margin title="Usuários Cadastrados" icon="mdi-account-details">
          <v-col cols="2" class="pa-0 ma-0">
            <v-text-field
              v-model="search"
              outlined
              dense
              rounded
              append-icon="mdi-magnify"
              placeholder="Pesquisar"
            ></v-text-field>
          </v-col>
        </title-negative-margin>
        <v-data-table
          :headers="headers"
          :items="usuarios"
          :search="search"
          dense
          class="text-no-wrap"
          :items-per-page="20"
          :loading="loading"
          loading-text="Carregando... Tenha paciência!"
        >
          <template v-slot:item.lider="{ item }">
            <span
              :class="
                item.lider == true ? 'green--text text--accent-5' : 'red--text text--accent-4'
              "
              small
            >
              {{ status(item.lider) }}
            </span>
          </template>
          <template v-slot:item.status="{ item }">
            <span
              :class="
                item.status == true ? 'green--text text--accent-5' : 'red--text text--accent-4'
              "
              small
            >
              {{ status(item.status) }}
            </span>
          </template>
          <template v-slot:item.mapeamento_perfil="{ item }">
            <span
              :class="
                item.mapeamento_perfil == true
                  ? 'green--text text--accent-5'
                  : 'red--text text--accent-4'
              "
              small
            >
              {{ status(item.mapeamento_perfil) }}
            </span>
          </template>
          <template v-slot:item.editar_perfil="{ item }">
            <span
              :class="
                item.editar_perfil == true
                  ? 'green--text text--accent-5'
                  : 'red--text text--accent-4'
              "
              small
            >
              {{ status(item.editar_perfil) }}
            </span>
          </template>
          <template v-slot:item.excluir_post_feed="{ item }">
            <span
              :class="
                item.excluir_post_feed == true
                  ? 'green--text text--accent-5'
                  : 'red--text text--accent-4'
              "
              small
            >
              {{ status(item.excluir_post_feed) }}
            </span>
          </template>
          <template v-slot:item.editar_senha="{ item }">
            <span
              :class="
                item.editar_senha == true
                  ? 'green--text text--accent-5'
                  : 'red--text text--accent-4'
              "
              small
            >
              {{ status(item.editar_senha) }}
            </span>
          </template>
          <template v-slot:item.fixar_artigo_feed="{ item }">
            <span
              :class="
                item.fixar_artigo_feed == true
                  ? 'green--text text--accent-5'
                  : 'red--text text--accent-4'
              "
              small
            >
              {{ status(item.fixar_artigo_feed) }}
            </span>
          </template>
          <template v-slot:item.res_comen_feed="{ item }">
            <span
              :class="
                item.res_comen_feed == true
                  ? 'green--text text--accent-5'
                  : 'red--text text--accent-4'
              "
              small
            >
              {{ status(item.res_comen_feed) }}
            </span>
          </template>

          <template v-slot:item.alterar_dados="{ item }">
            <v-icon @click="dadosEditar(item)" small class="mr-2">mdi-pencil</v-icon>
            <v-icon @click="dadosEditar(item)" small>mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
    <editar-dados :abrirEdicaoUsuario="abrirEdicaoUsuario" :dados="dadosParaEditar"></editar-dados>
  </div>
</template>

<script>
  import config from '../../../../../core/config'
  import EditarDados from '../modal/EditarDados.vue'
  export default {
    components: { EditarDados },
    data: () => ({
      abrirEdicaoUsuario: false,
      search: null,
      loading: false,
      ex11: '',
      usuarios: [],
      dadosParaEditar: [],
      headers: [
        {
          text: 'almope',
          value: 'almope',
          align: 'center'
        },
        {
          text: 'usuario',
          value: 'usuario',
          align: 'center'
        },
        {
          text: 'nome',
          value: 'nome',
          align: 'center'
        },
        {
          text: 'regional',
          value: 'regional',
          align: 'center'
        },
        {
          text: 'produto',
          value: 'produto',
          align: 'center'
        },
        {
          text: 'agrupamento',
          value: 'agrupamento',
          align: 'center'
        },
        {
          text: 'grupo',
          value: 'grupo',
          align: 'center'
        },
        {
          text: 'cargo',
          value: 'cargo',
          align: 'center'
        },
        {
          text: 'email',
          value: 'email',
          align: 'center'
        },

        {
          text: 'filtro',
          value: 'filtro',
          align: 'center'
        },
        {
          text: 'nascimento',
          value: 'nascimento',
          align: 'center'
        },
        {
          text: 'lider',
          value: 'lider',
          align: 'center'
        },
        {
          text: 'status',
          value: 'status',
          align: 'center'
        },
        {
          text: 'mapeamento_perfil',
          value: 'mapeamento_perfil',
          align: 'center'
        },
        { text: 'editar_perfil', value: 'editar_perfil', align: 'center' },
        {
          text: 'excluir_post_feed',
          value: 'excluir_post_feed',
          align: 'center'
        },
        { text: 'editar_senha', value: 'editar_senha', align: 'center' },
        {
          text: 'fixar_artigo_feed',
          value: 'fixar_artigo_feed',
          align: 'center'
        },
        { text: 'res_comen_feed', value: 'res_comen_feed', align: 'center' }
        // {
        //   text: "Editar",
        //   align: "center",
        //   value: "alterar_dados",
        // },
      ]
    }),
    computed: {
      tipoAcesso() {
        return this.$store.getters.usuario.filtro
      }
    },
    methods: {
      colorItem(v) {
        if (v == true) {
          return 'green'
        }
      },
      status(v) {
        if (v == 1) {
          return 'Habilitado'
        } else {
          return 'Desabilitado'
        }
      },
      dadosEditar(v) {
        this.abrirEdicaoUsuario = true
        this.dadosParaEditar = v
      },
      async loadListaUsuarios() {
        try {
          this.loading = true
          let urlData = `${config.baseUrl}api/shared/admin/painel/usuarios/${this.tipoAcesso}`
          var res = await this.$api.get(urlData)
          this.usuarios = res.data
          this.loading = false
        } catch (error) {
          console.error(error)
        }
      }
    },
    created() {
      this.loadListaUsuarios()
    }
  }
</script>

<style></style>
