import React, { Component } from 'react';
import P5Wrapper from 'react-p5-wrapper';
import { Redirect } from 'react-router-dom';
import { WindowResizeListener } from 'react-window-resize-listener';


import sketch from '../p5/flow';
import '../styles/Home.scss';

/**
 * [Home description]
 * @return {Element}
 */
class Home extends Component {
  /**
   * [constructor description]
   */
  constructor() {
    super();
    this.state = {
      width: 800,
      height: 500,
    };
  }

  /**
   * [handleResize description]
   * @param  {number} width  [description]
   * @param  {number} height [description]
   */
  handleResize(width, height) {
    console.log('resize...');
    console.log(`width : ${width}`);
    console.log(`height : ${height}`);
    this.setState({
      width,
      height,
    });
  }

  /**
   * [render description]
   * @return {Element} [description]
   */
  render() {
    return (
      <div>
        <Redirect to="/" />
        <P5Wrapper
          sketch={sketch}
          width={this.state.width}
          height={this.state.height}
        />
        <h1 className="home-title">Vibert</h1>
        <h1 className="home-title">Thio</h1>
        <WindowResizeListener
          onResize={w => this.handleResize(w.windowWidth, w.windowHeight)}
        />
      </div>
    );
  }
}


export default Home;
