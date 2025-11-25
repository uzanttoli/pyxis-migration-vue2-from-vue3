// import Vue from 'vue'
import config from '../../../core/config.js'
import api from '@/plugins/axios.js'

const MenuService = {
  /**
   * Recupera todos os itens de menu liberador para o usuário.
   * @returns {Promise<Array>} Uma lista de itens de menu.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getAll() {
    try {
      const menuItens = localStorage.getItem('menuItens')
      if (!menuItens) {
        const urlData = `${config.pyxisReceptivoUrl}receptivo/menu/items/listar`

        const res = await api.get(urlData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        let items = res.data
        localStorage.setItem('menuItens', JSON.stringify(items))
        return items
      } else {
        return JSON.parse(localStorage.getItem('menuItens'))
      }
    } catch (error) {
      console.error('Erro ao recuperar itens de menu:', error)
      throw error
    }
  }
}

export default MenuService
