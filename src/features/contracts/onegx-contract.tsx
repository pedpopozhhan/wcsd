import { GoADropdown, GoADropdownItem, GoAInput } from '@abgov/react-components';
import { useEffect, useState } from 'react';
import styles from '@/features/contracts/onegx-contract.module.scss';
import { ContractType, typeItems } from '@/common/types/contract-type';
import searchService from '@/services/contract-management.services';
import { failedToPerform, publishToast } from '@/common/toast';
import { useConditionalAuth } from '@/app/hooks';
import { navigateTo } from '@/common/navigate';
import OneGxContractSearchResults from './onegx-contract-search-result';
import { IOneGxContract } from '@/interfaces/contract-management/onegx-contract-management-data';
const { dropdownContainer, toolbar, spacer } = styles;

export default function OneGxContract() {
  const auth = useConditionalAuth();
  const header = 'Contracts Management';
  const [searchResults, setSearchResults] = useState([] as IOneGxContract[]);
  const [allData, setAllData] = useState([] as IOneGxContract[]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [contractType, setContractType] = useState('all' as ContractType);
  const [retry, setRetry] = useState<boolean>(false);
  useEffect(() => {
    const subscription = searchService.getAll(auth?.user?.access_token).subscribe({
      next: (searchResults) => {
        const data = searchResults.slice();
        data.sort((a, b) => {
          return b.supplierName > a.supplierName ? -1 : b.supplierName < a.supplierName ? 1 : 0;
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
    const upper = searchTerm.toUpperCase();
    const searched = allData.filter((x) => {
      return (
        x.supplierid?.toString().toUpperCase().includes(upper) ||
        x.supplierName.toUpperCase().includes(upper) ||
        x.contractNumber.toUpperCase().includes(upper)
      );
    });
    setSearchResults(searched);
  }
  const onChange = (name: string, value: string) => {
    setSearchTerm(value);
    const upper = value.toUpperCase();
    const searched = allData.filter((x) => {
      return (
        x.supplierid?.toString().toUpperCase().includes(upper) ||
        x.supplierName.toUpperCase().includes(upper) ||
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

      <OneGxContractSearchResults searchResults={searchResults}></OneGxContractSearchResults>
    </main>
  );
}
