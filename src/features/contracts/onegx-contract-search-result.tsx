import { IOneGxContractRowData } from '@/interfaces/contract-management/onegx-contract-search-row-data';
import { GoABlock, GoAButton, GoASpacer, GoATable, } from '@abgov/react-components';
import React, { useEffect, useState } from 'react';
import styles from '@/features/contracts/onegx-contract-search-result.module.scss';
const { number, tableContainer } = styles;

interface IOneGxContractSearchResultsProps {
  searchResults: IOneGxContractRowData[];
}
const OneGxContractSearchResults: React.FC<IOneGxContractSearchResultsProps> = (props) => {
  const [results, setResults] = useState(props.searchResults);
  const [pageResults, setPageResults] = useState<IOneGxContractRowData[]>([]);

  const contractSearchResultColumns: { value: string; label: string }[] = [
    { value: 'vendor', label: 'Vendor' },
    { value: 'businessId', label: 'Business ID.' },
    { value: 'contractNumber', label: 'Contract No.' },
    { value: 'contractType', label: 'Type' },
  ];

  useEffect(() => {
    setResults(props.searchResults);
    setPageResults(props.searchResults?.slice(0, perPage));
    setPage(1);
  }, [props.searchResults]);

  function sortData(sortBy: string, sortDir: number) {
    results.sort((a: IOneGxContractRowData, b: IOneGxContractRowData) => {
      const varA = a[sortBy as keyof IOneGxContractRowData];
      const varB = b[sortBy as keyof IOneGxContractRowData];
      if (typeof varA === 'string' && typeof varB === 'string') {
        const res = varB.localeCompare(varA);
        return res * sortDir;
      }
      return (varA > varB ? 1 : -1) * sortDir;
    });
    setResults(results.slice());
    setPageResults(results.slice(0, perPage));
    setPage(1);
  }

  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  function changePage(newPage: number) {
    if (newPage) {
      const offset = (newPage - 1) * perPage;
      const pagedResults = results.slice(offset, offset + perPage);
      setPage(newPage);
      setPageResults(pagedResults);
    }
  }

  function getTotalPages() {
    const num = results ? Math.ceil(results.length / perPage) : 0;

    return num;
  }

  function isNextDisabled() {
    const num = results ? Math.ceil(results.length / perPage) : 0;

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

  return (
    <div className={tableContainer}>
      <GoATable onSort={sortData} mb='xl' width='100%'>
        <thead>
          <tr>
            <th style={{ verticalAlign: 'middle', width: '40%' }}>{contractSearchResultColumns[0].label}</th>
            <th style={{ verticalAlign: 'middle' }}>{contractSearchResultColumns[1].label}</th>
            <th style={{ verticalAlign: 'middle' }}>{contractSearchResultColumns[2].label}</th>
            <th style={{ verticalAlign: 'middle' }}>{contractSearchResultColumns[3].label}</th>
          </tr>
        </thead>
        <tbody>
          {pageResults?.map((result, idx) => (
            <tr key={idx}>
              <td>{result.supplierName}</td>
              <td className={number}>{result.supplierid}</td>
              <td className={number}>{result.contractNumber}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </GoATable>

      {pageResults && pageResults.length > 0 && (
        <GoABlock alignment='center'>
          <div style={{ display: 'flex', alignSelf: 'center' }}>
            <span style={{ whiteSpace: 'nowrap' }}>
              Page {page} of {getTotalPages()}
            </span>
          </div>
          <GoASpacer hSpacing='fill' />
          <GoABlock mb='m' alignment='center' gap='m'>
            <GoABlock>
              <GoAButton type='tertiary' leadingIcon='arrow-back' onClick={previous} disabled={page === 1}>
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
export default OneGxContractSearchResults;
