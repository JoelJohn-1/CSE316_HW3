import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import AddSong_Transaction from '../components/AddSong_Transaction.js'
import MoveSong_Transaction from '../components/MoveSong_Transaction.js'
import DeleteSong_Transaction from '../components/DeleteSong_Transaction.js'
import EditSong_Transaction from '../components/EditSong_Transaction.js'
import api, { getAllPlaylists } from '../api'
export const GlobalStoreContext = createContext({});

// OUR TRANSACTIONS
// import MoveSong_Transaction from './transactions/MoveSong_Transaction.js';
// import EditSong_Transaction from './transactions/EditSong_Transaction.js';
// import DeleteSong_Transaction from './transactions/DeleteSong_Transaction';

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();
// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        listIdToDelete: null,
        songIndexToDelete: null,
        songIndexToEdit: null,
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function asyncUpdateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function asyncGetListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        asyncGetListPairs(playlist);
                    }
                }
                asyncUpdateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    //THIS FUNCTION PROCESSES CREATING A LIST
    store.createNewList = function () {
        async function asyncCreateNewList() {
           var playlist = {
                name: 'Untitled',
                songs: []
            }
            let response = await api.createNewList(playlist);
            if (response.data.success) {
                async function getListPairs(playlist) {
                    let old_id = response.data.id;
                    response = await api.getPlaylistPairs();
                    if (response.data.success) {
                        let pairsArray = response.data.idNamePairs;
                        storeReducer({
                            type: GlobalStoreActionType.CREATE_NEW_LIST,
                            payload: {
                                idNamePairs: pairsArray,
                                currentList: playlist
                            }
                        });
                        store.setCurrentList(old_id);
                    }
                }          
                getListPairs(playlist);
            }
        }

       asyncCreateNewList();
    }
    store.markListForDeletion = function (id) {
        store.listIdToDelete = id;
    }

    store.markSongForDeletion = function (id) {
        store.songIndexToDelete = id;
    }

    store.markSongForEditing = function (id) {
        store.songIndexToEdit = id;
        // store.oldTitle = store.currentList.songs[id].title;
    
        // store.oldArtist = store.currentList.songs[id].artist;
        // store.oldYTID = store.currentList.songs[id].youTubeId;
        
    }

    store.editSong = function (title, artist, ytID) {
        let playlist = store.currentList;
        playlist.songs[store.songIndexToEdit].title = title;
        playlist.songs[store.songIndexToEdit].artist = artist;
        playlist.songs[store.songIndexToEdit].youTubeId = ytID;
        async function asyncUpdateList(playlist) {
            let response = await api.updatePlaylistById(playlist._id, playlist);
            if (response.data.success)
                store.setCurrentList(store.currentList._id);
        }
        asyncUpdateList(store.currentList);
    }

    store.addEditSongTransaction = function(title, artist, ytID) {
        let songs = store.currentList.songs;
        let editTransaction = new EditSong_Transaction(store, store.songIndexToEdit, songs[store.songIndexToEdit].artist, songs[store.songIndexToEdit].title, songs[store.songIndexToEdit].youTubeId,
            artist, title, ytID);
            tps.addTransaction(editTransaction);
    }
    //THIS FUNCTION PROCESSES DELETING A LIST
    store.deleteList = function () {
        async function asyncDeleteList(id) {
            let response = await api.deleteList(id);
            async function getListPairs() {
                response = await api.getPlaylistPairs();
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: pairsArray
                    });
                }
            }   
            getListPairs();
        }   
        asyncDeleteList(store.listIdToDelete);
    }

    store.swapSongs = function(sourceId, targetId) {
        let newSongList = store.currentList.songs;
        [newSongList[sourceId], newSongList[targetId]] = [newSongList[targetId], newSongList[sourceId]];
        async function asyncUpdateList(playlist) {
            let response = await api.updatePlaylistById(playlist._id, playlist);
            if (response.data.success)
                store.setCurrentList(store.currentList._id);
        }
        asyncUpdateList(store.currentList);
    }

    store.addSwapSongsTransaction = function(sourceId, targetId) {
        let moveTransaction = new MoveSong_Transaction(store, sourceId, targetId);
        tps.addTransaction(moveTransaction);
    }

    store.addMoveAfterDelete = (index, oldSong) => {
        let newList = store.currentList;
        newList.songs.splice(index, 0, oldSong);
        async function asyncUpdateList(playlist) {
            let response = await api.updatePlaylistById(playlist._id, playlist);
            if (response.data.success)
                store.setCurrentList(store.currentList._id);
        }
        asyncUpdateList(store.currentList);
    }

    store.deleteSong = function () {
        if (store.songIndexToDelete == -1) {
            store.songIndexToDelete = store.currentList.songs.length - 1;
        }
        let newSongList = store.currentList.songs;
        newSongList.splice(this.songIndexToDelete, 1);
        async function asyncUpdateList(playlist) {
            let response = await api.updatePlaylistById(playlist._id, playlist);
            if (response.data.success)
                store.setCurrentList(store.currentList._id);
        }
        asyncUpdateList(store.currentList);
    }

    store.addDeleteSongTransaction = function () {
        let deleteTransaction = new DeleteSong_Transaction(store, store.songIndexToDelete, store.currentList.songs[store.songIndexToDelete]);
        tps.addTransaction(deleteTransaction);
    }
    
    store.addSong = function() {
        let newSongList = store.currentList.songs;
        let defaultSong = {
            "title": "Untitled",
            "artist": "Unknown",
            "youTubeId": "dQw4w9WgXcQ"
        }
        newSongList.push(defaultSong);
        async function asyncUpdateList(playlist) {
            let response = await api.updatePlaylistById(playlist._id, playlist);
            if (response.data.success)
                store.setCurrentList(store.currentList._id);
        }
        asyncUpdateList(store.currentList);
      
    }

    store.addAddSongTransaction = function () {
        let addtransaction = new AddSong_Transaction(store);
        tps.addTransaction(addtransaction);
    }
    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        tps.clearAllTransactions();
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }


    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}