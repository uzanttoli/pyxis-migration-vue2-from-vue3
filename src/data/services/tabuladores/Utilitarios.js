import Vue from 'vue'
import config from '@/core/config'

const UtilitariosService = {
  /**
   *
   * listar utilitarios
   *
   */
  async listarUtilitarios() {
    try {
      const url = `${config.baseUrl}api/shared/formularios/configuracao/utilitarios/listar`
      const response = await Vue.prototype.$api.get(url)
      return response.data
    } catch (error) {
      console.error('Error ao carregar lista de utilitarios:', error)
      throw error
    }
  },

  /**
   *
   * Atualizar utilitarios
   *
   */
  async atualizarUtilitarios(id, data) {
    try {
      const urlData = `${config.baseUrl}api/shared/formularios/configuracao/utilitarios/atualizar`
      const response = await Vue.prototype.$api.post(urlData, { id, data })
      return response.data
    } catch (error) {
      console.error('Error ao atualizar', error)
      throw error
    }
  },
  async processarTabulacao({ ...params }) {
    try {
      const urlData = `${config.baseUrl}api/shared/formularios/form_respostas/salvar`
      const response = await Vue.prototype.$api.post(urlData, {
        params: {
          ...params
        }
      })
      return response.data
    } catch (Error) {
      console.error(Error)
      throw Error
    }
  }
}
export default UtilitariosService
