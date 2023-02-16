import {makeAutoObservable} from "mobx";

class Friends {
    constructor() {
        this.list = [];
        this.outList = [];
        this.inList = [];

        this.loading = false;
        this.loaded = false;

        makeAutoObservable(this, {}, { deep: true });
    }

    socketMessageHandler (body) {
        switch (body.type) {
            case 'friends-request-in':
                this.addUserTo(body.data, this.inList);
                break;
            case 'friends-request-out':
                this.addUserTo(body.data, this.outList);
                break;
            case 'friends-add-in':
                this.replaceUserFromTo(body.data.login, this.outList, this.list);
                break;
            case 'friends-add-out':
                this.replaceUserFromTo(body.data.login, this.inList, this.list);
                break;
            case 'friends-remove-in':
                this.replaceUserFromTo(body.data.login, this.list, this.outList);
                break;
            case 'friends-remove-out':
                this.replaceUserFromTo(body.data.login, this.list, this.inList);
                break;
            case 'friends-remove-in-request-in':
                this.deleteUserFrom(body.data.login, this.outList);
                break;
            case 'friends-remove-in-request-out':
                this.deleteUserFrom(body.data.login, this.inList);
                break;
            case 'friends-remove-out-request-in':
                this.deleteUserFrom(body.data.login, this.outList);
                break;
            case 'friends-remove-out-request-out':
                this.deleteUserFrom(body.data.login, this.outList);
                break;
            default: break;
        }
    }

    addUserTo (user, to) {
        console.log(`add ${ user.login } to`, to);
        console.log(JSON.parse(JSON.stringify(to)));
        to.push(user);
    }

    replaceUserFromTo (login, from, to) {
        console.log(`replace ${ login } from`, from, 'to', to);
        console.log(JSON.parse(JSON.stringify(to)));
        console.log(JSON.parse(JSON.stringify(from)));
        this.addUserTo(this.deleteUserFrom(login, from), to);
    }

    deleteUserFrom (login, from) {
        console.log(`delete ${ login } from`, from);
        console.log(JSON.parse(JSON.stringify(from)));
        for (let i = 0; i < from.length; i++) {
            if (from[i].login === login) {
                return from.splice(i, 1)[0];
            }
        }
    }

    setSocket (socket) {
        socket.on('message', this.socketMessageHandler.bind(this));
    }
}

export default new Friends();