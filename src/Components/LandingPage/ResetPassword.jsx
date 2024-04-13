import './ConfirmAccount.css';
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from '../General/Button';
import { SetPassword } from '../../functions/Users/SetPassword';
import { showSuccessMessage } from '../../functions/Messages/SuccessMessage';
import { showErrorMessage } from '../../functions/Messages/ErrorMessage';

function ResetPassword() {

    const navigate = useNavigate();
    const { token } = useParams();

    const [passwordData, setPasswordData] = useState({
        password: '',
        confirmPassword: ''
    });

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleSetPassword = async (e) => {
        if (await SetPassword(e, token, passwordData.password, passwordData.confirmPassword)) {
            showSuccessMessage('Password set successfully');
            navigate('/');
        } else {
            showErrorMessage('Error setting password');
        }
    };

    const handleCancelButton = () => {
        navigate('/');
    };

    return (
        <div id="set-password">
            <h3>Please define a new password</h3>
            <form id="setPasswordForm">
                <input type="password" id="newPassword" name="password" placeholder="Password" value={passwordData.password} onChange={handlePasswordChange} required />
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
                <div className="password-buttons">
                    <Button text="Cancel" onClick={handleCancelButton}/>
                    <Button type="submit" text="Save" onClick={handleSetPassword} />
                </div>
            </form>
        </div>
    );
}
export default ResetPassword;