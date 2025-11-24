import Vue from 'vue'
import config from '../../../core/config.js'

const MenuAlmopeService = {
  async getByAlmope(almope) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/menu-almope?almope=${almope}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error(`Erro ao recuperar Menu para o almope ${almope}:`, error)
      throw error
    }
  },

  async toggleMenuAlmope(almope, id, activate) {
    try {
      if (activate) {
        return await this.removeMenuAlmopeExclusao(almope, id)
      } else {
        return await this.addMenuAlmopeExclusao(almope, id)
      }
    } catch (_) {
      console.error(`Erro ao alternar ativação do Menu para o almope ${almope} e id ${id}:`)
    }
  },

  async addMenuAlmopeExclusao(almope, id) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/menu-almope/adicionar?almope=${almope}&id=${id}`
      const res = await Vue.prototype.$api.post(urlData)
      return res.data
    } catch (_) {
      console.error(`Erro ao adicionar exclusão de menu para o almope ${almope} e id ${id}:`)
    }
  },

  async removeMenuAlmopeExclusao(almope, id) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/menu-almope/exclusao?almope=${almope}&id=${id}`
      const res = await Vue.prototype.$api.delete(urlData)
      return res.data
    } catch (_) {
      console.error(`Erro ao remover exclusão de menu para o almope ${almope} e id ${id}:`)
    }
  }
}

export { MenuAlmopeService }
