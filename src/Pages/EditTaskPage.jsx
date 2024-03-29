import { useNavigate } from "react-router-dom";
import EditTask from "../Components/MyScrum/Tasks/EditTask";
import { UserStore } from "../Stores/UserStore";

function EditTaskPage() {
    const user = UserStore.getState().user; 
    const navigate = useNavigate();

    if (!user) {
        navigate('/');
    } 
    
    return (
        <>
            <EditTask />
        </>
    );
}
export default EditTaskPage;