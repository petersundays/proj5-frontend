import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { UserStatistics } from '../../../functions/Statistics/Statistics';
import { UserStore } from '../../../Stores/UserStore';
import { CategoriesList } from '../../../functions/Statistics/Categories';
import { AverageTimeToFinishTask } from '../../../functions/Statistics/TaskAverageTime';


function Dashboard() {

    const token = UserStore(state => state.user.token);

    const [userStats, setUserStats] = useState([]);
    const [categories, setCategories] = useState([]);
    const [taskTime, setTaskTime] = useState(0.0);

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
        </div>
    </>
  );
}
export default Dashboard;