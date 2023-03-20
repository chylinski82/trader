import React, { useState } from 'react';

import './App.css';
import Ticker from './components/ticker/Ticker';
import HistoricData from './components/historicData/HistoricData';
import MovingAverage from './components/movingAverage/MovingAverage';
import FirstUpper from './components/movingAverage/FirstUpper';
import SecondUpper from './components/movingAverage/SecondUpper';
import FirstLower from './components/movingAverage/FirstLower';
import SecondLower from './components/movingAverage/SecondLower';
import TradeTile from './components/tradeTile/TradeTile';

function App() {
  const [price, setPrice] = useState(null);
  const [movingAverage, setMovingAverage] = useState(0);

  return (
    <>
      <div className="tile">
        <div className="container">
          <Ticker price={price}
                  setPrice={setPrice}/>
          <MovingAverage price={price}
                         movingAverage={movingAverage}
                         setMovingAverage={setMovingAverage} />
          <FirstUpper movingAverage={movingAverage} />
          <SecondUpper movingAverage={movingAverage} />
          <FirstLower movingAverage={movingAverage} />
          <SecondLower movingAverage={movingAverage} />       
        </div>
      </div>
      <div className="tile">
        <TradeTile />
      </div>
    </>  
  );
}

export default App;
