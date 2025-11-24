<template>
  <div>
    <v-col>
      <v-card elevation="1">
        <title-negative-margin title="Criar Perfil" icon="mdi-account-plus">
          <v-col cols="4" class="pa-0 ma-0">
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-text-field
                  outlined
                  v-bind="attrs"
                  v-on="on"
                  dense
                  append-icon="mdi-magnify"
                  rounded
                  label="Almope Espelho"
                  class="mb-n4"
                  v-model="almopeEspelho"
                  @keyup.enter="loadDadosEspelho()"
                ></v-text-field>
              </template>
              <span>Pesquise com um almope a regional e o perfil. [Pressione Enter]</span>
            </v-tooltip>
          </v-col>
        </title-negative-margin>
        <v-divider></v-divider>
        <v-form v-model="valid">
          <v-container>
            <v-col>
              <v-row>
                <v-col cols="6" class="pa-0 ma-0">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ attrs, on }">
                      <v-text-field
                        outlined
                        v-bind="attrs"
                        v-on="on"
                        rounded
                        label="Almope Manipulado"
                        dense
                        class="mr-2"
                        v-model="formCadastroUsuario.almopeManipulado"
                        @keyup.enter="loadDadosAlmopeManipulado()"
                        v-mask="masks.almope"
                      ></v-text-field>
                    </template>
                    <span>
                      Preencha o nome e usuario com dados já existentes. [Pressione Enter]
                    </span>
                  </v-tooltip>
                </v-col>
                <v-col cols="6" class="pa-0 ma-0">
                  <v-text-field
                    outlined
                    rounded
                    label="Usuario"
                    dense
                    v-model="formCadastroUsuario.usuario"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" class="pa-0 ma-0">
                  <v-text-field
                    outlined
                    rounded
                    label="Nome Completo"
                    class="mr-2 mt-n3"
                    dense
                    v-model="formCadastroUsuario.nomeCompleto"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" class="pa-0 ma-0">
                  <v-autocomplete
                    no-data-text="Regional não encontrada!"
                    outlined
                    dense
                    rounded
                    label="Regional"
                    :items="regionais"
                    item-text="REGIONAL"
                    clearable
                    class="mt-n3"
                    autocomplete="off"
                    hide-details
                    v-model="formCadastroUsuario.regionalSelecionada"
                    hide-selected
                  ></v-autocomplete>
                </v-col>
                <v-col cols="6" class="pa-0 ma-0">
                  <v-text-field
                    outlined
                    rounded
                    label="Senha"
                    dense
                    class="mr-2 mt-n3"
                    v-model="passwordDefault"
                    type="password"
                    autocomplete="off"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" class="pa-0 ma-0">
                  <v-select
                    outlined
                    rounded
                    label="Id Perfil"
                    dense
                    class="mt-n3"
                    :items="tipoPerfil"
                    item-text="TIPO_PERFIL"
                    item-value="TIPO_PERFIL"
                    v-model="filtroSelecionado"
                  ></v-select>
                </v-col>
                <v-col cols="12" class="pa-0 ma-0">
                  <v-text-field
                    outlined
                    rounded
                    label="Email"
                    class="mt-n3"
                    dense
                    v-model="formCadastroUsuario.email"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" class="pa-0 ma-0">
                  <v-select
                    outlined
                    rounded
                    label="Status"
                    dense
                    class="mt-n3 mr-2"
                    :items="status"
                    item-text="text"
                    item-value="value"
                    v-model="formCadastroUsuario.statusSelecionado"
                  ></v-select>
                </v-col>
                <v-col cols="6" class="pa-0 ma-0">
                  <v-select
                    outlined
                    rounded
                    label="Lider"
                    dense
                    class="mt-n3"
                    :items="lider"
                    item-text="text"
                    item-value="value"
                    v-model="formCadastroUsuario.liderSelecionado"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row class="mt-n3">
                <v-col>
                  <v-btn rounded block color="success" class="mt-n3 mb-n2" @click="criarUsuario()">
                    {{
                      formCadastroUsuario.senha
                        ? `Sua senha: ${this.formCadastroUsuario.senha}`
                        : `Criar`
                    }}
                  </v-btn>
                  <!-- :disabled="!this.formIsValid()" -->
                </v-col>
                <v-scroll-x-transition>
                  <v-col v-if="clearformIsValid()">
                    <v-btn
                      rounded
                      block
                      color="error"
                      class="mt-n3 mb-n2"
                      :disabled="!this.clearformIsValid()"
                      @click="clearForm()"
                    >
                      Limpar
                    </v-btn>
                  </v-col>
                </v-scroll-x-transition>
              </v-row>
            </v-col>
          </v-container>
        </v-form>
      </v-card>
    </v-col>
  </div>
</template>

