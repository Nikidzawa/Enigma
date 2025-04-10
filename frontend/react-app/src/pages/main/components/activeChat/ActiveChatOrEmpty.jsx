import ActiveChat from "./ActiveChat";
import ActiveChatController from "../../../../store/ActiveChatController";
import {observer} from "mobx-react-lite";
import styled from "styled-components";

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

export default observer(function ActiveChatOrEmpty () {
    const activeChat = ActiveChatController.getActiveChat();

    return (
        activeChat ?
            <ActiveChat activeChat={activeChat}/>
            :
            <EmptySection>
                <EmptyText>Выберите, кому хотели бы написать</EmptyText>
            </EmptySection>
    )
});