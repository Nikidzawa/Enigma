import styled from "styled-components";
import {useEffect,  useMemo, useRef, useState} from "react";
import MessagesApi from "../../../../../api/internal/controllers/MessagesApi";
import MessageDto from "../../../../../api/internal/dto/MessageDto";
import UserController from "../../../../../store/UserController";
import DateParser from "../../../../../helpers/DateParser";
import WhiteCheckMarkImg from "../../../../../img/two-ticks.png"
import BlackCheckMark from "../../../../../img/two-ticks-black.png"
import ClientController from "../../../../../store/ClientController";
import MessageReadResponse from "../../../../../network/response/MessageReadResponse";
import ChatRoomsController from "../../../../../store/ChatRoomsController";
import SendImage from "../../../../../img/send.png";
import MessageRequest from "../../../../../network/request/MessageRequest";
import ChatApi from "../../../../../api/internal/controllers/ChatApi";

const MessagesSectionMainComponent = styled.div`
    height: calc(100% - 110px);
    overflow-y: auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 16px;
    padding: 10px 6px 10px 6px;
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

const InputContainer = styled.div`
    height: 50px;
    display: flex;
    align-items: center;
    border-top: 1px solid #707070;
    gap: 10px;
`

const Input = styled.input`
    background-color: unset;
    border: none;
    color: white;
    width: 100%;
    height: 25px;
    outline: none;
    font-family: Rubik;
    padding-bottom: 5px;
    font-size: 16px;
`

const SendButton = styled.img`
    width: 30px;
    cursor: pointer;
