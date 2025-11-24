import Vue from 'vue'
import config from '@/core/config'

const EnderecoDesatualizadoService = {
  async salvarDadosTabulacao(dados) {
    try {
      const urlData = `${config.baseUrl}api/shared/formularios/validacao_endereco_erb/insert`
      const res = await Vue.prototype.$api.post(urlData, dados)

      return res.data
    } catch (Error) {
      console.error(Error)
      throw Error
    }
  }
}

export default EnderecoDesatualizadoService
