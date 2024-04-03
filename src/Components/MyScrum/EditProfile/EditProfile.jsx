import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EditProfile.css';
import { UserStore } from '../../../Stores/UserStore';
import AsideEditProfile from './AsideEditProfile';
import Button from '../../General/Button';
import { showErrorMessage } from '../../../functions/Messages/ErrorMessage';
import { showSuccessMessage } from '../../../functions/Messages/SuccessMessage';
import { showInfoMessage } from '../../../functions/Messages/InfoMessage';
import { getUserByUsername } from '../../../functions/Users/GetUserByUsername';

function EditProfile() {
    const navigate = useNavigate();
    const {username} = useParams();
    const token = UserStore.getState().user.token;
    const userLogged = UserStore.getState().user;
    const typeOfUser = UserStore.getState().user.typeOfUser;
    
    const DEVELOPER = 100;
    const SCRUM_MASTER = 200;
    const PRODUCT_OWNER = 300;


    const [formData, setFormData] = useState({}); 
    const [photoURL, setPhotoURL] = useState("");
    const [fetchedUser, setFetchedUser] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            const fetchedUser = await getUserByUsername(token, username);
            setFormData({ ...fetchedUser });
            setPhotoURL(fetchedUser.photoURL);
            setFetchedUser(fetchedUser);
        };
        fetchUser();
    }, [username]);

   

    const [displayPasswordModal, setDisplayPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        profile_oldPassword: '',
        profile_newPassword: '',
        profile_confirmPassword: ''
    });

    const handlePasswordModal = () => {
        clearPasswordFields();
        setDisplayPasswordModal(!displayPasswordModal);
    }; 

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleCancelEdition = () => {
        navigate('/my-scrum');
    };

    const clearPasswordFields = () => {
        setPasswordData({
            profile_oldPassword: '',
            profile_newPassword: '',
            profile_confirmPassword: ''
        });
    };


    const handlePhotoURLChangeOnAside = (event) => {
        const newPhotoURL = event.target.value;
        const img = new Image();

        img.src = newPhotoURL;
        img.onload = () => {
            setPhotoURL(newPhotoURL);
        };
        img.onerror = () => {
            setPhotoURL(user.photoURL);
        };
    };
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleInputChangeAndPhotoURLChange = (event) => {
        handleInputChange(event);
        handlePhotoURLChangeOnAside(event);
    };


    const areInputsUnchanged = () => {
        return (
            formData.firstName === fetchedUser.firstName &&
            formData.lastName === fetchedUser.lastName &&
            formData.email === fetchedUser.email &&
            formData.phone === fetchedUser.phone &&
            formData.photoURL === fetchedUser.photoURL
        );
    };

    const inputsThatChanged = () => {
        if (formData.firstName === userLogged.firstName) {
            formData.firstName = null;
        }
        if (formData.lastName === userLogged.lastName) {
            formData.lastName = null;
        }
        if (formData.email === userLogged.email) {
            formData.email = null;
        }
        if (formData.phone === userLogged.phone) {
            formData.phone = null;
        }
        if (formData.photoURL === userLogged.photoURL) {
            formData.photoURL = null;
        }
    };

    const isProfileOwner = () => {
        return username === userLogged.username || typeOfUser === PRODUCT_OWNER;
    };

    const isOwnerOrUnchanged = () => {
        return isProfileOwner() || areInputsUnchanged();
    };
          

    const handleSubmitProfileChanges = async (e) => {
        e.preventDefault();

        if (areInputsUnchanged()) {
            showInfoMessage('No changes were made');
            navigate('/my-scrum');
        } else {

            inputsThatChanged();
            
            const token = UserStore.getState().user.token;
            const updateRequest = `http://localhost:8080/proj5_backend_war_exploded/rest/users/${user.username}`;
            try {
                const response = await fetch(updateRequest, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                        token: token
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    const user = await response.json();
                    UserStore.getState().updateUser(formData);
                    showSuccessMessage('Profile updated successfully');
                    navigate('/my-scrum');
                } else {
                    const error = await response.text();
                    showErrorMessage('Error: ' + error);
                }
            } catch (error) {
                console.error('Error:', error);
                showErrorMessage('Something went wrong. Please try again later.');
            }
        }

    };

    const handleSubmitPasswordChanges = async (e) => {
        e.preventDefault();
        const token = UserStore.getState().user.token;
        const oldPassword = passwordData.profile_oldPassword;
        const newPassword = passwordData.profile_newPassword;
        const confirmPassword = passwordData.profile_confirmPassword;

        const updateRequest = `http://localhost:8080/proj5_backend_war_exploded/rest/users/${user.username}/password`;

        if (newPassword !== confirmPassword) {
            showErrorMessage('Passwords do not match');
            return;
        } else if (oldPassword === newPassword) {
            showErrorMessage('New password must be different from the old one');
            return;
        } else {

            try {
                const response = await fetch(updateRequest, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json', 
                        'Accept': '*/*',
                        token: token,
                        oldPassword: oldPassword,
                        newPassword: newPassword,
                    },
                    body: JSON.stringify(passwordData)


                }); 

                if (response.ok) {
                    showSuccessMessage('Password updated successfully');
                    clearPasswordFields();
                    setDisplayPasswordModal(false);
                } else {
                    const error = await response.text();
                    showErrorMessage(error);
                }
            } catch (error) {
                console.error('Error:', error);
                showErrorMessage('Something went wrong. Please try again later.');
            }
        }
    };



    return (
        <>
            <AsideEditProfile photoURL={photoURL} />
         
            <main className="main-editProfile">
                <form className="editProfile-register" id="edit-profile-form" onSubmit={handleSubmitProfileChanges} >
                    <div className="editProfile-fieldsContainer" >
                        <div className="left-fields-editProfile" >
                            <label className="labels-edit-profile" id="email-editProfile-label" hidden={ isProfileOwner() === true ? false : true } >Email</label>
                            <input type="email" className="editProfile-fields" id="email-editProfile" name="email" placeholder={fetchedUser.email} onChange={handleInputChange} readOnly={ isProfileOwner() === true ? false : true } hidden={ isProfileOwner() === true ? false : true }/>
                            <label className="labels-edit-profile" id="firstName-editProfile-label">First Name</label>
                            <input type="text" className="editProfile-fields" id="firstName-editProfile" name="firstName" placeholder={fetchedUser.firstName} onChange={handleInputChange} readOnly={ isProfileOwner() === true ? false : true }/>
                            <label className="labels-edit-profile" id="lastName-editProfile-label">Last Name</label>
                            <input type="text" className="editProfile-fields" id="lastName-editProfile" name="lastName" placeholder={fetchedUser.lastName} onChange={handleInputChange} readOnly={ isProfileOwner() === true ? false : true } />
                            <label className="labels-edit-profile" id="phone-editProfile-label" hidden={ isProfileOwner() === true ? false : true }>Phone</label>
                            <input type="text" className="editProfile-fields" id="phone-editProfile" name="phone" placeholder={fetchedUser.phone} onChange={handleInputChange} readOnly={ isProfileOwner() === true ? false : true } hidden={ isProfileOwner() === true ? false : true }/>
                            <label className="labels-edit-profile" id="photoURL-editProfile-label" hidden={ isProfileOwner() === true ? false : true }>Profile Picture</label>
                            <input type="url" className="editProfile-fields" id="photoURL-editProfile" name="photoURL" placeholder={fetchedUser.photoURL} onChange={handleInputChangeAndPhotoURLChange} readOnly={ isProfileOwner() === true ? false : true } hidden={ isProfileOwner() === true ? false : true }/>
                        </div>
                    </div>
                    <div className="editProfile-Buttons">
                        <Button text="Change Password" onClick={handlePasswordModal} hidden={ username === userLogged.username ? false : true }/>
                        <Button text="Cancel" onClick={handleCancelEdition} hidden={ isProfileOwner() === true ? false : true } />
                        <Button type="submit" text="Save" hidden={isProfileOwner() === true ? false : true} />
                    </div>
                </form>
            </main>

            <div id="passwordModal" className={`modal ${displayPasswordModal ? 'modalShown' : ''}`}>                
            <div className="modalContent">
                    <form id="changePasswordForm">
                        <input type="password" id="profile_oldPassword" name="profile_oldPassword" placeholder="Current Password" value={passwordData.profile_oldPassword} onChange={handlePasswordChange} required />
                        <input type="password" id="profile_newPassword" name="profile_newPassword" placeholder="New Password" value={passwordData.profile_newPassword} onChange={handlePasswordChange} required />
                        <input type="password" id="profile_confirmPassword" name="profile_confirmPassword" placeholder="Confirm New Password" value={passwordData.profile_confirmPassword} onChange={handlePasswordChange} required />
                        <div className="modal-buttons">
                            <Button text="Cancel" onClick={handlePasswordModal}/>
                            <Button type="submit" text="Save" onClick={handleSubmitPasswordChanges} />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default EditProfile;
