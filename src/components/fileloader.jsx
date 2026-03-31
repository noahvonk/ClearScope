
import React, {useState, useEffect} from 'react';
import FileItem from './fileitem.jsx';

const uploadIconWhite = new URL('../../assets/images/up-loading-white.png', import.meta.url);
const uploadIconBlack = new URL('../../assets/images/up-loading.png', import.meta.url);



export default function FileLoader(){

    const [selectedFiles, setSelectedFiles] = useState([]);

    let uploadIcon = uploadIconBlack;
    if(document.body.classList.contains('dark-mode')){
        uploadIcon = uploadIconWhite;
    } else {
        uploadIcon = uploadIconBlack;
    }

    useEffect(() => {
        if(document.querySelector('#upload-files-button') == null){
            return;
        }
        if(selectedFiles.length <= 0){
            document.querySelector('#upload-files-button').disabled = true;
        } else {
            document.querySelector('#upload-files-button').disabled = false;
        }
    }, [selectedFiles])

    function handleFileSelect(event) {
        const files = Array.from(event.target.files)
        setSelectedFiles(files);
        console.log(files);

        //setSelectedFiles(files.map(file => file.name));
    }

    function handleFileDrop(event) {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        setSelectedFiles(null);
        console.log(files);
    }

return (
<div>
<div className="file-loader-container">
<h3>Upload Files Here</h3>
<img className="upload-icon" src={uploadIcon} width="48" height="48" alt="Upload Icon" />
<p>Drag and drop files here or click to browse.</p>
<p>Files can include: Design Documents, Decks, Meeting Notes, etc.</p>
<input className='file-input' type="file" id="fileInput" multiple onChange={handleFileSelect}>
</input>
</div>
<button id='upload-files-button' className="button-accept center-button" disabled onClick={handleFileDrop}>Upload Files</button>
<div className="selected-files-container">
<h3>Selected Files:</h3>
{selectedFiles.map((file, index) => (
    <FileItem key={index} index={index} file={file} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
))}
</div>
</div>
)
}