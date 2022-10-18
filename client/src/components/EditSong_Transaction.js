import jsTPS_Transaction from "../common/jsTPS.js"

export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(store, index, oldArtist, oldTitle, oldYouTubeId, newArtist, newTitle, newYouTubeId) {
        super();
        this.store = store;
        this.index = index;
        this.oldArtist = oldArtist;
        this.oldTitle = oldTitle;
        this.oldYouTubeId = oldYouTubeId;
        this.newArtist = newArtist;
        this.newTitle = newTitle;
        this.newYouTubeId = newYouTubeId;
    }

    doTransaction() {
        this.store.editSong(this.newTitle, this.newArtist, this.newYouTubeId);
    }
    
    undoTransaction() {
        this.store.songIndexToEdit = this.index;
        this.store.editSong(this.oldTitle, this.oldArtist, this.oldYouTubeId);
    }
}