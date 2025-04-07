import styled from "styled-components";
import SendImage from "../../../../img/send.png"
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import MessagesSection from "./MessagesSection";
import PresenceApi from "../../../../api/internal/controllers/PresenceApi";
import PresenceDto from "../../../../api/internal/dto/PresenceDto";
import ClientController from "../../../../store/ClientController";
import PresenceResponse from "../../../../network/response/PresenceResponse";
import UserDto from "../../../../api/internal/dto/UserDto";
import TypingResponse from "../../../../network/response/TypingResponse";
import UserController from "../../../../store/UserController";
import MessageDto from "../../../../api/internal/dto/MessageDto";
import MessagesApi from "../../../../api/internal/controllers/MessagesApi";
import MessageRequest from "../../../../network/request/MessageRequest";
import OnlineStatusComponent from "../menu/OnlineStatusComponent";
import InfoProfile from "../menu/InfoProfile";
import UserApi from "../../../../api/internal/controllers/UserApi";

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

const ActiveChat = forwardRef(({activeChat, onMessageSend}, ref) => {
    const stompClient = ClientController.getClient();

    const [text, setText] = useState("");

    const [user, setUser] = useState({});
    const [chat, setChat] = useState({});

    const [isOnline, setIsOnline] = useState(false);
    const [lastOnlineDate, setLastOnlineDate] = useState(null);

    const [loading, setLoading] = useState(true);
    const [sendingMessage, setSendingMessage] = useState(false);

    const [profileVisible, setProfileVisible] = useState(false);

    const [lastTypingCall, setLastTypingCall] = useState(0);
    const typingTimeoutRef = useRef(null);
    const [isTyping, setTyping] = useState(false);

    const messagesSectionRef = useRef();

    useImperativeHandle(ref, () => ({
        addNewMessage: async (message) => {
            messagesSectionRef?.current.addMessageIntoChat(message);
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
        try {
            setUser(activeChat.companion);
            setChat(activeChat.chat);

            PresenceApi.getActual(activeChat.companion.id).then(response => {
                const presenceData = PresenceDto.fromJSON(response.data);
                setIsOnline(presenceData.isOnline);
                setLastOnlineDate(presenceData.lastOnlineDate);
            });
        } finally {
            setLoading(false);
        }
        }, []);

    function onInput(e) {
        setText(e.target.value);
        const now = Date.now();
        if (now - lastTypingCall > 2000) {
            ClientController.typing(UserController.getCurrentUser().id);
            setLastTypingCall(now);
        }
    }

    async function sendMessage() {
        try {
            if (text) {
                setSendingMessage(true);
                const newMessage = new MessageDto(null, new Date(), text, UserController.getCurrentUser().id);
                MessagesApi.save(UserController.getCurrentUser().id, user.id, newMessage).then(async response => {
                    const message = await MessageDto.fromJSON(response.data);
                    onMessageSend({message: message, companion: user});
                    ClientController.sendMessage(new MessageRequest(message.id, message.createdAt, message.senderId, user.id, message.text));
                    messagesSectionRef?.current.addMessageIntoChat(message);
                    setText("");
                    setLastTypingCall(2000);
                });
            }
        } finally {
            setSendingMessage(false);
        }
    }

    return (
        !loading && (user || chat) &&
        <>
            <MainContainer>
                <UpperSection>
                    <Name onClick={() => setProfileVisible(true)}>{user.name}</Name>
                    <OnlineStatusComponent isTyping={isTyping} isOnline={isOnline} lastOnlineDate={lastOnlineDate}/>
                </UpperSection>
                <MessagesSection ref={messagesSectionRef} chat={chat} user={user}/>
                <BottomSection>
                    <Input value={text} onInput={onInput} placeholder={"Введите сообщение"}
                           onKeyDown={(e) => e.key === "Enter" && !sendingMessage && sendMessage()}
                    />
                    <SendButton onClick={sendMessage} src={SendImage}/>
                </BottomSection>
            </MainContainer>
            <InfoProfile user={user} isOnline={isOnline} lastOnlineDate={lastOnlineDate}
                         visible={profileVisible} setVisible={setProfileVisible}
            />
        </>
    );
});

export default ActiveChat;