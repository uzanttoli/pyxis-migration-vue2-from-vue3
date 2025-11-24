import axios from 'axios'
import store from '../store/store'

const api = axios.create({
  baseURL: 'http://172.16.252.214:4200/index.php/',
  timeout: 40000,
  headers: { 'Content-Type': 'application/json' }
})

const success = res => res

const error = err => {
  if (err.response && 401 === err.response.status) {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    localStorage.removeItem('sessionID')
    localStorage.removeItem('ip')
    localStorage.removeItem('menuItens')
    window.location = '/'
  } else {
    return Promise.reject(err)
  }
}

api.interceptors.response.use(success, error)

api.interceptors.request.use(
  function (config) {
    const token = store.getters.token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default api
