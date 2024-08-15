import { GoAButton } from '@abgov/react-components';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import styles from './vendor-time-reports.module.scss';

import SignedOffTabDetails from '@/features/vendor-time-reports/tabs/signed-off-tab-details';
import ApprovedTabDetails from './tabs/approved-tab-details';
import VendorTimeReportsSidePanel from '@/features/vendor-time-reports/vendor-time-reports-side-panel';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import ProcessedTabDetails from './tabs/processed-tab-details';
import DraftsTabDetails from './tabs/drafts-tab-details';
import { SourceTab } from '@/common/navigate';
import { setTab } from '@/app/app-slice';

const InvoiceProcessing = () => {
  const { contractNumber } = useParams();
  const vendorForReconciliation = useAppSelector((state) => state.app.contractForReconciliation);
  const tab = useAppSelector((state) => state.app.tab);
  const navigate = useNavigate();

  const header = 'Invoice Processing';
  const [tabIndex, setTabIndex] = useState<number>(SourceTab.Approved);
  const { vendorTimeReportRoot, vendorTimeReportMain, main, tabGroupContainer, tabList, tabContainer } = styles;
  const dispatch = useAppDispatch();

  function BackToContractReconciliationClick() {
    navigate('/contracts');
  }

  useEffect(() => {
    setTabIndex(tab);
  }, [tab]);

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
          {'Back'}
        </GoAButton>
        <h2>{header}</h2>
        <div className={main}>
          <div className={tabGroupContainer}>
            <div className={tabList}>
              <button id='Signed-off' role='tab' aria-selected={tab === SourceTab.SignedOff} onClick={() => dispatch(setTab(SourceTab.SignedOff))}>
                <span>Signed-off</span>
              </button>
              <button id='Approved' role='tab' aria-selected={tab === SourceTab.Approved} onClick={() => dispatch(setTab(SourceTab.Approved))}>
                <span>Approved</span>
              </button>
              <button id='Processed' role='tab' aria-selected={tab === SourceTab.Processed} onClick={() => dispatch(setTab(SourceTab.Processed))}>
                <span>Processed</span>
              </button>
              <button id='Drafts' role='tab' aria-selected={tab === SourceTab.Draft} onClick={() => dispatch(setTab(SourceTab.Draft))}>
                <span>Drafts</span>
              </button>
            </div>
            <div className={tabContainer}>
              {tabIndex === SourceTab.SignedOff && <SignedOffTabDetails contractNumber={contractNumber} />}
              {tabIndex === SourceTab.Approved && <ApprovedTabDetails contractNumber={contractNumber} />}
              {tabIndex === SourceTab.Processed && <ProcessedTabDetails contractNumber={contractNumber} />}
              {tabIndex === SourceTab.Draft && <DraftsTabDetails contractNumber={contractNumber} />}
            </div>
          </div>
        </div>
      </div>
      <VendorTimeReportsSidePanel contractDetails={vendorForReconciliation} />
    </div>
  );
};

export default InvoiceProcessing;
