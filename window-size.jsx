import React, { Component } from 'react';

export const WindowSize = C =>
  class WindowSizedComponent extends Component {
    constructor( props ) {
      super( props );
      this.state = {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      }
      this.handleResize = this.handleResize.bind( this );
    }
  
    handleResize(e) {
      this.setState({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      });
    }
  
    componentDidMount() {
      window.addEventListener('resize', this.handleResize);
    }
  
    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }
  
    render() {
      return <C
        {...this.props}
        windowWidth={ this.state.windowWidth }
        windowHeight={ this.state.windowHeight }
        />;
    }
  }
