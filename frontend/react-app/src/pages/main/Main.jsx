import {useEffect, useState} from "react";
import styled from "styled-components";
import MenuImg from "../../img/menu.png";
import MenuPanel from "./components/menu/MenuPanel";
import ActiveChatOrEmpty from "./components/activeChat/ActiveChatOrEmpty";
import ActiveChatController from "../../store/ActiveChatController";
import ModalController from "../../store/ModalController";
import SearchInput from "./sections/search/components/SearchInput";
import SearchOrChatRoomsSection from "./sections/SearchOrChatRoomsSection";
import SearchController from "../../store/SearchController";

const MainContainer = styled.main`
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: space-between;
    background-color: #121212;
`;

const LeftMenuContainer = styled.div`
    height: 100vh;
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

const MenuButton = styled.img`
    height: 22px;
    width: 26px;
    cursor: pointer;
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

    const [menuIsVisible, setMenuIsVisible] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Escape') {
                if (!ModalController.isVisible()) {
                    if (SearchController.isSearching()) {
                        SearchController.stopSearch();
                    } else {
                        ActiveChatController.setActiveChat(null);
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

    return (
        <MainContainer onMouseMove={handleMouseMove}
                       onMouseUp={() => setIsResizing(false)}
                       onMouseLeave={() => setIsResizing(false)}>
            <LeftMenuContainer width={chatListWidth}>
                <TopMenuContainer>
                    <MenuButton src={MenuImg} onClick={() => setMenuIsVisible(true)}/>
                    <SearchInput/>
                </TopMenuContainer>
                <SearchOrChatRoomsSection/>
                <Resizer onMouseDown={e => {e.preventDefault(); setIsResizing(true)}}/>
            </LeftMenuContainer>
            <MenuPanel setMenuIsVisible={setMenuIsVisible} menuIsVisible={menuIsVisible}/>
            <ActiveChatOrEmpty/>
        </MainContainer>
    );
}
