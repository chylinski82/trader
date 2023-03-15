import React, { useState } from 'react';

import './App.css';
import Ticker from './components/ticker/Ticker';
import MovingAverage from './components/movingAverage/MovingAverage';

function App() {
  const [price, setPrice] = useState(null);

  return (
    <div className="tile">
      <Ticker price={price}
              setPrice={setPrice}/>
      <MovingAverage currency="BTC" periods={5} />
    </div>
  );
}

export default App;
