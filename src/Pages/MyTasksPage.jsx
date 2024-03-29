import { useNavigate } from "react-router-dom";
import AsideAddTask from "../Components/MyScrum/Tasks/AsideAddTask";
import MyTasks from "../Components/MyScrum/Tasks/MyTasks";
import { UserStore } from "../Stores/UserStore";

function MyTasksPage() {
    const user = UserStore.getState().user; 
    const navigate = useNavigate();

    if (!user) {
        navigate('/');
    } 

    return (
        <>
            <AsideAddTask />
            <MyTasks />
        </>
    );
}
export default MyTasksPage;