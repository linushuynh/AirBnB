import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import './Navigation.css';

const ProfileButton = ({ user, setShowModal, setLogin }) => {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);

    const openMenu = () => {
      if (showMenu) return;
      setShowMenu(true);
    };

    useEffect(() => {
      if (!showMenu) return;

      const closeMenu = () => {
        setShowMenu(false);
      };

      document.addEventListener('click', closeMenu);

      return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const logout = (e) => {
      e.preventDefault();
      dispatch(sessionActions.logout());
    };

    return (
      <>
        <button onClick={openMenu} className='profile-button'>
          <div >
        <i className="fa-regular fa-user" id="user-icon"></i>
          </div>
        </button>
        {showMenu && (user ?
          <ul className="profile-dropdown">
            <li>{user.username}</li>
            <li>{user.email}</li>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </ul>
          :
          <ul className="profile-dropdown">
        <div className="button-holder">
          <li>
            <button
            className="form-button"
            id="signup-button"
            onClick={() => {
              setLogin(false);
              setShowModal(true);
            }}>Sign Up</button>
          </li>
          <li>
            <button
            className="form-button"
            onClick={() => {
              setLogin(true);
              setShowModal(true);
            }}>Log in</button>
          </li>
          <li>
            <hr />
          </li>
          <li className="dropdown-text">
            Host your home
          </li>
          <li className="dropdown-text">
            Host an experience
          </li>
          <li className="dropdown-text">
            Help
          </li>
        </div>
        </ul>
        )}
      </>
    );
}

export default ProfileButton;
