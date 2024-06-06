import { serviceUser } from "./http-client.service";

class WebSocketClient {
    constructor(url) {
      this.url = url;
      this.ws = null;
      this.messageCallbacks = [];
    }
  
    connect( ) {
      this.ws = new WebSocket(this.url);
  
      this.ws.onopen = () => {
        console.log('Connected to WebSocket server');
        const user = serviceUser.get(); 
        this.sendMessage({ mode: 'cnx', type: "USER",    username:   ( user==null || user == undefined ? "unknown" : user.email)   }) ;
      };
  
      this.ws.onmessage = (event) => {
        console.log('Received from server:', event.data);
        this.messageCallbacks.forEach(callback => callback(event.data));
 
      };
  
      this.ws.onclose = () => {
        console.log('Disconnected from WebSocket server');
      };
    }
  
    disconnect() {
      if (this.ws) {
        this.ws.close();
      }
    }
  
    sendMessage(message) {
      if (this.ws) {
        this.ws.send(  JSON.stringify(message)   );
      }
    }
  
    addMessageListener(callback) {
      this.messageCallbacks.push(callback);
    }
  
    removeMessageListener(callback) {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    }
  }
export default WebSocketClient;