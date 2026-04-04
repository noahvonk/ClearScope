import React, { useState, useEffect } from 'react';

const deleteIconWhite = new URL('../../assets/images/trash-can-white.png', import.meta.url);
const deleteIconBlack = new URL('../../assets/images/trash-can.png', import.meta.url);

const preferences = require('../../preferences.json');

const maxSize = preferences.maxFileSize || 10 * 1024 * 1024; // max file size in MB, default to 10MB if not set in preferences

/**
 * Default function for the FileItem component, which represents an individual file in the list of selected files for upload.
 * It displays the file's name, size, type, and includes a delete button to remove the file from the selection.
 * The component also handles the styling of the file item, including highlighting files that exceed the maximum allowed size and formatting the file size for better readability.
 * @param {*} param0 - An object containing the props passed to the FileItem component, including index, file, selectedFiles, and setSelectedFiles.
 * @returns Tags to render a file item in the UI, including the file's name, size, type, and a delete button.
 */
export default function FileItem({ index, file, selectedFiles, setSelectedFiles }) {

    const fileIndex = index;

    // set delete icon color based on theme
    let deleteIcon = deleteIconBlack;
    if(document.body.classList.contains('dark-mode')){
        deleteIcon = deleteIconWhite;
    } else {
        deleteIcon = deleteIconBlack;
    }

    // if the file size is greater than the maximum allowed upload, highlight and mark for exclusion.
    // This saves the end user on credits and the max value can be adjusted in the settings tab.
    let classes = 'file-item-container';
    if(file.size > maxSize){
        classes += ' file-too-large';
    }

    // Sets the labels for the file sizes to show the proper units, and formats the file size to be more readable.
    // This is done by checking the file size against thresholds for bytes, kilobytes, and megabytes, and formatting the size accordingly with appropriate units.
    let fileSize = file.size;
    if(fileSize < 1024){
        fileSize = `${fileSize} bytes`;
    } else if(fileSize < 1024 * 1024){
        fileSize = `${(fileSize / 1024).toFixed(2)} KB`;
    } else {
        fileSize = `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
    }

    /**
     * Handles the deletion of a file. Removes it self from the file list.
     */
    function handleDelete(){
        const newSelectedFiles = selectedFiles.filter((_, index) => index !== fileIndex);
        setSelectedFiles(newSelectedFiles);
    }

    /***
     * Helper function to check if a value is null, undefined or an empty string. Used for checking file types that may not be present or are empty. This is important for ensuring that the application can handle files with missing or undefined types without crashing or displaying incorrect information.
     * @param {any} value - The value to check for null, undefined or empty string.
     * @returns {boolean} - Returns true if the value is null, undefined or an empty string, otherwise returns false.
     */
    function isNullOrEmpty(value){
        return value == null || value == undefined || value == "";
    }

    /**
     * Gets the string representation of the file type.
     * @returns {string} - The file type string in uppercase, or an empty string if not available.
     */
    function getFileTypeString(){
        let type = "";
        if(file.type.includes('/') && !isNullOrEmpty(file.type) ){
             type = file.type.split('/')[1]
        }
        if(!isNullOrEmpty(type)){
            return type.toUpperCase();
        }
        return "";
    }
    // Create a ui item to represent a file that has been uploaded, its name, file type, its size and a delete button to remove it from the list of uploaded files.
    return(
        <div className={classes}>
            <p className="incompatible-file-type-text">Incompatible file type</p>
            <p className="file-too-large-text">File too large.</p>
            <div className="file-item-row">            
                <h3>{file.name}</h3>
                <p>Size: {fileSize}</p>
            </div>
            <div className="file-item-row">
                <p><b>{getFileTypeString()}</b></p>

                <img className="image-button" src={deleteIcon} width="24" height="24" alt="Delete Icon" onClick={handleDelete} />
            </div>
        </div>
    )
}