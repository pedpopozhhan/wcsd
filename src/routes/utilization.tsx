import {
    GoAContainer,
    GoADropdown,
    GoADropdownItem,
    GoAIcon,
    GoAInputSearch,
    GoAInputText,
} from "@abgov/react-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./utilization.module.scss";

let { search } = styles;

export default function Utilization() {
    const navigate = useNavigate();

    const header = "Contract Utilization";
    const [contractType, setContractType] = useState("red");
    const [searchTerm, setSearchTerm] = useState("");

    // Intent is to use this until goa input allows keydown handling
    useEffect(() => {
        const element = document.querySelector("#searchInput");
        if (element) {
            console.log("element exists");
            element.addEventListener("keydown", onKeyDown);
        }
        return () => {
            if (element) {
                element.removeEventListener("keydown", onKeyDown);
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
        console.log("searching for " + searchTerm);
    }
    return (
        <main>
            <h2>{header}</h2>
            <div className={search}>
                <GoAInputText
                    id="searchInput"
                    leadingIcon="search"
                    onChange={onSearchTermChange}
                    value={searchTerm}
                    name="searchInput"
                />
            </div>

            <GoADropdown
                name="contractType"
                value={contractType}
                onChange={onChangeContractType}
            >
                <GoADropdownItem key="1" value="red" label="All Types" />
                <GoADropdownItem key="2" value="green" label="Casual Only" />
                <GoADropdownItem key="3" value="blue" label="Long-Term Only" />
            </GoADropdown>
        </main>
    );
}
