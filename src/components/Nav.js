import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import logoBright from '../assets/images/flash-60-bright.svg';
import logo from '../assets/images/flash-60.svg';
import '../styles/Nav.scss';

/**
 * [delayedReload description]
 */
function delayedReload() {
  window.setTimeout(() => location.reload(), 100);
}

const Nav = (props) => {
  console.log('navigating');
  const br = (props.location.pathname === '/' ? 'bright' : '');
  return (
    <div>
      <ul className="nav">
        <li>
          <NavLink to="/">
            <img
              src={props.location.pathname === '/' ? logoBright : logo}
              className={`nav-logo ${br}`}
              alt="logo"
              onTouchTap={() => delayedReload()}
            />
          </NavLink>
        </li>
        <li>
          <NavLink
            exact
            className={br}
            activeClassName="active"
            to="/"
            onTouchTap={() => delayedReload()}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            className={br}
            activeClassName="active"
            to="/About"
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            className={br}
            activeClassName="active"
            to="/Projects"
          >
            Projects
          </NavLink>
        </li>
        <li>
          <a
            className={br}
            href="https://beact.herokuapp.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Beact
          </a>
        </li>
      </ul>
    </div>
  );
};

Nav.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default Nav;
