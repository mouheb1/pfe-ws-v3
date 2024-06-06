import './Sidebar.css';

import React, {
  useEffect,
  useState,
} from 'react';

import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { UilSignOutAlt } from '@iconscout/react-unicons';

import {
  ADMIN_SIDE_BAR_DATA,
  USER_SIDE_BAR_DATA,
} from '../Data/Data';
import LogoEnova from '../LogoEnova.jpg';
import { serviceUser } from '../services/http-client.service';

const Sidebar = ({ user = {} }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selected, setSelected] = useState(-1);
    const [sidebarData, setSideBarData] = useState([]);

    const handleLogout = () => {
        serviceUser.clear();
        navigate('/login');
    };

    useEffect(() => {
        if (!user.role && !localStorage.getItem('user')) {
            localStorage.clear();
            window.location.href = '/login';
        }

        console.log('user.role', user.role, USER_SIDE_BAR_DATA);
        if (user.role === 'Admin') {
            setSideBarData(ADMIN_SIDE_BAR_DATA);
        } else {
            setSideBarData(USER_SIDE_BAR_DATA);
        }
    }, [user]);

    useEffect(() => {
        const currentPath = location.pathname.split('/')[1];
        const currentIndex = sidebarData.findIndex(item => item.path.split('/')[1] === currentPath);
        setSelected(currentIndex);
    }, [location.pathname, sidebarData]);

    const handleMenuItemClick = (index, path) => {
        setSelected(index);
        navigate(path);
    };

    return (
        <div>
            <div className='Enova'>
                <img src={LogoEnova} alt="logoEnova" />
            </div>
            <div className='menu'>
                {sidebarData && sidebarData.map((item, index) => {
                    return (
                        <div
                            className={selected === index ? 'menuItem active-sidebar-item' : 'menuItem'}
                            key={index}
                            onClick={() => handleMenuItemClick(index, item.path)}
                        >
                            <item.icon />
                            <span>{item.heading}</span>
                        </div>
                    );
                })}
                <div
                    className='menuItem'
                    onClick={() => {
                        const isConfirmed = window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?');
                        if (isConfirmed) {
                            handleLogout();
                        }
                    }}
                >
                    <UilSignOutAlt />
                    <span>Deconnexion</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
