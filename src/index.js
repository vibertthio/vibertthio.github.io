import React from 'react'; // eslint-disable-line
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';
import { MuiThemeProvider } from 'material-ui';
import Nav from './components/Nav';
import Home from './components/Home';
import './styles/index.scss';

require('../flash.ico');

const Blog = () => (
  <div>
    <Nav />
    <Route exact path="/" component={Home} />
    <Route exact path="/About" />
    <Route exact path="/Projects" />
    <Route exact path="/Contact" />
  </div>
);

const App = () => (
  <MuiThemeProvider>
    <HashRouter>
      <Blog />
    </HashRouter>
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
