const qualStatusOsChip = [
  {
    text: 'OS BAIXADA (CLIENTE AUSENTE)',
    value: 'OS BAIXADA (CLIENTE AUSENTE)'
  },
  {
    text: 'OS BAIXADA (ENTREGA REALIZADA)',
    value: 'OS BAIXADA (ENTREGA REALIZADA)'
  },
  {
    text: 'OS CANCELADA',
    value: 'OS CANCELADA'
  },
  {
    text: 'OS EM ABERTO (DENTRO PRAZO)',
    value: 'OS EM ABERTO (DENTRO PRAZO)'
  },
  {
    text: 'OS EM ABERTO (FORA PRAZO)',
    value: 'OS EM ABERTO (FORA PRAZO)'
  }
]

const enderecoClienteCorreto = [
  {
    text: 'SIM - OPERADOR CONFIRMOU NO MOMENTO DA VENDA',
    value: 'SIM - OPERADOR CONFIRMOU NO MOMENTO DA VENDA'
  },
  {
    text: 'SIM - OPERADOR NÃO CONFIRMOU ANTES DA VENDA',
    value: 'SIM - OPERADOR NÃO CONFIRMOU ANTES DA VENDA'
  },
  {
    text: 'NÃO - OPERADOR NÃO CONFIRMOU ANTES DA VENDA',
    value: 'NÃO - OPERADOR NÃO CONFIRMOU ANTES DA VENDA'
  }
]

const direcionadoClienteLoja = [
  {
    text: 'SIM',
    value: 'SIM'
  },
  {
    text: 'NÃO - NECESSÁRIO TRATATIVA DO CONTRATO',
    value: 'NÃO - NECESSÁRIO TRATATIVA DO CONTRATO'
  }
]

export default {
  qualStatusOsChip,
  enderecoClienteCorreto,
  direcionadoClienteLoja
}
