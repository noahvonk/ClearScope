import React, { useState, useEffect } from 'react';

export default function TaskItem({ index, task }) {

    function getAssinedTo(assigned_to){
        if(Array.isArray(assigned_to)){
            return assigned_to.join(", ");
        }
        return assigned_to;
    }

    function onPriorityChange(event){
        event.target.classList.remove("Low", "Medium", "High", "Critical");
        event.target.classList.add(event.target.value);
    }

    return (
    <div key={index} className="task-item">
        <div className="task-details-container-fullwidth">
            <label htmlFor='task-title'>Title:</label>
            <input type="text" className="task-title" defaultValue={task.title} />
            <label htmlFor='task-description'>Description:</label>
            <textarea className="task-description" defaultValue={task.description} />
        </div>
        
        <div className='task-details-container'>
            <div className='task-details-subcontainer'>
                <label htmlFor="task-estimated-hours">Estimated Hours:</label>
                <input type="number" className='task-estimated-hours' defaultValue={task.estimated_hours} />
            </div>

            <div className='task-details-subcontainer'>
                <label htmlFor="task-priority">Priority:</label>
                <select className={`task-priority ${task.priority}`} defaultValue={task.priority} onChange={(e) => onPriorityChange(e)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                </select>
            </div>
            <div className='task-details-subcontainer'>
                <label htmlFor="due-date">Due Date:</label>
                {console.log(task.due_date)}
                <input type="date" className='due-date' defaultValue={new Date(task.due_date).toISOString().split('T')[0]} />
            </div>
        </div>

        <div className='task-details-container'>


            <div className='task-details-subcontainer'>
                <label htmlFor="assigned-to">Assigned To:</label>
                <input type="text" className='assigned-to' defaultValue={getAssinedTo(task.assigned_to)} />
            </div>
        </div>


    </div>
    )
            
}