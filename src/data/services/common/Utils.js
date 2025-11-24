import config from '../../../core/config'
// import axios from 'axios'
import Vue from 'vue'

const Utils = {
  monthFilter(qdteMonth = 12, year) {
    const date = new Date()
    const currentYear = year ?? date.getFullYear()
    const nameMonth = [
      '',
      'JANEIRO',
      'FEVEREIRO',
      'MARÇO',
      'ABRIL',
      'MAIO',
      'JUNHO',
      'JULHO',
      'AGOSTO',
      'SETEMBRO',
      'OUTUBRO',
      'NOVEMBRO',
      'DEZEMBRO'
    ]

    return Array.from({ length: qdteMonth }, (_, index) => ({
      text: nameMonth[index + 1],
      value: `${currentYear}-${(index + 1).toString().padStart(2, '0')}-01`
    }))
  },

  yearFilter(qtdeYear = 2) {
    let currentYear = new Date().getFullYear()
    let years = Array.from({ length: qtdeYear }, (_, index) => ({
      text: currentYear - index,
      value: currentYear - index
    }))
    return years
  },

  oneCapitalLetter(string) {
    if (!string) return
  },

  replaceNulls(obj) {
    if (!obj) return
    for (let key in obj) {
      if (obj[key] === null || obj[key] === '') {
        obj[key] = '-'
      }
    }
  },

  normalizeObj(obj) {
    let dados = Array.isArray(obj) ? obj[0] : obj
    if (!dados) return []
    let dadosArray = []
    for (let key in dados) {
      dadosArray.push({
        title: key,
        valor: dados[key]
      })
    }

    return dadosArray
  },

  /**
   * Listar produtos disponiveis
   * @returns {Array}
   *
   */
  async getProductAvailable(relatorio, perfil, almope) {
    try {
      const urlData = `${config.baseUrl}api/shared/produtos/listar`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          relatorio,
          perfil,
          almope
        }
      })

      return res.data
    } catch (Error) {
      console.error(Error)
      throw Error
    }
  },

  /**
   * Listar almopes
   * @param {string} almopes
   * @returns {Array}
   */
  async getAlmopes(almopes) {
    try {
      const url = `${config.baseUrl}api/shared/pyxis/perfis_ativos`
      const res = await Vue.prototype.$api.get(url, {
        params: {
          almopes: almopes
        }
      })
      return res.data
    } catch (Error) {
      console.error(Error)
      throw Error
    }
  },
  async getListSkillSummaryBasic(produto) {
    try {
      const url = `${config.baseUrl}api/shared/utils/summary_skill/listar`
      const res = await Vue.prototype.$api.get(url, {
        params: {
          produto
        }
      })
      return res.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  // async uploadFile(url) {
  //   const formData = new FormData()

  //   await axios.post(url, formData, {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('token')}`
  //     },
  //     onUploadProgress: progressEvent => {
  //       const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)

  //     }
  //   })
  // }
}

export default Utils
