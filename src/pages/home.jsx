import React, {useState, useEffect} from 'react';
import FileLoader from '../components/fileloader.jsx';
import {RenderPage, RenderDefault} from '../App.jsx';
import AgentResponseContainer from '../components/agentResponseContainer.jsx';
import ModalError from '../components/modals/modalError.jsx';

// load all of our required files as consts as we only will need to access their contents, not replace them.
const gearIconWhite = new URL('../../assets/images/gear-white.png', import.meta.url);
const gearIconBlack = new URL('../../assets/images/gear.png', import.meta.url);
const routes = require('../../routes.json');

const homeIconWhite = new URL('../../assets/images/home-white.png', import.meta.url);
const homeIconBlack = new URL('../../assets/images/home.png', import.meta.url);

/** The Home component serves as the landing page for ClearScope, providing users with an interface to upload files and access settings.
 * It features a header, a settings icon that navigates to the Settings page, and incorporates the FileLoader component for file uploads.
 * The design adapts to the user's theme preference, ensuring a seamless experience across light and dark modes.
 * 
 * @returns Page component for the Home page, including file upload functionality and navigation to settings.
 */
export default function Home({currentPage, setCurrentPage}){

    const [filesUploading, setFilesUploading] = useState(false);
    const [files, setFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    
    // set our gear and home icon based on the current theme
    let gearIcon;
    let homeIcon;
    if(document.body.classList.contains('dark-mode')){
        gearIcon = gearIconWhite;
        homeIcon = homeIconWhite;
    } else {
        gearIcon = gearIconBlack;
        homeIcon = homeIconBlack;
    }

    useEffect(() => {
        if(errorMessage != null){
            setFilesUploading(false);
        }
    }, [errorMessage]);


    // when the component mounts, set the theme based on the user's preferences. This page acts as a wrapper for the File Loader component.
    return (
        <div className="home-container">
            <div className="header-container-image">
                {filesUploading ? 
                <img className="image-button" src={homeIcon} width="32" height="32" alt="Home Icon" onClick={() => { setFilesUploading(false); setFiles(null); }} /> : 
                <div width="32" height="32"></div>
            }
                <h1>ClearScope</h1>
                <img className="image-button" src={gearIcon} width="32" height="32" alt="Gear Icon" onClick={() => setCurrentPage(routes.SETTINGS)} />
            </div>
        {!filesUploading ? <FileLoader setFilesUploading={setFilesUploading} setFiles={setFiles}/> : <AgentResponseContainer files={files} filesUploading={filesUploading} setFilesUploading={setFilesUploading} setError={setErrorMessage} />}
        {errorMessage != null ? <ModalError errorMessage={errorMessage} setErrorMessage={setErrorMessage} /> : null}
        </div>
    )
}