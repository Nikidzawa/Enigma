import styled from "styled-components";
import {useEffect, useMemo, useRef, useState} from "react";
import MessagesApi from "../../../../../api/internal/controllers/MessagesApi";
import MessageDto from "../../../../../api/internal/dto/MessageDto";
import UserController from "../../../../../store/UserController";
import DateParser from "../../../../../helpers/DateParser";
import WhiteCheckMarkImg from "../../../../../img/two-ticks.png"
import BlackCheckMark from "../../../../../img/two-ticks-black.png"
import ClientController from "../../../../../store/ClientController";
import ChatRoomsController from "../../../../../store/ChatRoomsController";
import SendImage from "../../../../../img/send.png";
import AcceptImage from "../../../../../img/accept.png";
import MessageSendRequest from "../../../../../network/chat/message/send/MessageSendRequest";
import ChatApi from "../../../../../api/internal/controllers/ChatApi";
import {observer} from "mobx-react-lite";
import PrivateChatDto from "../../../../../api/internal/dto/PrivateChatDto";
import MessageOptionsModal from "./MessageOptionsModal";
import ReplyMessageComponent from "./ActionMessageComponent";
import ActionMessageComponent from "./ActionMessageComponent";
import MessageOptionsModalController from "../../../../../store/MessageOptionsModalController";
import ActiveChatInput from "./ActiveChatInput";

const MainContainer = styled.div`
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
`

const MessagesContainer = styled.div`
    margin-right: 5px;
    flex: 1; 
    overflow-y: auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 16px;
    padding: 10px 4px 10px 6px;
    -webkit-background-clip: text;
    transition: background-color 1s ease;
    opacity: ${props => props.readyMessages ? "1" : "0"};

    &::-webkit-scrollbar {
        max-width: 5px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: ${props => props.scrollIsVisible ? '#575757' : 'transparent'};
        border-radius: 4px;
    }

    &::-webkit-scrollbar-track {
        background-color: ${props => props.scrollIsVisible ? '#353842' : 'transparent'};
        border-radius: 4px;
        margin-top: 5px;
        margin-bottom: 5px;
    }

`;

const MyMessage = styled.div`
    max-width: 500px;
    min-width: 35px;
    background: #006c81;
    border-radius: 15px 0 15px 15px;
    padding: 7px 10px 6px 12px;
    align-self: flex-end;
    display: flex;
    flex-direction: column;
    gap: 2px;
`

const OtherMessage = styled.div`
    max-width: 500px;
    min-width: 35px;
    background: #353535;
    border-radius: 0 15px 15px 15px;
    padding: 7px 12px 6px 10px;
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    gap: 2px;
`

const MyMessageSendDate = styled.div`
    font-size: 12px;
    color: #cacaca;
    align-self: flex-end;
    cursor: default;
`

const OtherMessageSendDate = styled.div`
    font-size: 12px;
    color: #cacaca;
    align-self: flex-start;
    cursor: default;
`

const MyMessageText = styled.div`
    align-self: flex-end;
    font-size: 15px;
    word-break: break-word;

`

const OtherMessageText = styled.div`
    align-self: flex-start;
    font-size: 15px;
    word-break: break-word;
`

const ButtonSection = styled.div`
    display: flex;
    align-items: center;
    gap: 3px;
    justify-content: end;
`

const ReadMark = styled.img`
    width: 14px;
    height: 8px;
`

const EditMark = styled.div`
    font-size: 12px;
    color: #cacaca;
`

const SystemMessage = styled.div`
    max-width: 500px;
    min-width: 80px;
    background: transparent;
    color: white;
    border-radius: 10px;
    padding: 5px 15px;
    align-self: center;
    text-align: center;
    font-size: 14px;
    cursor: default;
`

