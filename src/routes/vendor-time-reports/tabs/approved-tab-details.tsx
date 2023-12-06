import {
  GoATable,
  GoAButton,
  GoABlock,
  GoADropdown,
  GoADropdownItem,
  GoASpacer,
  GoAPagination,
  GoATableSortHeader,
  GoABadge,
  GoAIconButton,
  GoACheckbox,
} from '@abgov/react-components';
import moment from 'moment';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLoader from '../page-loader';
import { IPaginationResult } from '@/interfaces/pagination-result.interface';
import { IFlightReportDashboard } from '@/interfaces/flight-report-dashboard/flight-report-dashboard.interface';
import { IForestArea } from '@/interfaces/flight-report-dashboard/corporate-region.interface';
import { IFilter } from '@/interfaces/flight-report-dashboard/filter.interface';
import { IPagination } from '@/interfaces/pagination.interface';
import { ISearch } from '@/interfaces/flight-report-dashboard/search.interface';
import { FlightReportDashboardService } from '@/services/flight-report-dashboard.service';

interface IFlightReportAllProps {
  contractNumber: string | undefined;
  searchValue?: string;
  onClickFlightReport?: (flightReportId: number) => void;
}

const ApprovedTabDetails: React.FunctionComponent<IFlightReportAllProps> = ({
  contractNumber,
  searchValue,
  onClickFlightReport,
  ...props
}) => {
  //Navigation
  const navigate = useNavigate();
  //Data set
  const [paginationResults, setPaginationResult] =
    React.useState<IPaginationResult<IFlightReportDashboard>>();
  //Loader
  const [loading, setIsLoading] = React.useState(true);

  //Pagination
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pageUsers, setPageFlightReports] = React.useState<any>([]);
  // page number
  const [page, setPage] = React.useState(1);
  //count per page
  const [perPage, setPerPage] = React.useState(10);
  const [previousSelectedPerPage, setPreviousSelectedPerPage] =
    React.useState(10);

  //Sorting
  const [sortCol, setSortCol] = React.useState('flightReportDate');
  const [sortDir, setSortDir] = React.useState(-1);
  const [isSorting, setIsSorting] = React.useState(false);

  //const filteredData = paginationResults?.data;

  //const sortPaginationResults = React.useMemo(() => sortedPaginationResults(), [sortedPaginationResults]);

  React.useEffect(() => {
    //console.log("startDate", startDate)
    //console.log("endDate", endDate)
    onRefreshFlightReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, searchValue, sortCol, sortDir, contractNumber]);

  function onRefreshFlightReport() {
    getFlightReports();
    setPageFlightReports(paginationResults?.data.slice(0, perPage));
  }

  //Get flight reports data
  const getFlightReports = async () => {
    setIsLoading(true);

    let strSearchValue = searchValue ? searchValue.toLowerCase() : '';
    let sortOrder = sortDir === -1 ? 'ASC' : 'DESC';

    let objIPagination: IPagination = {
      perPage: perPage,
      page: page,
    };

    let objIFilter: IFilter = {
      contractNumber: contractNumber,
      status: 'approved',
    };

    let objISearch: ISearch = {
      search: strSearchValue,
      sortBy: sortCol,
      sortOrder: sortOrder,
      filterBy: objIFilter,
      pagination: objIPagination,
    };

    setTimeout(() => {
      FlightReportDashboardService.getSearch(objISearch)
        .then((response: any) => {
          setPaginationResult((p) => {
            return sortingData(response.data);
          });

          setIsLoading(false);
        })
        .catch((e: Error) => {
          setIsLoading(false);
          sessionStorage.setItem('api_token', '');
          navigate('/');
        });
    }, 200);
  };

  function sortingData(
    paginationResult: IPaginationResult<IFlightReportDashboard>
  ) {
    const _flightReports = [...(paginationResult.data || [])];
    _flightReports.sort((a, b) => {
      return (
        (a[sortCol as keyof typeof paginationResults] >
        b[sortCol as keyof typeof paginationResults]
          ? -1
          : 1) * sortDir
      );
    });

    paginationResult.data = _flightReports;
    //Only for sorting applied reset pagination
    if (isSorting) {
      setPerPage(previousSelectedPerPage | 10);
      setPage(1);
      setPageFlightReports(paginationResults?.data.slice(0, perPage));

      //Reset value
      setIsSorting(false);
      setPreviousSelectedPerPage(perPage);
    }
    return paginationResult;
  }

  function sortData(sortBy: string, sortDir: number) {
    setSortCol(sortBy);
    setSortDir(sortDir);

    setPreviousSelectedPerPage(perPage);
    setPerPage(paginationResults?.paginationInfo.total || 30);
    setPage(1);
    setIsSorting(true);
  }

  //Pagination change page
  function changePage(newPage: any) {
    if (newPage) {
      setIsLoading(true);
      const offset = (newPage - 1) * perPage;
      const _flightReports = paginationResults?.data.slice(
        offset,
        offset + perPage
      );

      setPerPage(perPage);
      setPage(newPage);
      setPageFlightReports(_flightReports);
    }
  }

  function changePerPage(name: any, value: any) {
    if (value) {
      setIsLoading(true);
      const newPerPage = parseInt(value, 10);
      const offset = (page - 1) * newPerPage;

      const _flightReports = paginationResults?.data.slice(
        offset,
        offset + newPerPage
      );

      setPageFlightReports(_flightReports);
      //setSearchValue("");
      setPerPage((p) => {
        return newPerPage;
      });
      setPage(page);
    }
  }

  //#endregion

  function flightReportClick(flightReportId?: number) {
    if (flightReportId) {
      alert('Fligh Report ID:' + flightReportId);
      // navigate(`/flightReportDetail/${flightReportId}`, {
      //   state: corporateRegionPaginationResult,
      // });
    } else {
      // navigate(`/flightReportDetail/new`, {
      //   state: corporateRegionPaginationResult,
      // });
    }
  }

  function reconcileFlightReports() {
    alert('Reconcile - Selected flight reports.');
  }

  return (
    <>
      <PageLoader visible={loading} />
      <div>
        <GoAButton
          size='compact'
          type='primary'
          disabled
          onClick={() => reconcileFlightReports()}
        >
          Reconcile
        </GoAButton>
        <div className='divTable'>
          <GoATable onSort={sortData}>
            <thead>
              <tr>
                <th style={{ maxWidth: '2%', padding: '12px 0 12px 32px' }}>
                  <input
                    type='checkbox'
                    name='allApproved'
                    style={{
                      width: '20px',
                      height: '20px',
                      verticalAlign: 'bottom',
                    }}
                  ></input>
                </th>
                <th style={{ maxWidth: '38%' }}>
                  <GoATableSortHeader name='flightReportDate'>
                    Report Date
                  </GoATableSortHeader>
                </th>
                <th style={{ maxWidth: '12%' }}>
                  {/* <GoATableSortHeader name="flightReportId"> */}
                  Report No.
                  {/* </GoATableSortHeader> */}
                </th>
                <th style={{ maxWidth: '12%' }}>
                  {/* <GoATableSortHeader name="ao02Number"> */}
                  AO-02 No.
                  {/* </GoATableSortHeader> */}
                </th>
                <th style={{ maxWidth: '12%' }}>
                  {/* <GoATableSortHeader name="contractRegistrationName"> */}
                  Registration No.
                  {/* </GoATableSortHeader> */}
                </th>
                <th style={{ maxWidth: '12%' }}>
                  {/* <GoATableSortHeader name="totalCost"> */}
                  Total Cost
                  {/* </GoATableSortHeader> */}
                </th>
                <th style={{ maxWidth: '12%', textAlign: 'right' }}></th>
              </tr>
            </thead>

            <tbody
              style={{ position: 'sticky', top: 0 }}
              className='table-body'
            >
              {paginationResults?.data && paginationResults.data.length > 0 ? (
                paginationResults.data.map((record: any, index: any) => (
                  // {filteredData && filteredData.length > 0 ? (
                  // filteredData.map((record: any, index: any) => (
                  <tr key={record.flightReportId}>
                    <td style={{ padding: '12px 0 12px 32px' }}>
                      <input
                        type='checkbox'
                        name={record.flightReportId}
                        style={{
                          width: '20px',
                          height: '20px',
                          verticalAlign: 'bottom',
                        }}
                      ></input>
                    </td>
                    <td>{yearMonthDay(record.flightReportDate as string)}</td>
                    <td>
                      <GoAButton
                        {...{ style: '"padding: 0 10px 0 10px;height: 90px;"' }}
                        size='compact'
                        type='tertiary'
                        onClick={() =>
                          flightReportClick(record?.flightReportId)
                        }
                      >
                        {record.flightReportId}
                      </GoAButton>
                    </td>
                    <td>{record.ao02Number}</td>
                    <td>{record?.contractRegistrationName}</td>
                    {/* <td>{record?.totalCost}</td> */}
                    <td>999999</td>
                    <td>
                      <GoAIconButton
                        icon='chevron-forward'
                        onClick={() =>
                          flightReportClick(record?.flightReportId)
                        }
                      />
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

        <div
          className={
            paginationResults?.data && paginationResults?.data.length > 0
              ? 'visible pagination'
              : 'not-visible pagination'
          }
        >
          <GoABlock alignment='center'>
            <div style={{ display: 'flex', alignSelf: 'center' }}>
              <span style={{ whiteSpace: 'nowrap' }}>
                Page {page} of {paginationResults?.paginationInfo.totalPages}
              </span>
            </div>
            <GoASpacer hSpacing='fill' />

            <GoAPagination
              variant='links-only'
              itemCount={paginationResults?.paginationInfo.total || 10}
              // itemCount={filteredData?.length || 10}
              perPageCount={perPage}
              pageNumber={page}
              onChange={changePage}
            />
          </GoABlock>
        </div>
      </div>
    </>
  );
};

export default ApprovedTabDetails;
