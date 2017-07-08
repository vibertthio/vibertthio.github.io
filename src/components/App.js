import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import { MuiThemeProvider } from 'material-ui';

import Nav from './Nav';
import Home from './Home';
import '../styles/index.scss';

const App = () => (
  <MuiThemeProvider>
    <HashRouter>
      <div>
        <Nav />
        <Route exact path="/" component={Home} />
        <Route exact path="/About" />
        <Route exact path="/Projects" />
        <Route exact path="/Contact" />
      </div>
    </HashRouter>
  </MuiThemeProvider>
);

export default App;
