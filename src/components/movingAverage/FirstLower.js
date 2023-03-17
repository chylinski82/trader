import useMovingAverage from './useMovingAverage';

const FirstLower = ({ price }) => {
  const firstLower = useMovingAverage(price) - (useMovingAverage(price) * 0.002);

  return (
    <div className='field'>-1: {firstLower.toFixed(1)}</div>
  )
};

export default FirstLower;