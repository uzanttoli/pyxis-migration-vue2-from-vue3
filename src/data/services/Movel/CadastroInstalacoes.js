import Vue from 'vue'
import config from '../../../core/config.js'
import store from '../../../store/store.js'

const CadastroInstalacoesService = {
  async insert(data) {
    try {
      const urlData = `${config.baseUrl}api/shared/formularios/movel/controle_instalacoes/insert`
      const almope = store.getters.usuario.almope
      const payload = {
        ...data,
        AlmopeVenda: almope
      }

      const res = await Vue.prototype.$api.post(urlData, payload)
      return res
    } catch (error) {
      console.error('Erro ao inserir dados:', error)
      throw error
    }
  }
}

export default CadastroInstalacoesService
