import config from '@/core/config'
import Vue from 'vue'

const ExtratoService = {
  /**
   *
   * @param {*} almope
   * @param {*} numCargo
   * @param {*} produto
   * @returns
   *
   * @example
   * {
   *  almope: usuario.almope,
   *  coluna: {
   *    numCargo: 1 -> Coordenador
   *    numCargo: 2 -> Supervisor
   *    numCargo: 3 -> Operador
   * },
   *  produto: usuario.produto
   * }
   
   */
  async getVendasOnline(almope, numCargo, produto) {
    try {
      const urlData = `${config.baseUrl}api/shared/televendas/vendas_online`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          almope,
          coluna: numCargo,
          produto
        }
      })

      return res.data
    } catch (error) {
      console.error('Error fetching vendas online:', error)
      throw error
    }
  },
  /**
   *
   * @param {*} almope
   * @param {*} numCargo
   * @param {*} produto
   * @returns
   *
   * @example
   * {
   *  almope: usuario.almope,
   *  coluna: {
   *    numCargo: 1 -> Coordenador
   *    numCargo: 2 -> Supervisor
   *    numCargo: 3 -> Operador
   * },
   *  produto: usuario.produto
   * }
   
   */
  async getVendasHistorica(almope, numCargo, produto) {
    try {
      const urlData = `${config.baseUrl}api/shared/televendas/vendas_historica`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          almope,
          coluna: numCargo,
          produto
        }
      })

      return res.data
    } catch (error) {
      console.error('Error fetching vendas historica:', error)
      throw error
    }
  },
  /**
   *
   * @param {*} almope
   * @param {*} numCargo
   * @param {*} produto
   * @returns
   *
   * @example
   * {
   *  almope: usuario.almope,
   *  coluna: {
   *    numCargo: 1 -> Coordenador
   *    numCargo: 2 -> Supervisor
   *    numCargo: 3 -> Operador
   * },
   *  produto: usuario.produto
   * }
   
   */
  async getVendasSilente(almope, numCargo, produto) {
    try {
      const urlData = `${config.baseUrl}api/shared/service_to_sales/silente/vendas/dados_agente`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          almope,
          coluna: numCargo,
          produto
        }
      })

      return res.data
    } catch (error) {
      console.error('Error fetching vendas silente:', error)
      throw error
    }
  },
  /**
   *
   * @param {*} almope
   * @param {*} numCargo
   * @param {*} produto
   * @returns
   *
   * @example
   * {
   *  almope: usuario.almope,
   *  coluna: {
   *    numCargo: 1 -> Coordenador
   *    numCargo: 2 -> Supervisor
   *    numCargo: 3 -> Operador
   * },
   *  produto: usuario.produto
   * }
   
   */
  async getExtratoVendasSilente(almope, numCargo, produto) {
    try {
      const urlData = `${config.baseUrl}api/shared/service_to_sales/silente/vendas/dados_extrato`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          almope,
          coluna: numCargo,
          produto
        }
      })

      return res.data
    } catch (error) {
      console.error('Error fetching extrato vendas silente:', error)
      throw error
    }
  },
  /**
   *
   * @param {*} almope
   * @param {*} tipoDado
   * @returns
   *
   * @example
   * {
   *  almope: usuario.almope,
   *  tipoDado: 'ONLINE' || 'HISTORICO'
   * }
   
   */
  async getDetalhamentoVendas(almope, tipoDado, produto) {
    try {
      const urlData = `${config.baseUrl}api/shared/televendas/vendas_extrato`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          almope,
          tipoDado,
          produto
        }
      })

      return res.data
    } catch (error) {
      console.error('Error fetching extrato detalhado vendas', error)
    }
  }
}

export default ExtratoService
