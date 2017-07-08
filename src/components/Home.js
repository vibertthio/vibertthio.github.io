import React from 'react';
import P5Wrapper from 'react-p5-wrapper';

import sketch from '../p5/example';
import '../styles/Home.scss';

/**
 * [Home description]
 * @return {Element}
 */
const Home = () => (
  <div>
    <h1 className="home-title">Vibert</h1>
    <h1 className="home-title">Thio</h1>
    <div className="p5-sketch">
      <P5Wrapper sketch={sketch} />
    </div>
  </div>
);


export default Home;
