
// Makes any color into an integer within 0-255, bounces backwards smoothly if not.
export const bound = max => n => Math.abs( ( max + n % ( max * 2 ) ) - max );
export const boundColor = c => Math.round( bound( 255 )( c ) );
export const boundAlpha = bound( 1 );

export const makeRGBA = ( r, g, b, a ) =>
  'rgba(' + boundColor( r ) + ',' + boundColor( g ) + ',' + boundColor( b ) + ',' + boundAlpha( a ) + ')';
export const makeRGB = ( r, g, b ) => makeRGBA( r, g, b, 1 );

export const typeText = (text, time) => {
  let numChars = Math.floor( time );
  if ( numChars > text.length ) numChars = text.length;
  return text.slice( 0, numChars );
}
