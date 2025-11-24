class WebSocketService {
  constructor() {
    this.socket = null
  }

  connect(url) {
    this.socket = new WebSocket(url)

    this.socket.onopen = () => {
      console.log('WebSocket connection established.')
    }

    this.socket.onclose = () => {
      console.log('WebSocket connection closed.')
    }
  }
}

export default new WebSocketService()
