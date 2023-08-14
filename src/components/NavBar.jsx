import { Link, NavLink, useLocation } from 'react-router-dom'
import './NavBar.css'

const NavBar = () => {
    const location = useLocation()
    const {pathname} = location
    const splitLocation = pathname.split("/");
    const isActiveLi = (name) => splitLocation[1] === name ? "active" : ""
    const isActive = (name) => splitLocation[1] === name ? {textDecoration: 'none',color: "red",fontWeight: "bold"} : {textDecoration: 'none'}

    // eslint-disable-next-line react/prop-types
    const NavBars = ({name}) => <li className={isActiveLi(name)}><NavLink to={name} style={isActive(name)}>{name}</NavLink></li>
  return (
    <>
        <nav className="navbar">
            <ul className="menu">
                    <ul className="nav-links">
                        <li className={isActiveLi("")}><NavLink end to="/" style={isActive(name)}>Home</NavLink></li>
                        <NavBars name={"list"} />
                        <NavBars name={"create"} />
                    </ul>
            </ul>
        </nav>
    </>
  )
}

export default NavBar