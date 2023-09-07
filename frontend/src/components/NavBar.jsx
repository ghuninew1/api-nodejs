/* eslint-disable react/prop-types */
import { NavLink, useLocation } from 'react-router-dom'
import './NavBar.css'

const NavBar = () => {
    const location = useLocation()
    const {pathname} = location
    const splitLocation = pathname.split("/");
    const isActiveLi = (name) => splitLocation[1] === name ? "active nav-item" : "nav-item"
    const isActive = (name) => splitLocation[1] === name ? {textDecoration: 'none',color: "red",fontWeight: "bold"} : {textDecoration: 'none'}

    const NavBars = ({name}) => <li  className={isActiveLi(name)}><NavLink to={name} style={isActive(name)}>{name}</NavLink></li>
    const NavBar = (x) => (
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
         <div className="container-fluid">
          <div className='collapse navbar-collapse'>
            <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
              <li className={isActiveLi("")}><NavLink end to="/" style={isActive(name)}>Home</NavLink></li>
              { Array(x).fill(0).map((_,i) => <div key={i}> <NavBars name={'Api'+(i+1)} /> </div> ) }
            </ul>
          </div>
        </div>
    </nav>
    )

  return (
    <>
      {NavBar(3)}
    </>
  )
}

export default NavBar