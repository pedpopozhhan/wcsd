import { GoADropdown, GoADropdownItem, GoAInput } from '@abgov/react-components';
import { useEffect, useState } from 'react';
import styles from './contracts.module.scss';
import { ContractType, typeItems } from '@/common/types/contract-type';
import { IContractSearchResult } from '@/interfaces/contracts/contract-search-result';
import searchService from '@/services/contract-search.service';
import ContractSearchResults from './contract-search-results';
import { failedToPerform, publishToast } from '@/common/toast';
import { useConditionalAuth } from '@/app/hooks';
import { navigateTo } from '@/common/navigate';

const { dropdownContainer, toolbar, spacer } = styles;


export default function Contracts() {
  const auth = useConditionalAuth();
  const header = 'Contracts';
  const [searchResults, setSearchResults] = useState([] as IContractSearchResult[]);
  const [allData, setAllData] = useState([] as IContractSearchResult[]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [contractType, setContractType] = useState('all' as ContractType);
  const [retry, setRetry] = useState<boolean>(false);

  useEffect(() => {
    const subscription = searchService.getAll(auth?.user?.access_token).subscribe({
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
        if (error.response && error.response.status === 403) {
          navigateTo('unauthorized');
        }
        publishToast({
          type: 'error',
          message: failedToPerform('Load Contracts', error.response.data),
          callback: () => {
            setRetry(!retry);
          },
        });
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [JSON.stringify(allData), retry]);

  function onChangeContractType(name: string, type: string | string[]) {
    const _contractType = type as ContractType;
    setContractType(_contractType as ContractType);
    // rerun the search, sometimes it is the term, sometimes it is an item with a separator
    const filtered = allData.filter((x) => _contractType === 'all' || x.contractType === _contractType);
    const upper = searchTerm.toUpperCase();
    const searched = filtered.filter((x) => {
      return (
        x.businessId?.toString().toUpperCase().includes(upper) ||
        x.vendorName.toUpperCase().includes(upper) ||
        x.contractNumber.toUpperCase().includes(upper)
      );
    });
    setSearchResults(searched);
  }
  const onChange = (name: string, value: string) => {
    setSearchTerm(value);

    if (value.length < 3) {
      setSearchResults(allData.filter((x) => contractType === 'all' || x.contractType === contractType));
      return;
    }
    const filtered = allData.filter((x) => contractType === 'all' || x.contractType === contractType);
    const upper = value.toUpperCase();
    const searched = filtered.filter((x) => {
      return (
        x.businessId?.toString().toUpperCase().includes(upper) ||
        x.vendorName.toUpperCase().includes(upper) ||
        x.contractNumber.toUpperCase().includes(upper)
      );
    });
    console.dir(searched);
    setSearchResults(searched);
  };

  return (
    <main>
      <div>
        <h2>{header}</h2>
        <div className={toolbar}>
          <div className={spacer}></div>
          <div className={dropdownContainer}>
            <GoADropdown name='contractType' value={contractType} onChange={onChangeContractType}>
              {typeItems.map((type, idx) => (
                <GoADropdownItem key={idx} value={type.value} label={type.label} />
              ))}
            </GoADropdown>
          </div>
          <GoAInput
            type='search'
            name='search'
            value={searchTerm}
            onChange={onChange}
            leadingIcon='search'
            placeholder='Search Vendor or Contract'
          ></GoAInput>
        </div>
      </div>

      <ContractSearchResults searchResults={searchResults}></ContractSearchResults>
    </main>
  );
}
