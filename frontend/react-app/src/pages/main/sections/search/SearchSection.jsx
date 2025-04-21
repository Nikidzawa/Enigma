import styled, {keyframes} from "styled-components";
import UserProfile from "./components/UserProfile";
import {useEffect, useState} from "react";
import UserApi from "../../../../api/internal/controllers/UserApi";
import UserController from "../../../../store/UserController";
import IndividualDtoShort from "../../../../api/internal/dto/IndividualDtoShort";
import {observer} from "mobx-react-lite";
import SearchController from "../../../../store/SearchController";

const slideOutToBottom = keyframes`
    from {
        transform: translateY(-35%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
`;

const slideOutToUp = keyframes`
    from {
        transform: translateY(0);
        opacity: 1;
    }
    to {
        transform: translateY(-35%);
        opacity: 0;
        position: absolute;
    }
`;


const SearchCategories = styled.div`
    width: 100%;
    height: 25px;
    display: flex;
    align-items: center;
    animation: ${props => props.isActive ? slideOutToBottom : slideOutToUp} 0.25s forwards;
`

const SearchCategory = styled.div`
    cursor: pointer;
    padding: 5px 10px;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 15px;

    &.active {
        background-color: #292929;
        transition: background-color 0.2s;
    }
`

const SearchLabel = styled.div`
    background-color: #292929;
    padding: 5px;
    margin-top: 5px;
    font-size: 15px;
`

const EmptySearchResult = styled.div`
    display: flex;
    justify-content: center;
    text-align: center;
    padding: 0 10px;
    margin-top: auto;
`

const SearchPanel = styled.div`
    display: flex;
    flex-direction: column;
    height: 40%;
`

export default observer(function SearchSection({isSearchMode}) {
    const searchValue = SearchController.getSearchValue();

    const [searchCategory, setSearchCategory] = useState('MESSAGES')
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchCategory === 'PEOPLES' && searchValue.trim()) {
                UserApi.search(searchValue.trim(), UserController.getCurrentUser().id).then(response => {
                    setSearchResults(response.data.map(userInfo => IndividualDtoShort.fromJSON(userInfo)))
                });
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchCategory, searchValue]);

    return (
        <>
            <SearchCategories isActive={isSearchMode}>
                <SearchCategory className={searchCategory === 'MESSAGES' ? 'active' : ''}
                                onClick={() => setSearchCategory('MESSAGES')}>Сообщения</SearchCategory>
                <SearchCategory className={searchCategory === 'PEOPLES' ? 'active' : ''}
                                onClick={() => setSearchCategory('PEOPLES')}>Люди</SearchCategory>
            </SearchCategories>
            <SearchPanel>
                <SearchLabel>Глобальный поиск</SearchLabel>
                {
                    searchCategory === 'PEOPLES' && searchResults.map(userDto => (
                            <UserProfile key={userDto.id} userDto={userDto}/>
                        )
                    )
                }
                {
                    searchResults.length === 0 && <EmptySearchResult>Ничего не найдено</EmptySearchResult>
                }
            </SearchPanel>
        </>
    )
})