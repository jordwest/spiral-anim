import React, { Component } from 'react';
import { omit } from 'lodash';

import { Timed } from './timer.jsx';
import { typeText } from './utils.js';

// Scene shows portions of the SVG to only between certain times
export const Scene = Timed( props => {
  const { time, start, end } = props;
  if ( start != null && time < start ) return null;
  if ( end != null && time > end ) return null;
  
  const fadeIn = props.fadeIn || 1;
  const fadeOut = props.fadeOut || 1;

  let opacity = 1;
  
  if ( end != null && time > end - fadeOut ) {
    opacity = (end - time) / fadeOut;
  }
  
  if ( start != null && time < start + fadeIn ) {
    opacity = (time - start) / fadeIn;
  }

  return (
    <g opacity={ opacity }> 
      { props.children }
    </g>
  );
} );

// TypewriterText types out text one character at a time between the start/end times
export const TypewriterText = Timed( props => {
  const textProps = omit( props, [ 'start', 'end', 'fadeIn', 'fadeOut', 'children' ] );
  const { time } = props;

  return <Scene start={ props.start } end={ props.end } fadeIn={ props.fadeIn } fadeOut={ props.fadeOut }>
    <g transform={ props.transform }>
      <text
        { ...textProps }
        transform={ 'rotate(' + (time - props.start + 2 ) * 2 + ') scale(' + (time - props.start + 2 ) + ') translate( -5, 5 )' }
      >{ typeText( props.text, (time - props.start ) * 7 ) }</text>
    </g>
  </Scene>
} );

export const Orbiter = C => Timed( props => {
  const { time, count } = props;
  const baseRotation = time * 45; // 45 degrees per second
  const degreesSeparation = (360 / count);
  
  let satellites = [];
  
  for ( let i = 0; i < count; i++ ) {
    satellites.push(
      <g transform={'rotate( ' + (baseRotation + (degreesSeparation * i) ) + ' )'}>
        <C { ...props } />
      </g>
    );
  }
  
  return <g>{ satellites }</g>
} );