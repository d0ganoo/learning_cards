import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './features/App/App';
import reportWebVitals from './reportWebVitals';
import { ClientProvider } from './contexts/Client/Client';
import { UserProvider } from './contexts/User/User';
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query'
import { DeckProvider } from './contexts/UserDecks/Deck';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient()

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ClientProvider>
        <UserProvider>
          <Router>
            <DeckProvider>
              <App />
            </DeckProvider>
          </Router>
        </UserProvider>
      </ClientProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
