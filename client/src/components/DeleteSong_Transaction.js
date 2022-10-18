import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * MoveSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class DeleteSong_Transaction extends jsTPS_Transaction {
    constructor(store, oldIndex, oldSong) {
        super();
        this.store = store;
        this.oldIndex = oldIndex;
        this.oldSong = oldSong;
    }

    doTransaction() {
        this.store.deleteSong();
    }
    
    undoTransaction() {
        this.store.addMoveAfterDelete(this.oldIndex, this.oldSong);
    }
}