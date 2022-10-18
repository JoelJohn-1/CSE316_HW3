import React, { Component } from 'react';
import { GlobalStoreContext } from '../store'
import { useContext, useState } from 'react'

function DeleteSongModal() {

    const { store } = useContext(GlobalStoreContext);

    function handleConfirmDelete() {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.remove("is-visible");
        store.addDeleteSongTransaction();
    }

    function handleCancelDelete() {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.remove("is-visible");
    }
    
       let deleteSongModal = 
            <div 
                class="modal" 
                id="delete-song-modal" 
                data-animation="slideInOutLeft">
                    <div class="modal-root" id='verify-delete-song-root'>
                        <div class="modal-north">
                            Delete song?
                        </div>
                        <div class="modal-center">
                            <div class="modal-center-content">
                                Are you sure you wish to permanently delete the song?
                            </div>
                        </div>
                        <div class="modal-south">
                            <input type="button" 
                                id="delete-song-confirm-button" 
                                class="modal-button" 
                                value='Confirm' 
                                onClick={handleConfirmDelete}
                                />
                            <input type="button" 
                                id="delete-song-cancel-button" 
                                class="modal-button" 
                                value='Cancel'
                                onClick={handleCancelDelete}
                                />
                        </div>
                    </div>
            </div>
    return (
        deleteSongModal
    );
}

export default DeleteSongModal;