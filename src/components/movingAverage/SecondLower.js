import React from "react";

const SecondLower = ({ movingAverage }) => {
  const secondLower = movingAverage - (movingAverage * 0.0035);

  return (
    <div className='field'>-2: {secondLower.toFixed(1)}</div>
  )
};

export default SecondLower;