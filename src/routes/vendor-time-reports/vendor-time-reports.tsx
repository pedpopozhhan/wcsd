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
  import searchService from '@/routes/vendor-time-reports/flight-report-dashboard/services/search-service';
  import styles from '../utilization/utilization.module.scss' ;
  import { PagingRequest } from '@/models/paging-request';
  import { ContractType } from '@/types/contract-type';
  import React from 'react';
  import { FlightReportDashboardService } from './flight-report-dashboard/services/FlightReportDashboardService';
 // import { DomainService } from 'report-table-component/src/services/DomainService';
import SignedOffTabDetails from '../vendor-time-reports/tabs/signed-off-tab-details';
import VendorTimeReportsSidePanel from '../vendor-time-reports/vendor-time-reports-side-panel';
  
  let { search } = styles;
  
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

    function BackToContractUtilizationClick(){
      navigate('/utilization');
    }

  
    return (
      <GoABlock gap='none' alignment='start'>
        <div style={{minWidth: '80%'}}>
          <GoAContainer>
          <GoAButton {...{ style: '"padding: 0 10px 0 10px;height: 90px;"' }}
                        size='compact'
                        type='tertiary'
                        onClick={() => BackToContractUtilizationClick()}
                      > {`< Back`}
                      </GoAButton>
            <h2>{header}</h2>
            <GoATabs>
              <GoATab heading='Signed-off'>
               <SignedOffTabDetails contractId={contractId}/>
              </GoATab>
              <GoATab heading='Approved'></GoATab>
              <GoATab heading='Invoiced'></GoATab>
              <GoATab heading='Processed'></GoATab>
            </GoATabs>
          </GoAContainer>
        </div>
        <GoASpacer />
        <VendorTimeReportsSidePanel/>
      </GoABlock>
    );
  }

  export default VendorTimeReports
  