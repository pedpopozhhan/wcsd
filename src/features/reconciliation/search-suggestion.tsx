import { GoAIcon } from '@abgov/react-components';
import { useState, useRef, useEffect } from 'react';

import styles from './search-suggestion.module.scss';
import { SearchOption } from '@/features/reconciliation/search-option';

const { search, searchInput, searchInputWrapper, highlight, closeButton, closeButtonActive, container, item, active, hover, showMenu, hideMenu } =
  styles;

interface ISearchResultsProps {
  options: SearchOption[];
  filterPredicate: (candidate: SearchOption, inputValue: string) => boolean;
  onEnter: (results: SearchOption[]) => void;
  onChange: (inputValue: string | SearchOption) => void;
}
const SearchSuggestion: React.FC<ISearchResultsProps> = (props) => {
  const [inputValue, setInputValue] = useState('');
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const [allSuggestions, setAllSuggestions] = useState([] as SearchOption[]);
  const [arrowKeyPressed, setArrowKeyPressed] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerRef: any = useRef(null);

  // local array of filtered options for when 'enter' is pressed
  let filteredSuggestions: SearchOption[] = [];

  useEffect(() => {
    setAllSuggestions(props.options);
  }, [props.options]);

  // remember to handle clicking off the menu or input
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleOffMenuClick = (e: any) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setMenuIsOpen(false);
      }
    };
    if (menuIsOpen) {
      window.addEventListener('click', handleOffMenuClick);
    } else {
      window.removeEventListener('click', handleOffMenuClick);
    }
    return () => window.removeEventListener('click', handleOffMenuClick);
  }, [menuIsOpen, setMenuIsOpen]);

  function handleValueChanging(newValue: string | SearchOption) {
    if (typeof newValue == 'string') {
      setInputValue(newValue);
    } else {
      setInputValue(newValue.label);
    }
    props.onChange(newValue);

    if (!newValue) {
      setMenuIsOpen(false);
    }
  }

  function highlightLabel(label: string) {
    const regex = new RegExp(inputValue, 'gi');
    const parts = label.split(regex);
    const matches = label.match(regex) || [];
    return (
      <>
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < matches.length && <span className={highlight}>{matches[index]}</span>}
          </span>
        ))}
      </>
    );
  }

  function filterSuggestions() {
    const filtered = allSuggestions.filter((x) => {
      return props.filterPredicate(x, inputValue);
    });
    // save the filteredSuggestions
    filteredSuggestions = filtered.slice();
    return filtered.map((data, index) => (
      <div
        className={`${item} ${currentIndex === index ? hover : ''} ${selectedIndex === index ? active : ''}`}
        onClick={() => setSelection(index)}
        key={index}
      >
        {highlightLabel(data.label)}
      </div>
    ));
  }

  // option click handler
  function setSelection(index: number) {
    setSelectedIndex(index);
    handleValueChanging(filteredSuggestions[index]);
    props.onEnter([filteredSuggestions[index]]);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleInputKeyDown(e: any) {
    if (e.key === 'Enter') {
      if (!arrowKeyPressed) {
        // enter selected without pressing arrows
        setArrowKeyPressed(false);
        setMenuIsOpen(false);
        props.onEnter(filteredSuggestions);
      } else {
        // arrow pressed and enter selected
        if (filteredSuggestions[currentIndex]) {
          setSelectedIndex(currentIndex);
          handleValueChanging(filteredSuggestions[currentIndex]);
          props.onEnter([filteredSuggestions[currentIndex]]);
        }
      }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      setArrowKeyPressed(true);
      // focus the menu items
      // scroll through the items and highlight it
      let newIndex = currentIndex;
      if (e.key === 'ArrowDown' && containerRef.current && currentIndex < containerRef.current.children.length - 1) {
        newIndex++;
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        newIndex--;
      }
      // scrollintoview
      setCurrentIndex(newIndex);
      containerRef.current.children[newIndex].scrollIntoView({
        block: 'nearest',
      });
    } else {
      // any other key pressed
      // backspace unselects option
      // entering new character unselects option
      setCurrentIndex(0);
      setSelectedIndex(-1);
      // unset arrowpressed
      setArrowKeyPressed(false);
      //open the menu
      setMenuIsOpen(true);
    }
  }

  function resetInput() {
    filteredSuggestions = [];
    handleValueChanging('');
    setCurrentIndex(0);
    setSelectedIndex(-1);
    setMenuIsOpen(false);
    setArrowKeyPressed(false);
  }

  return (
    <div className={search}>
      <div className={searchInput}>
        <div className={searchInputWrapper}>
          <GoAIcon type='search' ml='xs' />
          <input
            data-cy='searchInput'
            value={inputValue}
            onChange={(e) => handleValueChanging(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder='Search by Vendor or Business No.'
          ></input>
          <div data-cy='searchCancel' className={`${closeButton} ${inputValue ? closeButtonActive : ''}`} onClick={() => resetInput()}>
            <GoAIcon type='close' />
          </div>
        </div>

        <div className={`${container} ${menuIsOpen ? showMenu : hideMenu}`} ref={containerRef}>
          {filterSuggestions()}
        </div>
      </div>
    </div>
  );
};
export default SearchSuggestion;
