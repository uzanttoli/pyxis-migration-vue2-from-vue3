import Vue from 'vue'
import config from '../../../core/config.js'
// import store from "../../../store/store.js";
// import { mapAndConvertKeys } from '../../../utils/mapAndConvertKeys.js';

const CreditoCartelaPremiadaService = {
  async getSummary(id, almope) {
    try {
      const urlData = `${config.baseUrl}api/shared/scratch_card/credito_cartela_premiada/get_summary/${id}/${almope}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados pelo ID:', error)
      throw error
    }
  },
  modelMap: {
    id: 'ID',
    formName: 'TITULO',
    formDescription: 'DESCRICAO',
    published: 'PUBLISHED'
  }
}

export default CreditoCartelaPremiadaService
