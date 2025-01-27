import styled from "styled-components";
import DefaultAvatar from "../../../img/i.png"
import DateParser from "../../../helpers/DateParser";
import CurrentUserController from "../../../store/CurrentUserController";
import ActiveChatController from "../../../store/ActiveChatController";

const MainContainer = styled.div`
    :hover {
        background: #32373e;
    }
`

const ChatRoomContainer = styled.div`
    height: 60px;
    padding: 10px;
    display: flex;
    gap: 10px;
    cursor: pointer;
`

const UserAvatar = styled.img`
    border-radius: 50%;
`

const UserData = styled.div`
    width: calc(100% - 70px);
    display: flex;
    flex-direction: column;
    gap: 10px;
`

const Name = styled.div`
    font-size: 19px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`

const LastMessage = styled.div`
    font-size: 14px;
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
    font-size: 14px;
    color: #7f7f7f;
`

export default function ChatRoom({chatRoom}) {
    function isMyMessage() {
        return CurrentUserController.getCurrentUser().id === chatRoom.lastMessage.senderId ? "Вы: " : "";
    }

    return (
        <>
            <MainContainer onClick={() => ActiveChatController.setChat(chatRoom)}>
                <ChatRoomContainer>
                    <UserAvatar src={DefaultAvatar}/>
                    <UserData>
                        <UpperLine>
                            <Name>{`${chatRoom.userName} ${chatRoom.userSurname}`}</Name>
                            <Date>{chatRoom.lastMessage ? DateParser.parseDate(chatRoom.lastMessage.createdAt) : " "}</Date>
                        </UpperLine>
                        <LastMessage>{chatRoom.lastMessage ? chatRoom.lastMessage && (isMyMessage() + chatRoom.lastMessage.text) : "Сообщений нет"}</LastMessage>
                    </UserData>
                </ChatRoomContainer>
            </MainContainer>
        </>
    );
}


