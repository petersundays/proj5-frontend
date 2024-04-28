import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./baseHeader.css";
import { UserStore } from "../../../Stores/UserStore";
import { CategoriesStore } from "../../../Stores/CategoriesStore";
import { useNavigate } from "react-router-dom";
import { AllTasksStore } from "../../../Stores/AllTasksStore";
import { showInfoMessage } from "../../../functions/Messages/InfoMessage";
import { AllUsersStore } from "../../../Stores/AllUsersStore";
import { NotificationStore } from "../../../Stores/NotificationStore";
import { StatisticsStore } from "../../../Stores/StatisticsStore";
import { FaBell } from "react-icons/fa";
import Dropdown from "react-bootstrap/Dropdown";
import { FaEnvelope } from "react-icons/fa";
import { useWebSocketClient } from "../../../Websockets/WebSocketClient";
import useWebSocketTask from "../../../Websockets/TaskWS";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

function BaseHeader() {
  const location = useLocation();

  const isConfirmAccountPage = location.pathname === "/confirm";
  const isRecoverPasswordPage = location.pathname === "/recover-password";
  const isResetPasswordPage = location.pathname.startsWith("/reset-password/");

  const token = UserStore.getState().user.token;
  const username = UserStore.getState().user.username;

  const [notifications, setNotifications] = useState(
    NotificationStore.getState().notifications
  );
  const wsClient = NotificationStore((state) => state.WebSocketClient);
  const { markAsRead } = useWebSocketClient();

  const { wsTask } = useWebSocketTask();

  useEffect(() => {
    const unsubscribe = NotificationStore.subscribe(() => {
      setNotifications(NotificationStore.getState().notifications);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  let firstName = "";
  if (UserStore.getState().user.firstName !== undefined) {
    firstName = UserStore.getState().user.firstName;
  } else {
    firstName = "First Name";
  }

  let photoURL = "";
  if (UserStore.getState().user.photoURL !== undefined) {
    photoURL = UserStore.getState().user.photoURL;
  } else {
    photoURL = "multimedia/user-avatar.jpg";
  }

  const DEVELOPER = 100;
  const SCRUM_MASTER = 200;
  const PRODUCT_OWNER = 300;

  const typeOfUser = UserStore.getState().user.typeOfUser;
  const userConfirmed = UserStore.getState().user.confirmed;
  const isAsideVisible = UserStore((state) => state.isAsideVisible);

  const navigate = useNavigate();

  const toggleAside = () => {
    console.log("Toggle Aside", isAsideVisible);
    UserStore.getState().toggleAside();
  };

  const messageIcon = () => <FaEnvelope id="notification" />;

  const handleDropdownNotifications = () => {
    const dropdownOptions = [];
    const hashMap = new Map();

    notifications.forEach((notification) => {
      if (hashMap.has(notification.sender)) {
        const existingValue = hashMap.get(notification.sender);
        hashMap.set(notification.sender, {
          count: existingValue.count + 1,
          timestamp:
            notification.timestamp > existingValue.timestamp
              ? notification.timestamp
              : existingValue.timestamp,
        });
      } else {
        hashMap.set(notification.sender, {
          count: 1,
          timestamp: notification.timestamp,
        });
      }
    });

    hashMap.forEach((value, key) => {
      dropdownOptions.push(
        <Dropdown.Item
          className="dropdown-item"
          key={key}
          onClick={() => {
            handleNotificationClick(key);
          }}
        >
          {messageIcon()}{" "}
          <span style={{ fontSize: "0.8em", color: "#223C4A" }}>
            {value.count}
          </span>
          {" from "}
          {key}{" "}
          <span className="dropdown-item-date" style={{ float: "right" }}>
            {value.timestamp}
          </span>
        </Dropdown.Item>
      );
    });

    return dropdownOptions;
  };

  const handleNotificationClick = (value) => {
    navigate(`/my-scrum/profile/${value}`);
    markAsRead(value);
  };

  const handleLogout = async () => {
    UserStore.setState({ user: {} });
    CategoriesStore.setState({ categories: [] });
    AllTasksStore.setState({ tasks: [] });
    AllUsersStore.getState().clearStore();
    NotificationStore.setState({ notifications: [] });
    StatisticsStore.getState().clearStore();

    // Close the WebSocket connection
    if (wsClient && wsClient.readyState === WebSocket.OPEN) {
      wsClient.close();
    }

    if (token === undefined || token === "" || token === null) {
      navigate("/");
      return;
    } else {
      const logout =
        "http://localhost:8080/backend_proj5_war_exploded/rest/users/logout";
      try {
        const response = await fetch(logout, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            token: token,
          },
        });

        if (response.ok) {
          showInfoMessage("Thank you for using Agile Scrum. See you soon!");
        } else {
          const error = await response.text();
          console.log("Error: " + error);
        }
      } catch (error) {
        console.error("Error:", error);
      }

      navigate("/");
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="sm">
    <div className="d-flex align-items-center left-items">
      {/* <Navbar.Brand className="logo-header">
        <img
          src="/multimedia/logo-scrum-05.png"
          id="logo-header"
          draggable="false"
        />
      </Navbar.Brand> */}
      <div className="ml-2 options" style={{ color: 'white', cursor: 'pointer' }} data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" onClick={toggleAside}>
      <MenuOpenIcon className="ml-2" style={{ color: 'white', cursor: 'pointer' }} sx={{ fontSize: 35 }} data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" onClick={toggleAside} />
        {/* <span className="ml-1 options-text">Options</span> */}
      </div>
    </div>
      <div className="navbar-content d-flex">
        <div className="navbar-external">
          <Nav className="mr-auto d-flex align-items-center">
            {userConfirmed === true ? (
              <NavDropdown
                title={
                  <>
                    <FaBell id="notification" />
                    <span style={{ fontSize: '0.8em', color:"#2CCCD3" }}>
                      {notifications.length}
                    </span>
                  </>
                }
                id="basic-nav-dropdown"
              >
                {handleDropdownNotifications()}
              </NavDropdown>
            ) : null}
            <Navbar.Text className="ml-2">
              <img src={photoURL} id="profile-pic" draggable="false" />
            </Navbar.Text>
            <Navbar.Text className="ml-2">
              {userConfirmed === true ? (
                <Link
                  to={`/my-scrum/profile/${username}`}
                  id="first-name-label"
                  draggable="false"
                >
                  {firstName}
                </Link>
              ) : (
                <p id="first-name-label" draggable="false">
                  {firstName}
                </p>
              )}
            </Navbar.Text>
            <Button variant="link" onClick={handleLogout} className="ml-2">
  <img
    src="/multimedia/log-out.png"
    alt="Logout Icon"
    className="logout-logo"
    draggable="false"
  />
</Button>
          </Nav>
        </div>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {!isConfirmAccountPage &&
              !isRecoverPasswordPage &&
              !isResetPasswordPage && (
                <>
                  {userConfirmed === true ? (
                    <>
                      <Nav.Link href="/my-scrum">My Tasks</Nav.Link>
                      <Nav.Link href="/my-scrum/all-tasks">All Tasks</Nav.Link>
                      <Nav.Link href="/my-scrum/users">Users</Nav.Link>
                      {typeOfUser === PRODUCT_OWNER && (
                        <Nav.Link href="/my-scrum/categories">
                          Categories
                        </Nav.Link>
                      )}
                      {typeOfUser === PRODUCT_OWNER && (
                        <Nav.Link href="/my-scrum/dashboard">
                          Dashboard
                        </Nav.Link>
                      )}
                    </>
                  ) : (
                    <Nav.Link></Nav.Link>
                  )}
                </>
              )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
  }
  export default BaseHeader;