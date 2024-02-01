import { GoAButton, GoATab, GoATabs } from '@abgov/react-components';
import { useNavigate, useParams } from 'react-router-dom';

import styles from './vendor-time-reports.module.scss';

import SignedOffTabDetails from '../vendor-time-reports/tabs/signed-off-tab-details';
import ApprovedTabDetails from './tabs/approved-tab-details';
import VendorTimeReportsSidePanel from '../vendor-time-reports/vendor-time-reports-side-panel';
import { useAppSelector } from '@/app/hooks';

const VendorTimeReports = () => {
  const { contractNumber } = useParams();
  const vendorForReconciliation = useAppSelector((state) => state.app.contractForReconciliation);

  const navigate = useNavigate();

  const header = vendorForReconciliation.vendorName;

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
            <ApprovedTabDetails contractNumber={contractNumber}></ApprovedTabDetails>
          </GoATab>
          <GoATab heading='Invoiced'></GoATab>
          <GoATab heading='Processed'></GoATab>
        </GoATabs>
      </div>
      <VendorTimeReportsSidePanel contractDetails={vendorForReconciliation} />
    </div>
  );
};

export default VendorTimeReports;
