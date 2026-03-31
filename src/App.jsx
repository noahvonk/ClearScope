import React, {useState, useEffect} from 'react';
import { createRoot } from 'react-dom/client';
import FileLoader from './components/fileloader.jsx';
import Settings from './pages/settings.jsx';
import Home from './pages/home.jsx';
const gearIconWhite = new URL('../assets/images/gear-white.png', import.meta.url);
const gearIconBlack = new URL('../assets/images/gear.png', import.meta.url);
const settingsFile = require('../preferences.json');
const routes = require('../routes.json');

let currentPage = routes.HOME;

const root = createRoot(document.body);

export function SetTheme(){
    if(settingsFile.settings.theme === "default"){
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if(prefersDarkMode){
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.add('light-mode');
        }
    } else {
        if(settingsFile.settings.theme === "dark"){
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.add('light-mode');
        } 
    }
}

export function AppContent() {

    // create states to track which page is currently being viewed, then we can dynamically load in pages into this app container without having to worry about losing state when navigating between pages.
    // This will be important for the file loader page, as we want to be able to load in files and then navigate to other pages without losing the loaded files.
    const [updatePage, setUpdatePage] = useState();
    const [currentPage, setCurrentPage] = useState();
    // keep pages stored in variables so that we can easily switch between them without having to worry about losing state, and also to avoid having to import pages multiple times.
    const homePage = <Home currentPage={updatePage} setCurrentPage={setUpdatePage} />;
    const settingsPage = <Settings currentPage={updatePage} setCurrentPage={setUpdatePage} />;

    function RenderPage(page) {
        switch(page){
            case routes.HOME:
                document.querySelector('.home-container').hidden = false;
                setCurrentPage(null);
                break;
            case routes.SETTINGS:
                setCurrentPage(settingsPage);
                document.querySelector('.home-container').hidden = true;
                break;
            default:
                setCurrentPage(null);
                document.querySelector('.home-container').hidden = false;
        }
    }

    useEffect(() => {
        RenderPage(updatePage);
    }, [updatePage])

    useEffect(() => {
        SetTheme();
        },
    [])



    return (
        <div className="app-container">
            <title>ClearScope</title>
            <Home currentPage={updatePage} setCurrentPage={setUpdatePage} />
            {currentPage}
        </div>
    )
}

RenderDefault();

export function App() {
    return <AppContent />;
}

export function RenderDefault(){
    root.render(<AppContent />); 
}



export function GoToCurrentPage(){
    //RenderPage("<", currentPage, "/>");
    
}
