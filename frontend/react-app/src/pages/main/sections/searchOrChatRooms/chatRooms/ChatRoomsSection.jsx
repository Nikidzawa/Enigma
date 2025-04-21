import styled, {keyframes} from "styled-components";
import ChatRoom from "./components/ChatRoom";
import {useEffect} from "react"; // Добавлен useRef
import ChatApi from "../../../../../api/internal/controllers/ChatApi";
import ChatRoomDto from "../../../../../api/internal/dto/ChatRoomDto";
import {observer} from "mobx-react-lite";
import ClientController from "../../../../../store/ClientController";
import UserController from "../../../../../store/UserController";
import ChatRoomsController from "../../../../../store/ChatRoomsController";

const slideOutToUp = keyframes`
    from {
        transform: translateY(150%);
        opacity: 0;
    }
    to {
        transform: translateY(0%);
        opacity: 1;
    }
`;

const ChatRoomsContainer = styled.div`
    display: ${props => props.isActive ? "none" : "block"};
    animation: ${props => !props.isActive && slideOutToUp} 0.2s forwards;
`;

export default observer(function ChatRoomsSection({isSearchMode}) {
    const user = UserController.getCurrentUser();
    const stompClient = ClientController.getClient();
    const chats = ChatRoomsController.getChatRooms();

    useEffect(() => {
        if (chats.length === 0 && stompClient.connected) {
            ChatApi.getAllUserChatsByUserId(user.id).then(response => {
                const chatsDto = response.data.map(room => ChatRoomDto.fromJSON(room))
                ChatRoomsController.initAll(chatsDto, stompClient, user.id)
            });
        }
    }, [])

    return (
        <ChatRoomsContainer isActive={isSearchMode}>
            {
                chats?.map(chatRoom => <ChatRoom key={chatRoom.companion.id} chatRoom={chatRoom}/>)
            }
        </ChatRoomsContainer>
    )
})