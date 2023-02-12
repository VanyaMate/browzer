import {makeAutoObservable} from "mobx";

class Conversations {
    constructor() {
        this.list = [];
        this.loading = false;
        this.loaded = false;

        makeAutoObservable(this, {}, { deep: true });
    }

    getById (id) {
        return this.list.filter((conv) => conv.id === id)[0];
    }

    socketMessageHandler (body) {
        switch (body.type) {
            case 'message':
                const conversation = this.getById(body.data.convId);
                if (conversation) {
                    conversation.messages = [body.data, ...conversation.messages];
                }
                break;
            case 'new-conversation':
                this.list.push(body.data.data);
                break;
            case 'delete-conversation':
                for (let i = 0; i < this.list.length; i++) {
                    if (this.list[i].id === body.data.id) {
                        this.list.splice(i, 1);
                        break;
                    }
                }
                break;
            default: break;
        }
    }

    setSocket (socket) {
        socket.on('message', this.socketMessageHandler.bind(this));
    }

    get needToGetConversationData () {
        return this.loading === false && this.loaded === false;
    }
}

export default new Conversations();