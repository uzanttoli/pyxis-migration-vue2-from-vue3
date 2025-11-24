import Vue from 'vue'
import config from '@/core/config'
import Utils from '../../common/Utils'

const DadosOnlineOperadorVisitaTecnicaService = {
  /**
   * Lista quantidade consolidada visitas tecnicas
   * @param {number} almope - login do usuario;
   * @param {number} tipoPerfil - tipo perfil do usuario;
   * @returns {Promise<Object>} Os dados gerados;
   * @throws Lança um erro se a solicitação falhar;
   */
  async getVisitaTecnica(almope, tipoPerfil) {
    try {
      let urlData = `${config.baseUrl}api/shared/visita_improdutiva/consolidado_mes`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          almope,
          tipoPerfil
        }
      })
      return res.data
    } catch (err) {
      console.error(err)
      throw err
    }
  },

  /**
   *
   * Listar minhas visitas improdutivas
   * @param {number} almope - login do usuario;
   * @param {number} tipoPerfil - perfil do usuario;
   * @throws Lança um erro se a solicitação falhar;
   */
  async getVisitaImprodutiva(almope, tipoPerfil) {
    try {
      let urlData = `${config.baseUrl}api/shared/visita_improdutiva/improdutivas`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          almope,
          tipoPerfil
        }
      })
      return res.data
    } catch (err) {
      console.error(err)
      throw err
    }
  },

  async getVisitaImprodutivaPorOperador(almope, tipoPerfil) {
    try {
      let urlData = `${config.baseUrl}api/shared/visita_improdutiva/improdutivas_operador`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          almope,
          tipoPerfil
        }
      })
      let columns = ['(%) SEM 1', '(%) SEM 2', '(%) SEM 3', '(%) SEM 4']

      for (let i = 0; i < columns.length; i++) {
        let allNulls = true

        for (let j = 0; j < res.data.length; j++) {
          if (res.data[j][columns[i]] !== null) {
            allNulls = false
            break
          }
        }

        if (allNulls) {
          for (let j = 0; j < res.data.length; j++) {
            delete res.data[j][columns[i]]
          }
        }
      }

      res.data.forEach(Utils.replaceNulls)
      return res.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export default DadosOnlineOperadorVisitaTecnicaService
