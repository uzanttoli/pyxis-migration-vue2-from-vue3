import axios from 'axios'
import config from '@/core/config'

export class FileUploadService {
  constructor(file, relatorioData, callbacks) {
    this.file = file
    this.relatorioData = relatorioData
    this.callbacks = callbacks
    this.token = localStorage.getItem('token')
  }

  _prepareData() {
    const { dateFormated, dadosRelatorioSelecionado } = this.relatorioData

    const dataSplit = dateFormated.split('/')
    const dia = dataSplit[0]
    const mesAno = `${dataSplit[1]}-${dataSplit[2]}`
    const ano = dataSplit[2]

    const extensao = this.file.name.split('.').pop()
    const nomeArquivo = dadosRelatorioSelecionado[0].nomeArquivo
    const novoNomeArquivo = `${dia}_${nomeArquivo}`

    const arquivoRenomeado = new File([this.file], `${novoNomeArquivo}.${extensao}`, {
      type: this.file.type
    })

    const formData = new FormData()
    formData.append('arquivo', arquivoRenomeado)

    return { formData, mesAno, ano }
  }

  _buildUrls(mesAno, ano) {
    const { dadosRelatorioSelecionado, produtoRelatorioSelecionado } = this.relatorioData
    const commonPath = `${dadosRelatorioSelecionado[0].nomeArquivo}/${mesAno}/${ano}/${produtoRelatorioSelecionado}`

    const urlUpload = `${config.baseUrl}api/shared/relatorios/arquivos/upload_arquivo/${commonPath}`
    const urlUploadAS02 = `http://10.64.175.49:4300/receptivo/index.php/api/arquivos/upload_arquivo/${commonPath}`

    return { urlUpload, urlUploadAS02 }
  }

  async executeUpload() {
    try {
      const { formData, mesAno, ano } = this._prepareData()

      const { urlUploadAS02 } = this._buildUrls(mesAno, ano)

      let progresso1 = { loaded: 0, total: 1 }
      let progresso2 = { loaded: 0, total: 1 }

      const configAxios = (progressTracker, headers = undefined) => ({
        headers: headers,
        onUploadProgress: e => {
          Object.assign(progressTracker, e)

          const totalPercentage = Math.round(
            ((progresso1.loaded + progresso2.loaded) * 100) / (progresso1.total + progresso2.total)
          )
          if (this.callbacks.onProgress) {
            this.callbacks.onProgress(totalPercentage)
          }
        }
      })

      const promise1 = axios.post(urlUploadAS02, formData, configAxios(progresso1))
      // const promise2 = axios.post(urlUpload, formData, configAxios(progresso2, { 'Authorization': `Bearer ${this.token}` }))

      const results = await Promise.allSettled([promise1])

      if (this.callbacks.onSuccess) {
        this.callbacks.onSuccess(results)
      }
    } catch (error) {
      this.callbacks.onError(error)
    }
  }
}