`

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

export default function ActiveChatMessages ({setChat, chat, user}) {
    const stompClient = ClientController.getClient();
    const [messages, setMessages] = useState([]);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [readyMessages, setReadyMessages] = useState(false);

    const [isLoadMessages, setLoadMessages] = useState(false);
    const [blockLoadMessages, setBlockLoadMessages] = useState(false);
    const [scrollIsVisible, setScrollIsVisible] = useState(true);

    const scrollTimeout = useRef(null);
    const ChatSectionRef = useRef(null);

    const observerRefs = useRef({});
    const messageRefs = useRef(new Set());

    const [text, setText] = useState("");
    const [lastTypingCall, setLastTypingCall] = useState(0);
    const [sendingMessage, setSendingMessage] = useState(false);

    const [firstUnreadMessage, setFirstUnreadMessage] = useState(null);

    useEffect(() => {
        if (stompClient && stompClient.connected) {

            //Подписка на получение сообщений
            const messagesSubscription = stompClient.subscribe(`/client/${UserController.getCurrentUser().id}/queue/messages`, (message) => {
                const parsedMessage = JSON.parse(message.body);
                if (Number.parseInt(parsedMessage.senderId) === user.id) {
                    const messageDto = MessageDto.fromRequest(parsedMessage);
                    setMessages(prev => [...prev, messageDto]);
                    scrollToBottom();
                }
            });

            // Подписка на обновление статуса сообщений
            const messageReadStatusSubscription = stompClient.subscribe(`/client/${user.id}/queue/read`, (message) => {
                const messageReadResponse = MessageReadResponse.fromJSON(JSON.parse(message.body));
                setMessages(prev => prev.map(msg =>
                    msg.id === messageReadResponse.messageId ? {...msg, isRead: true} : msg
                ));
            });

            return () => {
                messagesSubscription.unsubscribe();
                messageReadStatusSubscription.unsubscribe();
            };
        }
    }, [stompClient]);

    useEffect(() => {
        if (messages.length > 0 && isFirstRender) {
            setIsFirstRender(false);
            setFirstUnreadMessage(messages.find(m => !m.isRead && m.senderId !== UserController.getCurrentUser().id));
        }
    }, [messages]);

    const unreadMessages = useMemo(() => {
            return messages.filter(m => !m.isRead && m.senderId !== UserController.getCurrentUser().id)
    }, [messages]);

    useEffect(() => {
        unreadMessages.forEach(message => {
            if (messageRefs.current[message.id] && !observerRefs.current[message.id]) {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                ClientController.read(message.id)
                                MessagesApi.read(message.id)
                                setMessages(prev => prev.map(msg =>
                                    msg.id === message.id ? {...msg, isRead: true} : msg
                                ));
                                ChatRoomsController.removeNotification(user.id)
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

    useEffect(() => {
        loadMessages().then(messages => {
            if (messages) {
                setMessages(defaultSort(messages));
                scrollToBottom().then(() =>
                    setTimeout(() => {
                        setReadyMessages(true)
                    }, 30));
            }
        })
    }, []);

    async function loadMessages (){
        if (chat) {
            return await MessagesApi.getMessagesByChatId(chat.chatId, messages[0]?.id).then(response => {
                return response.data.map(message => MessageDto.fromJSON(message));
            });
        }
    }

    const scrollToBottom = async () => {
        if (ChatSectionRef.current) {
            setTimeout(() => {
                ChatSectionRef.current.scrollTo({
                    top: ChatSectionRef.current.scrollHeight,
                    behavior: "instant",
                });
            }, 0);
        }
    };

    async function scrolling() {
        if (ChatSectionRef.current && !isLoadMessages) {
            const scrollTop = ChatSectionRef.current.scrollTop;
            const threshold = 250;

            if (scrollTop <= threshold) {
                setLoadMessages(true);
                try {
                    if (!blockLoadMessages) {
                        const prevScrollHeight = ChatSectionRef.current.scrollHeight;
                        const prevScrollTop = ChatSectionRef.current.scrollTop;

                        const messages = await loadMessages();
                        if (messages.length > 0) {
                            setMessages((prev) => {
                                const newMessages = messages.filter(msg => !prev.some(existing => existing.id === msg.id));
                                return [...defaultSort(newMessages), ...prev];
                            });

                            await new Promise(resolve => setTimeout(resolve, 0));

                            const newScrollHeight = ChatSectionRef.current.scrollHeight;
                            ChatSectionRef.current.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop;
                        } else {
                            setBlockLoadMessages(true);
                        }
                    }
                } catch (error) {
                    console.error("Ошибка при загрузке сообщений: ", error);
                } finally {
                    setLoadMessages(false);
                }
            }
        }
        scrollVisibleController();

        function scrollVisibleController() {
            setScrollIsVisible(true);
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
            scrollTimeout.current = setTimeout(() => {
                setScrollIsVisible(false);
            }, 3000);
        }
    }

    function defaultSort(array) {
        return array.sort((a, b) => a.id - b.id);
    }

    function onInput(e) {
        setText(e.target.value);
        const now = Date.now();
        if (now - lastTypingCall > 2000) {
            ClientController.typing();
            setLastTypingCall(now);
        }
    }

    async function sendMessage() {
        try {
            if (text) {
                setSendingMessage(true);
                let newChat = chat;
                if (!chat) {
                    ChatApi.findOrCreateChat(UserController.getCurrentUser().id, user.id).then(response => {
                        const responseChat = response.data;
                        newChat = responseChat;
                        setChat(responseChat);
                    });
                    ChatRoomsController.updateChat(user, chat);
                }
                const newMessage = new MessageDto(null, UserController.getCurrentUser().id, newChat.chatId, new Date(), text, false, false, null, false);
                MessagesApi.save(newMessage).then(response => {
                    const message = MessageDto.fromJSON(response.data);
                    ChatRoomsController.updateLastMessageOrAddChat({message: message, companion: user});
                    ClientController.sendMessage(new MessageRequest(message.id, message.sentAt, UserController.getCurrentUser().id, user.id, newChat.chatId, message.text));
                    setMessages(prev => [...prev, message]);
                    scrollToBottom();
                    setText("");
                    setLastTypingCall(2000);
                });
            }
        } finally {
            setSendingMessage(false);
        }
    }

    return (
        <>
            <MessagesSectionMainComponent readyMessages={readyMessages} ref={ChatSectionRef} onScroll={scrolling} scrollIsVisible={scrollIsVisible}>
                {
                    messages.map((message, index) => {
                        const messageDayAndMonth = DateParser.getDayAndMonth(messages[index - 1], message);
                        return (
                            <>
                                {firstUnreadMessage && firstUnreadMessage.id === message.id && <SystemMessage>Непрочитанные сообщения</SystemMessage>}
                                {messageDayAndMonth && <SystemMessage>{messageDayAndMonth}</SystemMessage>}
                                {message.senderId === UserController.getCurrentUser().id ? (
                                    <MyMessage key={message.id}>
                                        <MyMessageText>{message.text}</MyMessageText>
                                        <ButtonSection>
                                            {
                                                <ReadMark src={message.isRead ? WhiteCheckMarkImg : BlackCheckMark}/>
                                            }
                                            <MyMessageSendDate>{DateParser.parseToHourAndMinute(message.sentAt)}</MyMessageSendDate>
                                        </ButtonSection>
                                    </MyMessage>
                                ) : (
                                    <OtherMessage key={message.id}
                                                  id={`${message.id}`}
                                                  data-is-read={message.isRead}
                                                  ref={el => messageRefs.current[message.id] = el}
                                    >
                                        <OtherMessageText>{message.text}</OtherMessageText>
                                        <OtherMessageSendDate>{DateParser.parseToHourAndMinute(message.sentAt)}</OtherMessageSendDate>
                                    </OtherMessage>
                                )}
                            </>
                        )
                    })
                }
            </MessagesSectionMainComponent>
            <InputContainer>
                <Input value={text} onInput={onInput} placeholder={"Введите сообщение"}
                       onKeyDown={(e) => e.key === "Enter" && !sendingMessage && sendMessage()}
                />
                <SendButton onClick={sendMessage} src={SendImage}/>
            </InputContainer>
        </>
    )
}