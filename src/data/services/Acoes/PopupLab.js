// import Vue from 'vue'
import api from '@/plugins/axios.js'
import config from '@/core/config'

const PopupLabService = {
  async getListarRotasDisponiveis() {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/acoes/popuplab/listar-views`
      const res = await api.get(urlData)
      return res.data
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  /**
   *
   * @returns
   *  Listar regionais de acordo com
   */
  async getListarRegionais(produto, idRota) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/acoes/popuplab/listar-regionais`
      const res = await api.get(urlData, {
        params: {
          produto: produto,
          idRota: idRota
        }
      })
      return res.data
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  /**
   *
   *
   *
   */
  async criarPopup(criarPopup) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/acoes/popuplab/criar`
      await api.post(urlData, {
        Titulo: criarPopup.Titulo,
        Produto: criarPopup.Produto,
        Id_Menu_Rota: criarPopup.Id_Menu_Rota,
        Arquivo_Popup: criarPopup.Arquivo_Popup,
        Data_Expiracao: criarPopup.Data_Expiracao,
        Almope_Cadastro: criarPopup.Almope_Cadastro,
        Regional_Direcionada: criarPopup.Regional_Direcionada,
        Almope_Liberacao: criarPopup.Almope_Liberacao
      })
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  /**
   *
   * Atualizar dados popup
   */
  async atualizarDadosPopup(atualizarPopup) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/acoes/popuplab/popup-atualizar-dados`
      await api.post(urlData, atualizarPopup)
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  /**
   *
   * Listar popup disponiveis
   *
   */
  async getListarPopupDisponiveis(almope, regional, produto, rotaAcessada) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/acoes/popuplab/popup-lab-disponiveis`
      const result = await api.get(urlData, {
        params: {
          almope: almope,
          regional: regional,
          produto: produto,
          rotaAcessada: rotaAcessada
        }
      })

      return result.data
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  /**
   *
   * Listar todos popup
   *
   */
  async getListarTodosPopups(produto, tipoPerfil) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/acoes/popuplab/popup-config`
      const result = await api.get(urlData, {
        params: {
          produto: produto,
          tipoPerfil: tipoPerfil
        }
      })
      return result.data
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export default PopupLabService
