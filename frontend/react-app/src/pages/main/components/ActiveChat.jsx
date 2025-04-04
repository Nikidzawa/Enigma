import styled from "styled-components";
import SendImage from "../../../img/send.png"
import UserController from "../../../store/UserController";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import MessagesApi from "../../../api/internal/controllers/MessagesApi";
import DateParser from "../../../helpers/DateParser";
import MessageDto from "../../../api/internal/dto/MessageDto";
import MessageRequest from "../../../network/request/MessageRequest";
import ClientController from "../../../store/ClientController";
import InfoProfile from "./menu/InfoProfile";
import PresenceApi from "../../../api/internal/controllers/PresenceApi";
import PresenceDto from "../../../api/internal/dto/PresenceDto";
import PresenceResponse from "../../../network/response/PresenceResponse";
import UserApi from "../../../api/internal/controllers/UserApi";
import UserDto from "../../../api/internal/dto/UserDto";
import TypingResponse from "../../../network/response/TypingResponse";
import OnlineStatusComponent from "./menu/OnlineStatusComponent";

const MainContainer = styled.div`
    flex: 1;
    justify-content: space-between;
    padding: 5px 10px;
    z-index: 100;
    background-color: #121212;
`

const UpperSection = styled.div`
    height: 60px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    border-bottom: 1px solid #707070;
    justify-content: center;
`

const ChatSection = styled.div`
    height: calc(100% - 110px);
    overflow-y: auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 16px;
    padding: 10px 9px 10px 0;
    -webkit-background-clip: text;
    transition: background-color 1s ease;

    &::-webkit-scrollbar {
        width: 8px;
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


const BottomSection = styled.div`
    height: 50px;
    display: flex;
    align-items: center;
    border-top: 1px solid #707070;
    gap: 10px;
`

const Name = styled.div`
    font-size: 20px;
    cursor: pointer;
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
    padding: 7px 10px 5px 20px;
    align-self: flex-end;
    display: flex;
    flex-direction: column;
    gap: 1px;
`

const OtherMessage = styled.div`
    max-width: 500px;
    min-width: 35px;
    background: #353535;
    border-radius: 0 15px 15px 15px;
    padding: 7px 20px 5px 10px;
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    gap: 1px;
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

