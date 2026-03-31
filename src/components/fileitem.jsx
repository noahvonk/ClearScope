import React, { useState, useEffect } from 'react';

export default function FileItem({ index, file, selectedFiles, setSelectedFiles }) {

    const fileIndex = index;

    function handleDelete(){
        const newSelectedFiles = selectedFiles.filter((_, index) => index !== fileIndex);
        setSelectedFiles(newSelectedFiles);
    }
    // Create a ui item to represent a file that has been uploaded, its name, file type, its size and a delete button to remove it from the list of uploaded files.
    return(
        <div className="file-item-container">
            <div className="file-item-row">            
                <h3>{file.name}</h3>
                <p>Size: {file.size} bytes</p>
            </div>
            <div className="file-item-row">
                <p>{file.type}</p>

                <button className="delete-button" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    )
}