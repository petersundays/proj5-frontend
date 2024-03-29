import React, { useEffect, useState } from 'react';
import "./TasksContainer.css";
import TaskElement from './TaskElement';
import { MyTasksStore } from '../../../Stores/MyTasksStore';
import { AllTasksStore } from '../../../Stores/AllTasksStore';
import { TasksByCategoryStore } from '../../../Stores/TasksByCategoryStore';
import { UserStore } from '../../../Stores/UserStore';
import { showSuccessMessage } from '../../../functions/Messages/SuccessMessage';
import { getTasksFromUser } from '../../../functions/Tasks/GetTasksFromUser';
import { getAllTasks } from '../../../functions/Tasks/GetAllTasks';
import { getTasksByCategory } from '../../../functions/Tasks/GetTasksByCategory';

function TasksContainer() {
    const [tasksToRender, setTasksToRender] = useState([]);
    const typeOfUser = UserStore.getState().user.typeOfUser;
    const token = UserStore.getState().user.token;
    const userLoggedIn = UserStore.getState().user.username;

    const TODO = 100;
    const DOING = 200;
    const DONE = 300;
    
    const LOW = 100;
    const MEDIUM = 200;
    const HIGH = 300;
    
    const DEVELOPER = 100;
    const SCRUM_MASTER = 200;
    const PRODUCT_OWNER = 300;


    useEffect(() => {
        const updateTasks = () => {
            let tasks = [];
            if (window.location.pathname === '/my-scrum') {
                tasks = MyTasksStore.getState().tasks;
            } else if (window.location.pathname === '/my-scrum/all-tasks') {
                tasks = AllTasksStore.getState().tasks;
            } else if (window.location.pathname === '/my-scrum/categories') {
                tasks = TasksByCategoryStore.getState().tasks;
            }
            setTasksToRender(tasks);
        };

        updateTasks();

        const unsubscribeMyTasks = MyTasksStore.subscribe(updateTasks);
        const unsubscribeAllTasks = AllTasksStore.subscribe(updateTasks);
        const unsubscribeTasksByCategory = TasksByCategoryStore.subscribe(updateTasks);

        return () => {
            unsubscribeMyTasks();
            unsubscribeAllTasks();
            unsubscribeTasksByCategory();
        };
    }, []);

    const filteredTasks = (stateId) => {
        if (typeOfUser === DEVELOPER) {
            return tasksToRender
                .filter(task => task.stateId === stateId && task.erased === false) 
                .map(task => <TaskElement key={task.id} task={task} />)
        } else {
            return tasksToRender
                .filter(task => task.stateId === stateId)
                .map(task => <TaskElement key={task.id} task={task} />)
        }
    }

    const updateTaskStateId = async (taskId, newStateId) => {

        const task = tasksToRender.find(task => task.id === taskId);
       
        const updateStatus = `http://localhost:8080/proj5_backend_war_exploded/rest/users/tasks/${taskId}/${newStateId}`;

        try {
            const response = await fetch(updateStatus, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                    token: token,
                },
            });

            if (response.ok) {
                showSuccessMessage('Estado da tarefa atualizado: ' + task.title);
            } else {
                const error = await response.text();
                showErrorMessage('Error: ' + error);
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage('Something went wrong. Please try again later.');
        }

        const updateMyTasks = await getTasksFromUser(userLoggedIn, token);
        const updateAllTasks = await getAllTasks(token);
        const category = task.category.name;
        const updateCategoryTasks = await getTasksByCategory(category, token);
        
        MyTasksStore.setState({ tasks: updateMyTasks });
        AllTasksStore.setState({ tasks: updateAllTasks });
        TasksByCategoryStore.setState({ tasks: updateCategoryTasks });

    }


    const renderTasks = (stateId) => {

        return tasksToRender
            ? filteredTasks(stateId)
            : null;
    };

    return (
        <>
            <div className="titulo-main" 
            onDragOver={(event) => { event.preventDefault(); }}
            onDrop={(event) => {
                const taskId = event.dataTransfer.getData("text/plain"); 
                updateTaskStateId(taskId, TODO);
            }}
            >
                <h2 className="main-home">To do</h2>
                <div className="panel" id="todo">
                    {renderTasks(TODO)}
                </div>
            </div>
            <div className="titulo-main"
            onDragOver={(event) => { event.preventDefault(); }}
            onDrop={(event) => {
                const taskId = event.dataTransfer.getData("text/plain"); 
                updateTaskStateId(taskId, DOING );
            }}
            >
                <h2 className="main-home">Doing</h2>
                <div className="panel" id="doing">
                    {renderTasks(DOING)}
                </div>
            </div>
            <div className="titulo-main"
            onDragOver={(event) => { event.preventDefault(); }}
            onDrop={(event) => {
                const taskId = event.dataTransfer.getData("text/plain"); 
                updateTaskStateId(taskId, DONE);
            }}
            >
                <h2 className="main-home">Done</h2>
                <div className="panel" id="done">
                    {renderTasks(DONE)}
                </div>
            </div>
        </>
    );
}

export default TasksContainer;
