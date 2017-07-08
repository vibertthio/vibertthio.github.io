import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { MuiThemeProvider } from 'material-ui';

import Nav from './Nav';
import Home from './Home';
import About from './About';
import '../styles/index.scss';

const App = () => (
  <MuiThemeProvider>
    <BrowserRouter>
      <div>
        <Route component={Nav} />
        <Route exact path="/" component={Home} />
        <Route exact path="/About" component={About} />
        <Route exact path="/Projects" />
        <Route exact path="/Contact" />
      </div>
    </BrowserRouter>
  </MuiThemeProvider>
);

export default App;
