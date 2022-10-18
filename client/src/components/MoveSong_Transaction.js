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
export default class MoveSong_Transaction extends jsTPS_Transaction {
    constructor(store, initOldSongIndex, initNewSongIndex) {
        super();
        this.store = store;
        this.oldSongIndex = initOldSongIndex;
        this.newSongIndex = initNewSongIndex;
    }

    doTransaction() {
        this.store.swapSongs(this.oldSongIndex, this.newSongIndex);
    }
    
    undoTransaction() {
        this.store.swapSongs(this.newSongIndex, this.oldSongIndex);
    }
}