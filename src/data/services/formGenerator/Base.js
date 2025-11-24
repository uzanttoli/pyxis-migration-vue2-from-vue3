import Vue from 'vue'
import config from '../../../core/config.js'

const FormGeneratorBaseService = {
  async downloadBase(idForm, startDate, endDate, version = null) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/base/get_download`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          idForm,
          startDate,
          endDate,
          version
        }
      })
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados:', error)
      throw error
    }
  }
}

export default FormGeneratorBaseService
