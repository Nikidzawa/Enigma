import {observer} from "mobx-react-lite";
import SearchSection from "./search/SearchSection";
import ChatRoomsSection from "./chatRooms/ChatRoomsSection";
import SearchController from "../../../store/SearchController";

export default observer(function SearchOrChatRoomsSection() {
    const isSearching = SearchController.isSearching();
    return (
        isSearching ? <SearchSection isSearchMode={isSearching}/> : <ChatRoomsSection isSearchMode={isSearching}/>
    )
})