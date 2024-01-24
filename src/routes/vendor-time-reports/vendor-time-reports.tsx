import { GoAButton, GoATab, GoATabs } from '@abgov/react-components';
import { useNavigate, useParams } from 'react-router-dom';

import styles from './vendor-time-reports.module.scss';

import SignedOffTabDetails from '../vendor-time-reports/tabs/signed-off-tab-details';
import ApprovedTabDetails from './tabs/approved-tab-details';
import VendorTimeReportsSidePanel from '../vendor-time-reports/vendor-time-reports-side-panel';

const VendorTimeReports = () => {
  const { contractNumber } = useParams();

  const navigate = useNavigate();

  const header = "[Vendor's] Time Reports";

  const { vendorTimeReportRoot, vendorTimeReportMain } = styles;

  function BackToContractReconciliationClick() {
    navigate('/reconciliation');
  }

  return (
    <div className={vendorTimeReportRoot}>
      <div className={vendorTimeReportMain}>
        <GoAButton
          {...{ style: '"padding: 0 10px 0 10px;height: 60px;"' }}
          size='compact'
          type='tertiary'
          leadingIcon='chevron-back'
          onClick={() => BackToContractReconciliationClick()}
        >
          {`Back`}
        </GoAButton>
        <h2>{header}</h2>
        <GoATabs initialTab={2}>
          <GoATab heading='Signed-off'>
            <SignedOffTabDetails contractNumber={contractNumber} />
          </GoATab>
          <GoATab heading='Approved'>
            <ApprovedTabDetails
              contractNumber={contractNumber}
            ></ApprovedTabDetails>
          </GoATab>
          <GoATab heading='Invoiced'></GoATab>
          <GoATab heading='Processed'></GoATab>
        </GoATabs>
      </div>
      <VendorTimeReportsSidePanel />
    </div>
  );
};

export default VendorTimeReports;
