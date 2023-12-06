import styles from './summary.module.scss';

let { container } = styles;
export default function Summary() {
  return (
    <div className={container}>
      <div>
        <div>Vendor</div>
        <div>Air Spray Ltd.</div>
      </div>
      <div>
        <div>Assigned to</div>
        <div>Sarah Tale</div>
      </div>
      <div>
        <div>Contract no.</div>
        <div>23AFD203</div>
      </div>
      <div>
        <div>Type</div>
        <div>Casual</div>
      </div>
      <div>
        <div>Invoice no.</div>
        <div>23-0452</div>
      </div>
      <div>
        <div>Invoice date</div>
        <div>2023-08-09</div>
      </div>
      <div>
        <div>Invoice received</div>
        <div>2023-09-08</div>
      </div>
      <div>
        <div>Period ending</div>
        <div>2023-07-31</div>
      </div>
    </div>
  );
}
