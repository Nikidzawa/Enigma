import styled from "styled-components";
import {useEffect, useRef, useState} from "react";
import ActiveChatMessages from "./ActiveChatMessages";
import ClientController from "../../../../../store/ClientController";
import PresenceResponse from "../../../../../network/response/PresenceResponse";
import TypingResponse from "../../../../../network/response/TypingResponse";
import OnlineStatusComponent from "../../../components/onlineStatus/OnlineStatusComponent";
import OtherProfile from "../../../components/OtherProfile";
import ModalController from "../../../../../store/ModalController";
import {observer} from "mobx-react-lite";
import userController from "../../../../../store/UserController";
import ChatRoomsController from "../../../../../store/ChatRoomsController";

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: #121212;
`

const UserData = styled.div`
    height: 60px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    border-bottom: 1px solid #707070;
    justify-content: center;
    padding: 5px;
`

const Name = styled.div`
    font-size: 20px;
    text-overflow: ellipsis;
    cursor: pointer;
`

export default observer(function ActiveChat () {
    const stompClient = ClientController.getClient();
    const activeChat = ChatRoomsController.getActiveChat();

    const [isOnline, setIsOnline] = useState(null);
    const [lastOnlineDate, setLastOnlineDate] = useState(null);
    const [profileVisible, setProfileVisible] = useState(false);

    const typingTimeoutRef = useRef(null);
    const [isTyping, setTyping] = useState(false);

    useEffect(() => {
        setLastOnlineDate(activeChat.companion.lastLogoutDate);

        if (stompClient && stompClient.connected) {

            // Подписка на получение онлайн статуса пользователя
            const presenceSubscription = stompClient.subscribe(`/client/${activeChat.companion.id}/personal/presence`, (message) => {
                const presenceResponse = PresenceResponse.fromJSON(JSON.parse(message.body));
                if (activeChat?.companion.id === presenceResponse.userId) {
                    setIsOnline(presenceResponse.isOnline);
                    presenceResponse.lastOnlineDate && setLastOnlineDate(presenceResponse.lastOnlineDate);
                }
            });

            // Подписка на отслеживание статуса "Печатает"
            const typingSubscription = stompClient.subscribe(ClientController.getTypingSubscription(userController.getCurrentUser().id, activeChat.companion.id), (message) => {
                const typingResponse = TypingResponse.fromJSON(JSON.parse(message.body))
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }
                setTyping(typingResponse.isTyping);

                if (typingResponse.isTyping) {
                    typingTimeoutRef.current = setTimeout(() => {setTyping(false)}, 3500);
                } else {
                    clearTimeout(typingTimeoutRef.current);
                }
            })

            // Отправка запроса на получение статуса пользователя
            ClientController.checkPresence(activeChat.companion.id);

            return () => {
                typingSubscription.unsubscribe();
                presenceSubscription.unsubscribe();
            };
        }
    }, [stompClient, activeChat.companion.id]);

    useEffect(() => {
        ModalController.setVisible(profileVisible)
    }, [profileVisible]);

    return (isOnline != null) && (
        <>
            <MainContainer>
                <UserData>
                    <Name onClick={() => setProfileVisible(true)}>{activeChat.companion.name}</Name>
                    <OnlineStatusComponent isTyping={isTyping}
                                           isOnline={isOnline}
                                           lastOnlineDate={lastOnlineDate}/>
                </UserData>
                <ActiveChatMessages/>
            </MainContainer>
            <OtherProfile user={activeChat.companion}
                          isOnline={isOnline}
                          lastOnlineDate={lastOnlineDate}
                          visible={profileVisible} setVisible={setProfileVisible}
            />
        </>
    );
})