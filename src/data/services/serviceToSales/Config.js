import Vue from 'vue'
import config from '@/core/config'

const ConfigService = {
  async getConfigComponent() {
    try {
      const urlData = `${config.baseUrl}api/shared/config/s2s`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Error fetching config service', error)
      throw error
    }
  }
}

export default ConfigService
