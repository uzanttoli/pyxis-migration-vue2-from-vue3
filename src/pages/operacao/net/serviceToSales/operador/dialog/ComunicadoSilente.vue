<template>
  <v-dialog v-model="dialog" width="510">
    <v-card class="rounded-xl pa-1 cor-padrao" color="red">
      <v-card elevation="5">
        <v-col class="pa-3">
          <div style="display: flex; justify-content: center">
            <v-img src="@/assets/img/core/sales.png" max-width="300"></v-img>
          </div>
          <h4>
            <i class="fa-solid fa-star mr-2 orange--text"></i>
            Olá, você sabe o que é venda silente?
          </h4>
          <p class="pa-2" style="text-align: justify">
            Um cliente é considerado "
            <strong style="color: red">silente</strong>
            " quando ativa seu chip, mas não utiliza os serviços após a ativação. Para não ser
            classificado como tal, o cliente deve realizar um consumo mínimo de voz ou dados.
            Atualmente o "
            <strong style="color: red">silente</strong>
            " é o principal motivo dos estornos de comissionamento, ou seja,
            <strong>
              uma vez ativo e sem a utilização temos o estorno da remuneração variavel.
            </strong>
          </p>

          <h4>
            <i class="fa-solid fa-star mr-2 orange--text"></i>
            Como evitar uma venda silente:
          </h4>
          <p class="pa-2" style="text-align: justify">
            No ato da venda informe a importância da utilização do serviço junto ao cliente.
          </p>
        </v-col>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      value: Boolean
    },
    computed: {
      dialog: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    }
  }
</script>

<style></style>
