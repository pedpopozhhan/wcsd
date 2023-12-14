import {
  GoAButton,
  GoATab,
  GoATabs,
} from '@abgov/react-components';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import React from 'react';
import styles from './vendor-time-reports.module.scss';

// import { DomainService } from 'report-table-component/src/services/DomainService';
import SignedOffTabDetails from '../vendor-time-reports/tabs/signed-off-tab-details';
import ApprovedTabDetails from './tabs/approved-tab-details';
import VendorTimeReportsSidePanel from '../vendor-time-reports/vendor-time-reports-side-panel';
import { FlightReportDashboardService } from '@/services/flight-report-dashboard.service';

const VendorTimeReports = () => {
  const { contractNumber } = useParams();
  (async () => {
    await aviationReportingAuthenticate();
    //  await domainServiceAuthenticate();
  })();

  async function aviationReportingAuthenticate() {
    await FlightReportDashboardService.getAuthenticate()
      .then((res) => {
        sessionStorage.setItem('api_token', res.data);
      })
      .catch((err) => {
        console.log('error', err);
      });
  }

  // async function domainServiceAuthenticate() {
  //   await DomainService.getAuthenticate()
  //     .then((res) => {
  //       sessionStorage.setItem('domainService_token', res.data);
  //     })
  //     .catch((err) => {
  //       console.log('error', err);
  //     });
  // }
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
            <ApprovedTabDetails contractNumber={contractNumber}></ApprovedTabDetails>
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
