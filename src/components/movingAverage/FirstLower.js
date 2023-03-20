import React from "react";

const FirstLower = ({ movingAverage }) => {
  const firstLower = movingAverage - (movingAverage * 0.002);

  return (
    <div className='field'>-1: {firstLower.toFixed(1)}</div>
  )
};

export default FirstLower;