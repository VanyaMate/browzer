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

    setSocket (socket) {
        socket.on('message', (data) => {
            if (data.convId) {
                const conversation = this.getById(data.convId);
                if (conversation) {
                    conversation.messages = [data, ...conversation.messages];
                }
            }
        });
    }

    get needToGetConversationData () {
        return this.loading === false && this.loaded === false;
    }
}

export default new Conversations();