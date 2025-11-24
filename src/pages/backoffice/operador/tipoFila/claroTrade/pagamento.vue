<template>
  <div
    style="
      display: flex;
      flex-wrap: wrap;
      border: 1px solid #3333;
      border-radius: 5px;
      background: #fbfcfc;
    "
  >
    <v-col cols="3">
      <label style="color: grey; font-size: 14px">Valor Total</label>
      <p>
        {{
          calcTotal([
            { valor: dados.PRECO_TV },
            { valor: dados.PRECO_INTERNET },
            { valor: dados.PRECO_FONE },
            { valor: dados.PRECO_CELULAR }
          ])
        }}
      </p>
    </v-col>
    <v-col cols="3">
      <label style="color: grey; font-size: 14px">Valor Promocional Total</label>
      <p>
        {{
          calcTotal([
            { valor: dados.PRECO_TV_PROMOCIONAL },
            { valor: dados.PRECO_INTERNET_PROMOCIONAL },
            { valor: dados.PRECO_FONE_PROMOCIONAL },
            { valor: dados.PRECO_CELULAR_PROMOCIONAL }
          ])
        }}
      </p>
    </v-col>
    <v-col cols="3">
      <label style="color: grey; font-size: 14px">Dia do Vencimento</label>
      <p>{{ dados.DIA_VENCIMENTO }}</p>
    </v-col>
    <v-col cols="3">
      <label style="color: grey; font-size: 14px">Forma de Pagamento</label>
      <p>{{ dados.FORMA_DE_PAGAMENTO }}</p>
    </v-col>
  </div>
</template>

<script>
  export default {
    props: {
      dados: {
        type: [Array, Object]
      }
    },
    computed: {},
    methods: {
      calcTotal(item) {
        let soma = item
          .filter(el => el.valor != null)
          .reduce((valorAtual, proximoValor) => {
            return valorAtual.valor + proximoValor.valor
          })
        let result = soma['valor']
        return result.toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL'
        })
      }
    }
  }
</script>

<style></style>
