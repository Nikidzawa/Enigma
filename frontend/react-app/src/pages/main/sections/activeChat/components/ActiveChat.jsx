import styled from "styled-components";
import {useEffect, useRef, useState} from "react";
import ActiveChatMessages from "./ActiveChatMessages";
import ClientController from "../../../../../store/ClientController";
import PresenceResponse from "../../../../../network/response/PresenceResponse";
import TypingResponse from "../../../../../network/response/TypingResponse";
import OnlineStatusComponent from "../../../components/onlineStatus/OnlineStatusComponent";
import UserApi from "../../../../../api/internal/controllers/UserApi";
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

const UserData = styled.div`
    height: 60px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    border-bottom: 1px solid #707070;
    justify-content: center;
    padding-left: 5px;
`

const Name = styled.div`
    font-size: 20px;
    cursor: pointer;
`

export default function ActiveChat ({activeChat}) {
    const stompClient = ClientController.getClient();

    const [user, setUser] = useState({});
    const [chat, setChat] = useState({});

    const [isOnline, setIsOnline] = useState(false);
    const [lastOnlineDate, setLastOnlineDate] = useState(null);

    const [loading, setLoading] = useState(true);

    const [profileVisible, setProfileVisible] = useState(false);

    const typingTimeoutRef = useRef(null);
    const [isTyping, setTyping] = useState(false);

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

    return (
        !loading && (user || chat) &&
        <>
            <MainContainer>
                <UserData>
                    <Name onClick={() => setProfileVisible(true)}>{user.name}</Name>
                    <OnlineStatusComponent isTyping={isTyping} isOnline={isOnline} lastOnlineDate={lastOnlineDate}/>
                </UserData>
                <ActiveChatMessages setChat={setChat} chat={chat} user={user}/>
            </MainContainer>
            <OtherProfile user={user} isOnline={isOnline} lastOnlineDate={lastOnlineDate}
                          visible={profileVisible} setVisible={setProfileVisible}
            />
        </>
    );
}