import {useEffect, useState} from "react";
import styled from "styled-components";
import ActiveChatSection from "./sections/activeChat/ActiveChatSection";
import ModalController from "../../store/ModalController";
import SearchInput from "./sections/searchOrChatRooms/search/components/SearchInput";
import SearchOrChatRoomsSection from "./sections/searchOrChatRooms/SearchOrChatRoomsSection";
import SearchController from "../../store/SearchController";
import MenuButton from "./sections/menu/components/MenuButton";
import MenuSection from "./sections/menu/MenuSection";
import ChatRoomsController from "../../store/ChatRoomsController";

const MainContainer = styled.main`
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: space-between;
    background-color: #121212;
`;

const LeftMenuContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    width: ${({width}) => width}px;
    position: relative;
    max-width: 70%;
    min-width: 10%;
`

const TopMenuContainer = styled.div`
    display: flex;
    padding: 10px;
    align-items: center;
    gap: 12px;
`

const Resizer = styled.div`
    width: 2px;
    cursor: ew-resize;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
`;

export default function Main() {
    const [chatListWidth, setChatListWidth] = useState(500);
    const [isResizing, setIsResizing] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Escape') {
                if (!ModalController.isVisible()) {
                    if (SearchController.isSearching()) {
                        SearchController.stopSearch();
                    } else {
                        ChatRoomsController.clearActiveChat();
                    }
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {window.removeEventListener('keydown', handleKeyDown)};
    }, [])


    const handleMouseMove = (e) => {
        if (isResizing) {
            const newWidth = e.clientX;
            setChatListWidth(newWidth > 150 ? newWidth : 150);
        }
    };

    const startResizing = (e) => {
        e.preventDefault();
        setIsResizing(true);
    }

    return (
        <MainContainer onMouseMove={handleMouseMove}
                       onMouseUp={() => setIsResizing(false)}
                       onMouseLeave={() => setIsResizing(false)}>
            <LeftMenuContainer width={chatListWidth}>
                <TopMenuContainer>
                    <MenuButton/>
                    <SearchInput/>
                </TopMenuContainer>
                <SearchOrChatRoomsSection/>
                <Resizer onMouseDown={startResizing}/>
            </LeftMenuContainer>
            <MenuSection/>
            <ActiveChatSection/>
        </MainContainer>
    );
}
