import '../../General/Asides.css';
import React from 'react';
import { UserStore } from '../../../Stores/UserStore';

function AsideEditProfile({ photoURL }) {
    const username = UserStore.getState().user.username;


    return ( 

        <>
            <aside>
                <h3 id="username-title-aside">{username}</h3>
                <img src={photoURL} id="edit-profile-pic-aside" draggable="false" alt="Profile Pic" />
            </aside>
        </>
    )
}
export default AsideEditProfile;