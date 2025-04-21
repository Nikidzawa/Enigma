import styled from "styled-components";
import SearchImg from "../../../../../../img/search.png";
import CloseImg from "../../../../../../img/close.png";
import SearchController from "../../../../../../store/SearchController";
import {observer} from "mobx-react-lite";

const SearchInputComponent = styled.input`
    width: 100%;
    border-radius: 15px;
    border-color: rgba(255, 255, 255, 0.5);
    background-color: transparent;
    color: white;
    font-size: 15px;
    padding: 6px 15px 6px 35px;
    outline: none;
    background-image: url("${props => props.img}");
    background-size: 20px;
    background-position: left;
    background-repeat: no-repeat;
    background-position-x: 7px;
`

const StopSearchButton = styled.img`
    position: absolute;
    width: 19px;
    height: 19px;
    right: 20px;
    cursor: pointer;
`

export default observer(function SearchInput() {
    const isSearching = SearchController.isSearching();
    const searchValue = SearchController.getSearchValue();

    function setValue(e) {
        if (!isSearching) {
            SearchController.setIsSearching(true);
        }
        SearchController.setSearchValue(e.target.value)
    }

    return (
        <>
            <SearchInputComponent
                img={SearchImg}
                onClick={() => {
                    SearchController.setIsSearching(true)
                }}
                value={searchValue}
                onInput={setValue}
                placeholder={"Поиск"}
            />
            {
                isSearching && <StopSearchButton src={CloseImg} onClick={() => SearchController.stopSearch()}/>
            }
        </>
    )
})