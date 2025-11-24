import Vue from 'vue'
import config from '@/core/config'

const IndicacaoMultiReservaService = {
  async getResumoTratativaTabulacao(almope) {
    try {
      const urlData = `${config.baseUrl}api/shared/formularios/indicacao_multi_reserva/resumo_tabulacao`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          almope
        }
      })

      return res.data
    } catch (Error) {
      console.error(Error)
      throw Error
    }
  }
}

export default IndicacaoMultiReservaService
