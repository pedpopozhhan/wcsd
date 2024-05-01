import { GoATable, GoAButton, GoABlock, GoASpacer, GoAPagination, GoATableSortHeader, GoAIconButton } from '@abgov/react-components';
import * as React from 'react';
import PageLoader from '@/common/page-loader';
import { IFlightReportDashboard } from '@/interfaces/flight-report-dashboard/flight-report-dashboard.interface';
import { yearMonthDay } from '@/common/dates';
import flightReportDashboardService from '@/services/flight-report-dashboard.service';
import { useEffect } from 'react';
import { useConditionalAuth } from '@/app/hooks';
import { navigateTo } from '@/common/navigate';
import styles from './signed-off-tab-details.module.scss';
import { failedToPerform, publishToast } from '@/common/toast';
const { headerRow } = styles;

interface IFlightReportAllProps {
  contractNumber: string | undefined;
  searchValue?: string;
  onClickFlightReport?: (flightReportId: number) => void;
}

const SignedOffTabDetails: React.FunctionComponent<IFlightReportAllProps> = ({ contractNumber, searchValue }) => {
  const auth = useConditionalAuth();
  //Data set
  const [data, setData] = React.useState<IFlightReportDashboard[]>([]);
  //Loader
  const [loading, setIsLoading] = React.useState(true);
  const [retry, setRetry] = React.useState<boolean>(false);

  //Pagination
  const [, setPageData] = React.useState<IFlightReportDashboard[]>([]);
  // page number
  const [page, setPage] = React.useState(1);
  //count per page
  const [perPage, setPerPage] = React.useState(10);
  const [, setPreviousSelectedPerPage] = React.useState(10);

  //Sorting

  useEffect(() => {
    const request = {
      contractNumber: contractNumber,
      status: 'signed off',
    };
    setIsLoading(true);
    const subscription = flightReportDashboardService.getSearch(auth?.user?.access_token, request).subscribe({
      next: (response) => {
        setData(response.rows);
        // sort by what default
        setPageData(response.rows.slice(0, perPage));

        setIsLoading(false);
      },
      error: (error) => {
        setIsLoading(false);
        console.error(error);
        if (error.response && error.response.status === 403) {
          navigateTo('unauthorized');
        }
        publishToast({
          type: 'error',
          message: failedToPerform('load flight reports', error.response.data),
          callback: () => {
            setRetry(!retry);
          },
        });
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [searchValue, contractNumber, auth, retry]);

  function sortData(sortBy: string, sortDir: number) {
    data.sort((a: IFlightReportDashboard, b: IFlightReportDashboard) => {
      const varA = a[sortBy as keyof IFlightReportDashboard];
      const varB = b[sortBy as keyof IFlightReportDashboard];
      if (typeof varA === 'string' && typeof varB === 'string') {
        const res = varB.localeCompare(varA);
        return res * sortDir;
      }
      return (varA > varB ? 1 : -1) * sortDir;
    });
    setData(data.slice());
    setPageData(data.slice(0, perPage));
    setPage(1);
    setPreviousSelectedPerPage(perPage);
  }
  function getTotalPages() {
    const num = data ? Math.ceil(data.length / perPage) : 0;

    return num;
  }

  //Pagination change page
  function changePage(newPage: number) {
    if (newPage) {
      setIsLoading(true);
      const offset = (newPage - 1) * perPage;
      const _flightReports = data.slice(offset, offset + perPage);

      setPerPage(perPage);
      setPage(newPage);
      setPageData(_flightReports);
      setIsLoading(false);
    }
  }

  //#endregion

  function flightReportClick(flightReportId?: number) {
    if (flightReportId) {
      window.open(import.meta.env.VITE_AVIATION_APPLICATION_BASE_URL + '/flightReportDetail/' + flightReportId, '_blank');
    }
  }

  return (
    <>
      <PageLoader visible={loading} />

      <div>
        <div className='divTable'>
          <GoATable onSort={sortData} width='100%'>
            <thead>
              <tr>
                <th style={{ maxWidth: '40%' }}>
                  <GoATableSortHeader name='flightReportDate'>Report Date</GoATableSortHeader>
                </th>
                <th className={headerRow} style={{ maxWidth: '15%' }}>
                  {/* <GoATableSortHeader name="flightReportId"> */}
                  Report No.
                  {/* </GoATableSortHeader> */}
                </th>
                <th className={headerRow} style={{ maxWidth: '15%' }}>
                  {/* <GoATableSortHeader name="ao02Number"> */}
                  AO-02 No.
                  {/* </GoATableSortHeader> */}
                </th>
                <th className={headerRow} style={{ maxWidth: '15%' }}>
                  {/* <GoATableSortHeader name="contractRegistrationName"> */}
                  Registration No.
                  {/* </GoATableSortHeader> */}
                </th>
                <th className={headerRow} style={{ maxWidth: '15%', textAlign: 'right' }}></th>
              </tr>
            </thead>

            <tbody style={{ position: 'sticky', top: 0 }} className='table-body'>
              {data && data.length > 0 ? (
                data.map((record: IFlightReportDashboard) => (
                  // {filteredData && filteredData.length > 0 ? (
                  // filteredData.map((record: any, index: any) => (
                  <tr key={record.flightReportId}>
                    <td>{yearMonthDay(record.flightReportDate as string)}</td>
                    <td>
                      <GoAButton
                        {...{ style: '"padding: 0 10px 0 10px;height: 90px;"' }}
                        size='compact'
                        type='tertiary'
                        onClick={() => flightReportClick(record?.flightReportId)}
                      >
                        {record.flightReportId}
                      </GoAButton>
                    </td>
                    <td>{record.ao02Number}</td>
                    <td>{record?.contractRegistrationName}</td>
                    <td style={{ textAlign: 'right' }}>
                      <GoAIconButton icon='chevron-forward' onClick={() => flightReportClick(record?.flightReportId)} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className='centertext'>
                    No data avaliable
                  </td>
                </tr>
              )}
            </tbody>
          </GoATable>
        </div>

        {data && data.length > 0 && (
          <GoABlock alignment='center'>
            <div style={{ display: 'flex', alignSelf: 'center' }}>
              <span style={{ whiteSpace: 'nowrap' }}>
                Page {page} of {getTotalPages()}
              </span>
            </div>
            <GoASpacer hSpacing='fill' />

            <GoAPagination
              variant='links-only'
              itemCount={data.length || 10}
              // itemCount={filteredData?.length || 10}
              perPageCount={perPage}
              pageNumber={page}
              onChange={changePage}
            />
          </GoABlock>
        )}
      </div>
    </>
  );
};

export default SignedOffTabDetails;
