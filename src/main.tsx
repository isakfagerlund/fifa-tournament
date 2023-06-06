import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Admin from './Admin.tsx';
import { MantineProvider } from '@mantine/core';
import Games from './Games.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: 'games',
    element: <Games />,
  },
  {
    path: 'admin',
    element: <Admin />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={{ colorScheme: 'dark' }}>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
);
