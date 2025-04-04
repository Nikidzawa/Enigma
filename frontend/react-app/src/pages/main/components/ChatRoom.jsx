import styled from "styled-components";
import DateParser from "../../../helpers/DateParser";
import UserController from "../../../store/UserController";
import {useEffect, useRef, useState} from "react";
import ClientController from "../../../store/ClientController";
import {observer} from "mobx-react-lite";
import PresenceResponse from "../../../network/response/PresenceResponse";
import UserDto from "../../../api/internal/dto/UserDto";
import UserApi from "../../../api/internal/controllers/UserApi";
import PresenceApi from "../../../api/internal/controllers/PresenceApi";
import PresenceDto from "../../../api/internal/dto/PresenceDto";
import TypingResponse from "../../../network/response/TypingResponse";
import TypingAnimation from "./menu/TypingAnimation";

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
    gap: 8px;
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
    background-color: #009a9a;
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
    gap: 3px;
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

const Typing = styled.div`
    color: #009a9a;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 3px;
`

export default observer(function ChatRoom({chatRoom, setActiveChat, updateChatCompanion}) {
    const [user, setUser] = useState({});
    const [lastMessage, setLastMessage] = useState(null);

    const [isOnline, setIsOnline] = useState(null);
    const [lastOnlineDate, setLastOnlineDate] = useState(null);

    const [isTyping, setTyping] = useState(false);
    const typingTimeoutRef = useRef(null);

    const stompClient = ClientController.getClient();

    function isMyMessage() {
        return UserController.getCurrentUser().id === lastMessage.senderId ? "Вы: " : "";
    }

    useEffect(() => {
        if (stompClient) {
            // Подписка на получение статуса пользователя
            const presenceSubscription = stompClient.subscribe(`/client/${chatRoom.companion.id}/personal/presence`, (message) => {
                const presenceResponse = PresenceResponse.fromJSON(JSON.parse(message.body));
                setIsOnline(presenceResponse.isOnline);
                setLastOnlineDate(presenceResponse.lastOnlineDate);

                if (!presenceResponse.isOnline) {
                    setTyping(false);
                    clearTimeout(typingTimeoutRef.current);
                }
            });

            // Подписка на обновление профиля
            const profileSubscription = stompClient.subscribe(`/client/${chatRoom.companion.id}/profile/changed`, (message) => {
                UserApi.getUserById(JSON.parse(message.body).userId).then(response => {
                    const userDto = UserDto.fromJSON(response.data);
                    setUser(userDto);
                    updateChatCompanion(userDto);
                });
            });

            // Подписка на отслеживание статуса "Печатает"
            const typingSubscription = stompClient.subscribe(`/client/${chatRoom.companion.id}/queue/typing`, (message) => {
                const typingResponse = TypingResponse.fromJSON(JSON.parse(message.body))
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }
                setTyping(typingResponse.isTyping);

                if (typingResponse.isTyping) {
                    typingTimeoutRef.current = setTimeout(() => {
                        setTyping(false);
                    }, 3500);
                } else {
                    clearTimeout(typingTimeoutRef.current);
                }
            })

            return () => {
                presenceSubscription.unsubscribe();
                profileSubscription.unsubscribe();
                typingSubscription.unsubscribe();
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }
            };
        }
    }, [stompClient]);

    useEffect(() => {
        setUser(chatRoom.companion);
        PresenceApi.getActual(chatRoom.companion.id).then(response => {
            const presenceData = PresenceDto.fromJSON(response.data);
            setIsOnline(presenceData.isOnline);
            setLastOnlineDate(presenceData.lastOnlineDate);
        });
    }, []);

    useEffect(() => {
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
                        {isTyping ? <Typing>Пишет<TypingAnimation/></Typing> : <LastMessage>{lastMessage ? (isMyMessage() + lastMessage.text) : "Сообщений нет"}</LastMessage>}
                    </UserData>
                </ChatRoomContainer>
            </MainContainer>
    );
})