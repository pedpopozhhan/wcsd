import { Fragment, useEffect, useState } from 'react';
import PageLoader from '@/common/page-loader';
import { publishToast } from '@/common/toast';
import Summary from '../invoice-details/summary';
import styles from './processed-invoice.module.scss';
import { GoAButton, GoAIcon } from '@abgov/react-components';
import Totalizer from '../process-invoice/invoice-amount-totalizer';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ServiceSheetTab from '../process-invoice/tabs/service-sheet-tab';
import DetailsTab from '../process-invoice/tabs/details-tab';

import { IDetailsTableRow } from '../invoice-details/details-table-row.interface';
import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
import { useAppDispatch, useAppSelector } from '@/app/hooks';

import { IProcessedInvoiceData } from '@/interfaces/processed-invoice/processed-invoice-data';
import processedInvoiceDetailService from '@/services/processed-invoice-detail.service';
import { setServiceSheetData, setcostDetailsData, setotherCostsData, setReadOnly } from '../process-invoice/tabs/process-invoice-tabs-slice';
import { IServiceSheetData } from '@/interfaces/common/service-sheet-data';

export default function ProcessedInvoice() {
    const { invoiceKey } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    // const reconciledData = useLocation();
    // const timeReportData: IDetailsTableRow[] = reconciledData.state.timeReportData;
    // const invoiceTimeReportData = timeReportData.map((i) => i.data);

    const otherCostData: IOtherCostTableRowData[] | undefined = useAppSelector((state) => state.processInvoiceTabs.otherCostsData);
    const serviceSheetData: IServiceSheetData | undefined = useAppSelector((state) => state.processInvoiceTabs.serviceSheetData);
    const readonly: boolean | undefined = useAppSelector((state) => state.processInvoiceTabs.readonly);
    const invoiceId: string = useAppSelector((state) => state.processInvoiceTabs.invoiceceId);
    const invoiceAmount: number = useAppSelector((state) => state.processInvoiceTabs.invoiceAmount);

    // const showSavedInvoiceNotification = useAppSelector((state) => state.processInvoiceNotification.showInvoiceSavedNotification);
    const invoiceData = useAppSelector((state) => state.app.invoiceData);
    //const serviceSheet = useAppSelector((state) => state.serviceSheetData);
    const [invoiceDetail, setInvoiceDetail] = useState<IProcessedInvoiceData>();
    const serviceSheet = useState([invoiceDetail?.invoiceServiceSheet]);
    const contractDetails = useAppSelector((state) => state.app.contractForReconciliation);
    const [loading, setIsLoading] = useState(true);


    let {
        container,
        content,
        sideBar,
        main,
        footer,
        header,
        tabGroupContainer,
        tabList,
        tabContainer,
        summaryContainer,
    } = styles;

    const [tabIndex, setTabIndex] = useState<number>(1);

    function navigateToTimeReports() {
        navigate(`/VendorTimeReports/${contractDetails.contractNumber}`, {
            state: contractDetails.contractNumber,
        });
    }


    // useEffect(() => {
    //     const subscription = processedInvoiceDetailService.getInvoiceDetail(Number(invoiceKey)).subscribe({
    //         next: (results) => {
    //             setIsLoading(true);
    //             setInvoiceDetail(results);
    //             dispatch(setServiceSheetData(invoiceDetail?.invoiceServiceSheet));
    //             setIsLoading(false);
    //         },
    //         error: (error) => {
    //             console.error(error);
    //             publishToast({ type: 'error', message: `Server error` });
    //         },
    //     });
    //     return () => {
    //         subscription.unsubscribe();
    //     };
    // }, [Number(invoiceKey)]);


    return (
        <div className={container}>
            <div className={content}>
                <div className={sideBar}>
                    <div className={header}>Invoice </div>
                    <Totalizer invoiceAmount={invoiceAmount} />
                    <div className={summaryContainer}>
                        <Summary />
                    </div>
                </div>
                <div className={main}>
                    <div className={tabGroupContainer}>
                        <div className={tabList}>
                            <button id='ServiceSheet' role='tab' aria-selected={tabIndex === 1} onClick={(e) => setTabIndex(1)}>
                                <span>Service sheet</span>
                            </button>
                            <button id='Details' role='tab' aria-selected={tabIndex === 2} onClick={(e) => setTabIndex(2)}>
                                <span>Details</span>
                            </button>
                        </div>
                        <div className={tabContainer}>
                            {tabIndex === 1 && <ServiceSheetTab InvoiceID={invoiceId} InvoiceAmount={invoiceAmount} />}
                            {tabIndex === 2 && <DetailsTab />}
                        </div>
                    </div>
                </div>
            </div>
            <div className={footer}>
                {(Number(invoiceKey) > 0) && (<Fragment><GoAButton type='primary' disabled >
                    <label>Update</label>
                </GoAButton>
                    <GoAButton type='secondary' onClick={navigateToTimeReports}>
                        Close
                    </GoAButton></Fragment>)}

            </div>
        </div>
    );
};

