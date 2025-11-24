import Vue from 'vue'
import config from '@/core/config'

const TratativaBkoVendasService = {
  /**
   * Puxa casos para tratativa, permitindo diferentes ações dependendo do caso.
   *
   * @param { Object } params - Objeto contendo os parâmetros da solicitação.
   * @param { Object } params.formulario - Dados do formulário (ex: informações preenchidas pelo usuário).
   * @param { string } params.segmento - Segmento da fila, obtido de `this.$route.params.fila`.
   * @param { string } params.action - Ação que será executada (valor de `action`).
   * @param { string } params.numOcorrencia - Número de ocorrência, obtido de `this.dadosParaTratativa.HASH_MAILING`.
   * @param { string|null } params.dataAgendamento - Data de agendamento (pode ser `null` inicialmente).
   * @param { string } params.usuario - Usuário responsável, obtido de `this.usuario.almope`.
   * @param { string } params.produto - Produto relacionado, obtido de `this.$route.query.queueOf`.
   * @param { string } params.procedureOperation - Procedimento relacionado à fila, obtido de `this.configTabulador[0].FILA_PROCEDURE`.
   * @param { string|null } params.meioContato - Meio de contato (pode ser `null` inicialmente).
   * @param { boolean|null } params.ativoRealizado - Indicador de se o ativo foi realizado (pode ser `null` inicialmente).
   * @param { boolean|null } params.contratoInstalado - Indicador de se o contrato foi instalado (pode ser `null` inicialmente).
   * @param { string|null } params.motivoMacro - Motivo macro, se disponível (pode ser `null` inicialmente).
   * @param { string|null } params.motivoMicro - Motivo micro, se disponível (pode ser `null` inicialmente).
   *
   * @throws { Error } Lança um erro se a solicitação falhar.
   *
   * @example
   * // Status da tratativa:
   * Status:{
   *   NovoCaso: 1,
   *   Agendamento: 3,
   *   Salvar: 10,
   * };
   */
  async processarOperacoesTratativas({ ...params }) {
    try {
      const urlData = `${config.baseUrl}api/shared/service_to_sales/backoffice/tratativa_mailing/casos/processar`
      const response = await Vue.prototype.$api.post(urlData, {
        params: {
          ...params
        }
      })
      return response.data
    } catch (Error) {
      console.error(Error)
      throw Error
    }
  },

  async getOpcoesAgendamento(idForm) {
    try {
      const urlData = `${config.baseUrl}api/shared/formularios/config/opcoes_agendamento`
      const response = await Vue.prototype.$api.get(urlData, {
        params: {
          idForm
        }
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export default TratativaBkoVendasService
