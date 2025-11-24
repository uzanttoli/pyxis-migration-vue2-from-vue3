import axios from 'axios'

export async function useFileUpload(file: File, endpoint: string, user: number) {
  const extension = file.name.split('.').pop()
  const newFileId = `${user}_${new Date().getTime()}.${extension}`
  console.log(newFileId)

  const fileNewName = new File([file], newFileId, { type: file.type })

  const formData = new FormData()
  formData.append('arquivo', fileNewName)

  const configAxios = {
    onUploadProgress: (progressEvent: any) => {
      const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      return percentage
    }
  }

  const upload = await axios.post(endpoint, formData, configAxios)
  console.log(upload)
}
