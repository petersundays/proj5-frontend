import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { UserStatistics } from '../../../functions/Statistics/Statistics';
import { UserStore } from '../../../Stores/UserStore';
import { CategoriesList } from '../../../functions/Statistics/Categories';
import { AverageTimeToFinishTask } from '../../../functions/Statistics/TaskAverageTime';
import { GetConcludedTasksByDate } from '../../../functions/Statistics/ConcludedTasks';
import { GetUsersRegisteredByDate } from '../../../functions/Statistics/RegistredUsers';


function Dashboard() {

    const token = UserStore(state => state.user.token);

    const [userStats, setUserStats] = useState([]);
    const [categories, setCategories] = useState([]);
    const [taskTime, setTaskTime] = useState(0.0);
    const [concludedTasks, setConcludedTasks] = useState([]);
    const [usersRegistered, setUsersRegistered] = useState([]);


    useEffect(() => {
        UserStatistics(token).then((stats) => {
          setUserStats(stats);
        });
    
        CategoriesList(token).then((categories) => {
          setCategories(categories);
        });

        AverageTimeToFinishTask(token).then((time) => {
          setTaskTime(time);
        });

        GetConcludedTasksByDate(token).then((tasks) => {
            setConcludedTasks(tasks);
        });

        GetUsersRegisteredByDate(token).then((users) => {
            setUsersRegistered(users);
        });

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
                <label className="dashboard-label">ActiveUsers</label>
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