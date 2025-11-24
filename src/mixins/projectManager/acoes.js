import config from '../../core/config'

const acoes = {
  methods: {
    async atualizarUltimasInformacoes(data) {
      let urlData = `${config.baseUrl}api/shared/project_manager/solicitacao/atualizacoes`
      await this.$api.post(urlData, data)
    },
    async cadastrarNotificacao(data, notification = true) {
      if (notification) {
        let urlData = `${config.baseUrl}api/shared/project_manager/notificacao/cadastro/`
        await this.$api.post(urlData, data)
      }
    }
  }
}

export default acoes
