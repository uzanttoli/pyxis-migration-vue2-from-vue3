function GetEnelConfigTable(pNumSuperior, coordFilter, supFilter) {
  const createHeader = (text, value, filter = null) => {
    return {
      text,
      value,
      sortable: true,
      align: 'center',
      ...(filter && { filter })
    }
  }

  const headersBase = [
    createHeader('Tempo Logado', 'TEMPO_LOGADO'),
    createHeader('Jackin', 'JACKIN'),
    createHeader('Lanche', 'ALIMENTACAO'),
    createHeader('Pessoal', 'PARTICULAR'),
    createHeader('Descanso', 'DESCANSO'),
    createHeader('Técnica', 'SISTEMA'),
    createHeader('Treinamento', 'TREINAMENTO'),
    createHeader('Administrativa', 'FEEDBACK'),
    createHeader('Ginástica', 'SAUDE'),
    createHeader('Padrão', 'PADRAO'),
    createHeader('Laboral', 'LABORAL'),
    createHeader('Produto', 'PRODUTO')
  ]

  const headersOper = [createHeader('Almope', 'ALMOPE'), createHeader('Nome', 'NOME')]

  const headersSupervisao = {
    COORDENADOR: createHeader('Coordenaador', 'COORDENADOR', value => {
      return coordFilter ? value === coordFilter : true
    }),
    SUPERVISOR: createHeader('Supervisor', 'SUPERVISOR', value => {
      return supFilter ? value === supFilter : true
    })
  }

  let finalHeaders = [...headersBase]

  switch (pNumSuperior) {
    case 1:
      finalHeaders.unshift(headersSupervisao)
      break
    case 2:
      finalHeaders.unshift(headersSupervisao.SUPERVISOR)
      finalHeaders.push(headersSupervisao.COORDENADOR)
      break
    case 3:
      finalHeaders.unshift(...headersOper)
      finalHeaders.push(headersSupervisao.SUPERVISOR, headersSupervisao.COORDENADOR)
      break
  }

  return finalHeaders
}

export default GetEnelConfigTable
