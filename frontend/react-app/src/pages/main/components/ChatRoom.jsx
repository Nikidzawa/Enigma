import styled from "styled-components";
import DateParser from "../../../helpers/DateParser";
import UserController from "../../../store/UserController";
import {useEffect, useRef, useState} from "react";
import ClientController from "../../../store/ClientController";
import {observer} from "mobx-react-lite";
import PresenceResponse from "../../../network/response/PresenceResponse";
import PresenceApi from "../../../api/internal/controllers/PresenceApi";
import PresenceDto from "../../../api/internal/dto/PresenceDto";
import TypingResponse from "../../../network/response/TypingResponse";
import TypingAnimation from "./menu/TypingAnimation";
import WhiteCheckMarkImg from "../../../img/two-ticks.png";
import BlackCheckMark from "../../../img/two-ticks-black.png";
import ActiveChatController from "../../../store/ActiveChatController";

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
    margin-right: 5px;
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
    color: #7f7f7f;
`

const Typing = styled.div`
    color: #009a9a;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 3px;
`

const ReadStatusAndMessageDate = styled.div`
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-right: 5px;
    gap: 4px;
`

const ReadMark = styled.img`
    width: 13px;
    height: 7px;
`

const MiddleLine = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 0;
`

const LastMessageOrTypingContainer = styled.div`
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    flex-shrink: 1;
    min-width: 0;
    padding-right: 5px;
`

const NewMessagesCountContainer = styled.div`
    display: flex;
    font-size: 13px;
    background-color: #009a9a;
    border-radius: 50%;
    width: 17px;
    height: 17px;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-right: 5px;
`

export default observer(function ChatRoom({chatRoom}) {
    const [user, setUser] = useState({});
    const [lastMessage, setLastMessage] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const [isOnline, setIsOnline] = useState(null);

    const [isTyping, setTyping] = useState(false);
    const typingTimeoutRef = useRef(null);

    const stompClient = ClientController.getClient();

    function isMyMessage() {
        return UserController.getCurrentUser().id === lastMessage.senderId;
    }

    useEffect(() => {
        if (stompClient) {
            // Подписка на получение статуса пользователя
            const presenceSubscription = stompClient.subscribe(`/client/${chatRoom.companion.id}/personal/presence`, (message) => {
                const presenceResponse = PresenceResponse.fromJSON(JSON.parse(message.body));
                setIsOnline(presenceResponse.isOnline);

                if (!presenceResponse.isOnline) {
                    setTyping(false);
                    clearTimeout(typingTimeoutRef.current);
                }
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
        });
    }, []);

    useEffect(() => {
        setLastMessage(chatRoom.messages ? chatRoom.messages[chatRoom.messages.length - 1] : null);
    }, [chatRoom.messages]);

    useEffect(() => {
        setUser(chatRoom.companion);
    }, [chatRoom.companion]);

    useEffect(() => {
        setUnreadCount(chatRoom.unreadCount);
    }, [chatRoom.unreadCount]);

    return (
            <MainContainer onClick={() => ActiveChatController.setActiveChat(chatRoom)}>
                <ChatRoomContainer>
                    <AvatarContainer>
                        <UserAvatar src={user.avatarHref}/>
                        <OnlineCircle isOnline={isOnline}/>
                    </AvatarContainer>
                    <UserData>
                        <UpperLine>
                            <Name>{`${user.name} ${user.surname}`}</Name>
                            {
                                lastMessage && (
                                    <ReadStatusAndMessageDate>
                                        {
                                            isMyMessage() && <ReadMark src={lastMessage.isRead ? WhiteCheckMarkImg : BlackCheckMark}/>
                                        }
                                        <DateComponent>{lastMessage ? DateParser.parseDate(lastMessage.createdAt) : ""}</DateComponent>
                                    </ReadStatusAndMessageDate>
                                )
                            }
                        </UpperLine>
                        <MiddleLine>
                            <LastMessageOrTypingContainer>
                                {isTyping ? <Typing>Пишет<TypingAnimation/></Typing>
                                    : <LastMessage>{lastMessage ? ((isMyMessage() ? "Вы: " : "") + lastMessage.text) : "Сообщений нет"}</LastMessage>}
                            </LastMessageOrTypingContainer>
                            {
                                unreadCount > 0 && <NewMessagesCountContainer>{unreadCount}</NewMessagesCountContainer>
                            }
                        </MiddleLine>
                    </UserData>
                </ChatRoomContainer>
            </MainContainer>
    );
})