export default class KeyGen {
    static lastId = 0;
    static getId () {
        return ++KeyGen.lastId;
    }
}