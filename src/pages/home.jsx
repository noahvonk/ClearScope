import React, {useState, useEffect} from 'react';
import FileLoader from '../components/fileloader.jsx';
import {RenderPage, RenderDefault} from '../App.jsx';

// load all of our required files as consts as we only will need to access their contents, not replace them.
const gearIconWhite = new URL('../../assets/images/gear-white.png', import.meta.url);
const gearIconBlack = new URL('../../assets/images/gear.png', import.meta.url);
const routes = require('../../routes.json');

/** The Home component serves as the landing page for ClearScope, providing users with an interface to upload files and access settings.
 * It features a header, a settings icon that navigates to the Settings page, and incorporates the FileLoader component for file uploads.
 * The design adapts to the user's theme preference, ensuring a seamless experience across light and dark modes.
 * 
 * @returns Page component for the Home page, including file upload functionality and navigation to settings.
 */
export default function Home({currentPage, setCurrentPage}){
    
    // set our gear icon based on the current theme
    let gearIcon;
    if(document.body.classList.contains('dark-mode')){
        gearIcon = gearIconWhite;
    } else {
        gearIcon = gearIconBlack;
    }

    // when the component mounts, set the theme based on the user's preferences. This page acts as a wrapper for the File Loader component.
    return (
        <div className="home-container">
            <div className="header-container-image">
            <div width="32" height="32"></div>
            <h1>ClearScope</h1>
            <img className="image-button" src={gearIcon} width="32" height="32" alt="Gear Icon" onClick={() => setCurrentPage(routes.SETTINGS)} />

            </div>
            <FileLoader />
        </div>
    )
}