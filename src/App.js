import React, { useState } from 'react';

import './App.css';
import Ticker from './components/ticker/Ticker';
import HistoricData from './components/historicData/HistoricData';

function App() {
  const [price, setPrice] = useState(null);

  return (
    <>
      <div className="tile">
        <Ticker price={price}
                setPrice={setPrice}/>
      </div>
      <div className="tile">
        <HistoricData />
      </div>
    </>  
  );
}

export default App;
