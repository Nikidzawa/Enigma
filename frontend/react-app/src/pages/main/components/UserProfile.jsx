import styled from "styled-components";
import DefaultAvatar from "../../../img/i.png"
import DateParser from "../../../helpers/DateParser";
import UserController from "../../../store/UserController";
import ActiveChatController from "../../../store/ActiveChatController";
import ChatApi from "../../../api/internal/controllers/ChatApi";
import {useState} from "react";
import ChatRoomDto from "../../../api/internal/dto/ChatRoomDto";
import {observer} from "mobx-react-lite";
import ChatsController from "../../../store/ChatsController";

const MainContainer = styled.div`
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
    display: flex;
    gap: 2px;
    flex-direction: column;
    justify-content: center;
`

const Name = styled.div`
    font-size: 19px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`

const Nickname = styled.div`
    font-size: 13px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`

export default function UserProfile({userInfo, setChats, chats, setActiveChat}) {
    async function startNewChat () {
        await ChatApi.getOrCreateNewIndividualChat(UserController.getCurrentUser().id, userInfo.id)
            .then(response => {
                const chat = ChatRoomDto.fromJSON(response.data);
                if (chats.filter(chatRoom => chatRoom.chat.id === chat.chat.id).length === 0) {
                    setChats(prev => [chat, ...prev]);
                }
                setActiveChat(chat);
            });
    }

    return (
        <>
            <MainContainer onClick={startNewChat}>
                <ChatRoomContainer>
                    <UserAvatar src={userInfo.avatarHref}/>
                    <UserData>
                        <Name>{`${userInfo.name} ${userInfo.surname ? userInfo.surname : ''}`}</Name>
                        <Nickname>{`@${userInfo.nickname}`}</Nickname>
                    </UserData>
                </ChatRoomContainer>
            </MainContainer>
        </>
    );
}


