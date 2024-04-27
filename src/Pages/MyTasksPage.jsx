import { useNavigate } from "react-router-dom";
import AsideAddTask from "../Components/MyScrum/Tasks/AsideAddTask";
import MyTasks from "../Components/MyScrum/Tasks/MyTasks";
import { UserStore } from "../Stores/UserStore";

function MyTasksPage() {
    const user = UserStore((state) => state.user); 
    const navigate = useNavigate();

    const isAsideVisible = UserStore((state) => state.isAsideVisible);
    console.log("my tasks page ",isAsideVisible);

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