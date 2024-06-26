import React, { useEffect, useState } from 'react';
import "./TasksContainer.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import TaskElement from './TaskElement';
import { AllTasksStore } from '../../../Stores/AllTasksStore';
import { UserStore } from '../../../Stores/UserStore';
import { showSuccessMessage } from '../../../functions/Messages/SuccessMessage';
import { getTasksFromUser } from '../../../functions/Tasks/GetTasksFromUser';
import { getAllTasks } from '../../../functions/Tasks/GetAllTasks';
import { showErrorMessage } from '../../../functions/Messages/ErrorMessage';
import { StatisticsStore } from '../../../Stores/StatisticsStore';
import { Container, Row, Col, Carousel } from 'react-bootstrap';

function TasksContainer() {
    const [tasksToRender, setTasksToRender] = useState([]);
    const typeOfUser = UserStore.getState().user.typeOfUser;
    const token = UserStore.getState().user.token;
    const userLoggedIn = UserStore.getState().user.username;
    const { sendMessage } = StatisticsStore((state) => ({ sendMessage: state.sendMessage }));

    const [isMobile, setIsMobile] = useState(window.innerWidth < 1022);

    const TODO = 100;
    const DOING = 200;
    const DONE = 300;
    
    const DEVELOPER = 100;
   
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1200);
        };

        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    useEffect(() => {
        const updateTasks = () => {
            let tasks = AllTasksStore.getState().tasks;
            setTasksToRender(tasks);
        };
    
        updateTasks();
    
        const unsubscribeAllTasks = AllTasksStore.subscribe(updateTasks);
        
        return () => {
            unsubscribeAllTasks();
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

    const renderColumn = (stateId, title) => (
        <Col 
            onDragOver={(event) => { event.preventDefault(); }}
            onDrop={(event) => {
                const taskId = event.dataTransfer.getData("text/plain"); 
                updateTaskStateId(taskId, stateId);
            }}
        >
            <h2 className="main-home">{title}</h2>
            <div className="panel" id={title.toLowerCase()}>
                {renderTasks(stateId)}
            </div>
        </Col>
    );


    const updateTaskStateId = async (taskId, newStateId) => {

        const task = tasksToRender.find(task => task.id === taskId);
       
        const updateStatus = `http://localhost:8080/backend_proj5_war_exploded/rest/tasks/${taskId}/${newStateId}`;

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
                showSuccessMessage('Task state updated: ' + task.title);
                sendMessage();
            } else {
                const error = await response.text();
                showErrorMessage('Error: ' + error);
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage('Something went wrong. Please try again later.');
        }


        let updateTasks = [];

        if (location.pathname === '/my-scrum/all-tasks') {
            updateTasks = await getAllTasks(token);
        } else if (location.pathname === '/my-scrum') {

            updateTasks = await getTasksFromUser(userLoggedIn, token);
        }
        
        AllTasksStore.setState({ tasks: updateTasks });

    }


    const renderTasks = (stateId) => {

        return tasksToRender
            ? filteredTasks(stateId)
            : null;
    };

    return (
        <Container fluid>
            {isMobile ? (
                <Carousel>
                    <Carousel.Item>
                        {renderColumn(TODO, 'To do')}
                    </Carousel.Item>
                    <Carousel.Item>
                        {renderColumn(DOING, 'Doing')}
                    </Carousel.Item>
                    <Carousel.Item>
                        {renderColumn(DONE, 'Done')}
                    </Carousel.Item>
                </Carousel>
            ) : (
                <Row>
                    {renderColumn(TODO, 'To do')}
                    {renderColumn(DOING, 'Doing')}
                    {renderColumn(DONE, 'Done')}
                </Row>
            )}
        </Container>
    );
}

export default TasksContainer;