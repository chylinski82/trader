import useMovingAverage from './useMovingAverage';

const MovingAverage = ({ price }) => {
  const movingAverage = useMovingAverage(price);

  return (
    <div className='field'>MA: {movingAverage}</div>
  )
};

export default MovingAverage;
