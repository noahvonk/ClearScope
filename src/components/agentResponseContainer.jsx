import React, { useState, useEffect, useRef } from 'react';
import Spinner from '../../assets/svgs/spinner.svg';
import TaskItem from './taskItem.jsx';
import { exportToJson } from '../exports/exportTasks.js';
import ModalError from './modals/modalError.jsx';

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({
            name: file.name,
            type: file.type,
            data: reader.result.split(',')[1] // strip the data:mime;base64, prefix
        });
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}



export default function AgentResponseContainer({ files, setError, filesUploading, setFilesUploading }) {

    const [displayResponse, setDisplayResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [responseSummary, setResponseSummary] = useState("");
    const [loadingText, setLoadingText] = useState("Getting things started");
    const [responseReady, setResponseReady] = useState(false);
    const [taskList, setTaskList] = useState([]);
    const responseReadyRef = useRef(responseReady);
    const taskListRef = useRef(taskList);

    const preferences = JSON.parse(window.electronAPI.readFile(window.electronAPI.getAppPath()));

    const jsonExample = `    
    {
    "project_summary": "A brief summary of the contents of the files and how the tasks were generated based on that content.",
    "tasks": [{
                "title": "Task title goes here",
                "description": "description of task goes here",
                "estimated_hours": 1,
                "priority": "High", // Low, Medium, High, Critical
                "due_date": "April 7 2026",
                "assigned_to": ["person1", "person2"]
            }
        ]
    }`

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                setFilesUploading(true);
                const encodedFiles = await Promise.all(files.map(fileToBase64));

                // this file is going to most likely come back with a json parse error because claude is going to include text along with the json, so we need to strip out the text and only return the json. This is done by asking claude to only return the json, and to strip out any text that is not contained in json format. This is done in the prompt, but we also need to do it here to ensure that we can parse the response correctly.
                const response = await window.electronAPI.claudeQuery(
                    `Give me a response that details the contents of the uploaded files. I want a list of tasks broken down into JSON format, with each task having a title, description, due date, estimated hours, who the task is assigned to, and priority level. Follow this example ${jsonExample} I want a small summary of how these tasks were chosen based on the contents of the files. Strip out any text that is not contained in json format, and only return the json. You only have ${preferences.apis.claude_max_tokens} credits to work with keep it within that limit. Here is the data from the files:`,
                    encodedFiles
                );
                const jsonResponse = response.replace(/^[^{]*|[^}]*$/g, ''); // strip out any text that is not contained in json format
                const parsedResponse = JSON.parse(jsonResponse);

                setDisplayResponse(parsedResponse.tasks);
                setResponseSummary(parsedResponse.project_summary);
            } catch (err) {
                console.error('Error fetching response:', err);
                if(err != null && err.statusCode){
                    setError(await window.electronAPI.getErrorCodeMessage(err.statusCode));
                }
                else{
                    // this is a bit of a hacky solution, but the claude api returns a very generic error message when the api key is not set, so we can check for that specific error message and display a more user-friendly message instead.
                    // CLAUDE YOU SHOULD INCLUDE ERROR CODES INSTEAD OF THIS NONSENSE!!!!
                    switch(err.message){
                        case "Error invoking remote method 'claude-query': Error: Could not resolve authentication method. Expected either apiKey or authToken to be set. Or for one of the \"X-Api-Key\" or \"Authorization\" headers to be explicitly omitted":
                        setError("Claude API key is not set.\nPlease enter your Claude API key in the settings page and try again.");
                        return;
                    default:
                        setError(err.message);
                    }
                }
                setFilesUploading(false);
                setLoading(false);
                return;
            } finally {
                setResponseReady(true);
                //setLoading(false);
                responseReadyRef.current = true;
            }
        };

        if (files && files.length > 0) {
            fetchData();
        }
    }, [files]);

    useEffect(() => {
        if(loading){
            setTimeout(() => {
                FadeOutText();
            }, 3000);
        }
    }, [loading]);

    useEffect(() => {
        if(!displayResponse || !Array.isArray(displayResponse)){
            return;
        }
        taskListRef.current = displayResponse.map(() => React.createRef());
        setTaskList(displayResponse.map((task, index) => (
            <TaskItem key={index} index={index} task={task} ref={taskListRef.current[index]} />
        )));
    }, [displayResponse]);

    // if (error) {
    //     return (
    //         <div className='response-container'>
    //             <ModalError errorMessage={error} setErrorMessage={setError} />
    //         </div>
    //     );
    // }



    function FadeOutText(){
        if(document.querySelector('#loading-text') == null){
            return;
        }
        document.querySelector('#loading-text').classList.toggle('fade-hide');
        setTimeout(() => {
            setLoadingPhrase();
        }, 500); // match the duration of the fade-out animation
        setTimeout(() => {
            document.querySelector('#loading-text').classList.toggle('fade-hide');
            console.log("Response ready: " + responseReadyRef.current);
            setTimeout(() => {
                if(responseReadyRef.current){
                    document.querySelector('#loading-text').classList.toggle('fade-hide');
                    setTimeout(() => {
                        setLoading(false);
                    }, 500);
                }
                else{
                    FadeOutText();
                }

            }, 4000); // change text every 4 seconds
        }, 1000);

    }

    function handleExport(){
        // we need to grab each of the task components and call the getTaskData function to get the updated data from the user input, then we can create a new json object with that data and export it as a file.
        // now that taskList stores all of the task objects, we can just loop through that and call the getTaskData function on each of them to get the updated data from the user input, then we can create a new json object with that data and export it as a file.
        
        const updatedTasks = taskListRef.current.map(ref => ref.current.getTaskData());
        exportToJson(updatedTasks);

    }


    function setLoadingPhrase(){
        const loadingTexts = [
            "Analyzing files",
            "Generating response",
            "Agent Thinking",
            "Processing data",
            "Conjuring tasks",
            "Performing analysis",
            "Synthesizing response",
            "Peer reviewing response",
        ];
        if(responseReadyRef.current){
            setLoadingText("Finalizing response");
            return;
        }
        let loadText = loadingTexts[Math.floor(Math.random() * loadingTexts.length)];
        if(loadingText === loadText){
            return setLoadingPhrase();
        }
        setLoadingText(loadText);
    }

    useEffect(() => {
        const fetchData = () => {
            const response = require('../../exampleOutput.json');
            console.log(response);
            setDisplayResponse(response.tasks);
            setResponseSummary(response.project_summary);
            console.log(response.tasks);
        };
        fetchData();
    }, []);


    function parseResponse(response) {
        try {
            setTaskList(response.map((task, index) => (
                <TaskItem key={index} task={task} />
            )));
            return taskList;
        } catch (err) {
            console.error('Error parsing response:', err);
            return <p>Error parsing response: {err.message}</p>;
        }
    }

    return (
        <div className='response-container'>
            {loading ? 
            <div className='loading-spinner-container'>
                <Spinner className="loading-spinner" />
                <h2 id='loading-text'>{loadingText}</h2>
            </div> :
        <div className="agent-response-container">
            <h3>Tasks:</h3>
            <hr></hr>
            <p className="response-summary">{responseSummary}</p>
            <div className="tasks-container">
                {taskList}
            </div>
            <div className='export-stack'>
                <button className="button-accept" onClick={() => handleExport()}>Export</button>
                <select className="export-format-dropdown" defaultValue="">
                    <option value="" disabled>Choose export format</option>
                    <option value="json">JSON</option>
                    <option value="csv" disabled >CSV</option>
                    <option value="google-calendar" disabled>Google Calendar</option>
                    <option value="outlook-calendar" disabled>Outlook Calendar</option>
                    <option value="microsoft-planner" disabled>Microsoft Planner</option>
                    <option value="xlsx" disabled>Excel</option>
                    <option value="trello" disabled>Trello</option>
                    <option value="asana" disabled>Asana</option>
                </select>
            </div>
        </div>}
        </div>

    )
}  