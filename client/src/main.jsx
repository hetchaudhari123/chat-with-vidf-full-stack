import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import '@babel/polyfill';
import App from './app.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import Central from './contexts/Central';
import { CharacterProvider } from './contexts/CharacterContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain="dev-jqdpzmerrbp60het.us.auth0.com"
        clientId="u4qCw8azOMWpitq4awZCzf4sQ9C9TTJw"
        authorizationParams={{
          redirect_uri: 'https://chat-with-vidf-flax.vercel.app/chatbot',
        }}
        cacheLocation="localstorage"
      >
        <Central>
          <CharacterProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <App />
            </Suspense>
          </CharacterProvider>
        </Central>
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);
