import useMovingAverage from './useMovingAverage';

const SecondLower = ({ price }) => {
  const secondLower = useMovingAverage(price) - (useMovingAverage(price) * 0.0035);

  return (
    <div className='field'>-2: {secondLower.toFixed(1)}</div>
  )
};

export default SecondLower;