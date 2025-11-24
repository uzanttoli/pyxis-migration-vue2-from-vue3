export class MediaDimensions {
  /**
   * Método estático que recebe um arquivo de vídeo
   * do tipo file e retora um objeto com dois parâmetros
   * que são: width e height (largura e altura respectivamente)
   */
  static getVideoDimensionsFromFile(file) {
    /**
     * instanciamos aqui uma promisse porque
     * precisamos tratar esses métodos de
     * forma assíncrona
     */
    return new Promise(resolve => {
      /**
       * instanciamos o FileReader para carregar
       * o arquivo file dentro de nosso
       * elemento de vídeo que será criado
       */
      const reader = new FileReader()
      /**
       * Agora que temos uma instancia do FileReader
       * vamos utilizar a função onload que é executada
       * sempre que carregar o arquivo file, que no
       * nosso caso é executada a partir de outra
       * função do FileReader chamada readAsDataURL
       */
      reader.onload = () => {
        /**
         * Criamos um elemento de vídeo para armazenar
         * temporareamente o vídeo que será verificado
         */
        const video = document.createElement('video')
        /**
         * Inserindo o resultado do readAsDataUrl na
         * propriedade src do elemento de vídeo e
         * consequentemente disparando o método
         * onloadeddata do mesmo elemento
         */
        video.src = reader.result

        /**
         * Temos um método muito importante de
         * nosso elemento de vídeo, após carregar o
         * arquivo de vídeo para o elemento vai entrar
         * nesse método, onde vamos resolver nossa
         * promisse e entregar a largura e altura do
         * vídeo através das propriedades videoWidth
         * e videoHeight
         */
        video.onloadeddata = () =>
          /**
           * Objeto que será entregue após carregar
           * o arquivo file dentro do elemento
           * temporário.
           */
          resolve({
            width: video.videoWidth,
            height: video.videoHeight
          })
      }

      /**
       * Chamamos a função readAsDataURL para
       * carregar o file e disparar a função
       * do reader chamada onload
       */
      reader.readAsDataURL(file)
    })
  }

  /**
   * Método estático que recebe um arquivo de imagem
   * do tipo file e retora um objeto com dois parâmetros
   * que são: width e height (largura e altura respectivamente)
   */
  static getImageDimensionsFromFile(file) {
    /**
     * Já sabemos o porquê dessa promisse agora
     */
    return new Promise(resolve => {
      /**
       * Também sabemos o porquê usamos o reader
       */
      const reader = new FileReader()
      /**
       * Acho que já está pegando a ideia
       */
      reader.onload = () => {
        /**
         * Eita, coisas diferentes, pois bem,
         * usamos um método nativo do javascript
         * que cria um elemento de imagem, da mesma
         * forma que antes precisamos para o vídeo
         */
        const img = new Image()
        /**
         * Nem tenho o que escrever aqui mais
         */
        img.src = reader.result

        /**
         * perceba que o método da imagem é diferente
         * do método do vídeo, porém para nossa situação
         * vai servir para o mesmo fim que é ser executado
         * após ter uma mídia devidamente carregada dentro
         * do elemento criado temporariamente
         */
        img.onload = () =>
          resolve({
            width: img.naturalWidth,
            height: img.naturalHeight
          })
      }
      /**
       * Se antes já não tinha o que escrever, imagina agora.
       */
      reader.readAsDataURL(file)
    })
  }
}
