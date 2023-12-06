import {
  httpAviationReporting,
  httpAviationReportingAuthentication,
} from './http-common';
import { IFlightReportDashboard } from '../interfaces/flight-report-dashboard/flight-report-dashboard.interface';
import { IPaginationResult } from '../interfaces/pagination-result.interface';
import { ISearch } from '../interfaces/flight-report-dashboard/search.interface';

const getAuthenticate = async () => {
  const data = await httpAviationReportingAuthentication.post<string>(
    '/authentication/authenticate',
    {
      username: 'andrew.mitchell',
      password: 'password',
    }
  );

  return data;
};

//Search
const getSearch = async (objISearch: ISearch) => {
  const params = JSON.stringify({
    search: objISearch.search,
    sortBy: objISearch.sortBy,
    sortOrder: objISearch.sortOrder,
    filterBy: {
      contractNumber: objISearch.filterBy?.contractNumber,
      status: objISearch.filterBy?.status
    },
    paginationInfo: {
      perPage: objISearch.pagination.perPage,
      page: objISearch.pagination.page,
    },
  });

  const data = await httpAviationReporting.post<
    IPaginationResult<IFlightReportDashboard>
  >('/flight-report-dashboard/cost', params, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('api_token')}`,
    },
  });

  return data;
};

export const FlightReportDashboardService = {
  getAuthenticate,
  getSearch,
};
