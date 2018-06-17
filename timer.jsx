
import React, { Component } from 'react';
import { EventEmitter } from 'events';

class Timer extends EventEmitter {
  constructor() {
    super();
    this.running = false;
    this.time = 0;
    this.loopAt = 230000;
    this.speed = 1;
    this.prevTick = null;

    this.tick = this.tick.bind( this );
    this.start = this.start.bind( this );
    this.stop = this.stop.bind( this );
    this.toggle = this.toggle.bind( this );
    this.reset = this.reset.bind( this );
    this.setSpeed = this.setSpeed.bind( this );
    
    this.start();
  }
  
  tick() {
    if ( ! this.running ) return;

    if ( this.loopAt && this.time > this.loopAt ) {
      this.reset();
    }
    
    const now = Date.now();

    let deltaT = 0;
    if (this.prevTick != null) {
        deltaT = ((now - this.prevTick) * this.speed);
    }

    this.time += deltaT;
    this.prevTick = now;
    this.emit( 'tick', this.time / 1000 );
    requestAnimationFrame( this.tick );
  }
  
  start() {
    this.running = true;
    requestAnimationFrame( this.tick );
    this.emit( 'started' );
  }
  
  stop() {
    this.running = false;
    this.emit( 'stopped' );
  }
  
  toggle() {
    ( this.running ? this.stop() : this.start() );
  }
  
  reset() {
    this.time = 0;
  }

  set(t) {
    this.time = t * 1000;
  }
  
  setSpeed( multiplier ) {
    this.speed = multiplier;
  }
}

const timer = new Timer();

export const Timed = ( C ) =>
  class TimedComponent extends Component {
    constructor( props ) {
      super( props );
      this.onTick = this.onTick.bind( this );
      this.state = { time: 0 };
    }
    
    onTick( time ) {
      this.setState( { time } );
    }
    
    componentDidMount() {
      timer.on( 'tick', this.onTick );
    }
    
    componentWillUnmount() {
      timer.removeListener( 'tick', this.onTick );
    }
    
    render() {
      return <C
        {...this.props}
        maxTime={ timer.loopAt / 1000 }
        time={ this.state.time }
        timerSet={ (v) => timer.set(v) }
        timerStart={ timer.start }
        timerStop={ timer.stop }
        timerToggle={ timer.toggle }
        timerReset={ timer.reset }
        timerSetSpeed={ timer.setSpeed }
      />;
    }
  }
  
export const Time = Timed( props =>
  <span>{ props.time }</span>
);

export const StartStopButton = Timed( props =>
  <input {...props} type="button" onClick={ props.timerToggle } value="Start/Stop" />
)

export const ResetButton = Timed( props =>
  <input {...props} type="button" onClick={ props.timerReset } value="Reset" />
)

export const SetSpeedButton = Timed( props => {
  const setSpeed = () => props.timerSetSpeed( props.multiplier );

  return <input {...props} type="button" onClick={ setSpeed } value={ 'Speed ' + props.multiplier + 'x' }  />
} )

export const Slider = Timed( props =>
  <input
    className="timeSlider"
    type="range"
    max={props.maxTime}
    min={0}
    onChange={ (e) => parseFloat(props.timerSet(e.target.value)) }
    value={ props.time }
  />
)
