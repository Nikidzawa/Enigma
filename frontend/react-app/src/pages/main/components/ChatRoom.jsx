import styled from "styled-components";
import DateParser from "../../../helpers/DateParser";
import UserController from "../../../store/UserController";
import {useEffect, useState} from "react";
import ClientController from "../../../store/ClientController";
import {observer} from "mobx-react-lite";
import PresenceResponse from "../../../network/response/PresenceResponse";

const MainContainer = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    :hover {
        background: #32373e;
    }
`

const ChatRoomContainer = styled.div`
    height: 50px;
    padding: 5px;
    display: flex;
    gap: 10px;
    cursor: pointer;
`

const UserAvatar = styled.img`
    border-radius: 50%;
    width: 50px;
    height: 50px;
    min-width: 50px;
    min-height: 50px;
`

const AvatarContainer = styled.div`
    position: relative;
`

const OnlineCircle = styled.div`
    position: absolute;
    width: 13px;
    height: 13px;
    background-color: green;
    border: 1px solid #090909;
    border-radius: 50%;
    right: 0;
    bottom: 0;
    opacity: ${props => (props.isOnline ? "1" : "0")};
    
    transition: opacity 0.2s ease-in-out;
`

const UserData = styled.div`
    width: 100%;
    display: flex;
    gap: 5px;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
`

const Name = styled.div`
    font-size: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    flex-shrink: 1;
    min-width: 0;
`

const LastMessage = styled.div`
    font-size: 13px;
    color: #7f7f7f;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`

const UpperLine = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 0;
`

const Date = styled.div`
    font-size: 13px;
    padding: 0 5px;
    color: #7f7f7f;
    flex-shrink: 0;
`

export default observer(function ChatRoom({chatRoom, setActiveChat, activeChatRef}) {
    const [user, setUser] = useState({})
    const [lastMessage, setLastMessage] = useState(null)
    const [isOnline, setIsOnline] = useState(null)
    const stompClient = ClientController.getClient();

    function isMyMessage() {
        return UserController.getCurrentUser().id === lastMessage.senderId ? "Вы: " : "";
    }

    useEffect(() => {
        if (stompClient) {
            // Запрос текущего статуса
            ClientController.checkUserOnlineStatus(chatRoom.companion.id);

            // Подписка на получение статуса пользователя
            stompClient.subscribe(`/client/${chatRoom.companion.id}/personal/presence`, (message) => {
                const presenceResponse = PresenceResponse.fromJSON(JSON.parse(message.body));
                setIsOnline(presenceResponse.isOnline);
                activeChatRef.current?.updateOnlineStatus(presenceResponse);
            });
        }
    }, [stompClient]);

    useEffect(() => {
        setUser(chatRoom.companion);
        setIsOnline(chatRoom.companion.isOnline)
        setLastMessage(chatRoom.messages ? chatRoom.messages[chatRoom.messages.length - 1] : null);
    }, [chatRoom]);

    return (
            <MainContainer onClick={() => setActiveChat(chatRoom)}>
                <ChatRoomContainer>
                    <AvatarContainer>
                        <UserAvatar src={user.avatarHref}/>
                        <OnlineCircle isOnline={isOnline}/>
                    </AvatarContainer>
                    <UserData>
                        <UpperLine>
                            <Name>{`${user.name} ${user.surname}`}</Name>
                            <Date>{lastMessage ? DateParser.parseDate(lastMessage.createdAt) : ""}</Date>
                        </UpperLine>
                        <LastMessage>{lastMessage ? (isMyMessage() + lastMessage.text) : "Сообщений нет"}</LastMessage>
                    </UserData>
                </ChatRoomContainer>
            </MainContainer>
    );
})