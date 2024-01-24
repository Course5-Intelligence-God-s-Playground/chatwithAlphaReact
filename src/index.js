import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil';

import { HashRouter } from 'react-router-dom'
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
const config = {
  auth: {
      clientId: '7cddeb94-6a55-4520-b5fb-b30755cead1d'
  }
};
const publicClientApplication = new PublicClientApplication(config);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <HashRouter>
   <RecoilRoot>

   {/* <MsalProvider instance={publicClientApplication}> */}
            <App />
        {/* </ MsalProvider> */}
 
   </RecoilRoot>
   </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
