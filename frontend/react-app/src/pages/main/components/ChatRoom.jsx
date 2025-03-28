import styled from "styled-components";
import DefaultAvatar from "../../../img/i.png"
import DateParser from "../../../helpers/DateParser";
import UserController from "../../../store/UserController";
import ActiveChatController from "../../../store/ActiveChatController";
import {useEffect, useState} from "react";

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
    gap: 10px;
    cursor: pointer;
`

const UserAvatar = styled.img`
    border-radius: 50%;
    width: 50px;
    height: 50px;
`

const UserData = styled.div`
    width: 100%;
    display: flex;
    gap: 5px;
    flex-direction: column;
    justify-content: center;
`

const Name = styled.div`
    font-size: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
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
`

const Date = styled.div`
    font-size: 13px;
    padding: 0 5px;
    color: #7f7f7f;
`

export default function ChatRoom({chatRoom, setActiveChat}) {
    const [user, setUser] = useState({})
    const [lastMessage, setLastMessage] = useState(null)

    function isMyMessage() {
        return UserController.getCurrentUser().id === lastMessage.senderId ? "Вы: " : "";
    }

    useEffect(() => {
        setUser(chatRoom.companion);
        setLastMessage(chatRoom.messages ? chatRoom.messages[chatRoom.messages.length - 1] : null);
    }, [chatRoom]);

    return (
            <MainContainer onClick={() => setActiveChat(chatRoom)}>
                <ChatRoomContainer>
                    <UserAvatar src={user.avatarHref}/>
                    <UserData>
                        <UpperLine>
                            <Name>{`${user.name} ${user.surname}`}</Name>
                            <Date>{lastMessage ? DateParser.parseDate(lastMessage.createdAt) : ""}</Date>
                        </UpperLine>
                        <LastMessage>{lastMessage ? (isMyMessage() + lastMessage.text) : "Сообщений нет"}</LastMessage>
                    </UserData>
                </ChatRoomContainer>
            </MainContainer>
    );
}