export default observer(function ActiveChatMessages () {
    const activeChat = ChatRoomsController.getActiveChat();

    const [readyMessages, setReadyMessages] = useState(false);
    const [isLoadMessages, setLoadMessages] = useState(false);
    const [blockLoadMessages, setBlockLoadMessages] = useState(false);
    const [scrollIsVisible, setScrollIsVisible] = useState(true);

    const scrollTimeout = useRef(null);
    const ChatSectionRef = useRef(null);

    const observerRefs = useRef({});
    const messageRefs = useRef(new Set());

    const [sendingMessage, setSendingMessage] = useState(false);

    const [firstUnreadMessage, setFirstUnreadMessage] = useState(null);

    useEffect(() => {
        // Загрузка сообщений если чат создан, затем прокручиваем в самый низ
        if (activeChat.chat && activeChat.messages.length < 30) {
            loadMessages().then(() => scrollToBottom());
        }
        // устанавливаем флаг первого не прочитанного сообщения
        setFirstUnreadMessage(activeChat.messages.find(m => !m.isRead && m.senderId !== UserController.getCurrentUser().id));
        scrollToBottom();
        setReadyMessages(true);
    }, []);

    const unreadMessages = useMemo(() => {
            return activeChat.messages.filter(m => !m.isRead && m.senderId !== UserController.getCurrentUser().id)
    }, [activeChat.messages]);

    useEffect(() => {
        unreadMessages.forEach(message => {
            if (messageRefs.current[message.id] && !observerRefs.current[message.id]) {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                ClientController.read(activeChat.companion.id, message.id)
                                MessagesApi.read(message.id)
                                ChatRoomsController.handleMessageReadStatus(message.id, activeChat.companion.id)
                                ChatRoomsController.removeNotification(activeChat.companion.id)
                                observer.unobserve(entry.target)
                                delete observerRefs.current[message.id];
                            }
                        });
                    }, {threshold: 0.5, root: ChatSectionRef.current}
                );
                observer.observe(messageRefs.current[message.id]);
                observerRefs.current[message.id] = observer;
            }
        });
    }, [unreadMessages]);

    const scrollToBottom = async () => {
        if (ChatSectionRef.current) {
            requestAnimationFrame(() => {
                ChatSectionRef.current.scrollTo({
                    top: ChatSectionRef.current.scrollHeight,
                    behavior: "instant",
                });
            });
        }
    };

    async function loadMessages() {
        try {
            if (!isLoadMessages && !blockLoadMessages) {
                // Блокируем загрузку новых сообщений до тех пор, пока не завершится загрузка текущих
                setLoadMessages(true);

                // Загрузка сообщений с бека, преобразование в DTO
                const prevMessages = await MessagesApi.getMessagesByChatIdAndLastMessageId(
                    activeChat.chat.chatId,
                    activeChat.messages[0].id
                ).then(response => response.data.map(message => MessageDto.fromJSON(message)));

                // Фильтруем дубли (не должны быть, но на всякий случай)
                const newMessages = prevMessages.filter(msg => !activeChat.messages.some(existing => existing.id === msg.id));
                ChatRoomsController.addMessagesInStart(activeChat.companion.id, newMessages);

                // Если сообщений меньше лимита, то старых сообщений больше быть не должно. Блокируем загрузку для избежания бесполезных запросов к беку
                if (prevMessages.length < 30) {
                    setBlockLoadMessages(true);
                } else {
                    setBlockLoadMessages(false);
                }

                // Ждём пока сообщения добавятся
                await new Promise(resolve => requestAnimationFrame(resolve));
            }
        } catch (error) {
            console.error('Error loading messages', error);
        } finally {
            setLoadMessages(false);
        }
    }

    async function scrolling() {
        const scrollTop = ChatSectionRef.current.scrollTop;
        const threshold = 250;

        // Если текущая позиция ползунка прокрутки находится на расстоянии 250 пикселей до верхней границы, то начинаем загружать новые сообщения
        if (scrollTop <= threshold) {
            // Получаем текущие координаты ползунка прокрутки
            const prevScrollHeight = ChatSectionRef.current.scrollHeight;
            const prevScrollTop = ChatSectionRef.current.scrollTop;

            // Загружаем новые сообщения в чат
            await loadMessages();

            // обновляем позицию ползунка прокрутки
            const newScrollHeight = ChatSectionRef.current.scrollHeight;
            const scrollDiff = newScrollHeight - prevScrollHeight;
            ChatSectionRef.current.scrollTop = scrollDiff + prevScrollTop;
        }

        // Если 3 секунды не было никаких действий, то ползунок прокрутки исчезает
        setScrollIsVisible(true);
        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }
        scrollTimeout.current = setTimeout(() => setScrollIsVisible(false), 3000);
    }

    async function sendMessage(text) {
        try {
            if (!sendingMessage) {
                const trimmedText = text.trim();
                if (!trimmedText) return;

                setFirstUnreadMessage(null);
                setSendingMessage(true);

                let chat = activeChat.chat;
                if (!chat) {
                    const response = await ChatApi.findOrCreateChat(UserController.getCurrentUser().id, activeChat.companion.id);
                    chat = PrivateChatDto.fromJSON(response.data);
                }

                const newMessage = new MessageDto(
                    null,
                    UserController.getCurrentUser().id,
                    chat.chatId,
                    new Date(),
                    trimmedText,
                    false,
                    false,
                    null,
                    false
                );

                const response = await MessagesApi.save(newMessage);
                const savedMessage = MessageDto.fromJSON(response.data);

                ClientController.sendMessage(
                    new MessageSendRequest(
                        savedMessage.id,
                        savedMessage.sentAt,
                        UserController.getCurrentUser().id,
                        activeChat.companion.id,
                        chat.chatId,
                        savedMessage.text
                    )
                );

                ChatRoomsController.updateLastMessageOrAddChat({message: savedMessage, companion: activeChat.companion});

                await scrollToBottom();
            }
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setSendingMessage(false);
        }
    }

    function openMessageOptions (e, entity) {
        if (e.button === 2) {
            MessageOptionsModalController.setIsOpen(true)
            MessageOptionsModalController.setSelectedMessageEntity(entity)
            MessageOptionsModalController.setSelectedMessageCoordinates({x: e.clientX, y: e.clientY})
        }
    }

    return (
        <MainContainer>
            <MessagesContainer readyMessages={readyMessages} ref={ChatSectionRef} onScroll={scrolling} scrollIsVisible={scrollIsVisible}>
                {
                    activeChat.messages.map((message, index) => {
                        const prevMessage = activeChat.messages[index - 1];
                        let messageDayAndMonth;
                        if (message && (!prevMessage || prevMessage.sentAt.toDateString() !== message.sentAt.toDateString())) {
                            messageDayAndMonth = DateParser.getDayAndMonth(message.sentAt);
                        }
                        return (
                            <>
                                {firstUnreadMessage && firstUnreadMessage.id === message.id && <SystemMessage>Непрочитанные сообщения</SystemMessage>}
                                {messageDayAndMonth && <SystemMessage>{messageDayAndMonth}</SystemMessage>}
                                {message.senderId === UserController.getCurrentUser().id ? (
                                    <MyMessage key={message.id}
                                               onMouseUp={e => openMessageOptions(e, message)}>
                                        <MyMessageText>{message.text}</MyMessageText>
                                        <ButtonSection>
                                            <EditMark>{message.isEdited && 'изменено'}</EditMark>
                                            <ReadMark src={message.isRead ? WhiteCheckMarkImg : BlackCheckMark}/>
                                            <MyMessageSendDate>{DateParser.parseToHourAndMinute(message.sentAt)}</MyMessageSendDate>
                                        </ButtonSection>
                                    </MyMessage>
                                ) : (
                                    <OtherMessage key={message.id} id={`${message.id}`} data-is-read={message.isRead}
                                                  onMouseUp={e => openMessageOptions(e, message)}
                                                  ref={el => messageRefs.current[message.id] = el}>
                                        <OtherMessageText>{message.text}</OtherMessageText>
                                        <OtherMessageSendDate>{DateParser.parseToHourAndMinute(message.sentAt)} {message.isEdited && 'изменено'}</OtherMessageSendDate>
                                    </OtherMessage>
                                )}
                            </>
                        )
                    })
                }
            </MessagesContainer>
            <MessageOptionsModal/>
            <ActiveChatInput sendMessage={sendMessage}/>
        </MainContainer>
    )
})