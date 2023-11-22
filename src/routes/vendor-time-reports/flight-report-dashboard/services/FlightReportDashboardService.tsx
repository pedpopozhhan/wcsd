import {httpAviationReporting, httpAviationReportingAuthentication} from "../../../../http-common";
import { IFlightReportDashboard } from "../interfaces/IFlightReportDashboard" ;
import { IPaginationResult } from "../interfaces//IPaginationResult";
import { ISearch } from "../interfaces/ISearch";


const getAuthenticate = async () => {
  const data = await httpAviationReportingAuthentication.post<string>(
    "/authentication/authenticate",
    {
      username: "andrew.mitchell",
      password: "password",
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
      columnName: objISearch.filterBy?.columnName,
      columnValue: objISearch.filterBy?.columnValue,
      reportDateFrom:objISearch.filterBy?.reportDateFrom,
      reportDateTo:objISearch.filterBy?.reportDateTo,
      corporateRegions:objISearch.filterBy?.corporateRegions,
    },
    paginationInfo: {
      perPage: objISearch.pagination.perPage,
      page: objISearch.pagination.page,
    },
  });

  const data = await httpAviationReporting.post<IPaginationResult<IFlightReportDashboard>>(
    "/flight-report-dashboard/get",
    params,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("api_token")}`,
      },
    }
  );
  
  return data;
};



export const FlightReportDashboardService = {
  getAuthenticate,
  getSearch
};
