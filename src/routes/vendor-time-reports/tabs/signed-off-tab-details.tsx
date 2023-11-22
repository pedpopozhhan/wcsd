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
} from '@abgov/react-components';
import moment from 'moment';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLoader from '../page-loader';
import { IFlightReportDashboard } from '../flight-report-dashboard/interfaces/IFlightReportDashboard';
import { IForestArea } from '../flight-report-dashboard/interfaces/ICorporateRegion';
import { IFilter } from '../flight-report-dashboard/interfaces/IFilter';
import { IPagination } from '../flight-report-dashboard/interfaces/IPagination';
import { IPaginationResult } from '../flight-report-dashboard/interfaces/IPaginationResult';
import { ISearch } from '../flight-report-dashboard/interfaces/ISearch';
import { FlightReportDashboardService } from '../flight-report-dashboard/services/FlightReportDashboardService';

interface IFlightReportAllProps {
  contractId: string | undefined;
  forestAreaSelected?: never[];
  startDate?: string;
  endDate?: string;
  searchValue?: string;
  onClickFlightReport?: (flightReportId: number) => void;
}

const SignedOffTabDetails: React.FunctionComponent<IFlightReportAllProps> = ({
  contractId,
  forestAreaSelected,
  startDate,
  endDate,
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
  }, [
    page,
    perPage,
    endDate,
    forestAreaSelected,
    searchValue,
    sortCol,
    sortDir,
    contractId
  ]);

  function onRefreshFlightReport() {
    getFlightReports();
    setPageFlightReports(paginationResults?.data.slice(0, perPage));
  }

  //Get flight reports data
  const getFlightReports = async () => {
    setIsLoading(true);

    let strSearchValue = searchValue ? searchValue.toLowerCase() : '';
    let sortOrder = sortDir === -1 ? 'ASC' : 'DESC';
    let startDt =
      startDate === null || startDate === ''
        ? null
        : moment(startDate).format('yyyy-MM-DD');
    let endDt =
      endDate === null || startDate === ''
        ? null
        : moment(endDate).format('yyyy-MM-DD');
    let objForestArea: IForestArea = {
      corporateRegionId:
        forestAreaSelected != null || forestAreaSelected !== undefined
          ? forestAreaSelected.map((forestArea) => {
              return forestArea['value'] as string;
            })
          : [],
    };

    let objIPagination: IPagination = {
      perPage: perPage,
      page: page,
    };
 
    //const testContractid = 81804
    let objIFilter: IFilter = {
      columnName: 'status',
      columnValue: "['Signed off']",
      reportDateFrom: null,
      reportDateTo: null,
      corporateRegions: objForestArea
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
      if (flightReportId) {
        // navigate(`/flightReportDetail/${flightReportId}`, {
        //   state: corporateRegionPaginationResult,
        // });
      } else {
        // navigate(`/flightReportDetail/new`, {
        //   state: corporateRegionPaginationResult,
        // });
      }
    }
  }

  return (
    <>
      <PageLoader visible={loading} />

      <div>
        <div className='divTable'>
          <GoATable onSort={sortData}>
            <thead>
              <tr>
                <th style={{ maxWidth: '40%' }}>
                  <GoATableSortHeader name='flightReportDate'>
                    Report Date
                  </GoATableSortHeader>
                </th>
                <th style={{ maxWidth: '15%' }}>
                  {/* <GoATableSortHeader name="flightReportId"> */}
                  Report No.
                  {/* </GoATableSortHeader> */}
                </th>
                <th style={{ maxWidth: '15%' }}>
                  {/* <GoATableSortHeader name="ao02Number"> */}
                  AO-02 No.
                  {/* </GoATableSortHeader> */}
                </th>
                <th style={{ maxWidth: '15%' }}>
                  {/* <GoATableSortHeader name="contractRegistrationName"> */}
                  Registration No.
                  {/* </GoATableSortHeader> */}
                </th>
                <th style={{ maxWidth: '15%' }}></th>
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
                    <td>
                      {moment(record.flightReportDate).format('yyyy-MM-DD')}
                    </td>
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
            {/* <GoABlock mb='m' alignment='center' gap='m'>
              <span style={{ whiteSpace: 'nowrap' }}>Show</span>
              <div className='dropdown-list'>
                <GoADropdown
                  name='selPerPage'
                  onChange={changePerPage}
                  value='10'
                  width='8ch'
                >
                  <GoADropdownItem value='10'></GoADropdownItem>
                  <GoADropdownItem value='20'></GoADropdownItem>
                  <GoADropdownItem value='30'></GoADropdownItem>
                </GoADropdown>
              </div>
              <span style={{ whiteSpace: 'nowrap' }}>
                of {paginationResults?.paginationInfo.total} items
              </span>
            </GoABlock> */}
            <div style={{ display: 'flex', alignSelf: 'center' }}>
              <span style={{ whiteSpace: 'nowrap' }}>
                Page {page} of {paginationResults?.paginationInfo.totalPages}
              </span>
            </div>
            <GoASpacer hSpacing='fill' />

            <GoAPagination
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

export default SignedOffTabDetails;
