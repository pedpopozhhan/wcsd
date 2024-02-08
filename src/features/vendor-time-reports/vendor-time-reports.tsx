import { GoAButton, GoATab, GoATabs } from '@abgov/react-components';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import styles from './vendor-time-reports.module.scss';

import SignedOffTabDetails from '../vendor-time-reports/tabs/signed-off-tab-details';
import ApprovedTabDetails from './tabs/approved-tab-details';
import VendorTimeReportsSidePanel from '../vendor-time-reports/vendor-time-reports-side-panel';
import { useAppSelector } from '@/app/hooks';
import ProcessedTabDetails from './tabs/processed-tab-details';

const VendorTimeReports = () => {
  const { contractNumber } = useParams();
  const vendorForReconciliation = useAppSelector((state) => state.app.contractForReconciliation);

  const navigate = useNavigate();

  const header = vendorForReconciliation.vendorName;
  const [tabIndex, setTabIndex] = useState<number>(2);
  const { vendorTimeReportRoot, vendorTimeReportMain, main, tabGroupContainer, tabList, tabContainer } = styles;

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
        <div className={main}>
          <div className={tabGroupContainer}>
            <div className={tabList}>
              <button id='Signed-off' role='tab' aria-selected={tabIndex === 1} onClick={(e) => setTabIndex(1)}>
                <span>Signed-off</span>
              </button>
              <button id='Approved' role='tab' aria-selected={tabIndex === 2} onClick={(e) => setTabIndex(2)}>
                <span>Approved</span>
              </button>
              <button id='Processed' role='tab' aria-selected={tabIndex === 3} onClick={(e) => setTabIndex(3)}>
                <span>Processed</span>
              </button>
            </div>
            <div className={tabContainer}>
              {tabIndex === 1 && <SignedOffTabDetails contractNumber={contractNumber} />}
              {tabIndex === 2 && <ApprovedTabDetails contractNumber={contractNumber} />}
              {tabIndex === 3 && <ProcessedTabDetails contractNumber={contractNumber} />}
            </div>
          </div>
        </div>
      </div>
      <VendorTimeReportsSidePanel contractDetails={vendorForReconciliation} />
    </div>
  );
};

export default VendorTimeReports;
