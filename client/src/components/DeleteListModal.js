import React from 'react';
import { GlobalStoreContext } from '../store'

// eslint-disable-next-line
import { useContext, useState } from 'react'

function DeleteListModal() {

    const { store } = useContext(GlobalStoreContext);

    function handleConfirmDelete() {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
        store.deleteList();
    }

    function handleCancelDelete() {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
    }
    
       let deleteListModal = 
            <div 
                class="modal" 
                id="delete-list-modal" 
                data-animation="slideInOutLeft">
                    <div class="modal-root" id='verify-delete-list-root'>
                        <div class="modal-north">
                            Delete playlist?
                        </div>
                        <div class="modal-center">
                            <div class="modal-center-content">
                                Are you sure you wish to permanently delete the playlist?
                            </div>
                        </div>
                        <div class="modal-south">
                            <input type="button" 
                                id="delete-list-confirm-button" 
                                class="modal-button" 
                                value='Confirm' 
                                onClick={handleConfirmDelete}
                                />
                            <input type="button" 
                                id="delete-list-cancel-button" 
                                class="modal-button" 
                                value='Cancel'
                                onClick={handleCancelDelete}
                                />
                        </div>
                    </div>
            </div>
    return (
        deleteListModal
    );
}

export default DeleteListModal;