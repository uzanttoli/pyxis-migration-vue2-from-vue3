<template>
  <div>
    <v-col>
      <v-card elevation="1">
        <title-negative-margin
          title="Controle de Perfil"
          icon="mdi-file-document-edit-outline"
        ></title-negative-margin>
        <!-- <pre>{{ dadosControlePerfil }}</pre> -->
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center">Perfil</th>
                <th class="text-center">Editar Perfil</th>
                <th class="text-center">Editar Senha</th>
                <th class="text-center">Excluir Post Feed</th>
                <th class="text-center">Fixar Artigo</th>
                <th class="text-center">Responder</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(perfil, i) in dadosControlePerfil" :key="i">
                <td>{{ perfil.TIPO_PERFIL }}</td>
                <td class="text-center">
                  <v-btn-toggle
                    id="btn-toggle"
                    dense
                    mandatory
                    v-model="perfil.EDITAR_PERFIL"
                    color="deep-purple white--text"
                    class="rounded-xl"
                  >
                    <!-- v-model="statusEditarPerfil" -->
                    <v-btn
                      :loading="carregandoStatus"
                      v-for="(item, i) in statusControlePerfil"
                      :key="i"
                      :value="item.value"
                      @click="alterarStatus(perfil, item.value)"
                    >
                      {{ item.nome }}
                    </v-btn>
                  </v-btn-toggle>
                </td>
                <td class="text-center">
                  <v-btn-toggle
                    id="btn-toggle"
                    dense
                    mandatory
                    v-model="perfil.EDITAR_SENHA"
                    color="deep-purple white--text"
                    class="rounded-xl"
                  >
                    <v-btn
                      :loading="carregandoStatus"
                      v-for="(item, i) in statusControlePerfil"
                      :key="i"
                      :value="item.value"
                      @click="alterarStatus(perfil, item.value)"
                    >
                      {{ item.nome }}
                    </v-btn>
                  </v-btn-toggle>
                </td>
                <td class="text-center">
                  <v-btn-toggle
                    id="btn-toggle"
                    dense
                    mandatory
                    v-model="perfil.EXCLUIR_POST_FEED"
                    color="deep-purple white--text"
                    class="rounded-xl"
                  >
                    <v-btn
                      :loading="carregandoStatus"
                      v-for="(item, i) in statusControlePerfil"
                      :key="i"
                      :value="item.value"
                      @click="alterarStatus(perfil, item.value)"
                    >
                      {{ item.nome }}
                    </v-btn>
                  </v-btn-toggle>
                </td>
                <td class="text-center">
                  <v-btn-toggle
                    id="btn-toggle"
                    dense
                    mandatory
                    v-model="perfil.FIXAR_ARTIGO_FEED"
                    color="deep-purple white--text"
                    class="rounded-xl"
                  >
                    <v-btn
                      :loading="carregandoStatus"
                      v-for="(item, i) in statusControlePerfil"
                      :key="i"
                      :value="item.value"
                      @click="alterarStatus(perfil, item.value)"
                    >
                      {{ item.nome }}
                    </v-btn>
                  </v-btn-toggle>
                </td>
                <td class="text-center">
                  <v-btn-toggle
                    id="btn-toggle"
                    dense
                    mandatory
                    v-model="perfil.RES_COMEN_FEED"
                    color="deep-purple white--text"
                    class="rounded-xl"
                  >
                    <v-btn
                      :loading="carregandoStatus"
                      v-for="(item, i) in statusControlePerfil"
                      :key="i"
                      :value="item.value"
                      @click="alterarStatus(perfil, item.value)"
                    >
                      {{ item.nome }}
                    </v-btn>
                  </v-btn-toggle>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </v-col>
  </div>
</template>

<script>
  import config from '../../../../core/config.js'
  export default {
    data: () => ({
      carregandoStatus: false,
      statusControlePerfil: [
        { nome: 'Sim', value: 1 },
        { nome: 'Não', value: 0 }
      ],
      dadosControlePerfil: []
    }),
    computed: {
      perfil() {
        return this.$store.getters.usuario.filtro
      },
      dateNow() {
        this.moment.locale('pt-br')
        return this.moment().format('YYYY-MM-DDTHH:mm:ss.sssZ')
      },
      ipMaquina() {
        return localStorage.getItem('ip')
      }
    },
    methods: {
      alterarStatus(dados) {
        this.carregandoStatus = true
        setTimeout(() => {
          let data = {
            ...dados,
            USUARIO_ALTERACAO: this.$store.getters.usuario.almope,
            IP_MAQUINA: this.ipMaquina
            // DATA_ALTERACAO: this.dateNow,
          }
          let urlData = `${config.baseUrl}api/shared/admin/painel/controle_perfil/`
          let getFormData = object =>
            Object.keys(object).reduce((FormData, key) => {
              FormData.append(key, object[key])
              return FormData
            }, new FormData())
          this.$api.post(urlData, getFormData(data)).then(res => {
            const Toast = this.$swal.mixin({
              toast: true,
              position: 'bottom-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: toast => {
                toast.addEventListener('mouseenter', this.$swal.stopTimer)
                toast.addEventListener('mouseleave', this.$swal.resumeTimer)
              }
            })
            Toast.fire({
              icon: 'success',
              title: res.data
            })
            this.loadDadosControlePerfil()
            this.carregandoStatus = false
          })
        }, 2500)
      },
      loadDadosControlePerfil() {
        let urlData = `${config.baseUrl}api/shared/admin/painel/controle_perfil/${this.perfil}`
        this.$api.get(urlData).then(res => {
          this.dadosControlePerfil = res.data
        })
      }
    },
    created() {
      this.loadDadosControlePerfil()
    }
  }
</script>

<style></style>
