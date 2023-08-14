// import { useState } from 'react'
import {  createBrowserRouter, RouterProvider, Outlet, Navigate  } from 'react-router-dom'
import './App.css'
// import 'bootstrap/dist/css/bootstrap.min.css';
import StudentList from './components/StudentList'
import NavBar from './components/NavBar'
import Themes from './components/Themes'
import EditStudent from './components/EditStudent'


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
          path: 'Api-List',
          element: <StudentList />,
          children: [
            {
              path: 'edit/:id',
              element: <EditStudent />,
            },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to='/' replace />,
    },
  ])
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
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
