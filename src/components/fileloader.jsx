import React, {useState, useEffect} from 'react';
import FileItem from './fileitem.jsx';

const uploadIconWhite = new URL('../../assets/images/up-loading-white.png', import.meta.url);
const uploadIconBlack = new URL('../../assets/images/up-loading.png', import.meta.url);

let preferences;

let maxSize;

export default function FileLoader({ setFilesUploading, setFiles }) {

    const [selectedFiles, setSelectedFiles] = useState([]);

    preferences = JSON.parse(window.electronAPI.readFile(window.electronAPI.getAppPath()));

    maxSize = preferences.maxFileSize || 10 * 1024 * 1024; // max file size in MB, default to 10MB if not set in preferences

    // sets the upload icon based on the current theme, defaults to black if no theme is set. This is done to ensure that the icon is visible in both light and dark modes. The icons are stored in the assets folder and imported as URLs.
    let uploadIcon = uploadIconBlack;
    if(document.body.classList.contains('dark-mode')){
        uploadIcon = uploadIconWhite;
    } else {
        uploadIcon = uploadIconBlack;
    }

    if(!window.electronAPI.fileExists(window.electronAPI.getAppPath())){
        window.electronAPI.readFile(window.electronAPI.getAppPath());
    }

    // handles the selection of files through the file input, loads them into the state. Which has a side effect of creating a list of selected files.
    function handleFileSelect(event) {
        let files = Array.from(event.target.files);
        //TODO: Change this to check if the files array is empty, if not we are going to append it, not replace it
        setSelectedFiles(files = [...selectedFiles, ...files]);
        console.log(files);
    }

    // handles the upload of files, currently just logs the files to the console, but can be expanded to include actual upload functionality.
    function handleFileDrop(event) {
        console.log("Uploading files...");
        event.preventDefault();
        setFilesUploading(true);
        setFiles(selectedFiles);
        console.log(selectedFiles);
        setSelectedFiles(null);
    }

    function getMaxSize(){
        let size = maxSize;
        if(maxSize < 1024){
            return maxSize + " bytes";
        } else if( maxSize < 1024 * 1024){
            return (maxSize / 1024).toFixed(2) + " KB";
        }
        else{
            return (maxSize / (1024 * 1024)).toFixed(2) + " MB";
        }
    }

return (
<div>
    {/*The UI for handling file uploads*/}
    <div className="file-loader-container">
        <h3>Upload Files Here</h3>
        <img className="upload-icon" src={uploadIcon} width="48" height="48" alt="Upload Icon" />
        <p>Drag and drop files here or click to browse. (Max file size: {getMaxSize()})</p>
        <p>Files can include: Design Documents, Decks, Meeting Notes, etc.</p>
        <input className='file-input' accept="text/plain,application/pdf,image/jpeg,image/png,image/gif,image/webp,application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/csv, application/rtf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/msword, application/vnd.ms-excel" type="file" id="fileInput" multiple onChange={handleFileSelect}>
        </input>
    </div>
    <button id='upload-files-button' className="button-accept center-button" disabled={selectedFiles.length === 0} onClick={(e) => handleFileDrop(e)}>Upload Files</button>
    {/*The UI for displaying all selected files*/}
    <div className="selected-files-container">
        <h3>Selected Files:</h3>
        {selectedFiles.map((file, index) => (
            // each time the selectedFiles state is updated, a new FileItem component is created for each file in the selectedFiles array.
            // The FileItem component is responsible for displaying the file's name, type, size, and providing a delete button to remove the file from the selection.
            // The index of the file in the selectedFiles array is passed as a prop to the FileItem component to help identify which file to remove when the delete button is clicked.
            <FileItem id={`file-${index}`} key={index} index={index} file={file} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
        ))}
    </div>
</div>
)
}