import { GoATable, GoATableSortHeader } from '@abgov/react-components';
import styles from '@/features/process-invoice/tabs/invoice-cost-details-table.module.scss';
import { yearMonthDay } from '@/common/dates';
import { convertToCurrency } from '@/common/currency';
import { ITimeReportDetailsTableRowData } from '@/interfaces/invoice-details/time-report-details-table-row-data';
import { useAppDispatch, useAppSelector } from '@/app/hooks';


let { container, checkboxWrapper, buttonWrapper, tableContainer, stickyColumn, start, end, onTop } = styles;
interface IDetailsTabProps {
    data: ITimeReportDetailsTableRowData[];
}
const InvoiceCostDataTable: React.FC<IDetailsTabProps> = (props) => {

    const dispatch = useAppDispatch();
    const rowData = useAppSelector((state) => state.invoiceDetails.rowData);

    function sortData(sortBy: string, sortDir: number) {
        const data = [...rowData];
        const sorted = data.sort((a: any, b: any) => {
            const varA = a.data[sortBy];
            const varB = b.data[sortBy];
            if (typeof varA === 'string' || typeof varB === 'string') {
                const res = varB.localeCompare(varA);
                return res * sortDir;
            }
            if (varA === varB) {
                return 0;
            }
            return (varA > varB ? 1 : -1) * sortDir;
        });
    }

    return (
        <div className={container}>
            <div className={tableContainer}>
                <GoATable onSort={sortData} width='100%'>
                    <thead>
                        <tr>
                            <th>
                                <GoATableSortHeader name={'flightReportDate'}>Date</GoATableSortHeader>
                            </th>
                            <th>Reg no.</th>
                            <th>Report no.</th>
                            <th>AO02 no.</th>
                            <th>Rate type</th>
                            <th>
                                <GoATableSortHeader name={'noOfUnits'}>No. of Units</GoATableSortHeader>
                            </th>
                            <th>Rate unit</th>
                            <th>
                                <GoATableSortHeader name={'ratePerUnit'}>Rate / unit</GoATableSortHeader>
                            </th>
                            <th>
                                <GoATableSortHeader name={'cost'}>Cost</GoATableSortHeader>
                            </th>
                            <th>Internal order</th>
                            <th>Cost centre</th>
                            <th>Fund</th>
                            <th>G/L acct</th>
                            <th>Fire no.</th>
                            <th className={`${stickyColumn} ${end} ${onTop}`}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rowData.map((x, index) => (
                            <tr key={index}>

                                <td>{yearMonthDay(x.data.flightReportDate)}</td>
                                <td>{x.data.contractRegistrationName}</td>
                                <td>{x.data.flightReportId}</td>
                                <td>{x.data.aO02Number}</td>
                                <td>{x.data.rateType}</td>
                                <td>{x.data.noOfUnits}</td>
                                <td>{x.data.rateUnit}</td>
                                <td>{convertToCurrency(x.data.ratePerUnit)}</td>
                                <td>{convertToCurrency(x.data.cost)}</td>
                                <td>{x.data.internalOrder}</td>
                                <td>{x.data.costCenter}</td>
                                <td>{x.data.fund}</td>
                                <td>{x.data.glAcct}</td>
                                <td>{x.data.fireNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </GoATable>
            </div>
        </div>
    );

}
export default InvoiceCostDataTable;
