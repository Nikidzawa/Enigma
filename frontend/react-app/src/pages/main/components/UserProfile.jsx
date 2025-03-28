import styled from "styled-components";
import UserController from "../../../store/UserController";
import ChatApi from "../../../api/internal/controllers/ChatApi";
import ChatRoomDto from "../../../api/internal/dto/ChatRoomDto";
import UserDto from "../../../api/internal/dto/UserDto";

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

export default function UserProfile({userInfo, chats, setActiveChat}) {

    async function openChat () {
        let existingChat = chats.find(chat => chat.companion.id === userInfo.id);
        if (!existingChat) {
            existingChat = new ChatRoomDto(
                new UserDto(userInfo.id, userInfo.nickname, userInfo.name, userInfo.surname, null, null, userInfo.avatarHref), [], null
            )
        }
        setActiveChat(existingChat);
    }

    return (
        <MainContainer onClick={openChat}>
            <ChatRoomContainer>
                <UserAvatar src={userInfo.avatarHref}/>
                <UserData>
                    <Name>{`${userInfo.name} ${userInfo.surname ? userInfo.surname : ''}`}</Name>
                    <Nickname>{`@${userInfo.nickname}`}</Nickname>
                </UserData>
            </ChatRoomContainer>
        </MainContainer>
    );
}


