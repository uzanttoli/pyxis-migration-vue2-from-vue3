import Vue from 'vue'
import config from '@/core/config'

const FormFieldsService = {
  async getFormsFields() {
    try {
      const urlData = `${config.baseUrl}api/shared/formularios/config/campos_formularios`
      const result = await Vue.prototype.$api.get(urlData)

      return result.data
    } catch (Error) {
      console.error(Error)
      throw Error
    }
  }
}

export default FormFieldsService
