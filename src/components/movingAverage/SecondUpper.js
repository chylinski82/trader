import useMovingAverage from './useMovingAverage';

const SecondUpper = ({ price }) => {
  const secondUpper = useMovingAverage(price) + (useMovingAverage(price) * 0.0035);

  return (
    <div className='field'>+2: {secondUpper.toFixed(1)}</div>
  )
};

export default SecondUpper;