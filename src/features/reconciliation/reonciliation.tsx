import { GoADropdown, GoADropdownItem, GoAIcon } from '@abgov/react-components';
import { useEffect, useState } from 'react';
import styles from './reconciliation.module.scss';
import { ContractType, typeItems } from '@/types/contract-type';
import { IContractSearchResult } from '@/interfaces/reconciliation/contract-search-result';
import searchService from '@/services/reconciliation-search.service';
import { useLocation } from 'react-router-dom';
import { SearchOption } from './search-option';
import SearchSuggestion from './search-suggestion';
import ContractSearchResults from './contract-search-results';
import { useAppDispatch } from '@/app/hooks';
import { failedToPerform, publishToast } from '@/common/toast';

let { top, search, invoiceProcessedNotificationContainer, invoiceProcessedNotificationLabel, searchResultsContainer } = styles;

export default function Reconciliation() {
  const header = 'Contracts';
  const dispatch = useAppDispatch();
  const [searchResults, setSearchResults] = useState([] as IContractSearchResult[]);
  const [allData, setAllData] = useState([] as IContractSearchResult[]);
  const [searchTerm, setSearchTerm] = useState('' as string | SearchOption);
  const [contractType, setContractType] = useState('all' as ContractType);
  const location = useLocation();

  useEffect(() => {
    const subscription = searchService.getAll().subscribe({
      next: (searchResults) => {
        const data = searchResults.slice();
        data.sort((a, b) => {
          return b.vendorName > a.vendorName ? -1 : b.vendorName < a.vendorName ? 1 : 0;
        });

        setAllData(data);
        setSearchResults(data);
      },
      error: (error) => {
        console.error(error);
        publishToast({ type: 'error', message: failedToPerform('search contracts', 'Server error') });
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [JSON.stringify(allData)]);

  function handleOnEnter(filtered: SearchOption[]) {
    const results = allData.filter((x) => filtered.some((y) => y.value === x.index));

    setSearchResults(results.filter((x) => contractType === 'all' || x.contractType === contractType));
  }

  function onChangeContractType(name: string, type: string | string[]) {
    const _contractType = type as ContractType;
    setContractType(_contractType as ContractType);
    // rerun the search, sometimes it is the term, sometimes it is an item with a separator
    let filtered = allData.filter((x) => _contractType === 'all' || x.contractType === _contractType);

    if (typeof searchTerm == 'string') {
      const term = searchTerm as string;
      setSearchResults(
        filtered.filter((x) => {
          return x.businessId?.toString().includes(term) || x.vendorName.toUpperCase().includes(term.toUpperCase());
        })
      );
    } else {
      const splits = searchTerm.label.split(separator);
      const result = filtered.find((x) => x.vendorName === splits[0]);
      if (result) {
        setSearchResults([result]);
      } else {
        setSearchResults([]);
      }
    }
  }

  function handleOnChange(newValue: string | SearchOption) {
    setSearchTerm(newValue);
    if (!newValue) {
      const filtered = allData.filter((x) => contractType === 'all' || x.contractType === contractType);
      setSearchResults(filtered);
    }
  }

  const separator = ' - ';
  function createOptions(): SearchOption[] {
    return allData.map((item) => {
      const val = `${item.vendorName}${separator}${item.businessId}`;
      return { value: item.index, label: val };
    });
  }

  function filterPredicate(candidate: SearchOption, inputValue: string) {
    const upCase = inputValue.toUpperCase();
    const splits = candidate.label.split(separator);
    const found = splits.some((x) => x.toUpperCase().startsWith(upCase));
    return found;
  }

  return (
    <main>
      <div className={top}>
        <h2>{header}</h2>
        <div className={search}>
          <SearchSuggestion
            options={createOptions()}
            filterPredicate={filterPredicate}
            onEnter={handleOnEnter}
            onChange={handleOnChange}
          ></SearchSuggestion>
        </div>

        <GoADropdown name='contractType' value={contractType} onChange={onChangeContractType}>
          {typeItems.map((type, idx) => (
            <GoADropdownItem key={idx} value={type.value} label={type.label} />
          ))}
        </GoADropdown>
      </div>
      <div className={searchResultsContainer}>
        <ContractSearchResults searchResults={searchResults}></ContractSearchResults>
      </div>
    </main>
  );
}
