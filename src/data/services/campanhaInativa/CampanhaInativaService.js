import Vue from 'vue'
import config from '@/core/config.js'

const CampanhaInativaService = {
  async getAll() {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/campanha-inativa/listar`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar campanhas inativas:', error)
      throw error
    }
  }
}

export { CampanhaInativaService }
