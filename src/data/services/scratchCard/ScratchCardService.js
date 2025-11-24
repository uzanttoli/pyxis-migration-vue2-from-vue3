import Vue from 'vue'
import config from '../../../core/config.js'
// import store from "../../../store/store.js";
// import { mapAndConvertKeys } from '../../../utils/mapAndConvertKeys.js';

const ScratchCardService = {
  async getAll(id, page = 1, limit = 500) {
    try {
      const urlData = `${config.baseUrl}api/shared/scratch_card/scratch_card/get_all/${id}?page=${page}&limit=${limit}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados pelo ID:', error)
      throw error
    }
  },
  async getAllAwarded(id) {
    try {
      const urlData = `${config.baseUrl}api/shared/scratch_card/scratch_card/get_all_awarded/${id}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados pelo ID:', error)
      throw error
    }
  },
  /**
   * Recupera um cartão de raspagem pelo ID
   * @param {number} id - O ID do cartão de raspagem
   * @returns {Promise<Object>} Os dados do cartão de raspagem
   * @throws Lança um erro se a solicitação falhar.
   */
  async getById(id) {
    try {
      const urlData = `${config.baseUrl}api/shared/scratch_card/scratch_card/get_by_id/${id}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados pelo ID:', error)
      throw error
    }
  },
  async scratch(drawFormId, cardId, userId) {
    try {
      const urlData = `${config.baseUrl}api/shared/scratch_card/scratch_card/scratch/${drawFormId}/${cardId}/${userId}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados pelo ID:', error)
      throw error
    }
  },
  async generateCards(drawFormId, amount) {
    try {
      const urlData = `${config.baseUrl}api/shared/scratch_card/scratch_card/generate_cards/${drawFormId}/${amount}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados pelo ID:', error)
      throw error
    }
  },
  async assignRandomAwards(awardIds, drawFormId) {
    try {
      const urlData = `${config.baseUrl}api/shared/scratch_card/scratch_card/card_assign_random_awards`
      const payload = {
        awardIds: awardIds,
        drawFormId: drawFormId
      }
      const res = await Vue.prototype.$api.post(urlData, {
        ...payload
      })
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

export default ScratchCardService
