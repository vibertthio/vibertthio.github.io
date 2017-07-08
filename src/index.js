import React from 'react'; // eslint-disable-line
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './components/App';
import './styles/index.scss';

require('../flash.ico');

injectTapEventPlugin();

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
