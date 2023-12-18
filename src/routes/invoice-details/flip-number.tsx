import styles from './flip-number.module.scss';
import { FC, useEffect, useState } from 'react';

let {
  container,
  fraction,
  hundreds,
  thousands,
  millions,
  billions,
  trillions,
  oneDigit,
  twoDigits,
  threeDigits,
  noDigits,
} = styles;
interface IFlipNumberProps {
  value: number;
}

const FlipNumber: FC<IFlipNumberProps> = ({ value }) => {
  const [commaSplits, setCommaSplits] = useState<string[]>([]);
  const [fractionVal, setFractionVal] = useState<string>('00');
  function getLeadingZeroClassName(idx: number) {
    const value = commaSplits[commaSplits.length - idx];
    let className = threeDigits;
    if (value.length === 1) {
      return className;
    }
    if (value[0] === '0') {
      className = twoDigits;
      if (value[1] === '0') {
        className = oneDigit;
        if (value[2] === '0') {
          className = noDigits;
        }
      }
    }
    return className;
  }
  useEffect(() => {
    // fix to 2 decimal places
    const fixed = (Math.round(value * 100) / 100).toFixed(2);
    // separate whole and fraction
    const splits = fixed.toString().split('.');
    if (splits.length === 1) {
      splits.push('00');
    }

    // commarize the whole part
    const commarized = splits[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // split into tens, hundreds, thousands etc
    setCommaSplits(commarized.split(','));

    setFractionVal(splits[1]);
  }, [value]);

  return (
    <div className={container}>
      $
      {
        //trillions
        commaSplits.length >= 5 && (
          <span
            className={`${trillions} ${getLeadingZeroClassName(5)}`}
            style={
              { '--trillions': commaSplits[commaSplits.length - 5] } as any
            }
          >
            ,
          </span>
        )
      }
      {
        //billions
        commaSplits.length >= 4 && (
          <span
            className={`${billions} ${getLeadingZeroClassName(4)}`}
            style={{ '--billions': commaSplits[commaSplits.length - 4] } as any}
          >
            ,
          </span>
        )
      }
      {
        //millions
        commaSplits.length >= 3 && (
          <span
            className={`${millions} ${getLeadingZeroClassName(3)}`}
            style={{ '--millions': commaSplits[commaSplits.length - 3] } as any}
          >
            ,
          </span>
        )
      }
      {
        //thousands
        commaSplits.length >= 2 && (
          <span
            className={`${thousands} ${getLeadingZeroClassName(2)}`}
            style={
              { '--thousands': commaSplits[commaSplits.length - 2] } as any
            }
          >
            ,
          </span>
        )
      }
      {
        //hundreds
        commaSplits.length >= 1 && (
          <span
            className={`${hundreds} ${getLeadingZeroClassName(1)}`}
            style={{ '--hundreds': commaSplits[commaSplits.length - 1] } as any}
          ></span>
        )
      }
      <span
        className={fraction}
        style={{ '--fraction': fractionVal } as any}
      ></span>
    </div>
  );
};
export default FlipNumber;
