import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authAction';
import { showSuccessToast } from '../redux/toastAction';
import { Button } from '../components/ui';

const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        localStorage.clear();
        Cookies.remove('token');
        dispatch(logout());
        dispatch(showSuccessToast('Successfully logged out!'));
        navigate('/');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
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
