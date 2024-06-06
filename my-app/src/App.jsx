import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './page/Sidebar';
import ListUsers from './page/ListUsers';
import ListRobot from './page/ListRobot';
import Login from './page/login';
import Signup from './page/signup'; // Importez le composant Signup
import HistoriquePage from './HistoriquePage';
import Dashboard from './page/Dashboard/Dashboard';
import Statistiques from './page/Statistiques';
import WebSocketClient from './services/websocket-client.service';
import { state } from './states/global.state';


state.wsClient = new WebSocketClient(process.env.REACT_APP_WEBSOCKET_BASE_URL);

function App() {

  const [user, setUser] = useState({})
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user') || '{}')
    setUser(localUser)
    state.wsClient.connect();
    return () => {
      state.wsClient.disconnect();
    };
  }, []);

  return (

    <div className="App">

      <BrowserRouter>
        <Routes>
          {/* Page de connexion sans barre latérale */}
          <Route path='/login' element={<LoginWithoutSidebar />} exact />
          {/* Page d'inscription sans barre latérale */}
          <Route path='/signup' element={<SignupWithoutSidebar />} exact />
          {/* Reste de l'application avec la barre latérale */}
          <Route path='/*' element={<MainContentWithSidebar user={user} />} />

        </Routes>
      </BrowserRouter>
    </div>

  );
}


function LoginWithoutSidebar() {
  return (
    <div className="FullWidthPage">
      <Login />
    </div>
  );
}

function SignupWithoutSidebar() {
  return (
    <div className="FullWidthPage">
      <Signup />
    </div>
  );
}

function MainContentWithSidebar({ user }) {
  return (
    <div className="MainContentWithSidebar">
      <div className="Sidebar">
        <Sidebar user={user} />
      </div>
      <div className="MainContent">
        <Routes>
          {
            user.role === 'Admin' ? (
              <React.Fragment>
                <Route path='/' element={<Dashboard />} />
                <Route path='/Dashboard' element={<Dashboard />} />
                <Route path='/ListUsers' element={<ListUsers />} />
                <Route path='/ListRobot' element={<ListRobot />} />
                <Route path='/HistoriquePage' element={<HistoriquePage />} />
                <Route path='/Statistiques/:reference?' element={<Statistiques />} />
              </React.Fragment>
            )
              :
              <Route path='/Statistiques/:reference?' element={<Statistiques />} />
          }
        </Routes>
      </div>
      <div>
      </div>
    </div>
  );
}

export default App;