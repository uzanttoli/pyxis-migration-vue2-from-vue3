// import Vue from 'vue'
import api from '@/plugins/axios.js'
import config from '@/core/config'

const HumorService = {
  /**
   *
   * Salvar dados humor
   *
   */
  async salvarDadosHumor(obj) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/pesquisa/humor`
      await api.post(urlData, obj)
    } catch (e) {
      console.error(e)
      throw e
    }
  },

  /**
   *
   * Validacao se usuario já respondeu pesquisa
   *
   */
  async validarPesquisaHumorUsuario(almope) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/pesquisa/humor`
      const result = await api.get(urlData, {
        params: {
          almope: almope
        }
      })

      return result.data
    } catch (e) {
      console.error(e)
      throw e
    }
  },

  /**
   *
   * Atualizar humor dia
   *
   */
  async atualizarPesquisaHumor(obj) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/pesquisa/humor`
      await api.put(urlData, obj)
    } catch (e) {
      console.error(e)
      throw e
    }
  },

  /**
   *
   * Meu humor
   *
   */
  async getMeuHumor(almope) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/pesquisa/humor/meu-humor`
      const res = await api.get(urlData, {
        params: {
          almope: almope
        }
      })

      return res.data[0]
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}

export default HumorService
