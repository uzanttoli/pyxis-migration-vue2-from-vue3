const validacaoAcesso = {
  methods: {
    almopeRestricao(arr, almope) {
      if (arr == null) {
        return true
      } else {
        let array = []
        array.push(arr)
        let validacao = arr.includes(almope)
        if (validacao == true) {
          return false
        } else {
          return true
        }
      }
    },
    almopeLiberacao(arr, almope) {
      if (arr) {
        let array = []
        array.push(arr)
        let validacao = arr.includes(almope)
        return validacao
      }
    },

    restricaoTipoAcesso(arr, tipoAcesso) {
      if (arr) {
        let array = []
        array.push(arr)
        let validacao = arr.includes(tipoAcesso)
        return validacao
      }
    },
    restricaoRegional(arr, regional) {
      if (arr) {
        let array = []
        array.push(arr)
        let validacao = arr.includes(regional)
        return validacao
      }
    },
    restricaoSubMenuRestricao(arr, regional) {
      if (arr) {
        let array = []
        array.push(arr)
        let validacao = arr.includes(regional)
        return validacao
      }
    },
    restricaoValidOperacao(arr, regional) {
      let validacao = arr.includes(regional)
      if (validacao == true) {
        return false
      } else {
        return true
      }
    },
    liberacaoProduto(array, produto) {
      if (!array) return true
      let validacao = array.includes(produto)
      return validacao
      // if (validacao == true) {
      //   return true;
      // } else {
      //   return false;
      // }
    },
    liberacaoTipoAcesso(array, perfil) {
      // se o array estiver vazio ele trata a informação para o usuario. se quiser limitar forneca o array com os dados
      if (!array) return true
      let validacao = array.includes(perfil)
      return validacao
    }
  }
}

export default validacaoAcesso
