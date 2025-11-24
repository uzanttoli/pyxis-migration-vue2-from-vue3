<template>
  <v-col class="mt-n4 mb-n5 pa-0 ma-0">
    <v-tooltip right>
      <template v-slot:activator="{ attrs, on }">
        <v-text-field
          v-bind="attrs"
          v-on="on"
          placeholder="##/##/####"
          outlined
          dense
          class="mt-5 ma-0 pa-0"
          @keyup.enter="saveProdutoEntregue(idVenda, idProduto)"
          v-mask="masks.data"
          v-model="dataEntregaDigitada"
        ></v-text-field>
      </template>
      <span>Pressione ENTER para salvar a data de entrega!</span>
    </v-tooltip>
  </v-col>
</template>
<script>
  import masks from '../../../shared/masks/masks'
  export default {
    props: {
      idVenda: {
        type: [String, Number, Object]
      },
      idProduto: {
        type: [String, Number, Object]
      }
    },
    data: () => ({
      snackbar: false,
      dataEntregaDigitada: '',
      text: '',
      icon: '',
      color: ''
    }),
    computed: {
      masks() {
        return masks
      },

      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      dataIsValid() {
        // if (this.dataEntregaDigitada.length == 10) {
        //   return true;
        // }
        let data = this.dataEntregaDigitada

        function isValidDate(dateString) {
          // First check for the pattern
          if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) return false

          // Parse the date parts to integers
          var parts = dateString.split('/')
          var day = parseInt(parts[0], 10)
          var month = parseInt(parts[1], 10)
          var year = parseInt(parts[2], 10)
          var data = new Date()
          var anoAtual = data.getFullYear()
          // Check the ranges of month and year
          if (year < 1000 || year > anoAtual || month == 0 || month > 12) return false

          var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

          // Adjust for leap years
          if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) monthLength[1] = 29

          // Check the range of the day
          return day > 0 && day <= monthLength[month - 1]
        }
        return isValidDate(data)
      }
    },
    methods: {
      // idVendas, idProduto
      async saveProdutoEntregue(idVendas, idProduto) {
        if (this.dataIsValid) {
          let data = {
            idVendas,
            idProduto,
            dataEntrega: this.dataEntregaDigitada,
            entreguePor: this.usuarioAlmope
          }
          await this.$store.dispatch('saveProdutoEntregue', data)
          this.$store.dispatch('loadControleDeEntregas')

          this.$emit('updated:data', {
            invalido: true,
            msg: 'Dados Atualizados com sucesso',
            type: 'success'
          })
        } else {
          this.$emit('updated:data', {
            invalido: true,
            msg: 'Data Invalida',
            type: 'error'
          })
        }
      }
    }
  }
</script>

<style></style>
