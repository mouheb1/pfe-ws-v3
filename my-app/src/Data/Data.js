//Sidebar imports
import {
  UilChart,
  UilClipboardAlt,
  UilEstate,
  UilRobot,
  UilUsersAlt,
} from '@iconscout/react-unicons';

export const ADMIN_SIDE_BAR_DATA = [
    { heading: 'Dashboard', icon: UilEstate, path: '/Dashboard' },
    { heading: 'List Users', icon: UilUsersAlt, path: '/ListUsers' },
    { heading: 'List Robot', icon: UilRobot, path: '/ListRobot' },
    { heading: 'Historique', icon: UilClipboardAlt, path: '/HistoriquePage' },
    { heading: 'Statistiques', icon: UilChart, path: '/Statistiques' }
];

export const USER_SIDE_BAR_DATA = [
    { heading: 'Statistiques', icon: UilChart, path: '/Statistiques' },
];
