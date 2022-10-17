import React, { Component } from 'react';

function DeleteListModal() {
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
                                value='Confirm' />
                            <input type="button" 
                                id="delete-list-cancel-button" 
                                class="modal-button" 
                                value='Cancel' />
                        </div>
                    </div>
            </div>
    return (
        deleteListModal
    );
}

export default DeleteListModal;