import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authAction';
import { Button } from '../components/ui';

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
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleLogout}
      className="text-danger border-danger hover:bg-danger hover:text-white"
    >
      Logout
    </Button>
  );
};

export default Logout;
