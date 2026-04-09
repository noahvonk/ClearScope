import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

const TaskItem = forwardRef(({ index, task }, ref) => {

    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [estimatedHours, setEstimatedHours] = useState(task.estimated_hours);
    const [priority, setPriority] = useState(task.priority);
    const [dueDate, setDueDate] = useState(task.due_date);
    const [assignedTo, setAssignedTo] = useState(task.assigned_to);

    useImperativeHandle(ref, () => ({
        getTaskData: () => {
            return {
                title,
                description,
                estimated_hours: estimatedHours,
                priority,
                due_date: dueDate,
                assigned_to: assignedTo
            }
        }
    }));


    function getAssinedTo(assigned_to){
        if(Array.isArray(assigned_to)){
            return assigned_to.join(", ");
        }
        return assigned_to;
    }

    function onPriorityChange(event){
        event.target.classList.remove("Low", "Medium", "High", "Critical");
        event.target.classList.add(event.target.value);
        setPriority(event.target.value);
    }

    return (
    <div key={index} className="task-item">
        <div className="task-details-container-fullwidth">
            <label htmlFor='task-title'>Title:</label>
            <input type="text" className="task-title" defaultValue={title} onChange={(e) => setTitle(e.target.value)} />
            <label htmlFor='task-description'>Description:</label>
            <textarea className="task-description" defaultValue={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        
        <div className='task-details-container'>
            <div className='task-details-subcontainer'>
                <label htmlFor="task-estimated-hours">Estimated Hours:</label>
                <input type="number" className='task-estimated-hours' defaultValue={estimatedHours} onChange={(e) => setEstimatedHours(e.target.value)} />
            </div>

            <div className='task-details-subcontainer'>
                <label htmlFor="task-priority">Priority:</label>
                <select className={`task-priority ${priority}`} defaultValue={priority} onChange={(e) => onPriorityChange(e)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                </select>
            </div>

            <div className='task-details-subcontainer'>
                <label htmlFor="due-date">Due Date:</label>
                {console.log(dueDate)}
                <input type="date" className='due-date' defaultValue={new Date(dueDate).toISOString().split('T')[0]} onChange={(e) => setDueDate(e.target.value)} />
            </div>
        </div>

        <div className='task-details-container'>
            <div className='task-details-subcontainer'>
                <label htmlFor="assigned-to">Assigned To:</label>
                <input type="text" className='assigned-to' defaultValue={getAssinedTo(assignedTo)} onChange={(e) => setAssignedTo(e.target.value.split(",").map(name => name.trim()))} />
            </div>
        </div>


    </div>
    )
            
});

export default TaskItem;