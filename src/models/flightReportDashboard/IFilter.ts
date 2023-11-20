import { IForestArea } from "./ICorporateRegion";

export interface IFilter{
    columnName: string,
    columnValue: string,
    reportDateFrom?:string | null,
    reportDateTo?:string | null,
    corporateRegions?:IForestArea,
    negotiated?:boolean
};