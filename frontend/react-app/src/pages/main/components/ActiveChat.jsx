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
    padding: 10px 7px 10px 0;
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

const OnlineStatusText = styled.div`
    font-size: 15px;
    color: #a0a0a0;
    cursor: default;
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
    background: #246adf;
    border-radius: 15px;
    padding: 7px 13px;
    align-self: flex-end;
    display: flex;
    flex-direction: column;
`

const OtherMessage = styled.div`
    max-width: 500px;
    background: #575757;
    border-radius: 15px;
    padding: 7px 13px;
    align-self: flex-start;
    display: flex;
    flex-direction: column;
`

const MessageSendDate = styled.div`
    font-size: 12px;
    color: #cacaca;
    align-self: flex-end;
`

const MyMessageText = styled.div`
    align-self: flex-end;
`

const OtherMessageText = styled.div`
    align-self: flex-start;
`

const ActiveChat = forwardRef(({activeChat, onMessageSend}, ref) => {
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

    useImperativeHandle(ref, () => ({
        addNewMessage: async (message) => {
            if (activeChat?.companion.id === message.senderId) {
                await setMessages(prev => [...prev, message]);
                scrollToBottom();
            }
        },
        updateOnlineStatus: async (presenceResponse) => {
            if (activeChat?.companion.id === presenceResponse.userId) {
                setIsOnline(presenceResponse.isOnline)
                setLastOnlineDate(lastOnlineDate || new Date())
            }
        },
        updateProfileData: async (userDto) => {
            if (activeChat?.companion.id === userDto.id) {
                setUser(userDto);
            }
        }
    }));

    useEffect(() => {
        setUser(activeChat.companion);
        setChat(activeChat.chat);

        setLastOnlineDate(activeChat.companion.lastOnline);
        setIsOnline(activeChat.companion.isOnline);

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
            const prevScrollHeight = ChatSectionRef.current.scrollHeight;

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

                            setTimeout(() => {
                                ChatSectionRef.current.scrollTop =
                                    ChatSectionRef.current.scrollHeight - prevScrollHeight + threshold;}, 100);
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
            });
        }
    }

    return (
        !loading &&
            <>
                <MainContainer>
                    <UpperSection>
                        <Name onClick={() => setProfileVisible(true)}>{user.name}</Name>
                        <OnlineStatusText>{isOnline ? 'В сети' : 'Был в сети в ' + DateParser.parseToDateAndTime(lastOnlineDate)}</OnlineStatusText>
                    </UpperSection>
                    <ChatSection ref={ChatSectionRef} onScroll={scrolling} scrollIsVisible={scrollIsVisible}>
                        {
                            messages.map((message) => (
                                message.senderId === UserController.getCurrentUser().id ? (
                                    <MyMessage key={message.id}>
                                        <MyMessageText>{message.text}</MyMessageText>
                                        <MessageSendDate>{DateParser.parseToHourAndMinute(message.createdAt)}</MessageSendDate>
                                    </MyMessage>
                                ) : (
                                    <OtherMessage key={message.id}>
                                        <OtherMessageText>{message.text}</OtherMessageText>
                                        <MessageSendDate>{DateParser.parseToHourAndMinute(message.createdAt)}</MessageSendDate>
                                    </OtherMessage>
                                )
                            ))
                        }
                    </ChatSection>
                    <BottomSection>
                        <Input
                            value={text}
                            onInput={(e) => setText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder={"Введите сообщение"}
                        />
                        <SendButton onClick={sendMessage} src={SendImage}/>
                    </BottomSection>
                </MainContainer>
                {profileVisible && <InfoProfile user={user} isOnline={isOnline} lastOnlineDate={lastOnlineDate} visible={profileVisible} setVisible={setProfileVisible}/>}
            </>
    );
});

export default ActiveChat;