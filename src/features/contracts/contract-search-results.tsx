import { IContractSearchResult } from '@/interfaces/contracts/contract-search-result';
import { GoABlock, GoAButton, GoAIconButton, GoASpacer, GoATable } from '@abgov/react-components';
import React, { useEffect, useState } from 'react';
import styles from './contract-search-results.module.scss';
import { ContractType, convertContractType } from '@/common/types/contract-type';
const { chevron, number, tableContainer } = styles;
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/app/hooks';
import { setContractForReconciliation } from '@/app/app-slice';

interface IContractSearchResultsProps {
  searchResults: IContractSearchResult[];
}
const ContractSearchResults: React.FC<IContractSearchResultsProps> = (props) => {
  const [results, setResults] = useState(props.searchResults);
  const [pageResults, setPageResults] = useState<IContractSearchResult[]>([]);

  const dispatch = useAppDispatch();

  const contractSearchResultColumns: { value: string; label: string }[] = [
    { value: 'vendor', label: 'Vendor' },
    { value: 'businessId', label: 'Business No.' },
    { value: 'contractNumber', label: 'Contract No.' },
    { value: 'contractType', label: 'Type' },
    { value: 'downloadsAvail', label: 'Downloads available' },
  ];

  useEffect(() => {
    setResults(props.searchResults);
    setPageResults(props.searchResults?.slice(0, perPage));
    setPage(1);
  }, [props.searchResults]);

  function sortData(sortBy: string, sortDir: number) {
    results.sort((a: IContractSearchResult, b: IContractSearchResult) => {
      const varA = a[sortBy as keyof IContractSearchResult];
      const varB = b[sortBy as keyof IContractSearchResult];
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
  const navigate = useNavigate();

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

  function timeReportsClick(selectedVendor: IContractSearchResult) {
    dispatch(setContractForReconciliation(selectedVendor));
    if (selectedVendor.contractNumber) {
      navigate(`/invoice-processing/${selectedVendor.contractNumber}`, {
        state: selectedVendor.contractNumber,
      });
    }
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
            <th style={{ verticalAlign: 'middle' }}>{contractSearchResultColumns[0].label}</th>
            <th style={{ verticalAlign: 'middle' }}>{contractSearchResultColumns[1].label}</th>
            <th style={{ verticalAlign: 'middle' }}>{contractSearchResultColumns[2].label}</th>
            <th style={{ verticalAlign: 'middle' }}>{contractSearchResultColumns[3].label}</th>
            <th style={{ verticalAlign: 'middle' }}>{contractSearchResultColumns[4].label}</th>

            <th></th>
          </tr>
        </thead>
        <tbody>
          {pageResults?.map((result, idx) => (
            <tr key={idx}>
              <td>{result.vendorName}</td>
              <td className={number}>{result.businessId}</td>
              <td className={number}>
                <a onClick={() => timeReportsClick(result)}>{result.contractNumber}</a>
              </td>
              <td>{convertContractType(result.contractType as ContractType)}</td>
              <td>{result.downloadsAvailable}</td>
              <td>
                <div className={chevron}>
                  <GoAIconButton icon='chevron-forward' onClick={() => timeReportsClick(result)} />
                </div>
              </td>
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
export default ContractSearchResults;
