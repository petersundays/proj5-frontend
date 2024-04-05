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

export function UserDetails () {

    const [displayContainer, setDisplayContainer] = useState(AllUsersStore.getState().displayContainer); 
    const [newUser, setNewUser] = useState(AllUsersStore.getState().newUser);
    const token = UserStore.getState().user.token;
    const usernameToEdit = AllUsersStore.getState().userToEdit;
    const userLoggedType = UserStore.getState().user.typeOfUser;

    const DEVELOPER = 100;
    const SCRUM_MASTER = 200;
    const PRODUCT_OWNER = 300;

    const [userToEdit, setUserToEdit] = useState({});
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [role, setRole] = useState(undefined);
    

    useEffect(() => {
        console.log('displayContainer DETAILS', AllUsersStore.getState().displayContainer);
        const classes = document.getElementsByClassName('users-details-container')
        console.log('classes', classes[0].classList);
        getUserToEdit(usernameToEdit);
}, [usernameToEdit, displayContainer]); 

    useEffect(() => {
        const unsubscribe = AllUsersStore.subscribe((state) => {
            const usernameToEdit = state.userToEdit;
            getUserToEdit(usernameToEdit);
        });
        return () => unsubscribe();
    }, []);

    const getUserToEdit = async (usernameToEdit) => {
        const user = await getUserByUsername(token, usernameToEdit);
        setUserToEdit(user);
    }



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
            
            setPhotoUrl("https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTWfm4QX7YF7orMboLv4jjuwoYgd85bKBqeiBHLOfS6MgfHUW-d");
       
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

    const areInputsUnchanged = () => {
        return email === '' && firstName === '' && lastName === '' && phone === '' && role === undefined;
    }

    const inputsThatChanged = () => {
        let updatedUser = {};

        if (email !== userToEdit.email && email !== '') {
            updatedUser.email = email;
        }    
        if (firstName !== userToEdit.firstName && firstName !== '') {
            updatedUser.firstName = firstName;
        }
        if (lastName !== userToEdit.lastName && lastName !== '') {
            updatedUser.lastName = lastName;
        }
        if (phone !== userToEdit.phone && phone !== '') {
            updatedUser.phone = phone;
        }
        if (photoUrl !== userToEdit.photoURL && photoUrl !== '') {
            updatedUser.photoURL = photoUrl;
        }
        if (role !== userToEdit.typeOfUser && role !== undefined) {
            updatedUser.typeOfUser = role;
        }
    
        return updatedUser;
    };


    const updateUserToEdit = (user) => {

        if (user.email) {
            userToEdit.email = user.email;
        }
        if (user.firstName) {
            userToEdit.firstName = user.firstName;
        }
        if (user.lastName) {
            userToEdit.lastName = user.lastName;
        }
        if (user.phone) {
            userToEdit.phone = user.phone;
        }
        if (user.photoURL) {
            userToEdit.photoURL = user.photoURL;
        }
        if (user.typeOfUser) {
            userToEdit.typeOfUser = user.typeOfUser;
        }
        
        return userToEdit;
    }
        

    const handleCancelButton = () => {
        if (newUser) {
            clearInputs();
            setNewUser(false);
            AllUsersStore.getState().setNewUser(false);
            setDisplayContainer(false);
            AllUsersStore.getState().setDisplayContainer(false);
        } else {
            clearInputs();
            setDisplayContainer(false);
            AllUsersStore.getState().setDisplayContainer(false);
        }
        const classes = document.getElementsByClassName('users-details-container')
        console.log('classes', classes[0].classList);
    }


    const handleSaveButton = async (e) => {
        e.preventDefault();
        if (newUser) {
            await registerNewUser(e);
        } else {
            await handleSubmitProfileChanges(e);
        }
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
                AllUsersStore.getState().addUser(userRegistred);
                AllUsersStore.getState().setNewUser(false);
                AllUsersStore.getState().setDisplayContainer(false);
                setNewUser(false);
                setDisplayContainer(false);
                clearInputs();
                
            }
        }
    }


    const handleSubmitProfileChanges = async (e) => {
        e.preventDefault();

        if (areInputsUnchanged()) {
            showInfoMessage('No changes were made');
            setDisplayContainer(false);
            AllUsersStore.getState().setDisplayContainer(false);
        } else {

            const updatedUser = inputsThatChanged();
            
            const token = UserStore.getState().user.token;
            const updateRequest = `http://localhost:8080/backend_proj5_war_exploded/rest/users/${userToEdit.username}`;
            try {
                const response = await fetch(updateRequest, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                        token: token
                    },
                    body: JSON.stringify(updatedUser)
                });

                if (response.ok) {                
                    showSuccessMessage('Profile updated successfully');
                    clearInputs();
                    setDisplayContainer(false);
                    updateUserToEdit(updatedUser);
                    AllUsersStore.getState().updateUser(userToEdit);
                    AllUsersStore.getState().setDisplayContainer(false);
             

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
    

    return (
        <div className={ `users-details-container ${!displayContainer ? 'hidden' : ''}` }>
            <h3 id="label-title" >{newUser ? "Register New User" : userToEdit.username}</h3>
            <img src={newUser ? userAvatar : userToEdit.photoURL} id="profile-clicked-pic" alt="Profile Pic" />
            <form id="edit-user-form">
                <label className="labels-edit-profile" id="username-editProfile-label" hidden={newUser ? false : true}>Username</label>
                <input type="text" className="editUser-fields" id="username-editUser" name="username" placeholder={newUser ? "Username" : ''} onChange={handleInputs} value={username} hidden={newUser ? false : true}/>
                <label className="labels-edit-profile" id="password-editProfile-label" hidden={newUser ? false : true}>Password</label>
                <input type="password" className="editUser-fields" id="confirmPassword-editUser" name="password" placeholder={newUser ? "Password" : ''} onChange={handleInputs} value={password} hidden={newUser ? false : true}/>
                <label className="labels-edit-profile" id="confirmPassword-editProfile-label" hidden={newUser ? false : true}>Confirm Password</label>
                <input type="password" className="editUser-fields" id="confirmPassword-editUser" name="confirmPassword" placeholder={newUser ? "Confirm Password" : ''} onChange={handleInputs} value={confirmPassword} hidden={newUser ? false : true}/>
                <label className="labels-edit-profile" id="email-editProfile-label" >Email</label>
                <input type="email" className="editUser-fields" id="email-editUser" name="email" placeholder={newUser ? "Email" : userToEdit.email} onChange={handleInputs} value={email} readOnly={!newUser && userLoggedType !== PRODUCT_OWNER}/>
                <label className="labels-edit-profile" id="first name-editProfile-label">First Name</label>
                <input type="text" className="editUser-fields" id="first name-editUser" name="first name" placeholder={newUser ? "First Name" : userToEdit.firstName} onChange={handleInputs} value={firstName} readOnly={!newUser && userLoggedType !== PRODUCT_OWNER}/>
                <label className="labels-edit-profile" id="last name-editProfile-label">Last Name</label>
                <input type="text" className="editUser-fields" id="last name-editUser" name="last name" placeholder={newUser ? "Last Name" : userToEdit.lastName} onChange={handleInputs} value={lastName} readOnly={!newUser && userLoggedType !== PRODUCT_OWNER}/>
                <label className="labels-edit-profile" id="phone-editProfile-label">Phone</label>
                <input type="text" className="editUser-fields" id="phone-editUser" name="phone" placeholder={newUser ? "Phone" : userToEdit.phone} onChange={handleInputs} value={phone} readOnly={!newUser && userLoggedType !== PRODUCT_OWNER}/>
                <label className="labels-edit-profile" id="photo url-editProfile-label">Photo URL</label>
                <input type="url" className="editUser-fields" id="photo url-editUser" name="photo url" placeholder={newUser ? "photoUrl" : userToEdit.photoURL} onChange={handlePhotoUrlAndInputChange} value={newUser ? "" : userToEdit.photoURL} readOnly={!newUser && userLoggedType !== PRODUCT_OWNER} />
                <select id="select_role" name="role" onChange={handleInputs} preventDefault="" readOnly={!newUser && userLoggedType !== PRODUCT_OWNER}>
                    {/* <option disabled="" value="undefined" id="user_role_loaded" ></option> */}
                    <option value="100" id="Developer" selected={userToEdit.typeOfUser === DEVELOPER} readOnly={!newUser && userLoggedType !== PRODUCT_OWNER}>Developer</option>
                    <option value="200" id="Scrum Master" selected={userToEdit.typeOfUser === SCRUM_MASTER} readOnly={!newUser && userLoggedType !== PRODUCT_OWNER}>Scrum Master</option>
                    <option value="300" id="Product Owner" selected={userToEdit.typeOfUser === PRODUCT_OWNER} readOnly={!newUser && userLoggedType !== PRODUCT_OWNER}>Product Owner</option>
                </select>
                <div className='buttons-container'>
                    <Button width="94px" marginRight= '5px' text="Save" onClick={handleSaveButton} hidden={!newUser && userLoggedType !== PRODUCT_OWNER}/>
                    <Button width="94px" marginLeft= '5px' text="Cancel" onClick={handleCancelButton} hidden={!newUser && userLoggedType !== PRODUCT_OWNER}/>

                </div>
            </form>
    </div>
    )
}