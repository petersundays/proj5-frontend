import { useNavigate } from "react-router-dom";
import EditProfile from "../Components/MyScrum/EditProfile/EditProfile";
import { UserStore } from "../Stores/UserStore";

function EditProfilePage() {

    const user = UserStore.getState().user; 
    const navigate = useNavigate();

    if (!user) {
        navigate('/');
    } 
    
    return (
        <>
            <EditProfile />
        </>
    );
}
export default EditProfilePage;