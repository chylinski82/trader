import useMovingAverage from './useMovingAverage';

const FirstUpper = ({ price }) => {
  const firstUpper = useMovingAverage(price) + (useMovingAverage(price) * 0.002);

  return (
    <div className='field'>+1: {firstUpper.toFixed(1)}</div>
  )
};

export default FirstUpper;