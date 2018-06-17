import React from 'react';
import ReactDOM from 'react-dom';

import { Time, StartStopButton, ResetButton, SetSpeedButton, Slider } from './timer.jsx';
import { Canvas } from './canvas.jsx';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Canvas />
        <div>
            <Slider />
        </div>
        <div>
          <SetSpeedButton multiplier={ 0.1 } />
          <SetSpeedButton multiplier={ 0.5 } />
          <SetSpeedButton multiplier={ 1.0 } />
          <SetSpeedButton multiplier={ 1.5 } />
          <SetSpeedButton multiplier={ 2.0 } />
          <SetSpeedButton multiplier={ 5.0 } />
          <StartStopButton /><ResetButton />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('main'));
