<template>
  <div style="background: #fbfcfc; border: 1px solid #3333; border-radius: 5px">
    <v-col>
      <div style="display: flex">
        <div style="flex: 0 0 20%; display: flex; flex-direction: column; gap: 5px">
          <label style="color: grey; font-size: 14px">Tipo da venda</label>
          <span>{{ dados.SEGMENTO }}</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 5px">
          <label style="color: grey; font-size: 14px">Tipo Envio da Fatura</label>
          <span>{{ dados.TIPO_ENVIO_FATURA }}</span>
        </div>
      </div>
      <div style="margin-top: 30px; display: flex; align-items: start">
        <img src="../../../../../assets/img/conexao.svg" class="mr-2" />
        <div
          style="display: flex; align-items: start; gap: 10px; flex-direction: column; width: 100%"
        >
          <div
            style="display: flex; justify-content: space-between; width: 100%"
            v-for="(item, i) in produtosContratados"
            :key="i"
          >
            <span>{{ item.plano }}</span>
            <span>{{ item.valor }}</span>
          </div>

          <div style="display: flex; justify-content: space-between; width: 100%">
            <span style="color: grey; font-size: 14px">QUANTIDADE DE PACOTES</span>
            <span>{{ produtosContratados.length }}</span>
          </div>
        </div>
      </div>
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
    computed: {
      produtosContratados() {
        let dados = this.dados
        const planos = []
        let descPlanos = ['TV', 'INTERNET', 'FONE', 'CELULAR']
        for (let i = 0; i < descPlanos.length; i++) {
          if (dados[`PLANO_${descPlanos[i]}`] && dados[`PRECO_${descPlanos[i]}`] !== null) {
            planos.push({
              plano: dados[`PLANO_${descPlanos[i]}`],
              valor: this.real(dados[`PRECO_${descPlanos[i]}`])
            })
          }
        }
        return planos
      }
    },
    methods: {
      real(valor) {
        if (!valor) return 0
        return valor.toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL'
        })
      }
    }
  }
</script>

<style scoped>
  p {
    padding: 0;
    margin: 0;
  }
</style>
