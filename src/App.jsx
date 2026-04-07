import React, {useState, useEffect} from 'react';
import { createRoot } from 'react-dom/client';
import FileLoader from './components/fileloader.jsx';
import Settings from './pages/settings.jsx';
import Home from './pages/home.jsx';
const routes = require('../routes.json');

let currentPage = routes.HOME;

const root = createRoot(document.body);

export async function SetTheme(){
    const settingsFile = JSON.parse(window.electronAPI.readFile(window.electronAPI.getAppPath()));
    if(settingsFile.settings.theme === "default"){
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if(prefersDarkMode){
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
    } else {
        if(settingsFile.settings.theme === "dark"){
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        } 
    }
    console.log("Theme set to: " + settingsFile.settings.theme);
}

export function AppContent() {

    // create states to track which page is currently being viewed, then we can dynamically load in pages into this app container without having to worry about losing state when navigating between pages.
    // This will be important for the file loader page, as we want to be able to load in files and then navigate to other pages without losing the loaded files.
    const [updatePage, setUpdatePage] = useState(routes.HOME);
    const [themeReady, setThemeReady] = useState(false);

    useEffect(() => {
        // when the page is updated, scroll to the top of the page. This is important for ensuring that the user is always at the top of the page when navigating to a new page, and also for improving the overall user experience.
       SetTheme().then(() => setThemeReady(true));
       return () => {
       }
    }, []);

    if(!themeReady){
        return null; // or a loading spinner, or some placeholder content
    }

    return (
        <div className="app-container">
            <title>ClearScope</title>
            <div className="home-page-container" hidden={updatePage !== routes.HOME}>
                <Home currentPage={updatePage} setCurrentPage={setUpdatePage} />
            </div>
            {updatePage === routes.SETTINGS && <Settings currentPage={updatePage} setCurrentPage={setUpdatePage} />}
        </div>
    )
}

RenderDefault();

export default function App() {
    return <AppContent />;
}

export function RenderDefault(){
    root.render(<AppContent />); 
}



export function GoToCurrentPage(){
    //RenderPage("<", currentPage, "/>");
    
}
