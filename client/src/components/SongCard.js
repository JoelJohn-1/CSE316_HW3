// eslint-disable-next-line
import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
// eslint-disable-next-line
    const { store } = useContext(GlobalStoreContext);

    const { song, index } = props;
    let cardClass = "list-card unselected-list-card";
    
    function handleToggleDelete(event) {
        event.stopPropagation();
        let _id = event.target.id;
            if (_id.indexOf('delete-song-') >= 0)
                _id = ("" + _id).substring("delete-song-".length);
        toggleDelete(_id);
    }

    function toggleDelete(id) {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.add("is-visible");
        // store.markListForDeletion(id);
        console.log(id);
    }

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
                onClick={handleToggleDelete}
            />
        </div>
    );
}

export default SongCard;