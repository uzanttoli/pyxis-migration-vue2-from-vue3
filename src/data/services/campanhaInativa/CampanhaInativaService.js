// import Vue from 'vue'
import api from '@/plugins/axios.js'
import config from '@/core/config.js'

const CampanhaInativaService = {
  async getAll() {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/campanha-inativa/listar`
      const res = await api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar campanhas inativas:', error)
      throw error
    }
  }
}

export { CampanhaInativaService }
