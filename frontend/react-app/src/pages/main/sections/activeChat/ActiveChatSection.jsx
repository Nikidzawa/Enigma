import ActiveChat from "./components/ActiveChat";
import {observer} from "mobx-react-lite";
import styled from "styled-components";
import {useEffect} from "react";
import ChatRoomsController from "../../../../store/ChatRoomsController";

const EmptySection = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 5px;
`

const EmptyText = styled.div`
    padding: 5px 25px;
    background-color: #292929;
    border-radius: 20px;
    font-size: 15px;
    text-align: center;
`

export default observer(function ActiveChatSection() {
    const activeChat = ChatRoomsController.getActiveChat();

    useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        if (activeChat != null) {
            document.addEventListener('contextmenu', handleContextMenu);
        } else {
            document.removeEventListener('contextmenu', handleContextMenu);
        }

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [activeChat]);

    return (
        activeChat ?
            <ActiveChat key={activeChat.companion.id}/>
            :
            <EmptySection>
                <EmptyText>Выберите, кому хотели бы написать</EmptyText>
            </EmptySection>
    )
});