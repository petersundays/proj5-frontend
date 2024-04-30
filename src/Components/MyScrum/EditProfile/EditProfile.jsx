import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditProfile.css";
import { UserStore } from "../../../Stores/UserStore";
import AsideEditProfile from "./AsideEditProfile";
import Button from "../../General/Button";
import { showErrorMessage } from "../../../functions/Messages/ErrorMessage";
import { showSuccessMessage } from "../../../functions/Messages/SuccessMessage";
import { showInfoMessage } from "../../../functions/Messages/InfoMessage";
import { getUserByUsername } from "../../../functions/Users/GetUserByUsername";
import "react-chat-elements/dist/main.css";
import { MessageList } from "react-chat-elements";
import useWebSocketMessage from "../../../Websockets/MessageWS";
import { MessageStore } from "../../../Stores/MessageStore";

function EditProfile() {
  const navigate = useNavigate();
  const { username } = useParams();
  const token = UserStore.getState().user.token;
  const userLogged = UserStore.getState().user;
  const usernameLogged = userLogged.username;
  const typeOfUser = UserStore.getState().user.typeOfUser;
  const wsMessage = useWebSocketMessage(username);
  const messages = MessageStore((state) => state.messages);
  const sendMessage = wsMessage.sendMessage;

  const [message, setMessage] = useState("");

  const PRODUCT_OWNER = 300;

  const [formData, setFormData] = useState({});
  const [photoURL, setPhotoURL] = useState("");
  const [fetchedUser, setFetchedUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getUserByUsername(token, username);
      if (
        fetchedUser.username !== username ||
        fetchedUser.confirmed === false
      ) {
        navigate(`/my-scrum/profile/${usernameLogged}`);
      } else {
        setFormData({ ...fetchedUser });
        setPhotoURL(fetchedUser.photoURL);
        setFetchedUser(fetchedUser);
      }
    };
    fetchUser();
  }, [username]);

  useEffect(() => {
    return () => {
      // Clean up messages on component unmount
      MessageStore.setState({ messages: [] });
    };
  }, []);

  const [displayPasswordModal, setDisplayPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    profile_oldPassword: "",
    profile_newPassword: "",
    profile_confirmPassword: "",
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
    navigate("/my-scrum");
  };

  const clearPasswordFields = () => {
    setPasswordData({
      profile_oldPassword: "",
      profile_newPassword: "",
      profile_confirmPassword: "",
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

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    sendMessage({
      content: message,
    });
    setMessage("");
  };

  const handleSubmitProfileChanges = async (e) => {
    e.preventDefault();

    if (areInputsUnchanged()) {
      showInfoMessage("No changes were made");
      navigate("/my-scrum");
    } else {
      inputsThatChanged();

      const token = UserStore.getState().user.token;
      const updateRequest = `http://localhost:8080/backend_proj5_war_exploded/rest/users/${fetchedUser.username}`;
      try {
        const response = await fetch(updateRequest, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            token: token,
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const user = await response.json();
          if (fetchedUser.username === userLogged.username) {
            UserStore.getState().updateUser(formData);
          }
          showSuccessMessage("Profile updated successfully");
          navigate("/my-scrum");
        } else {
          const error = await response.text();
          showErrorMessage("Error: " + error);
        }
      } catch (error) {
        console.error("Error:", error);
        showErrorMessage("Something went wrong. Please try again later.");
      }
    }
  };

  const handleSubmitPasswordChanges = async (e) => {
    e.preventDefault();
    const token = UserStore.getState().user.token;
    const oldPassword = passwordData.profile_oldPassword;
    const newPassword = passwordData.profile_newPassword;
    const confirmPassword = passwordData.profile_confirmPassword;

    const updateRequest = `http://localhost:8080/backend_proj5_war_exploded/rest/users/${fetchedUser.username}/password`;

    if (newPassword !== confirmPassword) {
      showErrorMessage("Passwords do not match");
      return;
    } else if (oldPassword === newPassword) {
      showErrorMessage("New password must be different from the old one");
      return;
    } else {
      try {
        const response = await fetch(updateRequest, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            token: token,
            oldPassword: oldPassword,
            newPassword: newPassword,
          },
          body: JSON.stringify(passwordData),
        });

        if (response.ok) {
          showSuccessMessage("Password updated successfully");
          clearPasswordFields();
          setDisplayPasswordModal(false);
        } else {
          const error = await response.text();
          showErrorMessage(error);
        }
      } catch (error) {
        console.error("Error:", error);
        showErrorMessage("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <>
      <AsideEditProfile photoURL={photoURL} />
      <main className="main-editProfile container-fluid">
        <form
          className="editProfile-register"
          id="edit-profile-form"
          onSubmit={handleSubmitProfileChanges}
        >
          <div className="editProfile-fieldsContainer col-12">
            <div className="left-fields-editProfile col-12 col-md-6">
              <div className="form-group">
                <label
                  className="labels-edit-profile"
                  id="email-editProfile-label"
                  hidden={isProfileOwner() === true ? false : true}
                >
                  Email
                </label>
                <input
                  type="email"
                  className="editProfile-fields form-control"
                  id="email-editProfile"
                  name="email"
                  placeholder={fetchedUser.email}
                  onChange={handleInputChange}
                  readOnly={isProfileOwner() === true ? false : true}
                  hidden={isProfileOwner() === true ? false : true}
                />
              </div>
              <div className="form-group">
                <label
                  className="labels-edit-profile"
                  id="firstName-editProfile-label"
                >
                  First Name
                </label>
                <input
                  type="text"
                  className="editProfile-fields form-control"
                  id="firstName-editProfile"
                  name="firstName"
                  placeholder={fetchedUser.firstName}
                  onChange={handleInputChange}
                  readOnly={isProfileOwner() === true ? false : true}
                />
              </div>
              <div className="form-group">
                <label
                  className="labels-edit-profile"
                  id="lastName-editProfile-label"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  className="editProfile-fields form-control"
                  id="lastName-editProfile"
                  name="lastName"
                  placeholder={fetchedUser.lastName}
                  onChange={handleInputChange}
                  readOnly={isProfileOwner() === true ? false : true}
                />
              </div>
              <div className="form-group">
                <label
                  className="labels-edit-profile"
                  id="phone-editProfile-label"
                  hidden={isProfileOwner() === true ? false : true}
                >
                  Phone
                </label>
                <input
                  type="text"
                  className="editProfile-fields form-control"
                  id="phone-editProfile"
                  name="phone"
                  placeholder={fetchedUser.phone}
                  onChange={handleInputChange}
                  readOnly={isProfileOwner() === true ? false : true}
                  hidden={isProfileOwner() === true ? false : true}
                />
              </div>
              <div className="form-group">
                <label
                  className="labels-edit-profile"
                  id="photoURL-editProfile-label"
                  hidden={isProfileOwner() === true ? false : true}
                >
                  Profile Picture
                </label>
                <input
                  type="url"
                  className="editProfile-fields form-control"
                  id="photoURL-editProfile"
                  name="photoURL"
                  placeholder={fetchedUser.photoURL}
                  onChange={handleInputChangeAndPhotoURLChange}
                  readOnly={isProfileOwner() === true ? false : true}
                  hidden={isProfileOwner() === true ? false : true}
                />
              </div>
            </div>
          </div>
          <div className="editProfile-Buttons col-12">
            {userLogged.username !== username && (
              <button
                className="btn btn-primary open-chat"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#profile-conversation-offcanvas"
                aria-controls="profile-conversation-offcanvas"
              >
                Open Chat
              </button>
            )}
            <Button
              text="Change Password"
              onClick={handlePasswordModal}
              hidden={username === userLogged.username ? false : true}
              className="btn btn-primary change-password"
            />
            <Button
              text="Cancel"
              onClick={handleCancelEdition}
              hidden={isProfileOwner() === true ? false : true}
              className="btn btn-secondary"
            />
            <Button
              type="submit"
              text="Save"
              hidden={isProfileOwner() === true ? false : true}
              className="btn btn-success"
            />
          </div>
        </form>
        {userLogged.username !== username && (
          <>
            <div
              className="offcanvas offcanvas-end"
              tabIndex="-1"
              id="profile-conversation-offcanvas"
              aria-labelledby="profile-conversation-offcanvasLabel"
            >
              <div className="offcanvas-header">
                <h5 id="profile-conversation-offcanvasLabel">Chat</h5>
                <button
                  type="button"
                  className="btn-close text-reset"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body">
                <div className="profile-conversation col-12">
                  <div className="profile-chat">
                    <MessageList
                      className="message-list"
                      lockable={true}
                      toBottomHeight={"100%"}
                      dataSource={messages.map((message) => ({
                        position:
                          message.sender === username ? "left" : "right",
                        type: "text",
                        title: message.sender,
                        text: message.content,
                        date: message.timestamp,
                        avatar: userLogged.photoURL,
                        ...(message.sender === username
                          ? { status: message.read === true ? "read" : "sent" }
                          : {}),
                      }))}
                    />
                  </div>
                  <div className="profile-message">
                    <textarea
                      className="profile-type-message form-control"
                      value={message}
                      onChange={handleMessageChange}
                    />
                    <img
                      src="../../../../multimedia/send.png"
                      onClick={handleSendMessage}
                      className="img-fluid"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <div
        id="passwordModal"
        className={`modal ${displayPasswordModal ? "modalShown" : ""}`}
      >
        <div className="modalContent">
          <form id="changePasswordForm" className="form-group">
            <input
              type="password"
              id="profile_oldPassword"
              name="profile_oldPassword"
              placeholder="Current Password"
              value={passwordData.profile_oldPassword}
              onChange={handlePasswordChange}
              required
              className="form-control"
            />
            <input
              type="password"
              id="profile_newPassword"
              name="profile_newPassword"
              placeholder="New Password"
              value={passwordData.profile_newPassword}
              onChange={handlePasswordChange}
              required
              className="form-control"
            />
            <input
              type="password"
              id="profile_confirmPassword"
              name="profile_confirmPassword"
              placeholder="Confirm New Password"
              value={passwordData.profile_confirmPassword}
              onChange={handlePasswordChange}
              required
              className="form-control"
            />
            <div className="modal-buttons">
              <Button
                text="Cancel"
                onClick={handlePasswordModal}
                className="btn btn-secondary"
              />
              <Button
                type="submit"
                text="Save"
                onClick={handleSubmitPasswordChanges}
                className="btn btn-success"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
