// import { useState } from 'react'
import {  createBrowserRouter, RouterProvider, Outlet  } from 'react-router-dom'
import './App.css'
// import 'bootstrap/dist/css/bootstrap.min.css';
import StudentList from './pages/api1/ApiCrud'
import NavBar from './components/NavBar'
import Themes from './components/Themes'
import Api2 from './pages/api2';

function App() {  

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          index: true,
          element: <h1>Home</h1>,
        },
        {
          path: 'Api1',
          element: <StudentList />,
          children: [
            {
              path: 'edit/:id',
              element: "edit",
            },
          ],
        },
        {
          path: 'Api2',
          element: <Api2 />,
        },
        {
          path: '*',
          element: "Error 404",
        },
      ],
    },
  ])
  return <RouterProvider router={router} />;
}

function Root() {
  return (
    <Themes>
      <NavBar />
      <div className="container">
        <Outlet />
      </div>
    </Themes>
  )
}

export default App
