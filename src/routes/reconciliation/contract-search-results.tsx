import { IContractSearchResult } from '@/interfaces/reconciliation/contract-search-result'
import {
  GoABlock,
  GoAButton,
  GoAIconButton,
  GoASpacer,
  GoATable,
} from '@abgov/react-components';
import React, { useEffect, useState, useContext } from 'react';
import { MainContext } from '@/common/main-context';
import styles from './search-results.module.scss';
import { ContractType, convertContractType } from '@/types/contract-type';
let { link, table, chevron, number } = styles;
import { useNavigate } from 'react-router-dom';

interface IContractSearchResultsProps {
  searchResults: IContractSearchResult[];
}
const ContractSearchResults: React.FC<IContractSearchResultsProps> = (props) => {
  const [results, setResults] = useState(props.searchResults);
  const [pageResults, setPageResults] = useState<IContractSearchResult[]>([]);

  const mainContext = useContext(MainContext);
  const { setVendorForReconciliation } = mainContext;

  const contractSearchResultColumns: { value: string; label: string }[] = [
    { value: 'vendor', label: 'Vendor' },
    { value: 'businessId', label: 'Business No.' },
    { value: 'contractNumber', label: 'Contract No.' },
    { value: 'contractType', label: 'Type' },
    { value: 'numTimeReports', label: 'Time Reports' },
  ];

  let totalPages = 0;
  useEffect(() => {
    setResults(props.searchResults);
    setPageResults(props.searchResults?.slice(0, perPage));
    setPage(1);
  }, [props.searchResults]);

  function sortData(sortBy: string, sortDir: number) {
    results.sort((a: any, b: any) => {
      const varA = a[sortBy];
      const varB = b[sortBy];
      if (typeof varA === 'string' || typeof varB === 'string') {
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
  const [perPage, setPerPage] = useState(10);
  const navigate = useNavigate();

  function changePage(newPage: any) {
    if (newPage) {
      const offset = (newPage - 1) * perPage;
      const pagedResults = results.slice(offset, offset + perPage);
      setPage(newPage);
      setPageResults(pagedResults);
    }
  }
  function changePerPage(name: any, value: any) {
    const newPerPage = parseInt(value, 10);
    const offset = (page - 1) * newPerPage;
    const pagedResults = results.slice(offset, offset + newPerPage);
    setPageResults(pagedResults);
    setPerPage(newPerPage);
  }

  function getTotalPages() {
    let num = results ? Math.ceil(results.length / perPage) : 0;

    return num;
  }

  function isNextDisabled() {
    let num = results ? Math.ceil(results.length / perPage) : 0;

    return !num || page === num;
  }

  function timeReportsClick(selectedVendor: IContractSearchResult) {
    setVendorForReconciliation(selectedVendor);
    if (selectedVendor.contractNumber) {
      navigate(`/VendorTimeReports/${selectedVendor.contractNumber}`, {
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

  //   function convertContractType(type: string) {
  //     return typeItems.find((x) => x.value === type)?.label;
  //   }

  return (
    <>
      {/* <div className={table}> */}
      <GoATable onSort={sortData} mb='xl' width='100%'>
        <thead>
          <tr>
            <th style={{ verticalAlign: 'middle' }}>
              {/* <GoATableSortHeader name={searchResultColumns[0].value}> */}
              {contractSearchResultColumns[0].label}
              {/* </GoATableSortHeader> */}
            </th>
            <th style={{ verticalAlign: 'middle' }}>
              {/* <GoATableSortHeader name={searchResultColumns[1].value}> */}
              {contractSearchResultColumns[1].label}
              {/* </GoATableSortHeader> */}
            </th>
            <th style={{ verticalAlign: 'middle' }}>
              {/* <GoATableSortHeader name={searchResultColumns[2].value}> */}
              {contractSearchResultColumns[2].label}
              {/* </GoATableSortHeader> */}
            </th>
            <th style={{ verticalAlign: 'middle' }}>
              {/* <GoATableSortHeader name={searchResultColumns[3].value}> */}
              {contractSearchResultColumns[3].label}
              {/* </GoATableSortHeader> */}
            </th>
            {/* Hide this for now
             <th className={link}>
              <GoATableSortHeader name={searchResultColumns[4].value}>
                {searchResultColumns[4].label}
              </GoATableSortHeader>
            </th> */}

            <th></th>
          </tr>
        </thead>
        <tbody>
          {pageResults?.map((result, idx) => (
            <tr key={idx}>
              <td>{result.vendorName}</td>
              <td className={number}>{result.businessId}</td>
              <td className={number}>
                <a onClick={() => timeReportsClick(result)}>
                  {result.contractNumber}
                </a>
              </td>
              <td>
                {convertContractType(result.contractType as ContractType)}
              </td>
              {/* Hide this for now
              <td className={link}>
                <a>{result.numTimeReports}</a>
              </td> */}
              <td>
                <div className={chevron}>
                  <GoAIconButton
                    icon='chevron-forward'
                    onClick={() => timeReportsClick(result)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </GoATable>
      {/* </div> */}
      <GoABlock alignment='center'>
        <div style={{ display: 'flex', alignSelf: 'center' }}>
          <span style={{ whiteSpace: 'nowrap' }}>
            Page {page} of {getTotalPages()}
          </span>
        </div>
        <GoASpacer hSpacing='fill' />
        <GoABlock mb='m' alignment='center' gap='m'>
          <GoABlock>
            <GoAButton
              type='tertiary'
              leadingIcon='arrow-back'
              onClick={previous}
              disabled={page === 1}
            >
              Previous
            </GoAButton>
            <GoAButton
              type='tertiary'
              trailingIcon='arrow-forward'
              onClick={next}
              disabled={isNextDisabled()}
            >
              Next
            </GoAButton>
          </GoABlock>
        </GoABlock>
      </GoABlock>
    </>
  );
};
export default ContractSearchResults;