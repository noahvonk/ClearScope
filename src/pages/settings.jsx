import React, {useEffect, useState} from 'react';
import { RenderDefault, SetTheme } from '../App.jsx';

// load all of our required files as consts as we only will need to access their contents, not replace them.
const backArrowIconWhite = new URL('../../assets/images/back-arrow-white.png', import.meta.url);
const backArrowIconBlack = new URL('../../assets/images/back-arrow.png', import.meta.url);
const routes = require('../../routes.json');

// Loads our preferences file as a mutable variable so we can read and write to it in the settings page. This will need to be placed in a different location outside of the project to allow the file to be accesses in builds, but this works for development.
// The file is written to the user's app data folder in production, but we can read and write to it here for development purposes.
// TODO: Move this to a different location and create the file if it doesn't exist, with default values.
let preferences = require('../../preferences.json');

/**
 * ShowClaudeKey toggles the visibility of the Claude API key input field in the Settings page. When the associated checkbox is checked, the input field is set to "password" type, hiding the API key. When unchecked, the input field is set to "text" type, revealing the API key for the user to view or edit.
 */
function ShowClaudeKey(){

    // grab the claude api key input and toggle its type based on the checkbox state
    const claudeKeyInput = document.querySelector('.claude-api-key');
    if(document.querySelector('#claudeKeyCheckbox').checked){
        claudeKeyInput.type = "password";
    } else {
        claudeKeyInput.type = "text";
    }
}

/**
 * ShowTrelloKey toggles the visibility of the Trello API key input field in the Settings page. When the associated checkbox is checked, the input field is set to "password" type, hiding the API key. When unchecked, the input field is set to "text" type, revealing the API key for the user to view or edit.
 */
function ShowTrelloKey(){

    // grab the trello api key input and toggle its type based on the checkbox state
    const trelloKeyInput = document.querySelector('.trello-api-key');
    if(document.querySelector('#trelloKeyCheckbox').checked){
        trelloKeyInput.type = "password";
    } else {
        trelloKeyInput.type = "text";
    }
}

/**
 * ShowTrelloSecret toggles the visibility of the Trello API secret input field in the Settings page. When the associated checkbox is checked, the input field is set to "password" type, hiding the API secret. When unchecked, the input field is set to "text" type, revealing the API secret for the user to view or edit.
 */
function ShowTrelloSecret(){

    // grab the trello api secret input and toggle its type based on the checkbox state
    const trelloSecretInput = document.querySelector('.trello-api-secret');
    if(document.querySelector('#trelloSecretCheckbox').checked){
        trelloSecretInput.type = "password";
    } else {
        trelloSecretInput.type = "text";
    }
}

/** The Settings component provides an interface for users to configure their ClearScope preferences, including API key management and appearance settings.
 * 
 * @param {currentPage} currentPage a state variable that holds the current page being displayed, used for navigation purposes.
 * @param {setCurrentPage} setCurrentPage a state set function that allows updating the currentPage state, enabling navigation between different pages in the application.
 * @returns Page component for the Settings page, including options for managing API keys and toggling between light and dark themes, as well as navigation back to the Home page.
 */
export default function Settings({currentPage, setCurrentPage}){

    // set the back arrow icon based on the current theme
    let backArrowIcon = backArrowIconWhite;
    if(document.body.classList.contains('dark-mode')){
        backArrowIcon = backArrowIconWhite;
    } else {
        backArrowIcon = backArrowIconBlack;
    }

    /**Saves the current settings to the preferences file.
     * 
     * @param {*} event the event from the button being pressed.
     */
    function SaveSettings(event){
        event.preventDefault();
        const filePath = window.electronAPI.getAppPath();
        preferences.settings.theme = document.querySelector('.theme-select').value;
        preferences.apis.claude_api_key = document.querySelector('.claude-api-key').value;
        preferences.maxFileSize = parseInt(document.querySelector('.max-file-size').value);
        try {
            window.electronAPI.writeFile(filePath, JSON.stringify(preferences, null, 2));
            console.log('Preferences saved successfully!');
        } catch (err) {
            console.error('Error saving preferences:', err);
        }
    }

    useEffect(() => {

        // Set defaults
        document.querySelector('.theme-select').value = preferences.settings.theme;
        document.querySelector('.claude-api-key').value = preferences.apis.claude_api_key;

        // if the key is empty, uncheck the checkbox and show the input
        if(preferences.apis.claude_api_key.length <= 0){
            document.querySelector('#claudeKeyCheckbox').checked = false;
            ShowClaudeKey();
        }
    }), []

    // The settings page includes options for managing API keys and toggling between light and dark themes, as well as navigation back to the Home page.
    return (
        <div className="settings-container">
            <div className="header-container-image">
            <img className="image-button" src={backArrowIcon} width="32" height="32" alt="Back Arrow Icon" onClick={() => setCurrentPage(routes.HOME)} />
            <h1>Settings</h1>
            <div width="32" height="32"></div>
            </div>
            <p>Configure your ClearScope preferences here.</p>
            <div className="item-container">
                <h2>API Keys</h2>
                <p>Manage your API keys for various services.</p>
                <div className="sub-item-container"> 
                    <h3>Claude API Key</h3>
                    <div>
                        <input id="claude-api-key" className="claude-api-key" type="password" placeholder="Enter your Claude API Key" />
                        <input type='checkbox' id="claudeKeyCheckbox" defaultChecked onChange={ShowClaudeKey} />
                        <label htmlFor="claudeKeyCheckbox">Hide API Key</label>
                    </div>
                </div>
                <div className="sub-item-container"> 
                    <h3>Trello API Key</h3>
                    <div>
                        <input id="trello-api-key" className="trello-api-key" type="password" placeholder="Enter your Trello API Key" />
                        <input type='checkbox' id="trelloKeyCheckbox" defaultChecked onChange={ShowTrelloKey} />
                        <label htmlFor="trelloKeyCheckbox">Hide API Key</label>
                    </div>
                </div>
                <div className="sub-item-container"> 
                    <h3>Trello API Secret</h3>
                    <div>
                        <input id="trello-api-secret" className="trello-api-secret" type="password" placeholder="Enter your Trello API Secret" />
                        <input type='checkbox' id="trelloSecretCheckbox" defaultChecked onChange={ShowTrelloSecret} />
                        <label htmlFor="trelloSecretCheckbox">Hide API Secret</label>
                    </div>
                </div>
                {/* future api keys will go here */}
            </div>
            <div className="item-container">
                <h2>Appearance</h2>
                <p>Toggle between light and dark mode.</p>
                <select className="theme-select">
                    <option value="default">Default (Match System)</option>
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                </select>
            </div>
            <div className="item-container">
                <h2>File Size</h2>
                <p>Set the maximum allowed file size for uploads.</p>
                <input id="max-file-size" className="max-file-size" type="number" placeholder="Enter max file size in bytes" defaultValue={preferences.maxFileSize} />
                {/* TODO: Add a dropdown to select the units for the file size, and convert the input value to bytes based on the selected unit before saving it to the preferences. */}
                <label htmlFor="max-file-size"> bytes</label>
            </div>
            {/* future settings will go here with a new div and classname to create a seperate container */}
            <button className="button-accept" onSubmit={null}onClick={SaveSettings}>Save</button>
        </div>
    )
}