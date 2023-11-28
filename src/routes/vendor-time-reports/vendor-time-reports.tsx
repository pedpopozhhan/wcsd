import {
  GoAAppHeader,
  GoABlock,
  GoAButton,
  GoAContainer,
  GoADropdown,
  GoADropdownItem,
  GoAFormItem,
  GoAGrid,
  GoAIcon,
  GoAInput,
  GoAInputSearch,
  GoAInputText,
  GoASpacer,
  GoATab,
  GoATable,
  GoATabs,
  GoATextArea,
  GoAThreeColumnLayout,
  GoATwoColumnLayout,
} from '@abgov/react-components';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import React from 'react';
import styles from  './vendor-time-reports.module.scss';

// import { DomainService } from 'report-table-component/src/services/DomainService';
import SignedOffTabDetails from '../vendor-time-reports/tabs/signed-off-tab-details';
import ApprovedTabDetails from './tabs/approved-tab-details';
import VendorTimeReportsSidePanel from '../vendor-time-reports/vendor-time-reports-side-panel';
import { FlightReportDashboardService } from '@/services/flight-report-dashboard.service';

const VendorTimeReports = () => {
  const { contractId } = useParams();
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

  const {vendorTimeReportRoot, vendorTimeReportMain} = styles;

  function BackToContractUtilizationClick() {
    navigate('/utilization');
  }

  return (
     <div className={vendorTimeReportRoot} >
      <div className={vendorTimeReportMain}>
          <GoAButton
            {...{ style: '"padding: 0 10px 0 10px;height: 90px;"' }}
            size='compact'
            type='tertiary'
            onClick={() => BackToContractUtilizationClick()}
          >
            {' '}
            {`< Back`}
          </GoAButton>
          <h2>{header}</h2>
          <GoATabs initialTab={2}>
            <GoATab heading='Signed-off'>
              <SignedOffTabDetails contractId={contractId} />
            </GoATab>
            <GoATab heading='Approved'>
              <ApprovedTabDetails contractId={contractId}></ApprovedTabDetails>
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
