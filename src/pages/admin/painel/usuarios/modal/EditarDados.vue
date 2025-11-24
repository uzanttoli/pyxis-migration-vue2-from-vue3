<template>
  <!-- v-model="abrirEdicaoUsuario" -->

  <v-dialog
    width="900"
    :model-value="abrirEdicaoUsuario"
    @update:modelValue="val => $emit('update:abrirEdicaoUsuario', val)"
  >
    <v-card>
      <v-col class="pa-0 ma-0">
        <title-negative-margin title="Editar Dados"></title-negative-margin>
        {{ dados }}
        <v-form v-model="valid">
          <v-container>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  outlined
                  dense
                  rounded
                  v-model="dados.almope"
                  placeholder="Login/Almope"
                ></v-text-field>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  outlined
                  dense
                  rounded
                  v-model="dados.usuario"
                  placeholder="Usuario"
                ></v-text-field>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  outlined
                  dense
                  rounded
                  v-model="dados.nome"
                  placeholder="Nome"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="mt-n6">
              <v-col cols="4">
                <v-text-field
                  outlined
                  dense
                  rounded
                  v-model="dados.regional"
                  placeholder="Regional"
                ></v-text-field>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  outlined
                  dense
                  rounded
                  v-model="dados.produto"
                  placeholder="Produto"
                ></v-text-field>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  outlined
                  dense
                  rounded
                  v-model="dados.agrupamento"
                  placeholder="Agrupamento"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="mt-n6">
              <v-col cols="4">
                <v-text-field
                  outlined
                  dense
                  rounded
                  v-model="dados.grupo"
                  placeholder="Grupo"
                ></v-text-field>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  outlined
                  dense
                  rounded
                  v-model="dados.cargo"
                  placeholder="Cargo"
                ></v-text-field>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  outlined
                  dense
                  rounded
                  v-model="dados.email"
                  placeholder="Email"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-row class="mt-n6">
              <v-col cols="3">
                <v-switch v-model="dados.lider" hide-details label="Lider"></v-switch>
              </v-col>

              <v-col cols="3">
                <v-switch v-model="dados.status" hide-details label="Status"></v-switch>
              </v-col>

              <v-col cols="3">
                <v-switch
                  v-model="dados.editar_perfil"
                  hide-details
                  label="Editar Perfil"
                ></v-switch>
              </v-col>

              <v-col cols="3">
                <v-switch
                  v-model="dados.mapeamento_perfil"
                  hide-details
                  label="Mapeamento Perfil"
                ></v-switch>
              </v-col>
            </v-row>

            <v-row class="mt-n6">
              <v-col cols="3">
                <v-switch
                  v-model="dados.excluir_post_feed"
                  hide-details
                  label="Excluir Post"
                ></v-switch>
              </v-col>

              <v-col cols="3">
                <v-switch v-model="dados.editar_senha" hide-details label="Editar Senha"></v-switch>
              </v-col>

              <v-col cols="3">
                <v-switch
                  v-model="dados.fixar_artigo_feed"
                  hide-details
                  label="Fixar Post"
                ></v-switch>
              </v-col>

              <v-col cols="3">
                <v-switch
                  v-model="dados.res_comen_feed"
                  hide-details
                  label="Responder Coment"
                ></v-switch>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      abrirEdicaoUsuario: {
        type: Boolean,
        default: false
      },
      dados: {
        type: [Array, Object],
        require: true
      }
    },
    data: () => ({
      valid: false
    })
  }
</script>

<style></style>
