import FlipNumber from './flip-number';

const FlipNumberTest = () => {
  const numbers = [0, 0.0, 10.0, 10.01, 10.1, 999.0, 999.99, 1000.0, 1001, 1011, 1111, 10000, 11000, 999000, 900000, 909000];

  return (
    <div>
      {numbers.map((x, i) => {
        return (
          <div key={i} style={{ display: 'block' }}>
            {`${x} : `}
            <FlipNumber value={x} />
          </div>
        );
      })}
    </div>
  );
};
export default FlipNumberTest;
