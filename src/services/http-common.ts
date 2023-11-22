import axios from "axios";

export const httpAviationReportingAuthentication = axios.create({
  baseURL: "https://wmttaviationapi.azurewebsites.net/api/",
});

//#region Aviation reporting Development
export const httpAviationReportingDev = axios.create({
  baseURL: "https://dev-aviation-reporting.azurewebsites.net/api/v1.0/",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('api_token')}`
  },
});

//#endregion Aviation reporting Development

export const httpAviationReporting = axios.create({
  baseURL: "https://wmtt-aviation-reporting-api.azurewebsites.net/api/v1.0/",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('api_token')}`
  },
});

export const httpDomainServiceAuthentication = axios.create({
  baseURL: "https://wmtt-domain-service.azurewebsites.net/api/",
});


export const httpDomainService = axios.create({
  baseURL: "https://wmtt-domain-service.azurewebsites.net/api/v1.0/",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('api_token')}`
  },
});

//#region "Local service"

export const httpLocalServiceAuthentication = axios.create({
  baseURL: "https://localhost:7038/api/authentication/authenticate",
  headers: {
    'Content-Type': 'application/json'
  },
});

export const httpLocalService = axios.create({
  baseURL: "https://localhost:7038/api/v1.0/",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('local_api_token')}`
  },
});

//#endregion "Local service"

//#region Authentication

export const httpBff = axios.create({
  baseURL: "https://bff.lerusystems.com",
  headers: {
    "X-CSRF": "1",
  },
  withCredentials: true
});

//#endregion Authentication