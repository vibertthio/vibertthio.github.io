import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/images/flash-60.svg';
import '../styles/Nav.scss';

const Nav = () => {
  console.log('navigating');
  return (
    <div>
      <ul className="nav">
        <li>
          <NavLink to="/">
            <img
              src={logo}
              className="nav-logo"
              alt="logo"
            />
          </NavLink>
        </li>
        <li>
          <NavLink exact activeClassName="active" to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/About">
            About
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/Projects">
            Projects
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Nav;
