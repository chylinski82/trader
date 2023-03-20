import React from "react";

const FirstUpper = ({ movingAverage }) => {
  const firstUpper = movingAverage + (movingAverage * 0.002);

  return (
    <div className='field'>+1: {firstUpper.toFixed(1)}</div>
  )
};

export default FirstUpper;