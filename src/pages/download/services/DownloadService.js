import Vue from 'vue'
import config from '@/core/config'

// const md5 = require('md5.js')

const DownloadService = {
  /**
   *
   * Arquivo para download
   *
   */
  dadosCompartilhados: [],
  async getArquivosParaDownload(idForm, nomeForm) {
    try {
      const urlData = `${config.baseUrl}api/shared/bases/download_arquivo`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          idForm,
          nomeForm
        }
      })

      let arrHref = []

      arrHref = res.data.map(item => {
        // const hashAttc = new md5().update(item.HREF).digest('hex')
        return { [item.HREF]: item.ID.toLowerCase() }
      })
      this.dadosCompartilhados = arrHref

      return res.data
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  async getLinkDownload(id) {
    console.log(id, this.dadosCompartilhados)
  },
  /**
   * Listar produtos disponiveis
   * @returns {Array}
   *
   */
  async getListarAnexo(produto, tipoPerfil, almope) {
    try {
      const urlData = `${config.baseUrl}api/shared/bases/listar_arquivos`
      const res = await Vue.prototype.$api.get(urlData, {
        params: { produto, tipoPerfil, almope }
      })
      return res.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export default DownloadService
