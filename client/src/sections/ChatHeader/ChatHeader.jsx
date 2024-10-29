// ChatHeader.js
import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { FaUserCircle, FaCaretDown, FaSignOutAlt } from 'react-icons/fa';
import UserProfileModal from './UserProfile'; // Import the modal component
import './ChatHeader.css';
import { useRef } from 'react';
import { useEffect } from 'react';
const ChatHeader = ({ theme }) => {
  const dropdownRef = useRef(null); // Ref for dropdown menu
  const modalRef = useRef(null); // Ref for modal

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const { user, logout } = useAuth0();
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleClickOutside = (event) => {
    console.log("hey...........",dropdownRef?.current)
    if (
      dropdownRef.current && !dropdownRef.current.contains(event.target) &&
      modalRef.current && !modalRef.current.contains(event.target)
    ) {
      setDropdownOpen(false);
      closeModal();
    }
  };
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setDropdownOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="chat-header" style={{ backgroundColor: theme.headerBackground }}>
      <div className="header-content">
        {/* <div className="logo" onClick={toggleDropdown}> */}
        <div className="logo" onClick={toggleDropdown} ref={dropdownRef}>
          {user && user.picture ? (
            <img src={user.picture} alt="Logo" className="logo-image" />
          ) : (
            <FaUserCircle size={30} />
          )}
          <FaCaretDown />
        </div>
        {dropdownOpen && (
          <div className="dropdown-menu1" style={{ backgroundColor: theme.chatBackground }}>
            <div className="dropdown-item" onClick={openModal}>
              <FaUserCircle /> Profile
            </div>
            <div
              className="dropdown-item logout"
              onClick={() =>
                // logout({ logoutParams: { returnTo: 'https://chat-with-vidf.vercel.app/' } })
                // logout({ logoutParams: { returnTo: 'http://localhost:5173/' } })
                logout({ logoutParams: { returnTo: 'https://chat-with-vidf-fdahoxcca-hetchaudhari123s-projects.vercel.app' } })
              }
            >
              <FaSignOutAlt /> Logout
            </div>
          </div>
        )}
      </div>
      <UserProfileModal isOpen={isModalOpen} onClose={closeModal} ref={modalRef}/>
    </div>
  );
};

export default ChatHeader;
