import './ConfirmAccount.css';
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from '../General/Button';
import { SetPassword } from '../../functions/Users/SetPassword';
import { showSuccessMessage } from '../../functions/Messages/SuccessMessage';
import { showErrorMessage } from '../../functions/Messages/ErrorMessage';
import { IsValidationTokenValid } from '../../functions/Users/IsValidationTokenValid';
import { useTranslation } from 'react-i18next';

function ResetPassword() {

    const navigate = useNavigate();
    const { t } = useTranslation();

    const { token } = useParams();
  
    const [tokenValid, setTokenValid] = useState(false);

    IsValidationTokenValid(token).then((result) => {
        setTokenValid(result);
        if (!result) {
            showErrorMessage('Time expired, please try again');
            navigate('/');
        }
    });

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
        <>
            {tokenValid && 
                <div id="set-password">
                    <h3>{t('defineNewPassword')}</h3>
                    <form id="setPasswordForm">
                        <input type="password" id="newPassword" name="password" placeholder={t('password')} value={passwordData.password} onChange={handlePasswordChange} required />
                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder={t('confirmPassword')} value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
                        <div className="password-buttons">
                            <Button text={t('cancel')} onClick={handleCancelButton}/>
                            <Button type="submit" text={t('save')} onClick={handleSetPassword} />
                        </div>
                    </form>
                </div>
                
            }
        </>
    );
}
export default ResetPassword;