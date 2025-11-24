import Vue from 'vue'
import config from '@/core/config.js'

const ScoreboardService = {
  async listarPorAlmope(almope) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/dados-online/scoreboard/${almope}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados do scoreboard:', error)
      throw error
    }
  }
}

export default ScoreboardService
