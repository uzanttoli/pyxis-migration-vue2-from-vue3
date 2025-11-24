import Vue from 'vue'
import config from '@/core/config'

const RechamadaService = {
  /**
   *
   * Listar intervalos
   *
   */
  async getDadosIntervaloRechamada() {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/dados-online/rechamada/intervalos`
      const res = await Vue.prototype.$api.get(urlData)

      return res.data
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  /**
   *
   * Minha rechamada
   * @return
   */
  async getDadosMinhaRechamada(almope, perfil) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/dados-online/rechamada/minha-rechamada`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          almope: almope,
          perfil: perfil
        }
      })
      const dados = res.data.map(item => {
        return Object.keys(item).reduce((acc, key) => {
          acc[key] = key.includes('PERC')
            ? `${(item[key] * 100).toFixed(2).toString().replace('.', ',')}%`
            : item[key]
          return acc
        }, {})
      })
      return dados
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export default RechamadaService
