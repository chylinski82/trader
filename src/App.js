import React, { useState } from 'react';

import './App.css';
import Ticker from './components/ticker/Ticker';
import HistoricData from './components/historicData/HistoricData';
import MovingAverage from './components/movingAverage/MovingAverage';
import FirstUpper from './components/movingAverage/FirstUpper';
import SecondUpper from './components/movingAverage/SecondUpper';
import FirstLower from './components/movingAverage/FirstLower';
import SecondLower from './components/movingAverage/SecondLower';

function App() {
  const [price, setPrice] = useState(null);

  return (
    <>
      <div className="tile">
        <div className="container">
          <Ticker price={price}
                  setPrice={setPrice}/>
          <MovingAverage price={price} />
          <FirstUpper price={price} />
          <SecondUpper price={price} />
          <FirstLower price={price} />
          <SecondLower price={price} />
        </div>
      </div>
      <div className="tile">
        <HistoricData />
      </div>
    </>  
  );
}

export default App;
