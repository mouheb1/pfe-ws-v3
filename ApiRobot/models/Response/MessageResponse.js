class MsgReponseStatus {
    constructor(title = "Message", datestamp = new Date(), status = null, message = '') {
        this.title = title;
        this.datestamp = datestamp;
        this.status = status;
        this.message = message;
    }
    toString() {
        return `MsgReponseStatus(title=${this.title}, datestamp=${this.datestamp.toDateString()}, status=${this.status}, message=${this.message})`;
    }
    static builder() {
        return new MsgReponseStatusBuilder();
    }
}

class MsgReponseStatusBuilder {
    constructor() {
        this.title = "Message";
        this.datestamp = new Date();
        this.status = null;
        this.message = '';
    }

    setTitle(title) {
        this.title = title;
        return this;
    }

    setDatestamp(datestamp) {
        this.datestamp = datestamp;
        return this;
    }

    setStatus(status) {
        this.status = status;
        return this;
    }

    setMessage(message) {
        this.message = message;
        return this;
    }

    build() {
        return new MsgReponseStatus(this.title, this.datestamp, this.status, this.message);
    }
}

module.exports = MsgReponseStatus;
