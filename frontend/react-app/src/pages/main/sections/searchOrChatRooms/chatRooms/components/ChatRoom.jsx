import styled from "styled-components";
import DateParser from "../../../../../../helpers/DateParser";
import UserController from "../../../../../../store/UserController";
import {useEffect, useRef, useState} from "react";
import ClientController from "../../../../../../store/ClientController";
import {observer} from "mobx-react-lite";
import PresenceResponse from "../../../../../../network/chat/user/PresenceResponse";
import TypingResponse from "../../../../../../network/chat/typing/TypingResponse";
import TypingAnimation from "../../../../components/onlineStatus/TypingAnimation";
import WhiteCheckMarkImg from "../../../../../../img/two-ticks.png";
import BlackCheckMark from "../../../../../../img/two-ticks-black.png";
import ChatRoomsController from "../../../../../../store/ChatRoomsController";
import MessagesApi from "../../../../../../api/internal/controllers/MessagesApi";
import MessageDto from "../../../../../../api/internal/dto/MessageDto";

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
    width: 18px;
    height: 18px;
    margin-right: 5px;
`

const NewMessagesCount = styled.div`
    display: flex;
    font-size: 13px;
    background-color: #009a9a;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`

export default observer(function ChatRoom({chatRoom}) {
    const [lastMessage, setLastMessage] = useState(null);

    const [isOnline, setIsOnline] = useState(null);

    const [isTyping, setTyping] = useState(false);
    const typingTimeoutRef = useRef(null);

    const stompClient = ClientController.getClient();

    function isMyMessage() {
        return UserController.getCurrentUser().id === lastMessage.senderId;
    }

    useEffect(() => {
        if (stompClient) {
            // Подписка на получение онлайн статуса пользователя
            const presenceSubscription = stompClient.subscribe(`/client/${chatRoom.companion.id}/personal/presence`, (message) => {
                const presenceResponse = PresenceResponse.fromJSON(JSON.parse(message.body));
                setIsOnline(presenceResponse.isOnline);

                if (!presenceResponse.isOnline) {
                    setTyping(false);
                    clearTimeout(typingTimeoutRef.current);
                }
            });

            // Подписка на отслеживание статуса "Печатает"
            const typingSubscription = stompClient.subscribe(ClientController.getTypingSubscription(UserController.getCurrentUser().id, chatRoom.companion.id), (message) => {
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

            // Отправка запроса на получение статуса пользователя
            ClientController.checkPresence(chatRoom.companion.id);

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
        const lastMessage = chatRoom.messages[chatRoom.messages.length - 1];
        if (lastMessage) {
            setLastMessage(lastMessage);
        } else {
            MessagesApi.getMessagesByChatId(chatRoom.chat.chatId).then(response => {
                let newMessages = response.data.map(message => MessageDto.fromJSON(message));
                if (newMessages.length > 0) {
                    ChatRoomsController.addMessagesInStart(chatRoom.companion.id, newMessages)
                } else {
                    ChatRoomsController.removeChatRoom(chatRoom.companion.id);
                }
            })
        }
    }, [chatRoom.messages]);

    return lastMessage && (
            <MainContainer onClick={() => ChatRoomsController.setActiveChat(chatRoom.companion)}>
                <ChatRoomContainer>
                    <AvatarContainer>
                        <UserAvatar src={chatRoom.companion.avatarHref}/>
                        <OnlineCircle isOnline={isOnline}/>
                    </AvatarContainer>
                    <UserData>
                        <UpperLine>
                            <Name>{`${chatRoom.companion.name} ${chatRoom.companion.surname}`}</Name>
                            {
                                <ReadStatusAndMessageDate>
                                    {
                                        isMyMessage() && <ReadMark src={lastMessage.isRead ? WhiteCheckMarkImg : BlackCheckMark}/>
                                    }
                                    <DateComponent>{DateParser.parseDate(lastMessage.sentAt)}</DateComponent>
                                </ReadStatusAndMessageDate>
                            }
                        </UpperLine>
                        <MiddleLine>
                            <LastMessageOrTypingContainer>
                                {isTyping ? <Typing>Пишет<TypingAnimation/></Typing>
                                    : <LastMessage>{(isMyMessage() ? "Вы: " : "") + lastMessage.text}</LastMessage>}
                            </LastMessageOrTypingContainer>
                            <NewMessagesCountContainer>
                                {
                                    chatRoom.unreadCount > 0 && <NewMessagesCount>{chatRoom.unreadCount}</NewMessagesCount>
                                }
                            </NewMessagesCountContainer>
                        </MiddleLine>
                    </UserData>
                </ChatRoomContainer>
            </MainContainer>
    );
})