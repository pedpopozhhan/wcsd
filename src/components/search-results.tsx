import { SearchResponse } from '@/models/search-response';
import { SearchResult, searchResultColumns } from '@/models/search-result';
import {
  GoABlock,
  GoAButton,
  GoADropdown,
  GoADropdownItem,
  GoAIcon,
  GoAPagination,
  GoASpacer,
  GoATable,
  GoATableSortHeader,
} from '@abgov/react-components';
import React, { useEffect, useState } from 'react';
import styles from './search-results.module.scss';
import { typeItems } from '@/types/contract-type';
let { link, chevron } = styles;
interface ISearchResultsProps {
  searchResults: SearchResult[];
}
const SearchResults: React.FC<ISearchResultsProps> = (props) => {
  const [results, setResults] = useState(props.searchResults);
  const [pageResults, setPageResults] = useState<SearchResult[]>([]);
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

  function previous() {
    const newPage = Math.max(0, page - 1);
    changePage(newPage);
  }
  function next() {
    const newPage = Math.min(getTotalPages(), page + 1);
    changePage(newPage);
  }

  function convertType(type: number) {
    return typeItems.find((x) => x.value === type.toString())?.label;
  }
  if (!results || results.length === 0) {
    return <React.Fragment></React.Fragment>;
  }
  return (
    <>
      <GoATable onSort={sortData} mb='xl'>
        <thead>
          <tr>
            <th style={{ verticalAlign: 'middle' }}>
              {/* <GoATableSortHeader name={searchResultColumns[0].value}> */}
              {searchResultColumns[0].label}
              {/* </GoATableSortHeader> */}
            </th>
            <th style={{ verticalAlign: 'middle' }}>
              {/* <GoATableSortHeader name={searchResultColumns[1].value}> */}
              {searchResultColumns[1].label}
              {/* </GoATableSortHeader> */}
            </th>
            <th style={{ verticalAlign: 'middle' }}>
              {/* <GoATableSortHeader name={searchResultColumns[2].value}> */}
              {searchResultColumns[2].label}
              {/* </GoATableSortHeader> */}
            </th>
            <th style={{ verticalAlign: 'middle' }}>
              {/* <GoATableSortHeader name={searchResultColumns[3].value}> */}
              {searchResultColumns[3].label}
              {/* </GoATableSortHeader> */}
            </th>
            <th className={link}>
              <GoATableSortHeader name={searchResultColumns[4].value}>
                {searchResultColumns[4].label}
              </GoATableSortHeader>
            </th>

            <th></th>
          </tr>
        </thead>
        <tbody>
          {pageResults?.map((result, idx) => (
            <tr key={idx}>
              <td>{result.vendor}</td>
              <td>{result.businessId}</td>
              <td>{result.contractId}</td>
              <td>{convertType(result.type)}</td>
              <td className={link}>
                <a>{result.numTimeReports}</a>
              </td>

              <td>
                <div className={chevron}>
                  <a>
                    <GoAIcon type='chevron-forward' />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </GoATable>
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
              disabled={page === getTotalPages()}
            >
              Next
            </GoAButton>
          </GoABlock>
        </GoABlock>
      </GoABlock>
    </>
  );
};
export default SearchResults;
