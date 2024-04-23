import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "./EditTask.css";
import { CategoriesStore } from '../../../Stores/CategoriesStore';
import { UserStore } from '../../../Stores/UserStore';
import {MyTasksStore} from '../../../Stores/MyTasksStore';
import Button from '../../General/Button';
import PriorityButtons from '../../General/PriorityButtons';
import { showErrorMessage } from '../../../functions/Messages/ErrorMessage';
import { showSuccessMessage } from '../../../functions/Messages/SuccessMessage';
import { showWarningMessage } from '../../../functions/Messages/WarningMessage';
import useWebSocketStatistics from '../../../Websockets/StatisticsWS';

function EditTask() {

    const typeOfUser = UserStore.getState().user.typeOfUser;
    const userLoggedIn = UserStore.getState().user.username;

    
    const LOW = 100;
    const MEDIUM = 200;
    const HIGH = 300;
    
    const TODO = 100;
    const DOING = 200;
    const DONE = 300;

    const DEVELOPER = 100;
    const SCRUM_MASTER = 200;
    const PRODUCT_OWNER = 300;

    const location = useLocation();
    const navigate = useNavigate();
    let  taskToEdit = location.state.task;

    const sendMessage = useWebSocketStatistics().sendMessage;

    useEffect(() => {
        
        if ((taskToEdit.owner.username !== userLoggedIn || taskToEdit.owner.username === userLoggedIn && taskToEdit.erased) &&
            typeOfUser !== SCRUM_MASTER && 
            typeOfUser !== PRODUCT_OWNER) 
        {
            showErrorMessage('You are not allowed to edit this task');
            navigate('/my-scrum');
        } else {
            if ((typeOfUser === SCRUM_MASTER || typeOfUser === PRODUCT_OWNER) && taskToEdit.erased) {
                showWarningMessage('This task is erased and cannot be edited');
            }
        } 
        
    }, [location, navigate, userLoggedIn, typeOfUser]);
    


    const categories = CategoriesStore((state) => state.categories);

    const [taskTitle, setTaskTitle] = useState(taskToEdit.title);
    const [taskDescription, setTaskDescription] = useState(taskToEdit.description);
    const [taskStateId, setTaskStateId] = useState(taskToEdit.stateId);
    const [taskPriority, setTaskPriority] = useState(taskToEdit.priority);
    const [taskStartDate, setTaskStartDate] = useState(taskToEdit.startDate);
    const [taskEndDate, setTaskEndDate] = useState(taskToEdit.limitDate);
    const [taskCategory, setTaskCategory] = useState(taskToEdit.category.name);
    const [taskErased, setTaskErased] = useState(taskToEdit.erased);
    
    const [selectedStateId, setSelectedStateId] = useState(null);
    const [selectedPriority, setSelectedPriority] = useState(null);

  
    useEffect(() => {
        if (taskToEdit.stateId === TODO) {
            setSelectedStateId(TODO);
        } else if (taskToEdit.stateId === DOING) {
            setSelectedStateId(DOING);
        } else if (taskToEdit.stateId === DONE) {
            setSelectedStateId(DONE);
        } else if (taskToEdit.priority === LOW) {
            setSelectedPriority(LOW);
        } else if (taskToEdit.priority === MEDIUM) {
            setSelectedPriority(MEDIUM);
        } else if (taskToEdit.priority === HIGH) {
            setSelectedPriority(HIGH);
        }
    }, []);
       

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        if (id === 'titulo-task') {
            setTaskTitle(value);
        } else if (id === 'descricao-task') {
            setTaskDescription(value);
        } else if (id === 'startDate-editTask') {
            setTaskStartDate(value);
        } else if (id === 'endDate-editTask') {
            setTaskEndDate(value);
        }
    }

    const handleTaskStateId = (stateIdValue) => {
        if (stateIdValue === 'Todo') {
            setTaskStateId(TODO);
            setSelectedStateId(TODO);
        } else if (stateIdValue === 'Doing') {
            setTaskStateId(DOING);
            setSelectedStateId(DOING);
        } else if (stateIdValue === 'Done') {
            setTaskStateId(DONE);
            setSelectedStateId(DONE);
        } 
    };
    
    const handleTaskPriority = (priority) => {
        setTaskPriority(priority);
    };

    const handleTaskCategory = (e) => {
        setTaskCategory(e.target.value);
    };

    const createSelectOptions = () => {
        if (isTaskErased()) {
            return <option value={taskToEdit.category.name} >{taskToEdit.category.name}</option>;
        } else {
        return categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ));
        }
    };

    const isAnyFieldEmpty = () => {
        if (
          taskTitle === "" ||
          taskDescription === "" ||
          taskPriority === "" ||
          taskStartDate === "" ||
          taskEndDate === "" ||
          taskCategory === ""
        ) {
          return true;
        } else {
          return false;
        }
    };

    function isTaskErased() {
        if (taskToEdit.erased) {
            return true;
        } else {
            return false;
        }   
    }


    const handleCancel = () => {
        navigate('/my-scrum');
    };

    const handleSaveTask = async () => {
        
        if (isAnyFieldEmpty()) {
            showWarningMessage('Please fill all fields');
        } else {
            
            const taskId= taskToEdit.id;
            const token = UserStore.getState().user.token;

            const task = {
                title: taskTitle,
                description: taskDescription,
                stateId: taskStateId,
                priority: taskPriority,
                startDate: taskStartDate,
                limitDate: taskEndDate,
                category: {name: taskCategory},
            };

            const editRequest = `http://localhost:8080/backend_proj5_war_exploded/rest/tasks/${taskId}`;

            try {
                const response = await fetch(editRequest, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: '*/*',
                        token: token,
                    },
                    body: JSON.stringify(task),
                });

                if (response.ok) {
                    const updatedTask = MyTasksStore.getState().tasks.find(t => t.id === task.id);
                    showSuccessMessage('Task saved successfully');
                    sendMessage();
                    navigate('/my-scrum');
                } else {
                    const error = await response.text();
                    showErrorMessage('Error: ' + error);
                }
            } catch (error) {
                console.error('Error:', error);
                showErrorMessage('Something went wrong. Please try again later.');
            }
        }
    }
            

      

    return (
        <>
            <main className="main-task">
                <div className="detalhes-task">
                    <div>
                        <textarea id="titulo-task" placeholder='Task Title' value={taskTitle} onChange={handleInputChange} readOnly={ taskErased ? true : false} ></textarea>
                    </div>
                    <div>
                        <textarea className="text-task" id="descricao-task" placeholder='Task Description' value={taskDescription} onChange={handleInputChange} readOnly={ taskErased ? true : false}></textarea>
                    </div>
                    <div className="task-save">
                        <Button text="Save" onClick={handleSaveTask} hidden={taskErased} ></Button>
                        <Button text={ taskErased ? "Back" : "Cancel" } onClick={handleCancel}></Button>                    
                    </div>
                </div>
                <div className="task-buttons">
                    <div className="status-and-priority">
                        <div className="task-status">
                            <h4 className="taskH4">status</h4>
                            <div className="status-buttons">
                                <button className={`status-button todo ${selectedStateId === TODO ? 'selected' :'' }`} id="todo-button" value='todo' onClick={() => handleTaskStateId('Todo')} disabled={ taskErased ? true : false}>To do</button>
                                <button className={`status-button doing ${selectedStateId === DOING ? 'selected' :'' }`} id="doing-button" value='doing' onClick={() => handleTaskStateId('Doing')} disabled={ taskErased ? true : false}>Doing</button>
                                <button className={`status-button done ${selectedStateId === DONE ? 'selected' :'' }`} id="done-button" value='done' onClick={() => handleTaskStateId('Done')} disabled={ taskErased ? true : false}>Done</button>
                            </div>
                        </div>
                        <div className="task-priority">
                            <h4 className="taskH4">priority</h4>
                            <div className="priority-buttons">
                                <PriorityButtons onSelectPriority={handleTaskPriority} priority={taskToEdit.priority} disabled = {taskErased}></PriorityButtons>
                            </div>
                        </div>
                        <div className="dates">
                            <h4 className="taskH4">Dates</h4>
                            <div className="startDateDiv">
                                <label className="label-start-date">Start date: </label>
                                <input type="date" id="startDate-editTask" value={taskStartDate} onChange={handleInputChange} readOnly={ taskErased ? true : false} ></input> 
                        
                                <label className='label-end-date'>End date: </label>
                                <input type="date" id="endDate-editTask" value={taskEndDate} onChange={handleInputChange} readOnly={ taskErased ? true : false} ></input> 
                            </div>
                        </div>
                        <div className="category">
                            <h4 className="taskH4">Category</h4>
                            <div id="div-dropdown">
                                <select id="task-category-edit" value={taskCategory} onChange={handleTaskCategory} disabled={ taskErased ? true : false} required>
                                    <option value="" disabled >Category</option>
                                    {createSelectOptions()}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </>
    ); 
}
export default EditTask;