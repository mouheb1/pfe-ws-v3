const ClientStatus = require('../enum/ClientStatus');
const ClientType = require('../enum/ClientType');
const Client = require("../models/common/Client");

clients = [];
function add(socket, username, type) {
    const existingClient = clients.find(client => client.socket === socket);
    if (!existingClient) {
        const newClient = Client.builder()
            .setMode("cnx")
            .setUsername(username)
            .setType(type)
            .setSocket(socket)
            .setStatus( ClientStatus.CONNECTED )
            .build();
        clients.push(newClient.toJSON());
    } else {
        console.log('Client with this socket already exists.');
    }
}
function update(socket, username, type) { 
    const clientIndex = clients.findIndex(client => client.socket === socket);
    if (clientIndex !== -1) {
        clients[clientIndex].username = username;
        clients[clientIndex].type = type;
    } else {
        console.log('Client not found.');
    }
}
function removeClient(socket) {  clients = clients.filter(client => client.socket !== socket);}

function getClientBySocket( socket ) {
    const clientIndex = clients.findIndex(client => client.socket === socket);
    if (clientIndex !== -1) {
        return clients[clientIndex];
    } 
    return null;
}
function getClientList() { return clients;}
function getClientUserList() {return clients.filter(client => client.type == ClientType.USER);}
function getClientRobotList() {return clients.filter(client => client.type == ClientType.ROBOT);}
module.exports = { clientService: { add: add, update: update, delete: removeClient , selectBySocket: getClientBySocket,  selectAll: getClientList ,  selectAllUsers: getClientUserList ,   selectAllRobots: getClientRobotList} };






// class ClientSerice {
//     constructor() {
//         this.clients = [];
//     }
//     add(socket , username, type ) {
//         const existingClient = this.clients.find(client => client.socket === socket);
//         if (!existingClient) {
//             const newClient = Client.builder()
//                 .setUsername(username)
//                 .setType(type)
//                 .setSocket(socket)
//                 .build();
//             this.clients.push(newClient);
//         } else {
//             console.log('Client with this socket already exists.');
//         }
//     }

//     update(socket, username, type) {
//         const clientIndex = this.clients.findIndex(client => client.socket === socket);
//         if (clientIndex !== -1) {
//             this.clients[clientIndex].username = username;
//             this.clients[clientIndex].type = type;
//         } else {
//             console.log('Client not found.');
//         }
//     }

//     removeClient(socket) {
//         this.clients = this.clients.filter(client => client.socket !== socket);
//     }

//     getClientList() {
//         return this.clients;
//     }
//     getClientUserList() {
//         return this.clients.filter(client => client.type !== ClientType.USER);
//     }
//     getClientRobotList() {
//         return this.clients.filter(client => client.type !== ClientType.ROBOT);
//     }
// }
// module.exports = ClientSerice;



