import {
  GoAContainer,
  GoADropdown,
  GoADropdownItem,
  GoAIcon,
  GoAInput,
  GoAInputSearch,
  GoAInputText,
  GoATable,
} from '@abgov/react-components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import searchService from '@/services/search-service';
import styles from './utilization.module.scss';
import { PagingRequest } from '@/models/paging-request';
import { ContractType } from '@/types/contract-type';
import SearchResults from '@/components/search-results';
import { SearchResponse } from '@/models/search-response';

let { search } = styles;

export default function Utilization() {
  const navigate = useNavigate();

  const header = 'Contract Utilization';
  const [contractType, setContractType] = useState('Both');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResponse, setSearchResponse] = useState(new SearchResponse());
  const typeItems: { value: ContractType; label: string }[] = [
    { value: 'Both', label: 'All Types' },
    { value: 'Casual', label: 'Casual Only' },
    { value: 'LongTerm', label: 'Long-Term Only' },
  ];
  const paging = new PagingRequest();
  // Intent is to use this until goa input allows keydown handling
  useEffect(() => {
    const element = document.querySelector('#searchInput');
    if (element) {
      console.log('element exists');
      element.addEventListener('keydown', onKeyDown);
    }
    return () => {
      if (element) {
        element.removeEventListener('keydown', onKeyDown);
      }
    };
  });

  function onSearchTermChange(name: string, term: string) {
    setSearchTerm(term);
  }
  function onChangeContractType(name: string, type: string | string[]) {
    setContractType(type as string);
    performSearch();
  }
  function onKeyDown(event: any) {
    if (event.keyCode === 13) {
      performSearch();
    }
  }
  function performSearch() {
    searchService
      .search({
        searchTerm: searchTerm,
        contractType: contractType as ContractType,
        ...paging,
      })
      .then((fetchedData: SearchResponse) => {
        setSearchResponse(fetchedData);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  return (
    <main>
      <h2>{header}</h2>
      <div className={search}>
        <GoAInput
          id='searchInput'
          leadingIcon='search'
          onChange={onSearchTermChange}
          value={searchTerm}
          name='searchInput'
          type='search'
        />
      </div>

      <GoADropdown
        name='contractType'
        value={contractType}
        onChange={onChangeContractType}
      >
        {typeItems.map((type, idx) => (
          <GoADropdownItem key={idx} value={type.value} label={type.label} />
        ))}
      </GoADropdown>

      <SearchResults searchResponse={searchResponse}></SearchResults>
    </main>
  );
}
