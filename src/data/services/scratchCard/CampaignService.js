import Vue from 'vue'
import config from '@/core/config.js'
import { mapAndConvertKeys } from '@/utils/mapAndConvertKeys.js'
import store from '@/store/store.js'

const CampaignService = {
  /**
   * Retrieves all campaigns.
   * @param {boolean} [includeDeleted=false] - Whether to include deleted campaigns.
   * @returns {Promise<Object>} The response data.
   * @throws Will throw an error if the request fails.
   */
  async getAll(includeDeleted = false) {
    try {
      const urlData = `${config.baseUrl}api/shared/scratch_card/campaign/get_all?include_deleted=${includeDeleted}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados:', error)
      throw error
    }
  },
  /**
   * Retrieves all campaigns by role.
   * @param {string} almope - The almope identifier.
   * @param {string} regional - The regional identifier.
   * @param {boolean} [includeDeleted=false] - Whether to include deleted campaigns.
   * @returns {Promise<Object>} The response data.
   * @throws Will throw an error if the request fails.
   */
  async getAllByRole(almope, regional, includeDeleted = false) {
    try {
      const urlData = `${config.baseUrl}api/shared/scratch_card/campaign/get_all_by_role?include_deleted=${includeDeleted}&almope=${almope}&regional=${regional}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados:', error)
      throw error
    }
  },
  /**
   * Inserts a new campaign.
   * @param {Object} data - The campaign data to insert.
   * @returns {Promise<Object>} The response data.
   * @throws Will throw an error if the request fails.
   */
  async insert(data) {
    try {
      const almope = store.getters.usuario.almope
      const payload = mapAndConvertKeys(data, this.modelMap)
      const urlData = `${config.baseUrl}api/shared/scratch_card/campaign/insert`
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
  /**
   * Updates an existing campaign.
   * @param {string} id - The campaign identifier.
   * @param {Object} data - The campaign data to update.
   * @returns {Promise<Object>} The response data.
   * @throws Will throw an error if the request fails.
   */
  async update(id, data) {
    try {
      const almope = store.getters.usuario.almope
      const urlData = `${config.baseUrl}api/shared/scratch_card/campaign/update/${id}`
      const payload = {
        ...mapAndConvertKeys(data, this.modelMap),
        UPDATED_BY: almope,
        UPDATED_AT: new Date()
      }
      const res = await Vue.prototype.$api.put(urlData, payload)
      return res.data
    } catch (error) {
      console.error('Erro ao atualizar dados:', error)
      throw error
    }
  },
  modelMap: {
    id: 'ID',
    title: 'TITLE',
    startDate: 'START_DATE',
    endDate: 'END_DATE',
    published: 'PUBLISHED'
  }
}

export default CampaignService
