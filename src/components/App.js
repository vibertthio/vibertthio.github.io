import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import { MuiThemeProvider } from 'material-ui';

import Nav from './Nav';
import Home from './Home';
import About from './About';
import Projects from './Projects';
import '../styles/index.scss';

const App = () => (
  <MuiThemeProvider>
    <HashRouter>
      <div className="home-container">
        <Route component={Nav} />
        <Route exact path="/" component={Home} />
        <Route exact path="/About" component={About} />
        <Route exact path="/Projects" component={Projects} />
        <Route exact path="/Contact" />
      </div>
    </HashRouter>
  </MuiThemeProvider>
);

export default App;
