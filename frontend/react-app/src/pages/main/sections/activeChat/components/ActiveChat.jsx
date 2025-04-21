import styled from "styled-components";
import SendImage from "../../../../../img/send.png"
import {useEffect, useRef, useState} from "react";
import ActiveChatMessages from "./ActiveChatMessages";
import ClientController from "../../../../../store/ClientController";
import PresenceResponse from "../../../../../network/response/PresenceResponse";
import TypingResponse from "../../../../../network/response/TypingResponse";
import UserController from "../../../../../store/UserController";
import MessageDto from "../../../../../api/internal/dto/MessageDto";
import MessagesApi from "../../../../../api/internal/controllers/MessagesApi";
import MessageRequest from "../../../../../network/request/MessageRequest";
import OnlineStatusComponent from "../../../components/onlineStatus/OnlineStatusComponent";
import UserApi from "../../../../../api/internal/controllers/UserApi";
import ChatRoomsController from "../../../../../store/ChatRoomsController";
import IndividualDtoShort from "../../../../../api/internal/dto/IndividualDtoShort";
import OtherProfile from "../../../components/OtherProfile";
import ModalController from "../../../../../store/ModalController";

const MainContainer = styled.div`
    flex: 1;
    justify-content: space-between;
    padding: 5px 5px;
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
    padding-left: 5px;
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

export default function ActiveChat ({activeChat}) {
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

    useEffect(() => {
        if (stompClient) {

            // Подписка на получение онлайн статуса пользователя
            const presenceSubscription = stompClient.subscribe(`/client/${activeChat.companion.id}/personal/presence`, (message) => {
                const presenceResponse = PresenceResponse.fromJSON(JSON.parse(message.body));
                if (activeChat?.companion.id === presenceResponse.userId) {
                    setIsOnline(presenceResponse.isOnline);
                    presenceResponse.lastOnlineDate && setLastOnlineDate(presenceResponse.lastOnlineDate);
                }
            });

            // Подписка на обновление профиля
            const profileSubscription = stompClient.subscribe(`/client/${activeChat.companion.id}/profile/changed`, (message) => {
                UserApi.getUserById(JSON.parse(message.body).userId).then(response => {
                    const userDto = IndividualDtoShort.fromJSON(response.data);
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
                    typingTimeoutRef.current = setTimeout(() => {setTyping(false);}, 3500);
                } else {
                    clearTimeout(typingTimeoutRef.current);
                }
            })

            // Отправка запроса на получение статуса пользователя
            ClientController.checkPresence(activeChat.companion.id);

            return () => {
                typingSubscription.unsubscribe();
                presenceSubscription.unsubscribe();
                profileSubscription.unsubscribe();
            };
        }
    }, [stompClient]);

    useEffect(() => {
        ModalController.setVisible(profileVisible)
    }, [profileVisible]);

    useEffect(() => {
        try {
            setUser(activeChat.companion);
            setChat(activeChat.chat);
            setLastOnlineDate(activeChat.companion.lastLogoutDate);
        } finally {
            setLoading(false);
        }
    }, [activeChat]);

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
                const newMessage = new MessageDto(null, new Date(), text, UserController.getCurrentUser().id);
                MessagesApi.save(UserController.getCurrentUser().id, user.id, newMessage).then(async response => {
                    const message = await MessageDto.fromJSON(response.data);
                    ChatRoomsController.updateLastMessageOrAddChat({message: message, companion: user});
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
                <ActiveChatMessages ref={messagesSectionRef} chat={chat} user={user}/>
                <BottomSection>
                    <Input value={text} onInput={onInput} placeholder={"Введите сообщение"}
                           onKeyDown={(e) => e.key === "Enter" && !sendingMessage && sendMessage()}
                    />
                    <SendButton onClick={sendMessage} src={SendImage}/>
                </BottomSection>
            </MainContainer>
            <OtherProfile user={user} isOnline={isOnline} lastOnlineDate={lastOnlineDate}
                          visible={profileVisible} setVisible={setProfileVisible}
            />
        </>
    );
}