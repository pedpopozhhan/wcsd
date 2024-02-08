import { GoATable, GoAButton, GoABlock, GoASpacer, GoAPagination, GoATableSortHeader, GoAIconButton } from '@abgov/react-components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLoader from '../page-loader';
import { IProcessedInvoiceTableRowData } from '@/interfaces/flight-report-dashboard/processed-invoice-table-row-data';
import { yearMonthDay } from '@/common/dates';
import processedInvoicesService from '@/services/processed-invoices.service';
import { useAppDispatch } from '@/app/hooks';
import { setTimeReportsToReconcile } from '@/app/app-slice';

interface IFlightReportAllProps {
    contractNumber: string | undefined;
    searchValue?: string;
    onClickFlightReport?: (flightReportId: number) => void;
}

const ProcessedTabDetails: React.FunctionComponent<IFlightReportAllProps> = ({ contractNumber, searchValue, onClickFlightReport, ...props }) => {
    //Object for the page data
    const [pageData, setPageData] = useState<IProcessedInvoiceTableRowData[]>([]);

    //Navigation
    const navigate = useNavigate();
    //Data set
    const [data, setData] = useState<IProcessedInvoiceTableRowData[]>([]);

    //Loader
    const [loading, setIsLoading] = useState(true);

    //Pagination

    // page number
    const [page, setPage] = useState(1);
    //count per page
    const [perPage, setPerPage] = useState(10);
    const [previousSelectedPerPage, setPreviousSelectedPerPage] = useState(10);

    //Sorting
    const [sortCol, setSortCol] = useState('invoiceDate');
    const [sortDir, setSortDir] = useState(-1);
    const [isSorting, setIsSorting] = useState(false);

    const [contractID, setContractID] = useState<string | undefined>(contractNumber);

    const dispatch = useAppDispatch();

    // useEffect(() => {
    //     // let strSearchValue = searchValue ? searchValue.toLowerCase() : '';
    //     // let sortOrder = sortDir === -1 ? 'ASC' : 'DESC';

    //     // let objIPagination: IPagination = {
    //     //     perPage: perPage,
    //     //     page: page,
    //     // };

    //     // let objIFilter: IFilter = {
    //     //     contractNumber: contractNumber,
    //     //     status: 'approved',
    //     // };

    //     // let objISearch: ISearch = {
    //     //     search: strSearchValue,
    //     //     sortBy: sortCol,
    //     //     sortOrder: sortOrder,
    //     //     filterBy: objIFilter,
    //     //     pagination: objIPagination,
    //     // };
    //     // setIsLoading(true);
    //     // const subscription = processedInvoicesService.getInvoices(String(contractID)).subscribe((response) => {

    //     //     setData(response.invoices);
    //     //     // sort by what default
    //     //     setPageData(response.invoices.slice(0, perPage));
    //     //     setIsLoading(false);
    //     // });

    //     // return () => {
    //     //     subscription.unsubscribe();
    //     // };
    // }, [page, perPage, searchValue, sortCol, sortDir, contractNumber]);

    useEffect(() => {
        const subscription = processedInvoicesService.getInvoices(String(contractID)).subscribe({
            next: (results) => {
                const data = results.invoices.slice().map((x, i) => {
                    return {
                        index: i,
                        data: x,
                    };
                });
                //dispatch(setRowData(data));
                setData(results.invoices);
                // sort by what default
                setPageData(results.invoices.slice(0, perPage));
                setIsLoading(false);
            },
            error: (error) => {
                // TODO: display an error message the right way
                console.error(error);
            },
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [contractID]);
    // page, perPage, searchValue, sortCol, sortDir, 

    function sortData(sortBy: string, sortDir: number) {
        data.sort((a: any, b: any) => {
            const varA = a[sortBy];
            const varB = b[sortBy];
            if (typeof varA === 'string' || typeof varB === 'string') {
                const res = varB.localeCompare(varA);
                return res * sortDir;
            }
            return (varA > varB ? 1 : -1) * sortDir;
        });
        setData(data.slice());
        setPageData(data.slice(0, perPage));
        setPage(1);
        setSortCol(sortBy);
        setSortDir(sortDir);
        setPreviousSelectedPerPage(perPage);
    }
    function getTotalPages() {
        let num = data ? Math.ceil(data.length / perPage) : 0;
        return num;
    }

    //Pagination change page
    function changePage(newPage: any) {
        if (newPage) {
            setIsLoading(true);
            const offset = (newPage - 1) * perPage;
            const _processedInvoices = data.slice(offset, offset + perPage);
            setPerPage(perPage);
            setPage(newPage);
            setPageData(_processedInvoices);
            setIsLoading(false);
        }
    }

    //#endregion

    function invoiceIdClick(invoiceId?: number) {
        if (invoiceId) {
            alert('Invoice ID:' + invoiceId);
        }
    }

    const formatter = new Intl.NumberFormat('default', {
        style: 'currency',
        currency: 'USD',
    });

    return (
        <>
            <PageLoader visible={loading} />
            <div>
                <div className='divTable'>
                    <GoATable onSort={sortData} width='100%'>
                        <thead>
                            <tr>
                                <th style={{ maxWidth: '20%' }}>
                                    <GoATableSortHeader name='flightReportDate'>Invoice Date</GoATableSortHeader>
                                </th>
                                <th style={{ maxWidth: '20%' }}>
                                    Invoice No.
                                </th>
                                <th style={{ maxWidth: '20%' }}>
                                    Invoice Amount
                                </th>
                                <th style={{ maxWidth: '20%' }}>
                                    Payment
                                </th>
                                <th style={{ maxWidth: '20%', textAlign: 'right' }}></th>
                            </tr>
                        </thead>

                        <tbody style={{ position: 'sticky', top: 0 }} className='table-body'>
                            {pageData && pageData.length > 0 ? (
                                pageData.map((record: any, index: any) => (
                                    <tr key={record.invoiceId}>
                                        <td>{yearMonthDay(record.invoiceDate as string)}</td>
                                        <td>
                                            <GoAButton
                                                {...{ style: '"padding: 0 10px 0 10px;height: 90px;"' }}
                                                size='compact'
                                                type='tertiary'
                                                onClick={() => invoiceIdClick(record?.invoiceId)}
                                            >
                                                {record.invoiceNumber}
                                            </GoAButton>
                                        </td>
                                        <td>{record.invoiceAmount}</td>
                                        <td>{record?.type}</td>
                                        <td>
                                            <GoAIconButton icon='chevron-forward' onClick={() => invoiceIdClick(record?.invoiceId)} />
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

                <div className={data && data.length > 0 ? 'visible pagination' : 'not-visible pagination'} style={{ paddingTop: '50px' }}>
                    <GoABlock alignment='center'>
                        <div style={{ display: 'flex', alignSelf: 'center' }}>
                            <span style={{ whiteSpace: 'nowrap' }}>
                                Page {page} of {getTotalPages()}
                            </span>
                        </div>
                        <GoASpacer hSpacing='fill' />

                        <GoAPagination
                            variant='links-only'
                            itemCount={data.length}
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

export default ProcessedTabDetails;
