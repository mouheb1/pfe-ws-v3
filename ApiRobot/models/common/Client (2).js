const ClientStatus = require('../../enum/ClientStatus');
const ClientType = require('../../enum/ClientType'); 

class Client {
    constructor(username = '', type = ClientType.USER, socket = null, timestamp = new Date(), mode = '', status = '') {
        this.username = username;
        this.type = type;
        this.socket = socket;
        this.timestamp = timestamp;
        this.mode = mode;
        this.status = status;
    }

    toString() {
        return `Client(username=${this.username}, type=${this.type}, socket=${this.socket ? 'Connected' : 'Not Connected'}, timestamp=${this.timestamp}, mode=${this.mode}, status=${this.status})`;
    }

    toJSON() {
        return {
            username: this.username,
            type: this.type,
            socket: this.socket,
            timestamp: this.timestamp,
            mode: this.mode,
            status: this.status
        };
    }

    static builder() {
        return new ClientBuilder();
    }
}

class ClientBuilder {
    constructor() {
        this.username = '';
        this.type = ClientType.USER;
        this.socket = null;
        this.timestamp = new Date();
        this.mode = ''; // Initialize mode with an empty string
        this.status =  ''; // Initialize status with an empty string
    }

    setUsername(username) {
        this.username = username;
        return this;
    }

    setType(type) {
        this.type = type;
        return this;
    }

    setSocket(socket) {
        this.socket = socket;
        return this;
    }

    setTimestamp(timestamp) {
        this.timestamp = timestamp;
        return this;
    }

    setMode(mode) {
        this.mode = mode;
        return this;
    }

    setStatus(status) {
        this.status = status;
        return this;
    }

    build() {
        return new Client(this.username, this.type, this.socket, this.timestamp, this.mode, this.status);
    }
}

module.exports = Client;
