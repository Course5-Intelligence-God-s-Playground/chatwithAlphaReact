import './App.css';
import Home from './components/home/Home';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/Login/Login'
import ProtectedRoute from './components/utilites/ProtectedRoute';

import ErrorBoundary from './components/utilites/ErrorBoundary';

import { MsalAuthenticationTemplate, useMsal } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";

function App() {
  const navigate = useNavigate();

  const handleAuthenticationError = (error) => {
    // Handle the authentication error as needed
    // console.error('Authentication error:', error);

    // Redirect to the home page or any other desired page
    navigate('/');
  };
  return (


    <Routes>
      {/* <Route path="/" element={<Login />} />
      <Route element={<ProtectedRoute />}> */}
      <Route path="/*" element={<Home />} />

        {/* <Route element={<ErrorBoundary />}>
          <Route path="/home" element={<MsalAuthenticationTemplate interactionType={InteractionType.Popup}
            errorComponent={handleAuthenticationError}>
              <Home />
              </MsalAuthenticationTemplate>} />

        </Route> */}

      {/* </Route> */}

      {/* <Route path="*" element={<Home/>}></Route> */}
    </Routes>



  );
}

export default App;
