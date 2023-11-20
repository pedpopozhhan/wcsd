import {
    GoAAppHeader,
    GoABlock,
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
  import { useNavigate } from 'react-router-dom';
  import searchService from '@/services/search-service';
  import styles from './utilization.module.scss';
  import { PagingRequest } from '@/models/paging-request';
  import { ContractType } from '@/types/contract-type';
  import SearchResults from '@/components/search-results';
  import { SearchResponse } from '@/models/search-response';
  //import FlightReportAll from 'report-table-component/src/components/FlightReportAll';
  import React from 'react';
  //import DashboardGridColumns from 'report-table-component/src/model/enum/DashboardGridColumns';
  //import FlightReportStatus from 'report-table-component/src/model/enum/FlightReportStatus';
  import { FlightReportDashboardService } from '../services/FlightReportDashboardService';
 // import { DomainService } from 'report-table-component/src/services/DomainService';
import SignedOffTabDetails from '@/components/vendorTimeReports/signed-off-tab-details';
import VendorTimeReportsSidePanel from '@/components/vendorTimeReports/vendor-time-reports-side-panel';
//import SignedOffTabDetails from '@/components/vendorTimeReports/signed-off-tab-details';
  
  let { search } = styles;
  
  export default function VendorTimeReports() {
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
    //const [searchResults, setSearchResults] = useState([] as SignedOffTabResults[]);
  
    const header = 'Time Reports';

  
    return (
      <GoABlock gap='none' alignment='start'>
        <div style={{minWidth: '80%'}}>
          <GoAContainer>
            <h2>{header}</h2>
            <GoATabs>
              <GoATab heading='Signed-off'>
               <SignedOffTabDetails/>
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
  