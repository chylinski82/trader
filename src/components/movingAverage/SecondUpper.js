import React from "react";

const SecondUpper = ({ movingAverage }) => {
  const secondUpper = movingAverage + (movingAverage * 0.0035);

  return (
    <div className='field'>+2: {secondUpper.toFixed(1)}</div>
  )
};

export default SecondUpper;