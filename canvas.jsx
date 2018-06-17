import React, { Component } from 'react';

import { Timed } from './timer.jsx';

import { makeRGB, typeText } from './utils.js';

import { Scene, TypewriterText, Orbiter } from './bits.jsx';

import { WindowSize } from './window-size.jsx';

export const RecurseGroup = props => {
  if ( ! props.times ) return null;
  
  return (
      <g {...props}>
        { React.Children.map( props.children, child => React.cloneElement( child, { recurseRemaining: props.times } ) ) }
        <RecurseGroup {...props} times={ props.times - 1 } />
      </g>
  );
}

const genColor = base => time => makeRGB(
  base + (Math.sin(time*5) * 10),
  base + (Math.cos(time) * 10),
  base + (Math.sin(time) * 10)
);

const changingColor = ( start, end, startBase, endBase ) => time => {
  if ( time < start ) return genColor( startBase )( time );
  if ( time > end ) return genColor( endBase )( time );
  
  const changeoverDuration = end - start;
  const baseChange = endBase - startBase;
  const changeoverPct = ( time - start ) / changeoverDuration;
  return genColor( startBase + ( baseChange * changeoverPct ) )( time );
}

//const colorDark = genColor( 50 );
const colorDark = changingColor( 170, 200, 50, 170 );
const colorMid = genColor( 70 );
//const colorLight = genColor( 170 );
const colorLight = changingColor( 170, 200, 170, 50 );

const Articulation = Timed( ( { time, length } ) => {
  return <RecurseGroup times={ 8 } transform={ 'translate( ' + length + ', 0 ) rotate(' + time * 25 + ', 0, 0)' }>
      <circle cx="0" cy="0" r="4" stroke="black" strokeWidth="3" fill="black" />
      
      <Scene end={75} fadeOut={20}>
        <line x1="0" x2={ length } y1="0" y2="0" stroke={ colorMid( time ) } />
        <RecurseGroup times={ 10 } transform={ 'translate( 0, ' + length / 5 + ') rotate( ' + Math.sin( time ) * 5 + ' )' }>
          <circle cx="0" cy={ 0 } r="4" fill={ colorMid( time ) } />
          <circle cx="0" cy={ 0 } r="2" fill={ colorLight( time ) } />
        </RecurseGroup>
        <RecurseGroup times={ 10 } transform={ 'translate( 0, ' + -length / 5 + ') rotate( ' + Math.sin( time ) * 5 + ' )' }>
          <circle cx="0" cy={ 0 } r="4" fill={ colorMid( time ) } />
          <circle cx="0" cy={ 0 } r="2" fill={ colorLight( time ) } />
        </RecurseGroup>
      </Scene>
      <Scene start={70} fadeIn={15} end={110} fadeOut={5}>
        <line x1="0" x2={ length } y1="0" y2="0" stroke={ colorLight( time ) } strokeWidth={ 5 } />
      </Scene>
      <Scene start={95} fadeIn={15} end={ 125} fadeOut={20}>
        <circle cx="0" cy="10" r="5" fill={ colorLight( time ) } />
        <circle cx="0" cy="-10" r="5" fill={ colorLight( time ) } />
      </Scene>
      <Scene start={105} fadeIn={15} end={165} fadeOut={20}>
        <circle cx="0" cy={ Math.sin( time )*100 } r={ 10 + Math.cos( time * 2 )*5 } fill={ colorLight( time ) } />
        <circle cx={ Math.cos( time )*100 } cy="0" r={ 10 + Math.sin( time * 2 )*5 } fill={ colorLight( time ) } />
      </Scene>
      <Scene start={155} fadeIn={15}>
        <line x1="0" y1="0" x2="0" y2={ Math.sin( time )*100 } strokeWidth={ 10 + Math.cos( time * 2 )*5 } stroke={ colorLight( time ) } />
        <line x1="0" y1="0" x2={ Math.cos( time )*100 } y2="0" strokeWidth={ 10 + Math.sin( time * 2 )*5 } stroke={ colorLight( time ) } />
      </Scene>
  </RecurseGroup>
} );

const Satellite = Timed( props =>
  <circle cx={ 50 + ( Math.sin( props.time ) * 5 ) } cy="0" r={ 5 + (Math.cos( props.time ) * 2) } fill={ colorLight( props.time ) } />
);

