import { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';
import { StatisticsStore } from '../../../Stores/StatisticsStore';




function Dashboard() {

    const [userStats, setUserStats] = useState(StatisticsStore.getState().userStats);
    const [categories, setCategories] = useState(StatisticsStore.getState().categories);
    const [taskTime, setTaskTime] = useState(StatisticsStore.getState().averageTaskTime);
    const [concludedTasks, setConcludedTasks] = useState(StatisticsStore.getState().totalTasksDoneByEachDay);
    const [usersRegistered, setUsersRegistered] = useState(StatisticsStore.getState().usersRegistered);

useEffect(() => {
    const unsubscribe = StatisticsStore.subscribe((state) => {
        setUserStats(state.userStats);
        setCategories(state.categories);
        setTaskTime(state.averageTaskTime);
        setConcludedTasks(state.totalTasksDoneByEachDay);
        setUsersRegistered(state.usersRegistered);
    });

    return () => unsubscribe();
}, []);


      const displayCategories = () => {
        return categories.map((category) => {
            return (
                <tr key={category}>
                    <td>{category}</td>
                </tr>
            );
        });
    };

    const displayConcludedTasks = () => {
        return concludedTasks.map((task) => {
            return (
                <tr key={task}>
                    <td>{task[0]}</td>
                    <td>{task[1]}</td>
                </tr>
            );
        });
    }

    const displayUsersRegistered = () => {
        return usersRegistered.map((user) => {
            return (
                <tr key={user}>
                    <td>{user[0]}</td>
                    <td>{user[1]}</td>
                </tr>
            );
        });
    }


    const titles = ["Total Users", "Active Users", "Inactive Users", "Confirmed Users", "Not Confirmed Users"];
    const taskTitles = ["Average Tasks per User", "Total Tasks To Do", "Total Tasks Doing", "Total Tasks Done"];

    return (
        <>
        <div>
            <div id="dashboard" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Card className="user-stat-card">
                    <Card.Body>
                        {userStats.slice(0, 5).map((stat, index) => (
                            <div key={index}>
                                <Card.Title>{titles[index]}</Card.Title>
                                <Card.Text>{stat}</Card.Text>
                            </div>
                        ))}
                    </Card.Body>
                </Card>
                <Card className="task-stat-card">
                    <Card.Body>
                        {userStats.slice(5, 9).map((stat, index) => (
                            <div key={index}>
                                <Card.Title>{taskTitles[index]}</Card.Title>
                                <Card.Text>{stat}</Card.Text>
                            </div>
                        ))}
                    </Card.Body>
                </Card>
                <Card className="category-stat-card">
                    <Card.Body>
                        <Card.Title>Categories by #tasks</Card.Title>
                        {categories.map((category, index) => (
                            <Card.Text key={index}>{category}</Card.Text>
                        ))}
                    </Card.Body>
                </Card>
            </div>
            <div className='dashboard-charts'>
            <Card className="concluded-tasks-card">
                <Card.Body>
                    <Card.Title>Concluded Tasks Over Time</Card.Title>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={concludedTasks.map(task => ({ name: task[0], uv: task[1] }))}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend 
                            formatter={(value, entry) => {
                                const { dataKey } = entry;
                                if (dataKey === 'uv') {
                                return 'Total Tasks';
                                }
                                return value;
                            }}
                            />
                            <Line type="monotone" dataKey="uv" stroke="#21979c" />
                        </LineChart>
                    </ResponsiveContainer>
                </Card.Body>
            </Card>
            <Card className="registered-users-card">
                <Card.Body>
                    <Card.Title>Active Users</Card.Title>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={usersRegistered.map(user => ({ name: user[0], uv: user[1] }))}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend 
                            formatter={(value, entry) => {
                                const { dataKey } = entry;
                                if (dataKey === 'uv') {
                                return 'Total Users';
                                }
                                return value;
                            }}
                            />
                            <Line type="monotone" dataKey="uv" stroke="#21979c" />
                        </LineChart>
                    </ResponsiveContainer>
                </Card.Body>
            </Card>
            </div>
        </div>
        </>
    );
}
export default Dashboard;