import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { userLogout } from '../../redux/actions/authActions';
import { RootStore } from '../../utils/Typescript';

export default function Menu() {

    const { auth } = useSelector((state: RootStore) => state);

    const { pathname } = useLocation();

    const bfLoginLinks = [
        { lable: "LogIn", path: "/login" },
        { lable: "Register", path: "/register" }
    ]

    const afterLoginLinks = [
        { lable: "Home", path: "/" },
        { lable: "CreateBlog", path: "/create_blog" }
    ]

    const navLinks = auth.token ? afterLoginLinks : bfLoginLinks;

    const isActive = (pn: string) => {
        if (pathname === pn) return "active";
    }

    const dispatch = useDispatch();

    const logoutHandler = () => {
        if(!auth.token) return;

        dispatch(userLogout(auth.token));
    }

    return (
        <ul className="navbar-nav mb-2 mb-lg-0 ms-auto">
            {
                navLinks.map((item, index) => (
                    <li key={index} className={`nav-item ${isActive(item.path)}`}>
                        <Link to={item.path} className="nav-link">{item.lable}</Link>
                    </li>
                ))
            }
            {
                auth.user?.role === "admin" &&
                <li className={`nav-itme ${isActive("/category")}`}>
                    <Link to="/category" className="nav-link">Category</Link>
                </li>
            }
            {
                auth.user &&
                <li className="nav-item dropdown">
                    <span className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src={auth.user.avatar} alt="avatar" className="avatar" />
                    </span>
                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li><Link className="dropdown-item" to={`/profile/${auth.user._id}`}>Profile</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><Link className="dropdown-item" to="/" onClick={logoutHandler}>Logout</Link></li>
                    </ul>
                </li>
            }
        </ul>
    )
}
