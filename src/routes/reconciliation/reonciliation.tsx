import { GoADropdown, GoADropdownItem } from '@abgov/react-components';
import { useEffect, useState } from 'react';
import styles from './reconciliation.module.scss';
import { ContractType, typeItems } from '@/types/contract-type';
import SearchResults from '@/routes/reconciliation/search-results';
import { SearchResult } from '@/routes/reconciliation/search-result';
import SearchSuggestion from '@/routes/reconciliation/search-suggestion';
import { SearchOption } from '@/routes/reconciliation/search-option';
import searchService from '@/services/reconciliation-search.service';

let { top, search } = styles;

export default function Reconciliation() {
  const header = 'Invoice Reconciliation';

  const [searchResults, setSearchResults] = useState([] as SearchResult[]);
  const [allData, setAllData] = useState([] as SearchResult[]);
  const [searchTerm, setSearchTerm] = useState('' as string | SearchOption);
  const [contractType, setContractType] = useState('all' as ContractType);

  useEffect(() => {
    const subscription = searchService.getAll().subscribe((searchResults) => {
      const data = searchResults.slice();

      // sort ascending

      data.sort((a, b) => {
        return b.vendorName > a.vendorName
          ? -1
          : b.vendorName < a.vendorName
          ? 1
          : 0;
      });

      setAllData(data);
      setSearchResults(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [JSON.stringify(allData)]);

  function handleOnEnter(filtered: SearchOption[]) {
    const results = allData.filter((x) =>
      filtered.some((y) => y.value === x.index)
    );
    console.log(JSON.stringify(results));
    console.log(
      JSON.stringify(allData.filter((x) => x.vendorName.includes('MUSTANG')))
    );
    setSearchResults(
      results.filter(
        (x) => contractType === 'all' || x.contractType === contractType
      )
    );
  }

  function onChangeContractType(name: string, type: string | string[]) {
    const _contractType = type as ContractType;
    setContractType(_contractType as ContractType);
    // rerun the search, sometimes it is the term, sometimes it is an item with a separator
    let filtered = allData.filter(
      (x) => _contractType === 'all' || x.contractType === _contractType
    );

    if (typeof searchTerm == 'string') {
      const term = searchTerm as string;
      setSearchResults(
        filtered.filter((x) => {
          return (
            x.businessId?.toString().includes(term) ||
            x.vendorName.toUpperCase().includes(term.toUpperCase())
          );
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
      setSearchResults(allData);
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

        <GoADropdown
          name='contractType'
          value={contractType}
          onChange={onChangeContractType}
        >
          {typeItems.map((type, idx) => (
            <GoADropdownItem key={idx} value={type.value} label={type.label} />
          ))}
        </GoADropdown>
      </div>

      <SearchResults searchResults={searchResults}></SearchResults>
    </main>
  );
}
