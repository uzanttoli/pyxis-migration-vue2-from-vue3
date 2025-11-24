import Vue from 'vue'
import store from '@/store/store.js'
import { mapAndConvertKeys } from '@/utils/mapAndConvertKeys.js'

class BaseService {
  constructor(baseUrl, modelMap) {
    this.baseUrl = baseUrl
    this.modelMap = modelMap
  }

  async getAll() {
    try {
      const urlData = `${this.baseUrl}/get_all`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao buscar todos os dados:', error)
      throw error
    }
  }

  async getById(id) {
    try {
      const urlData = `${this.baseUrl}/get_by_id/${id}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao buscar dados pelo ID:', error)
      throw error
    }
  }

  async insert(data) {
    try {
      const almope = store.getters.usuario.almope
      const urlData = `${this.baseUrl}/insert`
      const payload = {
        ...mapAndConvertKeys(data, this.modelMap),
        CREATED_BY: almope,
        CREATED_AT: new Date()
      }
      const res = await Vue.prototype.$api.post(urlData, payload)
      return res.data
    } catch (error) {
      console.error('Erro ao inserir dados:', error)
      throw error
    }
  }

  async delete(id) {
    try {
      const urlData = `${this.baseUrl}/delete/${id}`
      const res = await Vue.prototype.$api.delete(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao deletar dados:', error)
      throw error
    }
  }

  async restore(id) {
    try {
      const urlData = `${this.baseUrl}/restore/${id}`
      const res = await Vue.prototype.$api.put(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao restaurar dados:', error)
      throw error
    }
  }

  async update(id, data) {
    try {
      const almope = store.getters.usuario.almope
      const urlData = `${this.baseUrl}/update/${id}`
      const payload = {
        ...mapAndConvertKeys(data, this.modelMap),
        UPDATED_BY: almope,
        UPDATED_AT: new Date()
      }
      const res = await Vue.prototype.$api.put(urlData, payload)
      return res.data
    } catch (error) {
      console.error('Erro ao atualizar dados:', error)
      throw error
    }
  }
}

export default BaseService
