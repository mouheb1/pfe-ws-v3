const WebSocket = require('ws');
const { envirement } = require('../configures/global.configure');
const { historyService } = require('./history.service');
const { clientService } = require('./client.service');
const ClientStatus = require('../enum/ClientStatus');

// In-memory object to track history creation in the current session


// Create a WebSocket server
const wss = new WebSocket.Server({ port: envirement.ws.port, host: envirement.ws.hostname });
console.log(`Server WebSocket is running on ws://${envirement.ws.hostname}:${envirement.ws.port}`);

function sendData(destination, msgStr) {
  clientService.selectAll().forEach(client => {
    if (client.socket == destination) {
      client.socket.send(JSON.stringify(msgStr));
    }
  });
}
function sendDataToUsers(msgStr) {
  clientService.selectAllUsers().forEach(client => {
    client.socket.send(JSON.stringify(msgStr));
  });
}


// Function to broadcast a message to all clients80
function recieveData(message, sender) {
  console.log('Received data string :', message.toString());
  // console.log(clientService. selectAll());
  try {
    const data = JSON.parse(message);
    if (!data.hasOwnProperty('mode')) { sender.send("error: cannot foud property mode "); return; }

    if (data.mode == "cnx") {
      if (!data.hasOwnProperty('type')) { sender.send("error: cannot foud property type "); return; }
      clientService.update(sender, data.username, data.type);
      const clientConnected = clientService.selectBySocket(sender);

      sendData(sender, {
        username: clientConnected.username,
        type: clientConnected.type,
        timestamp: clientConnected.timestamp,
        mode: clientConnected.mode,
        status: clientConnected.status
      });
      
      sendDataToUsers({
        username: clientConnected.username,
        type: clientConnected.type,
        timestamp: clientConnected.timestamp,
        mode: clientConnected.mode,
        status: clientConnected.status
      });
    }
    if (!data.hasOwnProperty('content')) { sender.send("error: cannot foud property content "); return; }
    if (data.mode == "data") {

      historyService.insert(data.content).then(response => { console.log(response); }).catch(error => { console.error(error); });

      sendData(sender, data);
      sendDataToUsers(data);
    }


  } catch (error) {
    console.error('Error parsing JSON:', error);
    sender.send('Error parsing JSON');
  }



}

// Event handler when a client connects
wss.on('connection', function connection(ws) {
  console.log('New client connected');
  //   addClient(ws); 
  clientService.add(ws, null, null);
  ws.send('Welcome to the WebSocket server!');

  // Event handler when the server receives a message from a client
  ws.on('message', function incoming(message) {
    recieveData(message, ws);
  });

  // Event handler when a client disconnects
  ws.on('close', function close() {
    console.log('Client disconnected');
    // createdHistories = {}
    const clientDisconnected = clientService.selectBySocket(ws);
    sendDataToUsers({
      username: clientDisconnected.username,
      type: clientDisconnected.type,
      timestamp: clientDisconnected.timestamp,
      mode: clientDisconnected.mode,
      status: ClientStatus.DISCONNECTED
    });
    clientService.delete(ws);
  });
}); 
