import { IInvoiceListSearchResult } from '@/interfaces/invoicing/invoice-list-data';
import { GoABlock, GoAButton, GoADropdown, GoADropdownItem, GoASpacer, GoATable, GoATableSortHeader } from '@abgov/react-components';
import React, { useEffect, useState } from 'react';
import styles from '@/features/invoicing/invoice-list-search-result.module.scss';
import { yearMonthDay } from '@/common/dates';
import { convertToCurrency } from '@/common/currency';
import { RecordsPerPageOptionItems } from '@/common/types/custom-types';
const { checkboxControl, checkboxHeader, roboto, headerRow, dropdownContainer, spacer, toolbar, footerRecordCount, headerRowCurrency } = styles;

interface IInvoiceListSearchResultsProps {
  searchResults: IInvoiceListSearchResult[];
}
const InvoiceListSearchResults: React.FC<IInvoiceListSearchResultsProps> = (props) => {
  const [results, setResults] = useState(props?.searchResults);
  const [pageResults, setPageResults] = useState<IInvoiceListSearchResult[]>([]);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10);
  const [page, setPage] = useState(1);
  //const [perPage] = useState(recordsPerPage);


  const contractSearchResultColumns: { value: string; label: string }[] = [
    { value: 'invoiceAge', label: 'Age' },
    { value: 'invoiceReceivedDate', label: 'Received date' },
    { value: 'invoiceDate', label: 'Invoice date' },
    { value: 'vendorName', label: 'Vendor' },
    { value: 'invoiceNumber', label: 'Invoice' },
    { value: '', label: 'Registration' },
    { value: 'invoiceStatus', label: 'Status' },
    { value: 'uniqueServiceSheetName', label: 'SES' },
    { value: '', label: '' },
    { value: 'invoiceAmount', label: 'Amount' },
  ];

  useEffect(() => {
    const sortedData = sort(contractSearchResultColumns[0].value, 0, props.searchResults);
    setResults(sortedData);
    setPageResults(sortedData?.slice(0, recordsPerPage));

  }, [props.searchResults, recordsPerPage]);

  function sort(sortBy: string, sortDir: number, rows: IInvoiceListSearchResult[]): IInvoiceListSearchResult[] {
    rows.sort((a: IInvoiceListSearchResult, b: IInvoiceListSearchResult) => {
      const varA = a[sortBy as keyof IInvoiceListSearchResult];
      const varB = b[sortBy as keyof IInvoiceListSearchResult];
      if (typeof varA === 'string' && typeof varB === 'string') {
        const res = varB.localeCompare(varA);
        return res * sortDir;
      }
      if (varA === varB) {
        return 0;
      }
      return (varA > varB ? 1 : -1) * sortDir;
    });
    return rows.slice().map((x) => {
      return x;
    });
  }

  function sortData(sortBy: string, sortDir: number) {
    const sortedData = sort(sortBy, sortDir, results);
    setResults(sortedData.slice());
    setPageResults(sortedData.slice(0, recordsPerPage));
    //setPage(1);
  }

  function changePage(newPage: number) {
    if (newPage) {
      const offset = (newPage - 1) * recordsPerPage;
      const pagedResults = results.slice(offset, offset + recordsPerPage);
      setPage(newPage);
      setPageResults(pagedResults);
    }
  }

  function getTotalPages() {
    const num = results ? Math.ceil(results.length / recordsPerPage) : 0;

    return num;
  }

  function isNextDisabled() {
    const num = results ? Math.ceil(results.length / recordsPerPage) : 0;

    return !num || page === num;
  }

  function previous() {
    const newPage = Math.max(0, page - 1);
    changePage(newPage);
  }
  function next() {
    const newPage = Math.min(getTotalPages(), page + 1);
    changePage(newPage);
  }

  function onChangeOfNumberOfRecordsPerPage(name: string, type: string | string[]) {
    changePage(1);
    setRecordsPerPage(Number(type));
  }

  return (
    <div className='divTable'>
      <GoATable onSort={sortData} mb='l'>
        <thead>
          <tr>
            <th className={checkboxHeader}>
              <input
                className={checkboxControl}
                type='checkbox'
                name='selectAll'
                checked={false}
                disabled
              ></input>
            </th>
            <th className={headerRow}>
              <GoATableSortHeader name={contractSearchResultColumns[0].value} >{contractSearchResultColumns[0].label}</GoATableSortHeader>
            </th>
            <th className={headerRow}>
              <GoATableSortHeader name={contractSearchResultColumns[1].value}>{contractSearchResultColumns[1].label}</GoATableSortHeader>
            </th>
            <th className={headerRow}>
              <GoATableSortHeader name={contractSearchResultColumns[2].value}>{contractSearchResultColumns[2].label}</GoATableSortHeader>
            </th>
            <th className={headerRow}>
              <GoATableSortHeader name={contractSearchResultColumns[3].value}>{contractSearchResultColumns[3].label}</GoATableSortHeader>
            </th>
            <th className={headerRow}>
              {contractSearchResultColumns[4].label}
            </th>
            <th className={headerRow}>
              <GoATableSortHeader name={contractSearchResultColumns[5].value}>{contractSearchResultColumns[5].label}</GoATableSortHeader>
            </th>
            <th className={headerRow}>
              <GoATableSortHeader name={contractSearchResultColumns[6].value}>{contractSearchResultColumns[6].label}</GoATableSortHeader>
            </th>
            <th className={headerRow}>
              <GoATableSortHeader name={contractSearchResultColumns[7].value}>{contractSearchResultColumns[7].label}</GoATableSortHeader>
            </th>
            <th className={headerRow}>
              {contractSearchResultColumns[8].label}
            </th>
            <th className={headerRowCurrency}>
              <GoATableSortHeader name={contractSearchResultColumns[9].value}>{contractSearchResultColumns[9].label}</GoATableSortHeader>
            </th>
          </tr>
        </thead>
        <tbody className='table-body'>
          {pageResults?.map((result, idx) => (
            <tr key={idx}>
              <td style={{ padding: '12px 0 12px 32px' }}>
                <input
                  className={checkboxControl}
                  type='checkbox'
                  checked={false}
                  disabled
                ></input>
              </td>
              <td>{result.invoiceAge < 10 ? result.invoiceAge.toString().padStart(2, '0') : result.invoiceAge.toString()}</td>
              <td>{yearMonthDay(result.invoiceReceivedDate)}</td>
              <td>{yearMonthDay(result.invoiceDate)}</td>
              <td>{result.vendorName}</td>
              <td>{result.invoiceNumber}</td>
              <td></td>
              <td>{result.invoiceStatus}</td>
              <td>{result.uniqueServiceSheetName}</td>
              <td></td>
              <td className={roboto}>{convertToCurrency(result.invoiceAmount)}</td>
            </tr>
          ))}
        </tbody>
      </GoATable>

      {pageResults && pageResults.length > 0 && (
        <GoABlock alignment='center'>
          <div>
            <div className={toolbar}>
              <div className={spacer} style={{ padding: '10px 10px 2px 12px' }}>Show</div>
              <div className={dropdownContainer}>
                <GoADropdown name='InvoiceAgeOption' value={recordsPerPage.toString()} onChange={onChangeOfNumberOfRecordsPerPage}>
                  {RecordsPerPageOptionItems.map((type, idx) => (
                    <GoADropdownItem key={idx} value={type.value} label={type.label} />
                  ))}
                </GoADropdown>
              </div>
              <span className={footerRecordCount}>of</span>
              <span className={footerRecordCount}>{results?.length} </span>
              <span className={footerRecordCount}>items</span>
            </div>
          </div>
          <GoASpacer hSpacing='fill' />
          <GoABlock mb='m' alignment='center' gap='m'>
            <GoABlock>
              <GoAButton type='tertiary' leadingIcon='arrow-back' onClick={previous} disabled={page === 1} >
                Previous
              </GoAButton>
              <GoAButton type='tertiary' trailingIcon='arrow-forward' onClick={next} disabled={isNextDisabled()}>
                Next
              </GoAButton>
            </GoABlock>
          </GoABlock>
        </GoABlock>
      )}
    </div>
  );
};
export default InvoiceListSearchResults;
