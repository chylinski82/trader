import React, { useState } from 'react';

import useHistoricData from '../historicData/useHistoricData';

const TradeTile = () => {

  const [entry, setEntry] = useState(0);
  const [inTrade, setInTrade] = useState(false);
  const [maClose, setMaClose] = useState(false);
  const [maCloseVal, setMaCloseVal] = useState(0);
  const [closeHigher, setCloseHigher] = useState(false);
  const [closeLower, setCloseLower] = useState(false);

  const data = useHistoricData();
  //const closePrice = data[data.length - 2]?.close;
  //console.log('close price', closePrice)

  return (
    <div>TradeTile</div>
  )
}

export default TradeTile