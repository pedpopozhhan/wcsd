export interface ICorporateRegion{
    corporateRegionId:string,
    crt_id:string,
    name:string,
    effective_date:string | undefined,
    termination_date?:string | undefined,

    create_userid?:string | undefined,
    create_timestamp?:Date | undefined,
    update_timestamp?:Date | undefined,
    update_userid?: string | undefined,   
} 

export interface IForestArea {
    corporateRegionId:string[],
}