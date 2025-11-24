import config from '../../../core/config'
import axios from 'axios'
import store from '../../../store/store'

export default async function registrarMudancaSmartsales(tipoAtualizacao, ip, almope) {
  let data = {
    ALMOPE_ATUALIZACAO: almope,
    TIPO_ATUALIZACAO: tipoAtualizacao,
    IP_MAQUINA_ATUALIZACAO: ip
  }
  const token = store.getters.token
  let urlData = `${config.baseUrl}api/shared/smartsales/configuracao/registrar_log_mudancas_smartsales`
  await axios.post(urlData, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
