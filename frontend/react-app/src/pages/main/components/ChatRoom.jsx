import styled from "styled-components";
import DateParser from "../../../helpers/DateParser";
import UserController from "../../../store/UserController";
import {useCallback, useEffect, useRef, useState} from "react";
import ClientController from "../../../store/ClientController";
import {observer} from "mobx-react-lite";
import PresenceResponse from "../../../network/response/PresenceResponse";
import ChatRoomDto from "../../../api/internal/dto/ChatRoomDto";
import UserDto from "../../../api/internal/dto/UserDto";
import UserApi from "../../../api/internal/controllers/UserApi";
import MessageDto from "../../../api/internal/dto/MessageDto";

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

const DateComponent = styled.div`
    font-size: 13px;
    padding: 0 5px;
    color: #7f7f7f;
    flex-shrink: 0;
`

export default observer(function ChatRoom({chatRoom, setActiveChat, activeChatRef, updateChatRoomPresenceData, updateChatRoomUserData}) {
    const [user, setUser] = useState({});
    const [lastMessage, setLastMessage] = useState(null);
    const [isOnline, setIsOnline] = useState(null);
    const stompClient = ClientController.getClient();

    function isMyMessage() {
        return UserController.getCurrentUser().id === lastMessage.senderId ? "Вы: " : "";
    }

    useEffect(() => {
        if (stompClient) {
            // Запрос текущего статуса
            ClientController.checkUserOnlineStatus(chatRoom.companion.id);

            // Подписка на получение статуса пользователя
            const presenceSubscription = stompClient.subscribe(`/client/${chatRoom.companion.id}/personal/presence`, (message) => {
                const presenceResponse = PresenceResponse.fromJSON(JSON.parse(message.body));
                setIsOnline(presenceResponse.isOnline);
                updateChatRoomPresenceData(presenceResponse, new Date());
                activeChatRef.current?.updateOnlineStatus(presenceResponse);
            });

            // Подписка на обновление профиля
            const profileSubscription = stompClient.subscribe(`/client/${chatRoom.companion.id}/profile/changed`, (message) => {
                UserApi.getUserById(JSON.parse(message.body).userId).then(response => {
                        const userDto = UserDto.fromJSON(response.data);
                        userDto.isOnline = true;
                        userDto.lastOnline = new Date();
                        updateChatRoomUserData(userDto);
                        activeChatRef.current?.updateProfileData(userDto);
                    }
                );
            });

            return () => {
                presenceSubscription.unsubscribe();
                profileSubscription.unsubscribe();
            };
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
                            <DateComponent>{lastMessage ? DateParser.parseDate(lastMessage.createdAt) : ""}</DateComponent>
                        </UpperLine>
                        <LastMessage>{lastMessage ? (isMyMessage() + lastMessage.text) : "Сообщений нет"}</LastMessage>
                    </UserData>
                </ChatRoomContainer>
            </MainContainer>
    );
})