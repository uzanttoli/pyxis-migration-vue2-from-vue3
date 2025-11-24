import Vue from 'vue'
import config from '@/core/config.js'
import store from '@/store/store.js'
import { mapAndConvertKeys } from '@/utils/mapAndConvertKeys.js'

const DrawCardService = {
  async getAll(id, includeDeleted = false) {
    try {
      const urlData = `${config.baseUrl}api/shared/scratch_card/draw_form/get_all/${id}?include_deleted=${includeDeleted}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados:', error)
      throw error
    }
  },
  async insert(data) {
    try {
      const almope = store.getters.usuario.almope
      const payload = mapAndConvertKeys(data, this.modelMap)
      const urlData = `${config.baseUrl}api/shared/scratch_card/draw_form/insert`
      const res = await Vue.prototype.$api.post(urlData, {
        ...payload,
        CREATED_BY: almope
      })
      return res
    } catch (error) {
      console.error('Erro ao inserir dados:', error)
      throw error
    }
  },
  modelMap: {
    id: 'ID',
    title: 'TITLE',
    scratchCardAmount: 'SCRATCH_CARD_AMOUNT',
    scratchCardWinningAmount: 'SCRATCH_CARD_WINNING_AMOUNT',
    campaign: 'CAMPAIGN'
  }
}

export default DrawCardService