<script>
  import config from '../../../../core/config'
  import masks from '../../../../shared/masks/masks.js'
  export default {
    data: () => ({
      valid: false,
      almopeEspelho: '',
      filtroSelecionado: '',
      formCadastroUsuario: {
        statusSelecionado: '',
        liderSelecionado: '',
        regionalSelecionada: '',
        almopeManipulado: '',
        usuario: '',
        email: '',
        senha: '',
        nomeCompleto: '',
        senhaGlobal: 'adm.cco@acesso_portal#19'
      },
      formCadastroUsuarioDefault: {
        statusSelecionado: '',
        liderSelecionado: '',
        regionalSelecionada: '',
        almopeManipulado: '',
        usuario: '',
        email: '',
        senha: '',
        nomeCompleto: '',
        senhaGlobal: 'adm.cco@acesso_portal#19' //Inserir no arquivo .env
      },
      regionais: [],
      tipoPerfil: [],
      // dadosEspelho: [],
      status: [
        { text: 'Habilitado', value: 1 },
        { text: 'Desabilitado', value: 0 }
      ],
      lider: [
        { text: 'Sim', value: 1 },
        { text: 'Não', value: 0 }
      ]
    }),
    computed: {
      masks() {
        return masks
      },
      passwordDefault() {
        let almope = this.formCadastroUsuario.almopeManipulado
        let date = new Date()

        let year = date.getFullYear().toString()
        return `${almope}#${year}`
      }
    },
    methods: {
      clearForm() {
        return (
          Object.assign(this.formCadastroUsuario, this.formCadastroUsuarioDefault),
          (this.filtroSelecionado = '')
        )
      },
      clearformIsValid() {
        return (
          this.formCadastroUsuario.nomeCompleto ||
          this.formCadastroUsuario.statusSelecionado ||
          this.formCadastroUsuario.liderSelecionado ||
          this.formCadastroUsuario.regionalSelecionada ||
          this.formCadastroUsuario.almopeManipulado ||
          this.formCadastroUsuario.usuario ||
          this.formCadastroUsuario.email ||
          this.filtroSelecionado
        )
      },
      formIsValid() {
        return (
          this.formCadastroUsuario.nomeCompleto &&
          this.formCadastroUsuario.statusSelecionado &&
          this.formCadastroUsuario.liderSelecionado &&
          this.formCadastroUsuario.regionalSelecionada &&
          this.formCadastroUsuario.almopeManipulado &&
          this.formCadastroUsuario.usuario &&
          // this.formCadastroUsuario.email &&
          this.filtroSelecionado
        )
      },
      tratamentoFiltro(value) {
        if (value == 'ADMINISTRADOR') return 1
        else if (value == 'GERENTE') return 2
        else if (value == 'COORDENADOR') return 3
        else if (value == 'SUPERVISOR') return 4
        else if (value == 'OPERADOR') return 5
        else if (value == 'STAFF') return 6
      },
      async criarUsuario() {
        try {
          let data = {
            ...this.formCadastroUsuario,
            senha: this.passwordDefault,
            idPerfil: this.tratamentoFiltro(this.filtroSelecionado),
            criadoPor: this.$store.getters.usuario.almope
          }
          let urlData = `${config.baseUrl}api/shared/admin/painel/criar_usuario`
          let getFormData = object =>
            Object.keys(object).reduce((FormData, key) => {
              FormData.append(key, object[key])
              return FormData
            }, new FormData())
          var res = await this.$api.post(urlData, getFormData(data))
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
        } catch (error) {
          if (error.response.status) {
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
              icon: 'error',
              title: error.response.data
            })
          }
        }
      },
      async loadRegionais() {
        let urlData = `${config.baseUrl}api/shared/meus_dados/perfil/regionais/`
        var res = await this.$api.get(urlData)
        this.regionais = res.data
      },
      loadTipoPerfil() {
        let urlData = `${config.baseUrl}api/shared/admin/painel/listar_tipo_perfil/`
        this.$api.get(urlData).then(res => {
          this.tipoPerfil = res.data
        })
      },
      async loadDadosEspelho() {
        try {
          let urlData = `${config.baseUrl}api/shared/admin/painel/usuario_espelho/${this.almopeEspelho}`
          var res = await this.$api.get(urlData)
          this.dadosEspelho = res.data
          this.formCadastroUsuario.regionalSelecionada = res.data[0]?.REGIONAL
          this.filtroSelecionado = res.data[0]?.FILTRO
          this.formCadastroUsuario.statusSelecionado = res.data[0]?.STATUS
          this.formCadastroUsuario.liderSelecionado = res.data[0]?.LIDER
        } catch (error) {
          if (error.response.status) {
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
              icon: 'warning',
              title: error.response.data
            })
          }
        }
      },
      async loadDadosAlmopeManipulado() {
        try {
          let urlData = `${config.baseUrl}api/shared/admin/painel/consultar_nome/${this.formCadastroUsuario.almopeManipulado}`
          var res = await this.$api.get(urlData)
          this.formCadastroUsuario.nomeCompleto = res.data[0]?.NOME ?? ''
          this.formCadastroUsuario.usuario = `@${res.data[0]?.NOME}` ?? ''
        } catch (error) {
          if (error.response.status) {
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
              icon: 'warning',
              title: error.response.data
            })
          }
        }
      }
    },
    created() {
      this.loadRegionais()
      this.loadTipoPerfil()
    }
  }
</script>

<style></style>
