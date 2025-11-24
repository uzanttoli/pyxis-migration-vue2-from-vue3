import axios from 'axios'
import config from '@/core/config.js'
const FileService = {
  async getFileUrl(folder, id) {
    let url = `${config.fileIOUrl}api/arquivos/get_arquivo_2/${folder}/${id}.png`
    return url
  },
  async getFolderUrl(folder) {
    let url = `${config.fileIOUrl}api/arquivos/get_arquivo_2/${folder}/`
    return url
  },
  async upload(folder, file, callback = null) {
    const urlData = `${config.fileIOUrl}api/arquivos/upload_arquivo_2/${folder}`
    const formData = new FormData()
    formData.append('arquivo', file)
    const res = await axios.post(urlData, formData, callback)
    return res.data
  },
  async uploadBatch(folder, files, callback = null) {
    const urlData = `${config.fileIOUrl}api/arquivos/upload_arquivos_batch/${folder}`
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('arquivos[]', files[i])
    }
    const res = await axios.post(urlData, formData, callback)
    return res.data
  }
}

export default FileService
