import { GoADropdown, GoADropdownItem, GoAInput } from '@abgov/react-components';
import { useEffect, useState } from 'react';
import styles from '@/features/invoicing/invoice-list.module.scss';
import { InvoiceAgeOption, InvoiceAgeOptionItems, InvoiceStatusOptionItems, IOptionType } from '@/common/types/custom-types';
import { IInvoiceListSearchResult } from '@/interfaces/invoicing/invoice-list-data';
import invoiceListService from '@/services/invoice-list.services';
import { failedToPerform, publishToast } from '@/common/toast';
import { useConditionalAuth } from '@/app/hooks';
import { navigateTo } from '@/common/navigate';
import InvoiceListSearchResults from '@/features/invoicing/invoice-list-search-result';
import { MultiSelect } from 'react-multi-select-component';

const { dropdownContainer, toolbar, spacer, multiSelect } = styles;

export default function InvoiceList() {
  const auth = useConditionalAuth();
  const header = 'Invoice list';
  const [searchResults, setSearchResults] = useState([] as IInvoiceListSearchResult[]);
  const [allData, setAllData] = useState([] as IInvoiceListSearchResult[]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [invoiceAgeOption, setInvoiceAgeOption] = useState('All ages' as InvoiceAgeOption);
  // const [invoiceStatusOption] = useState('All statuses' as InvoiceStatusOption);
  const [retry, setRetry] = useState<boolean>(false);
  const options = {
    allItemsAreSelected: 'All statuses are selected.',
    clearSearch: 'Clear Search',
    clearSelected: 'Clear Selected',
    noOptions: 'No options',
    search: 'Search',
    selectAll: 'Select All',
    selectAllFiltered: 'Select All (Filtered)',
    selectSomeItems: 'All statuses',
    create: 'Create',
  };
  const [selectedStatuses, setSelectedStatuses] = useState<IOptionType[]>([]);

  useEffect(() => {
    const subscription = invoiceListService.getInvoiceList(auth?.user?.access_token).subscribe({
      next: (searchResults) => {
        const data = searchResults.invoiceList.slice();
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
  }, [retry]);

  // Main search function -- whenever a value changes - this will be called to search on the main data set
  useEffect(() => {

    //status filter
    const invoiceStatusFilter = selectedStatuses.map((x) => x.value);
    const filterByStatus = (x: IInvoiceListSearchResult) => {
      return invoiceStatusFilter && invoiceStatusFilter.length !== 0 ? invoiceStatusFilter.includes(x.invoiceStatus) : true;
    };
    const filteredRecords = allData?.filter(filterByStatus).filter(getFilter());

    // Invoice age filter
    const filtered = filteredRecords.filter((x) => invoiceAgeOption === 'All ages' ? invoiceAgeOption === 'All ages' : invoiceAgeOption === '1-30' ?
      x.invoiceAge < 30 : invoiceAgeOption === '30-60' ? x.invoiceAge > 29 && x.invoiceAge < 61 : x.invoiceAge > 60);

    // Vendor, invoice or SES Filter
    if (searchTerm === '' || searchTerm.length < 3) {
      setSearchResults(filtered);
      return;
    }

    const upper = searchTerm.toUpperCase();
    const searched = filtered.filter((x) => {
      return (
        x.vendorName.toString().toUpperCase().includes(upper) ||
        x.invoiceNumber.toUpperCase().includes(upper) ||
        x.uniqueServiceSheetName.toUpperCase().includes(upper)
      );
    });

    console.log(searched.length);
    setSearchResults(searched);

  }, [JSON.stringify(selectedStatuses), invoiceAgeOption, searchTerm]);

  function onChangeOfInvoiceAgeOption(name: string, type: string | string[]) {
    const _invoiceAgeOption = type as InvoiceAgeOption;
    setInvoiceAgeOption(_invoiceAgeOption as InvoiceAgeOption);
    // rerun the search, sometimes it is the term, sometimes it is an item with a separator
    // const filtered = allData.filter((x) => _invoiceAgeOption === 'All ages' ? _invoiceAgeOption === 'All ages' : _invoiceAgeOption === '1-30' ?
    //   x.invoiceAge < 30 : _invoiceAgeOption === '30-60' ? x.invoiceAge > 29 && x.invoiceAge < 61 : x.invoiceAge > 60);
    // const upper = searchTerm.toUpperCase();
    // const searched = filtered.filter((x) => {
    //   return (
    //     x.vendorName.toString().toUpperCase().includes(upper) ||
    //     x.invoiceNumber.toUpperCase().includes(upper) ||
    //     x.uniqueServiceSheetName.toUpperCase().includes(upper)
    //   );
    // });
    // setSearchResults(searched);
  }

  const onSearchTermChange = (name: string, value: string) => {
    if (value === '' && searchTerm === '')
      return;
    setSearchTerm(value);

    // if (value.length < 3) {
    //   setSearchResults(allData.filter((x) => invoiceAgeOption === 'All ages' ? invoiceAgeOption === 'All ages' : x.invoiceNumber === invoiceAgeOption));
    //   return;
    // }
    // const filtered = allData.filter((x) => invoiceAgeOption === 'All ages' ? invoiceAgeOption === 'All ages' : x.invoiceNumber === invoiceAgeOption);
    // const upper = value.toUpperCase();
    // const searched = filtered.filter((x) => {
    //   return (
    //     x.vendorName.toString().toUpperCase().includes(upper) ||
    //     x.invoiceNumber.toUpperCase().includes(upper) ||
    //     x.uniqueServiceSheetName.toUpperCase().includes(upper)
    //   );
    // });
    // setSearchResults(searched);
  };


  const handleMultiSelectChange = (selectedOptions: IOptionType[]) => {
    setSelectedStatuses(selectedOptions);
    // const invoiceStatusFilter = selectedStatuses.map((x) => x.value);
    // const filterByStatus = (x: IInvoiceListSearchResult) => {
    //   return invoiceStatusFilter && invoiceStatusFilter.length !== 0 ? invoiceStatusFilter.includes(x.invoiceStatus) : true;
    // };
    // const filteredRecords = allData?.filter(filterByStatus).filter(getFilter());
    // console.log(filteredRecords.length);
    // setSearchResults(filteredRecords);
  };

  function getFilter() {
    return (x: IInvoiceListSearchResult) => x;
  }

  return (
    <main>
      <div>
        <h2>{header}</h2>
        <div className={toolbar}>
          <div className={spacer}></div>
          <div className={dropdownContainer}>
            <MultiSelect
              options={InvoiceStatusOptionItems.map((x) => {
                return { value: x.value, label: x.label };
              })}
              value={selectedStatuses}
              onChange={handleMultiSelectChange}
              labelledBy='All statuses'
              overrideStrings={options}
              className={multiSelect}

            />
          </div>
          {/* <div className={dropdownContainer}>
            <GoADropdown name='InvoiceStatusOption' value={invoiceStatusOption} onChange={onChangeOfInvoiceAgeOption}>
              {InvoiceStatusOptionItems.map((type, idx) => (
                <GoADropdownItem key={idx} value={type.value} label={type.label} />
              ))}
            </GoADropdown>
          </div> */}

          <div className={dropdownContainer}>
            <GoADropdown name='InvoiceAgeOption' value={invoiceAgeOption} onChange={onChangeOfInvoiceAgeOption}>
              {InvoiceAgeOptionItems.map((type, idx) => (
                <GoADropdownItem key={idx} value={type.value} label={type.label} />
              ))}
            </GoADropdown>
          </div>
          <GoAInput
            type='search'
            name='search'
            value={searchTerm}
            onChange={onSearchTermChange}
            leadingIcon='search'
            placeholder='Vendor, invoice or SES'
          ></GoAInput>
        </div>
      </div>
      <InvoiceListSearchResults searchResults={searchResults}></InvoiceListSearchResults>
    </main>
  );
}