const CircleOrbiter = Orbiter( Satellite );

const Planet = props =>
  <g transform={'translate(' + (350 + ( Math.sin( props.time ) * 40 )) + ', 0)'}>
    <circle cx="0" cy="0" r={ 20 + (Math.cos( props.time ) * 10) } fill={ colorLight( props.time ) } />
    <CircleOrbiter count={ 4 } />
  </g>

const SolarSystem = Orbiter( Planet );

export const Canvas = WindowSize( Timed( ( { time, windowWidth, windowHeight } ) => {
  const width = windowWidth - 20;
  const height = windowHeight - 120;
  
  const bars = ( n ) => {
    let c = [];
    for ( let i = 0; i < n; i++ ) {
      c.push(
        <g transform={ 'translate( ' + i * 41 + ', 0 )' }>
          <RecurseGroup times={ 26 + Math.round( Math.sin( 2 * time + (i / n) * Math.PI ) * 25 ) } transform="translate( 0, -6 )">
            <rect width="40" height="5" style={{
              fill: colorLight( time )
            }} />
          </RecurseGroup>
        </g>
      );
    }
    return c;
  }

  
  return <svg
    width={ width }
    height={ height }
    style={{ backgroundColor: colorDark( time ) }}
  >
    <g transform={ 'translate( ' + width / 2 + ', ' + height / 2 + ' )' }>
      <Scene start={ 1 } fadeIn={10} end={ 20 }>
        <g transform={ 'translate( ' + Math.sin(time) * 50 + ',' + Math.cos(time) * 50 + ' ) scale(' + (2 + (Math.sin( time * 1.5 ))) + ')' } >
          <Articulation length={ 90 + ( 50 * Math.sin(time  * 0.5) ) } />
        </g>
      </Scene>
      
      <Scene start={ 0 } fadeIn={3} end={ 16 } fadeOut={9}>
        <g transform={ 'translate( 50, 50 ) scale(' + (2 + (Math.sin( time * 1.5 )) + time * 1.3) + ')' } >
          <circle cx="0" cy="0" r="30" fill={ colorLight( time ) } opacity={0.6} />
        </g>
      </Scene>
    
      <Scene start={ 19 } end={ 40 } fadeIn={ 6 } fadeOut={ 5 }>
        <g transform={ 'scale(' + (1 + ((time - 19) * 0.2)) + ') translate(-210, 100) rotate(' + time + ', 210, 100 )'}>
        { bars( 10 ) }
        </g>
      </Scene>
      
      <Scene start={ 35 } fadeIn={5} end={230} fadeOut={ 10 }>
        <g transform={ 'translate( ' + Math.sin(time) * 50 + ',' + Math.cos(time) * 50 + ' ) scale(' + (2 + (Math.sin( time * 1.5 ))) + ') rotate(' + time * 5 + ')' } >
          <Articulation length={ -90 - ( 50 * Math.sin(time  * 0.5) ) } />
        </g>
      </Scene>
      
      <Scene start={ 55 } fadeIn={5} end={230} fadeOut={ 10 }>
        <g transform={ 'translate( ' + Math.sin(time) * 50 + ',' + Math.cos(time) * 50 + ' ) scale(' + (2 + (Math.sin( time * 1.5 ))) + ') rotate(' + time * 5 + ')' } >
          <Articulation length={ 90 + ( 50 * Math.sin(time  * 0.5) ) } />
        </g>
      </Scene>
      
      <Scene start={ 220 } fadeIn={ 10 } end={ 230 } fadeOut={ 15 } >
        <a href="https://twitter.com/jordwest" target="_blank"  transform={ 'translate( 0, 200 ) scale(' + (time - 200 ) * 0.05 + ') translate( -35, 0 )' }>
          <text fill={ colorLight( time ) } text-anchor="middle" text-decoration="underline"
                y="0" x="0">@jordwest</text>
        </a>
      </Scene>
      
      <Scene start={ 195 } fadeIn={ 10 } end={ 230 } fadeOut={ 10 }>
        <SolarSystem count={ 8 } />
      </Scene>
    </g>
  </svg>
}
) );