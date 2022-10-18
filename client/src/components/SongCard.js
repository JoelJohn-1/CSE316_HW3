// eslint-disable-next-line
import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
// eslint-disable-next-line
    const { store } = useContext(GlobalStoreContext);

    const { song, index } = props;

    const [ isDragging, setDragging ] = useState(false);
    const [ draggedTo, setDraggedTo ] = useState(false);

    let cardClass = "list-card unselected-list-card";
    
    function handleToggleDelete(event) {
        event.stopPropagation();
        let _id = event.target.id;
            if (_id.indexOf('remove-song-') >= 0)
                _id = ("" + _id).substring("remove-song-".length);
        toggleDelete(_id);
    }

    function toggleDelete(id) {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.add("is-visible");
        store.markSongForDeletion(id);
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        let _id = event.target.id;
            if (_id.indexOf('song-') >= 0)
                _id = ("" + _id).substring("song-".length, "song-".length + 1);
        toggleEdit(_id);
    }
    function toggleEdit(id) {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");
        
        store.markSongForEditing(id);
        
    }
    
    function handleDragStart(event) {
        event.dataTransfer.setData("song", event.target.id);
        setDragging(true);

    }

    function handleDragOver(event) {
        event.preventDefault();

        setDraggedTo(true);
        
    }

    function handleDragEnter(event) {
        event.preventDefault();

        setDraggedTo(true);
    }
    function handleDragLeave(event) {
        event.preventDefault();

        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        let sourceId = event.dataTransfer.getData("song");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1, sourceId.indexOf("-") + 2);
        let targetId = event.target.id;
        targetId = targetId.substring(targetId.indexOf("-") + 1, targetId.indexOf("-") + 2);
        setDragging(false);
        setDraggedTo(false);
        console.log(sourceId);
        console.log(targetId);

        if (sourceId != targetId) {
            store.addSwapSongsTransaction(sourceId, targetId);
        }
    }
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDoubleClick={handleToggleEdit}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"

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