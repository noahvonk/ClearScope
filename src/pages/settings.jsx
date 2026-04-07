import React, {useEffect, useState} from 'react';
import { SetTheme } from '../App.jsx';

// load all of our required files as consts as we only will need to access their contents, not replace them.
const backArrowIconWhite = new URL('../../assets/images/back-arrow-white.png', import.meta.url);
const backArrowIconBlack = new URL('../../assets/images/back-arrow.png', import.meta.url);
const routes = require('../../routes.json');

/** The Settings component provides an interface for users to configure their ClearScope preferences, including API key management and appearance settings.
 * 
 * @param {currentPage} currentPage a state variable that holds the current page being displayed, used for navigation purposes.
 * @param {setCurrentPage} setCurrentPage a state set function that allows updating the currentPage state, enabling navigation between different pages in the application.
 * @returns Page component for the Settings page, including options for managing API keys and toggling between light and dark themes, as well as navigation back to the Home page.
 */
export default function Settings({currentPage, setCurrentPage}){

    // Load preferences file
    const [preferences, setPreferences] = useState(() => JSON.parse(window.electronAPI.readFile(window.electronAPI.getAppPath())));
    console.log(preferences);

    // set all useStates now that preferences is loaded, this will allow us to have the current values of the preferences in the state, and we can update them as needed when the user makes changes in the settings page. This is important for ensuring that the UI reflects the current preferences and allows for real-time updates as the user interacts with the settings.
    const [showClaudeKey, setShowClaudeKey] = useState(preferences.apis.claude_api_key.length > 0 ? true : false);
    const [showTrelloKey, setShowTrelloKey] = useState(preferences.apis.trello_api_key.length > 0 ? true : false);
    const [showTrelloSecret, setShowTrelloSecret] = useState(preferences.apis.trello_api_secret.length > 0 ? true : false);
    const [claudeApiKey, setClaudeApiKey] = useState(preferences.apis.claude_api_key || '');
    const [trelloApiKey, setTrelloApiKey] = useState(preferences.apis.trello_api_key || '');
    const [theme, setTheme] = useState(preferences.settings.theme || 'default');
    const [trelloApiSecret, setTrelloApiSecret] = useState(preferences.apis.trello_api_secret || '');
    const [maxFileSize, setMaxFileSize] = useState(preferences.maxFileSize || 10 * 1024 * 1024);
    const [maxTokens, setMaxTokens] = useState(preferences.apis.claude_max_tokens || 1024);

    function setTokens(e){
        if(e.target.value < 1024){
            setMaxTokens(1024);
            e.target.value = 1024;
        }
        else if(e.target.value > 65536){
            setMaxTokens(65536);
            e.target.value = 65536;
        } else {
            setMaxTokens(e.target.value);
        }
    }

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
        const newPreferences = {...preferences,
            settings: {
                ...preferences.settings,
                theme: theme
            },
            apis: {
                ...preferences.apis,
                claude_api_key: claudeApiKey,
                trello_api_key: trelloApiKey,
                trello_api_secret: trelloApiSecret,
                claude_max_tokens: maxTokens
            },
            maxFileSize: maxFileSize
        };
        try {
            window.electronAPI.writeFile(window.electronAPI.getAppPath(), JSON.stringify(newPreferences, null, 2));
            setPreferences(newPreferences);
            SetTheme();
            console.log('Preferences saved successfully!');
        } catch (err) {
            console.error('Error saving preferences:', err);
        }
    }

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
                        <input id="claude-api-key" className="claude-api-key" defaultValue={claudeApiKey} type={showClaudeKey ? "password" : "text"} placeholder="Enter your Claude API Key" onChange={(e) => setClaudeApiKey(e.target.value)} />
                        <input type='checkbox' id="claudeKeyCheckbox" defaultChecked={showClaudeKey} onChange={() => setShowClaudeKey(!showClaudeKey)} />
                        <label htmlFor="claudeKeyCheckbox">Hide API Key</label>
                    </div>
                </div>
                <div className="sub-item-container"> 
                    <h3>Trello API Key</h3>
                    <div>
                        <input id="trello-api-key" className="trello-api-key" defaultValue={trelloApiKey} type={showTrelloKey ? "password" : "text"} placeholder="Enter your Trello API Key" onChange={(e) => setTrelloApiKey(e.target.value)} />
                        <input type='checkbox' id="trelloKeyCheckbox" defaultChecked={showTrelloKey} onChange={() => setShowTrelloKey(!showTrelloKey)} />
                        <label htmlFor="trelloKeyCheckbox">Hide API Key</label>
                    </div>
                </div>
                <div className="sub-item-container"> 
                    <h3>Trello API Secret</h3>
                    <div>
                        <input id="trello-api-secret" className="trello-api-secret" defaultValue={trelloApiSecret} type={showTrelloSecret ? "password" : "text"} placeholder="Enter your Trello API Secret" onChange={(e) => setTrelloApiSecret(e.target.value)} />
                        <input type='checkbox' id="trelloSecretCheckbox" defaultChecked={showTrelloSecret} onChange={() => setShowTrelloSecret(!showTrelloSecret)} />
                        <label htmlFor="trelloSecretCheckbox">Hide API Secret</label>
                    </div>
                </div>
                {/* future api keys will go here */}
            </div>
            <div className="item-container">
                <h2>Appearance</h2>
                <p>Toggle between light and dark mode.</p>
                <select className="theme-select" defaultValue={theme} onChange={(e) => setTheme(e.target.value)}>
                    <option value="default">Default (Match System)</option>
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                </select>
            </div>
            <div className="item-container">
                <h2>File Size</h2>
                <p>Set the maximum allowed file size for uploads. Make sure that your token limits are sufficient to handle the file size you set.</p>
                <input id="max-file-size" className="max-file-size" type="number" placeholder="Enter max file size in bytes" defaultValue={preferences.maxFileSize} onChange={(e) => setMaxFileSize(e.target.value)}/>
                {/* TODO: Add a dropdown to select the units for the file size, and convert the input value to bytes based on the selected unit before saving it to the preferences. */}
                <label htmlFor="max-file-size"> bytes</label>
            </div>
             <div className="item-container">
                <h2>Max Tokens Used</h2>
                <p>Sets the maximum number of tokens that can be used in a single request. Beware, setting this value too high may result in increased costs or slower response times. Additionally, setting it too low will produce incomplete task lists.</p>
                <input id="max-tokens" className="max-tokens" type="number" placeholder="Enter max tokens" defaultValue={preferences.apis.claude_max_tokens} min="1024" max="65536" onBlur={(e) => setTokens(e)} />
                {/* TODO: Add a dropdown to select the units for the file size, and convert the input value to bytes based on the selected unit before saving it to the preferences. */}
                <label htmlFor="max-tokens"> tokens</label>
            </div>
            {/* future settings will go here with a new div and classname to create a seperate container */}
            <button className="button-accept" onSubmit={null}onClick={SaveSettings}>Save</button>
        </div>
    )
}