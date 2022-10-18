import React, { Component, StrictMode } from 'react';
import { GlobalStoreContext } from '../store'
import { useContext, useState } from 'react'

function EditSongModal() {

    const { store } = useContext(GlobalStoreContext);
    
    function handleConfirmEdit() {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");
        let title = document.getElementById("edit-song-title-input").value;
        let artist = document.getElementById("edit-song-artist-input").value;
        let ytID = document.getElementById("edit-song-youTubeId-input").value;
        store.editSong(title, artist, ytID);
    }

    function handleCancelEdit() {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");
    }
    

    // function handleTitleChange(event) {

    // }

    // function handleArtistChange(event) {
    //     console.log(store.oldArtist)
    // }

    // function handleYTIDChange(event) {
    // }


       let editSongModal = 
       <div 
       class="modal" 
       id="edit-song-modal" 
       data-animation="slideInOutLeft">
           <div class="modal-root" id='verify-edit-song-root'>
               <div class="modal-north">
                   Edit Song
               </div>
               <div class="modal-center">
                   <div >
                   <div id="edit-song-title-tag">
                       Title: <input type="text" id="edit-song-title-input"   /><br></br>    
                   </div>
                   <div id="edit-song-artist-tag">
                       Artist: <input type="text" id="edit-song-artist-input"/> <br></br>    
                   </div>
                   <div id="edit-song-youTubeId-tag">
                       YouTubeId: <input type="text" id="edit-song-youTubeId-input" /> <br></br>     
                   </div>
                   </div>
               </div>
               <div class="modal-south">
                   <input type="button" 
                       id="edit-song-confirm-button" 
                       class="modal-button" 
                       onClick={handleConfirmEdit}
                       value='Confirm' />
                   <input type="button" 
                       id="edit-song-cancel-button" 
                       class="modal-button" 
                       onClick={handleCancelEdit}
                       value='Cancel' />
               </div>
           </div>
   </div>
    return (
        editSongModal
    );
}

export default EditSongModal;