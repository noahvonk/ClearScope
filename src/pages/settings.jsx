import React, {useEffect, useState} from 'react';
import { RenderDefault, SetTheme } from '../App.jsx';
const backArrowIconWhite = new URL('../../assets/images/back-arrow-white.png', import.meta.url);
const backArrowIconBlack = new URL('../../assets/images/back-arrow.png', import.meta.url);
const routes = require('../../routes.json');

let preferences = require('../../preferences.json');


function PreviewThemeSettings(){
    SetTheme();
}

function ShowClaudeKey(){
    const claudeKeyInput = document.querySelector('.claude-api-key');
    if(document.querySelector('#claudeKeyCheckbox').checked){
        claudeKeyInput.type = "password";
    } else {
        claudeKeyInput.type = "text";
    }
}



export default function Settings({currentPage, setCurrentPage}){
    let backArrowIcon = backArrowIconWhite;
    if(document.body.classList.contains('dark-mode')){
        backArrowIcon = backArrowIconWhite;
    } else {
        backArrowIcon = backArrowIconBlack;
    }

    function SaveSettings(event){
        event.preventDefault();
        const filePath = window.electronAPI.getAppPath();
        preferences.settings.theme = document.querySelector('.theme-select').value;
        preferences.apis.claude_api_key = document.querySelector('.claude-api-key').value;
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
    if(preferences.apis.claude_api_key.length <= 0){
        document.querySelector('#claudeKeyCheckbox').checked = false;
        ShowClaudeKey();
    }
}), []
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
            </div>
            <div className="item-container">
                <h2>Appearance</h2>
                <p>Toggle between light and dark mode.</p>
                <select className="theme-select" onChange={PreviewThemeSettings}>
                    <option value="default">Default (Match System)</option>
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                </select>
            </div>
            <button className="button-accept" onSubmit={null}onClick={SaveSettings}>Save</button>
            {/* Add settings options here */}
        </div>
    )
}