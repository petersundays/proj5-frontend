import { useEffect, useState } from 'react';
import { AllUsersStore } from '../../../Stores/AllUsersStore';
import Button from '../../General/Button';
import './UserDetails.css';
import { RegisterUser } from '../../../functions/Users/RegisterUser';
import { showErrorMessage } from '../../../functions/Messages/ErrorMessage';
import userAvatar from '../../../../multimedia/user-avatar.jpg';
import { showInfoMessage } from '../../../functions/Messages/InfoMessage';
import { UserStore } from '../../../Stores/UserStore';
import { showSuccessMessage } from '../../../functions/Messages/SuccessMessage';
import { getUserByUsername } from '../../../functions/Users/GetUserByUsername';
import { StatisticsStore } from '../../../Stores/StatisticsStore';
import { useTranslation } from 'react-i18next';

export function UserDetails () {

    //const [displayContainer, setDisplayContainer] = useState(AllUsersStore.getState().displayContainer); 
    //const [newUser, setNewUser] = useState(AllUsersStore.getState().newUser);
    const token = UserStore.getState().user.token;
    //const usernameToEdit = AllUsersStore.getState().userToEdit;
    const userLoggedType = UserStore.getState().user.typeOfUser;
    const { sendMessage } = StatisticsStore((state) => ({ sendMessage: state.sendMessage }));

    const { t } = useTranslation();

    const toggleNewUser = UserStore((state) => state.toggleNewUser);

    const DEVELOPER = 100;
    const SCRUM_MASTER = 200;
    const PRODUCT_OWNER = 300;

    //const [userToEdit, setUserToEdit] = useState({});
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [photoUrl, setPhotoUrl] = useState(userAvatar);
    const [role, setRole] = useState(undefined);


    const handleInputs = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'username':
                setUsername(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'first name':
                setFirstName(value);
                break;
            case 'last name':
                setLastName(value);
                break;
            case 'phone':
                setPhone(value);
                break;
            case 'photo url':
                setPhotoUrl(value);
                break;
            case 'role':
                if (value === '100') {
                    setRole(DEVELOPER);
                } else if (value === '200') {
                    setRole(SCRUM_MASTER);
                }
                else if (value === '300') {
                    setRole(PRODUCT_OWNER);
                }
                break;
            default:
                break;
        }
    }

    const handlePhotoURLChange = (e) => {
        const newPhotoURL = e.target.value;
        const img = new Image();

        img.src = newPhotoURL;
        img.onload = () => {
            setPhotoUrl(newPhotoURL);
        };
        img.onerror = () => {
            
            setPhotoUrl(userAvatar);
       
        };
    };

    const handlePhotoUrlAndInputChange = (e) => {
        handleInputs(e);
        handlePhotoURLChange(e);
    };

    const clearInputs = () => {
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setEmail('');
        setFirstName('');
        setLastName('');
        setPhone('');
        setPhotoUrl('');
        setRole("100");
    }
        

    const handleCancelButton = () => {     
            clearInputs();
            toggleNewUser(false);        
    }


    const handleSaveButton = async (e) => {
        e.preventDefault();
        await registerNewUser(e);
    }
    
    const registerNewUser = async (event) => {
        event.preventDefault();

        let registredSuccessfully = false;
    
        if (password !== confirmPassword) {
            showErrorMessage("Passwords don't match.");
            return;
        } else {

            if (photoUrl === '' || photoUrl === undefined) {
                setPhotoUrl('https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTWfm4QX7YF7orMboLv4jjuwoYgd85bKBqeiBHLOfS6MgfHUW-d');
            }

            const userToRegister = {
                username: username,
                password: password,
                email: email,
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                photoURL: photoUrl,
                typeOfUser: role
            }

            try {
                registredSuccessfully = await RegisterUser(event, userToRegister);
                
            } catch (error) {
                console.error('Error:', error);
                showErrorMessage("Something went wrong. Please try again later.");
            }

            if (registredSuccessfully) {
                const userRegistred = await getUserByUsername(token, username);
               // AllUsersStore.getState().setNewUser(false);
               // AllUsersStore.getState().setDisplayContainer(false);
                sendMessage();
                /* setNewUser(false);
                setDisplayContainer(false); */
                clearInputs();
                
            }
        }
    }


    return (
      <>
        <div
          className="offcanvas-users offcanvas-end"
          tabIndex="-1"
          id="offCanvasUsers"
          aria-labelledby="offcanvasExampleLabel"
        >
          <div className="offcanvas-header">
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label={t('Close')}
            ></button>
          </div>
          <div className="offcanvas-body">
            <div className= 'users-details-container'>
              <img src={photoUrl} id="profile-clicked-pic" alt={t('Profile Pic')} />
              <form id="edit-user-form">
                <label className="labels-edit-profile" id="username-editProfile-label">{t('Username')}</label>
                <input type="text" className="editUser-fields" id="username-editUser" name="username" placeholder={t('Username')} onChange={handleInputs} value={username} />
                <label className="labels-edit-profile" id="password-editProfile-label">{t('Password')}</label>
                <input type="password" className="editUser-fields" id="confirmPassword-editUser" name="password" placeholder={t('Password')} onChange={handleInputs} value={password} />
                <label className="labels-edit-profile" id="confirmPassword-editProfile-label">{t('Confirm Password')}</label>
                <input type="password" className="editUser-fields" id="confirmPassword-editUser" name="confirmPassword" placeholder={t('Confirm Password')} onChange={handleInputs} value={confirmPassword} />
                <label className="labels-edit-profile" id="email-editProfile-label">{t('Email')}</label>
                <input type="email" className="editUser-fields" id="email-editUser" name="email" placeholder={t('Email')} onChange={handleInputs} value={email} />
                <label className="labels-edit-profile" id="first name-editProfile-label">{t('First Name')}</label>
                <input type="text" className="editUser-fields" id="first name-editUser" name="first name" placeholder={t('First Name')} onChange={handleInputs} value={firstName} />
                <label className="labels-edit-profile" id="last name-editProfile-label">{t('Last Name')}</label>
                <input type="text" className="editUser-fields" id="last name-editUser" name="last name" placeholder={t('Last Name')} onChange={handleInputs} value={lastName} />
                <label className="labels-edit-profile" id="phone-editProfile-label">{t('Phone')}</label>
                <input type="text" className="editUser-fields" id="phone-editUser" name="phone" placeholder={t('Phone')} onChange={handleInputs} value={phone} />
                <label className="labels-edit-profile" id="photo url-editProfile-label">{t('Photo URL')}</label>
                <input type="url" className="editUser-fields" id="photo url-editUser" name="photo url" placeholder="photoUrl" onChange={handlePhotoUrlAndInputChange} />
                <select id="select_role" name="role" onChange={handleInputs} preventDefault="">
                  <option value="100" id="Developer">{t('Developer')}</option>
                  <option value="200" id="Scrum Master">{t('Scrum Master')}</option>
                  <option value="300" id="Product Owner">{t('Product Owner')}</option>
                </select>
                <div className='buttons-container'>
                  <Button width="94px" marginRight='5px' text={t('Save')} onClick={handleSaveButton} />
                  <Button width="94px" marginLeft='5px' text={t('Cancel')} onClick={handleCancelButton} />
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
  )
}