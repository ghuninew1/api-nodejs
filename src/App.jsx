import { useState } from 'react'
import {  createBrowserRouter, RouterProvider, Outlet, Navigate  } from 'react-router-dom'
import './App.css'
// import 'bootstrap/dist/css/bootstrap.min.css';
import CreateStudent from './components/CreateStudent'
import StudentList from './components/StudentList'
import NavBar from './components/NavBar'
import Themes from './components/Themes'
import EditStudent from './components/EditStudent'



function App() {
  // const [count, setCount] = useState(0)
  
  
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          index: true,
          element: 'Home',
        },
        {
          path: '/list',
          element: <StudentList />,
        },
        {
          path: '/create',
          element: <CreateStudent />,
        },
        {
          path: '/edit/:id',
          element: <EditStudent />,

        },
      ],
    },
    {
      path: '*',
      element: <Navigate to='/' replace />,
    },
  ])
  return <RouterProvider router={router} fallbackElement={"...Loading"} />;
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
