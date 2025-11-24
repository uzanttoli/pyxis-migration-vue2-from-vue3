import Vue from 'vue'
import config from '@/core/config'

const TratativaIndicacaoMulti = {
  /**
   * Recupera todas as ações realizadas nas ocorrência no dia atual
   * @returns {Promise<Array>} A lista de ações realizadas nas ocorrências
   * @param  {Number} - almope tratativa
   * @throws Lança um erro se a solicitação falhar.
   */
  async getNewCase(almope) {
    try {
      const urlData = `${config.baseUrl}api/shared/service_to_sales/backoffice/indicacao_combo_multi/indicacao/novo_caso`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          almope
        }
      })
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados:', error)
      throw error
    }
  },

  /**
   *
   * Finaliza e agenda dados da tratativa
   * @returns {Promise<Array>}
   * @param {Array} - dados referente a tratativa
   */
  async saveStatusCase(data) {
    try {
      const urlData = `${config.baseUrl}api/shared/service_to_sales/backoffice/indicacao_combo_multi/indicacao/finaliza_agenda_tratativa`
      const res = Vue.prototype.$api.post(urlData, data)
      return res
    } catch (error) {
      console.error('Erro ao recuperar dado:', error)
      throw error
    }
  }
}

export default TratativaIndicacaoMulti