const ActiveChat = forwardRef(({activeChat, onMessageSend}, ref) => {
    const stompClient = ClientController.getClient();

    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    const [scrollIsVisible, setScrollIsVisible] = useState(true);
    const scrollTimeout = useRef(null);
    const ChatSectionRef = useRef(null);
    const [isLoadMessages, setLoadMessages] = useState(false);
    const [blockLoadMessages, setBlockLoadMessages] = useState(false);

    const [user, setUser] = useState({});
    const [chat, setChat] = useState({});

    const [isOnline, setIsOnline] = useState(false);
    const [lastOnlineDate, setLastOnlineDate] = useState(null);
    const [loading, setLoading] = useState(true);

    const [profileVisible, setProfileVisible] = useState(false);

    const [lastTypingCall, setLastTypingCall] = useState(0);
    const typingTimeoutRef = useRef(null);
    const [isTyping, setTyping] = useState(false);

    useImperativeHandle(ref, () => ({
        addNewMessage: async (message) => {
            if (activeChat?.companion.id === message.senderId && messages.filter(lastMessage => lastMessage.id === message.id).length === 0) {
                await setMessages(prev => [...prev, message]);
                scrollToBottom();
            }
        }
    }));

    useEffect(() => {
        if (stompClient) {
            // Подписка на получение статуса пользователя
            const presenceSubscription = stompClient.subscribe(`/client/${activeChat.companion.id}/personal/presence`, (message) => {
                const presenceResponse = PresenceResponse.fromJSON(JSON.parse(message.body));
                if (activeChat?.companion.id === presenceResponse.userId) {
                    setIsOnline(presenceResponse.isOnline);
                    setLastOnlineDate(presenceResponse.lastOnlineDate);
                }
            });

            // Подписка на обновление профиля
            const profileSubscription = stompClient.subscribe(`/client/${activeChat.companion.id}/profile/changed`, (message) => {
                UserApi.getUserById(JSON.parse(message.body).userId).then(response => {
                    const userDto = UserDto.fromJSON(response.data);
                    if (activeChat?.companion.id === userDto.id) {
                        setUser(userDto);
                    }
                });
            });

            // Подписка на отслеживание статуса "Печатает"
            const typingSubscription = stompClient.subscribe(`/client/${activeChat.companion.id}/queue/typing`, (message) => {
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
                typingSubscription.unsubscribe();
                presenceSubscription.unsubscribe();
                profileSubscription.unsubscribe();
            };
        }
    }, [stompClient]);

    useEffect(() => {
        setUser(activeChat.companion);
        setChat(activeChat.chat);

        const loadMessages = async () => {
            if (activeChat.chat) {
                await MessagesApi.getMessagesByChatId(activeChat.chat.id, 0).then(response =>
                    setMessages(defaultSort(response.data.map(message => MessageDto.fromJSON(message))))
                );
            } else {
                await MessagesApi.getMessagesBySenderIdAndReceiverId(UserController.getCurrentUser().id, activeChat.companion.id).then(response =>
                    setMessages(defaultSort(response.data.map(message => MessageDto.fromJSON(message))))
                )
            }
        };

        loadMessages().then(() => {
            setTimeout(() => {
                scrollToBottom();
            }, 0);
        });

        setLoading(false);
    }, []);

    useEffect(() => {
        PresenceApi.getActual(activeChat.companion.id).then(response => {
            const presenceData = PresenceDto.fromJSON(response.data);
            setIsOnline(presenceData.isOnline);
            setLastOnlineDate(presenceData.lastOnlineDate);
        });
    }, []);

    function defaultSort(array) {
        return array.sort((a, b) => a.id - b.id);
    }

    const scrollToBottom = () => {
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
                        let latestMessages;
                        if (chat) {
                            await MessagesApi.getMessagesByChatId(chat.id, messages[0]?.id).then(response => {
                                latestMessages = response.data.map(message => MessageDto.fromJSON(message))
                            });
                        } else {
                            await MessagesApi.getMessagesBySenderIdAndReceiverId(UserController.getCurrentUser().id, user.id).then(response => {
                                latestMessages = response.data.map(message => MessageDto.fromJSON(message))
                            })
                        }

                        if (latestMessages.length > 0) {
                            setMessages((prevMessages) => {
                                return [...defaultSort(latestMessages), ...prevMessages];
                            });
                        } else {
                            setBlockLoadMessages(true);
                        }
                    }
                } catch (error) {
                    console.error("Ошибка при подгрузке сообщений: ", error);
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

    function onInput(e) {
        setText(e.target.value);
        const now = Date.now();
        if (now - lastTypingCall > 2000) {
            ClientController.typing(UserController.getCurrentUser().id);
            setLastTypingCall(now);
        }
    }

    async function sendMessage() {
        if (text) {
            const newMessage = new MessageDto(null, new Date(), text, UserController.getCurrentUser().id);
            MessagesApi.send(UserController.getCurrentUser().id, user.id, newMessage).then(async response => {
                const message = await MessageDto.fromJSON(response.data);
                setMessages(prev => [...prev, message]);
                onMessageSend({message: message, companion: user});
                setText("");
                scrollToBottom();
                ClientController.sendMessage(new MessageRequest(message.id, message.createdAt, message.senderId, user.id, message.text));
                setLastTypingCall(2000)
            });
        }
    }

    return (
        !loading &&
            <>
                <MainContainer>
                    <UpperSection>
                        <Name onClick={() => setProfileVisible(true)}>{user.name}</Name>
                        <OnlineStatusComponent isTyping={isTyping} isOnline={isOnline} lastOnlineDate={lastOnlineDate}/>
                    </UpperSection>
                    <ChatSection ref={ChatSectionRef} onScroll={scrolling} scrollIsVisible={scrollIsVisible}>
                        {
                            messages.map((message) => (
                                message.senderId === UserController.getCurrentUser().id ? (
                                    <MyMessage key={message.id}>
                                        <MyMessageText>{message.text}</MyMessageText>
                                        <MyMessageSendDate>{DateParser.parseToHourAndMinute(message.createdAt)}</MyMessageSendDate>
                                    </MyMessage>
                                ) : (
                                    <OtherMessage key={message.id}>
                                        <OtherMessageText>{message.text}</OtherMessageText>
                                        <OtherMessageSendDate>{DateParser.parseToHourAndMinute(message.createdAt)}</OtherMessageSendDate>
                                    </OtherMessage>
                                )
                            ))
                        }
                    </ChatSection>
                    <BottomSection>
                        <Input
                            value={text}
                            onInput={onInput}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder={"Введите сообщение"}
                        />
                        <SendButton onClick={sendMessage} src={SendImage}/>
                    </BottomSection>
                </MainContainer>
                <InfoProfile user={user} isOnline={isOnline} lastOnlineDate={lastOnlineDate} visible={profileVisible} setVisible={setProfileVisible}/>
            </>
    );
});

export default ActiveChat;