import React, { useState } from 'react';
import { UserStore } from '../../../Stores/UserStore.jsx';
import './TaskElement.css';
import darkCross from '../../../multimedia/dark-cross-01.png';
import restoreIcon from '../../../multimedia/restoreIcon.png';
import { useNavigate } from 'react-router-dom';
import { showErrorMessage } from '../../../functions/Messages/ErrorMessage.js';
import { showSuccessMessage } from '../../../functions/Messages/SuccessMessage.js';
import { getAllTasks } from '../../../functions/Tasks/GetAllTasks.js';
import { AllTasksStore } from '../../../Stores/AllTasksStore.jsx';
import { ConfirmationModal } from '../../General/ConfirmationModal.jsx';
import { StatisticsStore } from '../../../Stores/StatisticsStore.jsx';


const TaskElement = ({ task }) => {

    const navigate = useNavigate();
    const key = task.taskId;

    const taskOwner = task.owner.username;
    const userLoggedIn = UserStore.getState().user.username;
    const token = UserStore.getState().user.token;

    const LOW = 100;
    const MEDIUM = 200;
    const HIGH = 300;

    const DEVELOPER = 100;
    const SCRUM_MASTER = 200;
    const PRODUCT_OWNER = 300;

    const typeOfUser = UserStore.getState().user.typeOfUser;
    const { sendMessage } = StatisticsStore((state) => ({ sendMessage: state.sendMessage }));

    const taskElementId = task.taskId;
    const taskElementTitle = task.title;
    const taskElementDescription = task.description;
    const taskElementErased = task.erased;

    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const message = "Are you sure you want to delete this task?";
    
    const handleDisplayConfirmationModal = () => {
        setDisplayConfirmationModal(!displayConfirmationModal);
    }

    const addPriorityClass = () => {
        if (task.priority === LOW) {
            return 'low';
        } else if (task.priority === MEDIUM) {
            return 'medium';
        } else if (task.priority === HIGH) {
            return 'high';
        }
    }

    const addTaskErasedClass = () => {
        if (task.erased) {
            return 'erased';
        }
    }

    const addEraseButton = () => {
        if ( (typeOfUser === SCRUM_MASTER && !taskElementErased) || (typeOfUser === PRODUCT_OWNER && !taskElementErased) ) {
            return <img src={darkCross} className='apagarButton' id={task.id} dataset={taskElementId} alt='erase' onClick={handleEraseRestoreButton} />
        } 
    }

    const addDeleteAndRestoreButton = () => {
        if (typeOfUser === PRODUCT_OWNER && taskElementErased) {
            return (
            <>
                <img src={darkCross} className='permanent-delete-button' id={task.id} dataset={taskElementId} alt='delete' onClick={handleDisplayConfirmationModal} />
                <img src={restoreIcon} className='restore-button' id={task.id} dataset={taskElementId} alt='delete' onClick={handleEraseRestoreButton} />
            </>
            )
        }
    }

    const handleTaskToEdit = () => {
        
        if (typeOfUser=== DEVELOPER && task.erased) {
            showErrorMessage('Tarefa apagada, não é possível editar.');
            return;
        } else if ((taskOwner !== userLoggedIn && typeOfUser !== SCRUM_MASTER && typeOfUser !== PRODUCT_OWNER) && task.erased === false) {
            showErrorMessage('Não é possível editar tarefas de outros utilizadores.');
        } else if ((taskOwner === userLoggedIn || typeOfUser === SCRUM_MASTER || typeOfUser === PRODUCT_OWNER) && task.erased === false) {
            navigate('/my-scrum/edit-task', { state: { task: task } });
        } else if ((typeOfUser === SCRUM_MASTER || typeOfUser === PRODUCT_OWNER) && task.erased === true) {
            navigate('/my-scrum/edit-task', { state: { task: task } });
        }
    }

    const handleEraseRestoreButton = async () => {
        let restore = false;
        
        if (task.erased) {
            restore = true;
        } 

        await eraseTask(restore);
        
    }

    const handleDeleteButton = async () => {
        await deleteTask();
    }
   

    const eraseTask = async (restore) => {

        
        const eraseRequest = `http://localhost:8080/backend_proj5_war_exploded/rest/tasks/erase-restore/${task.id}`;
        try {
            const response = await fetch(eraseRequest, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                    token: token,
                },
            });

            if (response.ok) {
                if (restore) {
                    showSuccessMessage('Tarefa restaurada: ' + task.title);
                    sendMessage();
                } else {
                    showSuccessMessage('Tarefa apagada: ' + task.title);
                    sendMessage();
                }
            } else {
                const error = await response.text();
                showErrorMessage('Error: ' + error);
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage('Something went wrong. Please try again later.');
        }
    
        const updateAllTasks = await getAllTasks(token);
        AllTasksStore.setState({ tasks: updateAllTasks });
        
    }


    const deleteTask = async () => {

        const deleteRequest = `http://localhost:8080/backend_proj5_war_exploded/rest/tasks/delete/${task.id}`;
        try {
            const response = await fetch(deleteRequest, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                    token: token,
                },
            });

            if (response.ok) {
                showSuccessMessage('Tarefa eliminada: ' + task.title);
                sendMessage();
            } else {
                const error = await response.text();
                showErrorMessage('Error: ' + error);
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage('Something went wrong. Please try again later.');
        }
        
        const updateAllTasks = await getAllTasks(token);
        AllTasksStore.setState({ tasks: updateAllTasks });
    }

    return (
        
        <>
            <ConfirmationModal onConfirm={handleDeleteButton} onCancel={handleDisplayConfirmationModal} message={message} displayModal={displayConfirmationModal} />
            <div data-testid="task-element" key={key} className={`task ${addPriorityClass()} ${addTaskErasedClass()} not-draggable`} id={key} draggable="true" 
                onDragStart={(event) => {
                    event.dataTransfer.setData('text/plain', task.id);}}
                onDoubleClick={handleTaskToEdit} > 
                <div className='post-it'>
                    <h3>{taskElementTitle}</h3>
                    <div className='post-it-text'>
                        <p>{taskElementDescription}</p>
                    </div>
                    {addEraseButton()}
                    {addDeleteAndRestoreButton()}
                </div>
            </div>
        </>
    );
}
export default TaskElement;