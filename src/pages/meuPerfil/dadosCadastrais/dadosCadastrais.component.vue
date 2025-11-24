<template>
  <v-container>
    <v-row justify="end">
      <v-col class="mb-n10 mt-3" cols="2" v-if="usuario.filtro == 'ADMINISTRADOR'">
        <v-text-field
          v-if="editarPerfil"
          label="Pesquisar almope"
          outlined
          placeholder="Pesquisar almope"
          dense
          messages="Pressione a tecla enter para buscar usuario!"
          prepend-inner-icon="mdi-magnify"
          @keyup.enter="loadDadosCadastrais()"
          v-model="pesquisar_user"
          v-mask="[masks.almope]"
        ></v-text-field>
      </v-col>
    </v-row>
    <form @submit.prevent="saveDadosAtualizado">
      <v-row>
        <v-col cols="12">
          <v-card width="100%" class="mx-auto mt-10 rounded-xl" height="100%">
            <v-card-title>
              <i class="fa-solid fa-user mr-2"></i>
              Informações do usuário
              <v-spacer></v-spacer>
            </v-card-title>
            <v-divider></v-divider>
            <v-col cols="12">
              <v-row align="center" class="justify-space-around">
                <v-col cols="3">
                  <label>Almope:</label>
                  <v-text-field
                    placeholder="Almope"
                    readonly
                    outlined
                    hide-details
                    dense
                    v-model="formDadosCadastrais.almope"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <label>Nome:</label>
                  <v-text-field
                    placeholder="Nome"
                    readonly
                    outlined
                    hide-details
                    dense
                    v-model="formDadosCadastrais.nome"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <label>Superior Imediato:</label>
                  <v-text-field
                    placeholder="Superior Imediato"
                    dense
                    hide-details
                    readonly
                    outlined
                    v-model="formDadosCadastrais.superior1"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <label>Usuário:</label>
                  <v-text-field
                    placeholder="Usuário"
                    dense
                    hide-details
                    outlined
                    :disabled="pesquisar_user != '' && editarPerfil != 1 ? true : false"
                    v-model="formDadosCadastrais.usuario"
                  ></v-text-field>
                </v-col>

                <v-col cols="3">
                  <label>Senha:</label>
                  <v-text-field
                    placeholder="Sua senha é pessoal!"
                    dense
                    hide-details
                    type="password"
                    v-model="formDadosCadastrais.senha"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <label>Idioma:</label>
                  <v-select
                    dense
                    outlined
                    hide-details
                    :items="items_idioma"
                    v-model="formDadosCadastrais.idioma"
                    no-data-text="Não há idiomas disponiveis!"
                    :disabled="pesquisar_user != '' && editarPerfil != 1 ? true : false"
                  ></v-select>
                </v-col>

                <v-col cols="3">
                  <label>Localidade:</label>
                  <v-text-field
                    dense
                    outlined
                    hide-details
                    placeholder="Aracaju"
                    readonly
                    v-model="formDadosCadastrais.localidade"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <label>Email:</label>
                  <v-text-field
                    dense
                    outlined
                    hide-details
                    placeholder="email@almavivadobrasil.com.br"
                    v-model="formDadosCadastrais.email"
                    type="email"
                    :disabled="pesquisar_user != '' && editarPerfil != 1 ? true : false"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <label>Bio:</label>
                  <v-textarea
                    outlined
                    hide-details
                    placeholder="Escreva algo sobre você!"
                    rows="4"
                    counter="100"
                    :disabled="pesquisar_user != '' && editarPerfil != 1 ? true : false"
                    v-model="formDadosCadastrais.bio"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-col>
          </v-card>
        </v-col>
        <v-col cols="6" sm="12" xl="6" class="mt-10">
          <v-card class="mx-auto rounded-xl">
            <v-card-title>
              <i class="fa-solid fa-users-gear mr-2"></i>
              Informações Complementares
            </v-card-title>
            <v-divider></v-divider>
            <v-col>
              <v-row class="d-flex pa-2" align="center">
                <v-col cols="4">
                  <v-text-field
                    outlined
                    label="Minha permissão é de:"
                    dense
                    v-model="minha_permisao"
                    readonly
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="4" v-if="usuario.filtro == 'ADMINISTRADOR'">
                  <v-select
                    label="Mudar permissão para:"
                    outlined
                    :disabled="editarPerfil != 1"
                    dense
                    :items="filtro_permisao"
                    v-model="formDadosCadastrais.id_perfil"
                    item-text="TIPO_PERFIL"
                    item-value="ID_PERFIL"
                    hide-details
                  ></v-select>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    outlined
                    dense
                    label="Meu status é:"
                    :value="formDadosCadastrais.status == 1 ? 'Ativo' : 'Inativo'"
                    readonly
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="4" v-if="usuario.filtro == 'ADMINISTRADOR'">
                  <v-select
                    outlined
                    dense
                    label="Mudar Status para:"
                    v-model="formDadosCadastrais.status"
                    :disabled="editarPerfil != 1"
                    :items="items_status"
                    item-text="text"
                    hide-details
                    item-value="value"
                  ></v-select>
                </v-col>
                <v-col cols="4" v-if="usuario.filtro == 'ADMINISTRADOR'">
                  <v-select
                    outlined
                    dense
                    label="Permitir Inativação"
                    :disabled="editarPerfil != 1"
                    :items="items_inativacao"
                    hide-details
                    item-text="text"
                    item-value="value"
                    v-model="formDadosCadastrais.permitir_inativacao"
                  ></v-select>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="Regional"
                    multiple
                    outlined
                    dense
                    hide-details
                    readonly
                    v-model="formDadosCadastrais.regional"
                  ></v-text-field>
                </v-col>
                <v-col cols="4" v-if="usuario.filtro == 'ADMINISTRADOR'">
                  <v-select
                    outlined
                    dense
                    hide-details
                    label="Regional fixa"
                    :items="items_regional_fixa"
                    item-text="text"
                    item-value="value"
                    :disabled="editarPerfil != 1"
                    v-model="formDadosCadastrais.regional_fixa"
                  ></v-select>
                </v-col>
                <v-col
                  :cols="formDadosCadastrais.regional_fixa == 1 ? '4' : '8'"
                  v-if="usuario.filtro == 'ADMINISTRADOR' && formDadosCadastrais.regional_fixa == 1"
                >
                  <v-autocomplete
                    no-data-text="Regional não encontrada!"
                    outlined
                    dense
                    label="Mudar para"
                    :items="regionais"
                    :disabled="editarPerfil != 1"
                    item-text="REGIONAL"
                    clearable
                    hide-details
                    v-model="formDadosCadastrais.regional_para"
                    hide-selected
                    :required="
                      formDadosCadastrais.regional_fixa == 1 && usuario.filtro == 'ADMINISTRADOR'
                        ? true
                        : false
                    "
                  ></v-autocomplete>
                </v-col>
                <v-col
                  style="margin-top: -10px"
                  v-if="formDadosCadastrais.regional_fixa == 1 && usuario.filtro == 'ADMINISTRADOR'"
                >
                  <DatePicker
                    label="Selecione uma data para a regional fixa"
                    v-model="formDadosCadastrais.dataSelecionada"
                    :dateMaxProps="false"
                    :dateMinProps="true"
                    :isRange="true"
                    :addDay="futureDate"
                  />
                </v-col>
                <v-col
                  cols="12"
                  v-if="formDadosCadastrais.regional_fixa == 1 && usuario.filtro == 'ADMINISTRADOR'"
                >
                  <v-textarea
                    placeholder="Motivo para habilitar a regional fixa"
                    label="Motivo para habilitar a regional fixa"
                    rows="2"
                    outlined
                    dense
                    :required="
                      formDadosCadastrais.regional_fixa == 1 && usuario.filtro == 'ADMINISTRADOR'
                        ? true
                        : false
                    "
                    v-model="formDadosCadastrais.motivoContigencia"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-col>
          </v-card>
        </v-col>
        <v-col cols="6" sm="12" xl="6" class="mt-10">
          <v-card width="100%" class="mx-auto rounded-xl">
            <v-card-title>
              <i class="fa-solid fa-user-astronaut mr-2"></i>
              Avatar
            </v-card-title>
            <v-divider></v-divider>
            <avatar :editandoPerfil="pesquisar_user != '' ? true : false"></avatar>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="mb-5 mt-5" justify="center">
        <v-btn color="green" class="white--text" type="submit" width="200">Salvar</v-btn>
      </v-row>
    </form>
    <load-envio-dados :envioDados="baixandoInfor"></load-envio-dados>
    <v-snackbar v-model="snackbar">
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
  import Masks from '../../../shared/masks/masks'
  import config from '../../../core/config.js'
  import avatar from '../avatar/avatar.component.vue'
  import alerts from '../../../mixins/alerts.mixins'
  import DatePicker from '@/shared/components/DatePicker/DatePicker.vue'
  import loadEnvioDados from '../../../shared/components/load/loadHastag.vue'
  export default {
    components: {
      avatar,
      loadEnvioDados,
      DatePicker
    },
    data() {
      return {
        items_status: [
          { text: 'Ativo', value: 1 },
          { text: 'Inativo', value: 0 }
        ],
        items_inativacao: [
          { text: 'Sim', value: 1 },
          { text: 'Não', value: 0 }
        ],
        items_regional_fixa: [
          { text: 'Sim', value: 1 },
          { text: 'Não', value: 0 }
        ],
        futureDate: 30,
        snackbar: false,
        text: 'Almope não foi encontrado!',
        atualizar_status: null,
        toggle_exclusive: 1,
        baixandoInfor: false,
        minha_permisao: '',
        permitirLiberacao: '',
        regional_fixa: '',
        permitir_inativacao: '',
        pesquisar_user: '',
        regional: '',
        items_idioma: ['Português'],
        filtro_permisao: [],
        regionais: [],
        dados_cadastrais: [],
        formDadosCadastrais: {
          almope: null,
          nome: null,
          superior1: null,
          usuario: null,
          senha: null,
          idioma: null,
          bio: null,
          localidade: null,
          regional_fixa: null,
          email: null,
          id_perfil: null,
          lider: null,
          regional: null,
          status: null,
          regional_para: null,
          dataSelecionada: null,
          permitir_inativacao: null,
          motivoContigencia: value => {
            return value || null
          }
        }
      }
    },
    mixins: [alerts],
    computed: {
      masks() {
        return Masks
      },
      editarPerfil() {
        return this.$store.getters.usuario.editar_perfil
      },
      user() {
        let usuario = this.$store.getters.usuario.almope
        if (this.pesquisar_user != '') {
          return this.pesquisar_user
        } else {
          return usuario
        }
      },
      usuario() {
        return this.$store.getters.usuario
      }
      // date() {
      //   //TODO refazer estrutura de data modelo dd/mm/yyyy hh:mm:ss

      //   return `${dataF}/${mesF}/${ano} ${hora}:${minutos}:${segundos}`
      // }
    },
    methods: {
      async loadRegionais() {
        let urlData = `${config.baseUrl}api/shared/meus_dados/perfil/regionais/`
        var res = await this.$api.get(urlData)
        this.regionais = res.data
      },
      loadFiltroPermissao() {
        let urlData = `${config.baseUrl}api/shared/meus_dados/perfil/filtro_permissao`
        this.$api.get(urlData).then(res => {
          this.filtro_permisao = res.data
        })
      },

      async loadDadosCadastrais() {
        try {
          this.baixandoInfor = true
          let urlData = `${config.baseUrl}api/shared/meus_dados/perfil/dados_cadastrais/${this.user}`
          var res = await this.$api.get(urlData)

          if (res.data.length > 0) {
            this.formDadosCadastrais = res.data && res.data[0]
            this.formDadosCadastrais.regional_fixa == 1
              ? (this.formDadosCadastrais.regional_para = this.formDadosCadastrais.regional)
              : ''
            this.formDadosCadastrais.regional_fixa == 1
              ? (this.formDadosCadastrais.motivoContigencia =
                  this.formDadosCadastrais.motivo_regional_fixa)
              : ''
            this.formDadosCadastrais.email =
              this.formDadosCadastrais.email ?? `${this.user}@almavivaexperience.com.br`
            // this.dadosCadastrais()
            this.minha_permisao = res.data[0].tipo_perfil
            this.baixandoInfor = false
          } else {
            this.baixandoInfor = false
            return (this.snackbar = true)
          }
        } catch (e) {
          return e
        }
      },
      async saveBio() {
        let urlData = `${config.baseUrl}api/shared/meus_dados/perfil/bio`
        let getFormData = object =>
          Object.keys(object).reduce((FormData, key) => {
            FormData.append(key, object[key])
            return FormData
          }, new FormData())
        let data = {
          almope: this.$store.getters.usuario.almope,
          descricao_bio: this.formDadosCadastrais.bio
        }
        await this.$api.post(urlData, getFormData(data))
      },
      async saveDadosAtualizado() {
        try {
          let urlData = `${config.baseUrl}api/shared/meus_dados/perfil/update_dados_cadastrais/`
          this.formDadosCadastrais.regional_para =
            this.formDadosCadastrais.regional_para ?? this.formDadosCadastrais.regional

          await this.$api.post(urlData, this.formDadosCadastrais)
          // await this.saveBio()
          // this.loadDadosCadastrais()

          this.toast('Dados atualizados com sucesso!', 'top-right', false, 3500, 'success')
        } catch (error) {
          this.toast(
            'Oops, dados não atualizados. Tente novamente, caso o erro persista contate o administrador!',
            'top-right',
            false,
            3500,
            'success'
          )
        }
      }
    },
    watch: {
      'formDadosCadastrais.regional_fixa': function () {
        if (this.formDadosCadastrais.regional_fixa == 0) {
          this.formDadosCadastrais.motivoContigencia = ' '
          this.formDadosCadastrais.dataSelecionada = ['2025-01-20', '2025-01-21']
        }
      }
    },
    created() {
      this.loadDadosCadastrais()
      this.loadFiltroPermissao()
      this.loadRegionais()

      this.formDadosCadastrais.dataSelecionada = ['2025-01-20', '2025-01-21']
    }
  }
</script>

<style scoped>
  .circle {
    border-radius: 50%;
    width: 30px;
    height: 30px;
  }
</style>
