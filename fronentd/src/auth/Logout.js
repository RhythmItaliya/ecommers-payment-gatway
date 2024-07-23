import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authAction';

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.clear();
    Cookies.remove('token');
    dispatch(logout());
    navigate('/');
    window.location.reload();
  };

  return (
    <button onClick={handleLogout} className="btn">
      Logout
    </button>
  );
};

export default Logout;
