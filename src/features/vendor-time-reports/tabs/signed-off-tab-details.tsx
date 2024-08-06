import { GoATable, GoAButton, GoABlock, GoASpacer, GoAPagination, GoATableSortHeader, GoAIconButton, GoAInput } from '@abgov/react-components';
import * as React from 'react';
import PageLoader from '@/common/page-loader';
import { IFlightReportDashboard } from '@/interfaces/flight-report-dashboard/flight-report-dashboard.interface';
import { yearMonthDay } from '@/common/dates';
import flightReportDashboardService from '@/services/flight-report-dashboard.service';
import { useEffect } from 'react';
import { useConditionalAuth } from '@/app/hooks';
import { navigateTo } from '@/common/navigate';
import styles from './signed-off-tab-details.module.scss';
const { headerRow, roboto, toolbar, spacer } = styles;

interface IFlightReportAllProps {
  contractNumber: string | undefined;
  searchValue?: string;
  onClickFlightReport?: (flightReportId: number) => void;
}

const SignedOffTabDetails: React.FunctionComponent<IFlightReportAllProps> = ({ contractNumber, searchValue }) => {
  const auth = useConditionalAuth();
  //Data set
  const [data, setData] = React.useState<IFlightReportDashboard[]>([]);
  const [rawData, setRawData] = React.useState<IFlightReportDashboard[]>([]);
  //Loader
  const [loading, setIsLoading] = React.useState(true);

  // Searching
  const [searchVal, setSearchVal] = React.useState<string>();

  //Pagination
  const [pageData, setPageData] = React.useState<IFlightReportDashboard[]>([]);
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
        const sortedData = sort('flightReportDate', 1, response.rows);
        setRawData(sortedData);
        setData(sortedData);
        // sort by what default
        setPageData(sortedData.slice(0, perPage));

        setIsLoading(false);
      },
      error: (error) => {
        setIsLoading(false);
        console.error(error);
        if (error.response && error.response.status === 403) {
          navigateTo('unauthorized');
        }
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [searchValue, contractNumber, auth]);

  useEffect(() => {
    const offset = (page - 1) * perPage;
    const _flightReports = data.slice(offset, offset + perPage);
    setPageData(_flightReports);
  }, [data]);

  function sortData(sortBy: string, sortDir: number) {
    const sortedData = sort(sortBy, sortDir, data);
    setData(sortedData.slice());
    setPageData(sortedData.slice(0, perPage));
    setPage(1);
    setPreviousSelectedPerPage(perPage);
  }
  function sort(sortBy: string, sortDir: number, rows: IFlightReportDashboard[]): IFlightReportDashboard[] {
    rows.sort((a: IFlightReportDashboard, b: IFlightReportDashboard) => {
      const varA = a[sortBy as keyof IFlightReportDashboard];
      const varB = b[sortBy as keyof IFlightReportDashboard];
      if (typeof varA === 'string' && typeof varB === 'string') {
        const res = varB.localeCompare(varA);
        return res * sortDir;
      }
      if (varA === varB) {
        return 0;
      }
      return (varA > varB ? 1 : -1) * sortDir;
    });
    return rows.slice().map((x, i) => {
      x.row = i + 1;
      return x;
    });
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

  const onChange = (name: string, value: string) => {
    setSearchVal(value);
    if (value.length < 3) {
      setData(rawData);
      changePage(1);
      return;
    }
    const upper = value.toUpperCase();
    const results = rawData.filter((x) => x.contractRegistrationName?.toUpperCase().includes(upper));
    setData(results);
  };

  return (
    <>
      <PageLoader visible={loading} />

      <div>
        <div className={toolbar}>
          <div className={spacer}></div>
          <GoAInput
            type='search'
            name='search'
            value={searchVal}
            onChange={onChange}
            leadingIcon='search'
            placeholder='Search Registration no.'
          ></GoAInput>
        </div>
        <div className='divTable'>
          <GoATable onSort={sortData} width='100%'>
            <thead>
              <tr>
                <th></th>
                <th style={{ maxWidth: '40%' }}>
                  <GoATableSortHeader name='flightReportDate' direction='asc'>
                    Report Date
                  </GoATableSortHeader>
                </th>
                <th className={headerRow} style={{ maxWidth: '15%' }}>
                  <GoATableSortHeader name='flightReportId'>Report No.</GoATableSortHeader>
                </th>
                <th className={headerRow} style={{ maxWidth: '15%' }}>
                  <GoATableSortHeader name='ao02Number'>AO-02 No.</GoATableSortHeader>
                </th>
                <th className={headerRow} style={{ maxWidth: '15%' }}>
                  <GoATableSortHeader name='contractRegistrationName'>Registration No.</GoATableSortHeader>
                </th>
                <th className={headerRow} style={{ maxWidth: '15%', textAlign: 'right' }}></th>
              </tr>
            </thead>

            {!loading && (
              <tbody style={{ position: 'sticky', top: 0 }} className='table-body'>
                {pageData && pageData.length > 0 ? (
                  pageData.map((record: IFlightReportDashboard) => (
                    // {filteredData && filteredData.length > 0 ? (
                    // filteredData.map((record: any, index: any) => (
                    <tr key={record.flightReportId}>
                      <td>{record.row}</td>
                      <td>{yearMonthDay(record.flightReportDate as string)}</td>
                      <td>
                        <GoAButton
                          {...{ style: '"padding: 0 10px 0 10px;height: 90px;"' }}
                          size='compact'
                          type='tertiary'
                          onClick={() => flightReportClick(record?.flightReportId)}
                        >
                          <span className={roboto}>{record.flightReportId}</span>
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
            )}
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
