import BaseService from '@/data/services/BaseService.js'
import config from '@/core/config.js'
import Vue from 'vue'
import { mapAndConvertKeys } from '@/utils/mapAndConvertKeys.js'

class PrizesService extends BaseService {
  constructor(baseUrl, modelMap) {
    super(baseUrl, modelMap)
    this.modelMap = modelMap
  }

  async getAllPrizes(id) {
    try {
      const urlData = `${config.baseUrl}api/shared/scratch_card/prizes/get_all_prizes/${id}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados pelo ID:', error)
      throw error
    }
  }

  async batchInsert(data) {
    try {
      const urlData = `${this.baseUrl}batch_insert`
      const payload = {
        ...data.map(item => {
          return {
            ...mapAndConvertKeys(item, this.modelMap),
            IMAGE: item.id
          }
        })
      }
      const res = await Vue.prototype.$api.post(urlData, payload)
      return res.data
    } catch (error) {
      console.error('Erro ao inserir dados:', error)
      throw error
    }
  }
}

const prizesService = new PrizesService(`${config.baseUrl}api/shared/scratch_card/prizes/`, {
  id: 'ID',
  title: 'TITLE',
  image: 'IMAGE',
  value: 'VALUE',
  drawFormId: 'DRAW_FORM_ID'
})

export default prizesService
