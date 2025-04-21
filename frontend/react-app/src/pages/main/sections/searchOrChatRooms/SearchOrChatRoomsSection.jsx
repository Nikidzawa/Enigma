import {observer} from "mobx-react-lite";
import SearchSection from "./search/SearchSection";
import ChatRoomsSection from "./chatRooms/ChatRoomsSection";
import SearchController from "../../../../store/SearchController";
import styled from "styled-components";

const MainContainer = styled.div`
    position: relative;
    height: 100%;
`

export default observer(function SearchOrChatRoomsSection() {
    const isSearching = SearchController.isSearching();
    return (
        <MainContainer>
            <SearchSection isSearchMode={isSearching}/>
            <ChatRoomsSection isSearchMode={isSearching}/>
        </MainContainer>
    )
})