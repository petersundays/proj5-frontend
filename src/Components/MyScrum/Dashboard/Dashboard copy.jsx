import { useEffect, useState } from 'react';
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


  return (
    <>
        <div id="dashboard">
            <h3 className="dashboard-title">Dashboard</h3>
            <div className='dashboard-users'>
                <label className="dashboard-label">Total Users</label>
                <p id="total-users" className="dashboard-data">{userStats[0]}</p>
                <label className="dashboard-label">Active Users</label>
                <p id="confirmed-users" className="dashboard-data">{userStats[1]}</p>
                <label className="dashboard-label">Inactive Users</label>
                <p id="unconfirmed-users" className="dashboard-data">{userStats[2]}</p>
                <label className="dashboard-label">Confirmed Users</label>
                <p id="confirmed-users" className="dashboard-data">{userStats[3]}</p>
                <label className="dashboard-label">Not Confirmed Users</label>
                <p id="unconfirmed-users" className="dashboard-data">{userStats[4]}</p>
                <label className="dashboard-label">Average Tasks per User</label>
                <p id="tasks-per-user" className="dashboard-data">{userStats[5]}</p>
                <label className="dashboard-label">To Do Tasks</label>
                <p id="tasks-todo" className="dashboard-data">{userStats[6]}</p>
                <label className="dashboard-label">Doing Tasks</label>
                <p id="tasks-doing" className="dashboard-data">{userStats[7]}</p>
                <label className="dashboard-label">Done Tasks</label>
                <p id="tasks-done" className="dashboard-data">{userStats[8]}</p>
                <label className="dashboard-label">Average Time to Finish Task (days)</label>
                <p id="tasks-done" className="dashboard-data">{taskTime}</p>
            </div>
            <div className='dashboard-categories'>
                <table className="table">
                    <thead>
                        <tr className="table-header">
                            <th>Category</th>                                   
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {displayCategories()}
                    </tbody>
                </table>
            </div>
            <div className='dashboard-charts'>
                <table className="table">
                        <thead>
                            <tr className="table-header">
                                <th>Date</th> 
                                <th>Total</th>                                  
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {displayConcludedTasks()}
                        </tbody>
                    </table>
            </div>
            <div className='dashboard-registered-users'>
                <table className="table">
                        <thead>
                            <tr className="table-header">
                                <th>Date</th> 
                                <th>Total</th>                                  
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {displayUsersRegistered()}
                        </tbody>
                    </table>
            </div>

        </div>
    </>
  );
}
export default Dashboard;